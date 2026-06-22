import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema = z.object({
  periodType: z.enum(["day", "week", "month", "quarter"]),
  referenceDate: z.string().date(),
  reason: z.string().trim().min(10).max(1000),
  confirm: z.literal(true)
});

const archiveTargets = [
  {
    label: "Rendelések",
    sql: `update public.orders set archived_at=now()
           where organization_id=$1 and archived_at is null and created_at >= $2::date and created_at < $3::date`
  },
  {
    label: "Szállítási járatok",
    sql: `update public.shipping_runs set archived_at=now()
           where organization_id=$1 and archived_at is null and created_at >= $2::date and created_at < $3::date`
  },
  {
    label: "Átadások",
    sql: `update public.deliveries set archived_at=now()
           where organization_id=$1 and archived_at is null and created_at >= $2::date and created_at < $3::date`
  },
  {
    label: "Követelések",
    sql: `update public.receivables set archived_at=now()
           where organization_id=$1 and archived_at is null and created_at >= $2::date and created_at < $3::date`
  },
  {
    label: "Befizetések",
    sql: `update public.payments set archived_at=now()
           where organization_id=$1 and archived_at is null and created_at >= $2::date and created_at < $3::date`
  },
  {
    label: "Pénzügyi korrekciók",
    sql: `update public.financial_adjustments fa set archived_at=now()
           where fa.archived_at is null and fa.created_at >= $2::date and fa.created_at < $3::date
             and exists(select 1 from public.receivables r where r.id=fa.receivable_id and r.organization_id=$1)`
  },
  {
    label: "Kiadások",
    sql: `update public.expenses set archived_at=now()
           where organization_id=$1 and archived_at is null and created_at >= $2::date and created_at < $3::date`
  },
  {
    label: "Készletmozgások",
    sql: `update public.inventory_movements set archived_at=now()
           where organization_id=$1 and archived_at is null and created_at >= $2::date and created_at < $3::date`
  },
  {
    label: "Visszáruk",
    sql: `update public.returns set archived_at=now()
           where organization_id=$1 and archived_at is null and received_at >= $2::date and received_at < $3::date`
  },
  {
    label: "Visszahívások",
    sql: `update public.product_recalls set archived_at=now()
           where organization_id=$1 and archived_at is null and opened_at >= $2::date and opened_at < $3::date`
  },
  {
    label: "Leltárak",
    sql: `update public.stocktakes set archived_at=now()
           where organization_id=$1 and archived_at is null and started_at >= $2::date and started_at < $3::date`
  },
  {
    label: "Feladatok",
    sql: `update public.tasks set archived_at=now()
           where organization_id=$1 and archived_at is null and created_at >= $2::date and created_at < $3::date`
  },
  {
    label: "Tagi kölcsön tranzakciók",
    sql: `update public.member_loan_transactions set archived_at=now()
           where organization_id=$1 and archived_at is null and created_at >= $2::date and created_at < $3::date`
  },
  {
    label: "E-mail outbox",
    sql: `update public.email_outbox set archived_at=now()
           where organization_id=$1 and archived_at is null and created_at >= $2::date and created_at < $3::date`
  }
] as const;

function dateToISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function periodBounds(periodType: z.infer<typeof schema>["periodType"], referenceDate: string) {
  const date = new Date(`${referenceDate}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) throw new Error("Hibás dátum.");

  const start = new Date(date);
  if (periodType === "week") {
    const day = start.getUTCDay() || 7;
    start.setUTCDate(start.getUTCDate() - day + 1);
  } else if (periodType === "month") {
    start.setUTCDate(1);
  } else if (periodType === "quarter") {
    start.setUTCMonth(Math.floor(start.getUTCMonth() / 3) * 3, 1);
  }

  const end = new Date(start);
  if (periodType === "day") end.setUTCDate(end.getUTCDate() + 1);
  if (periodType === "week") end.setUTCDate(end.getUTCDate() + 7);
  if (periodType === "month") end.setUTCMonth(end.getUTCMonth() + 1);
  if (periodType === "quarter") end.setUTCMonth(end.getUTCMonth() + 3);

  return { fromDate: dateToISO(start), toDate: dateToISO(end) };
}

export async function POST(request: Request) {
  const auth = await apiUser(["admin"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const { fromDate, toDate } = periodBounds(input.periodType, input.referenceDate);

    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const counts: Record<string, number> = {};

      for (const target of archiveTargets) {
        const updated = await client.query(target.sql, [user.organization_id, fromDate, toDate]);
        counts[target.label] = updated.rowCount ?? 0;
      }

      const batch = await client.query<any>(`
        insert into public.data_archive_batches(
          organization_id,period_type,from_date,to_date,reason,table_counts,created_by
        )
        values($1,$2,$3,$4,$5,$6::jsonb,$7)
        returning *
      `, [user.organization_id, input.periodType, fromDate, toDate, input.reason.trim(), JSON.stringify(counts), user.user_id]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,'data.archived','archive_batch',$2,$3::jsonb)
      `, [user.user_id, String(batch.rows[0].id), JSON.stringify(batch.rows[0])]);
      await client.query(`
        insert into public.notifications(organization_id,role_code,type,title,body,entity_type,entity_id)
        values($1,null,'data.archived','Tesztadat archiválás',$2,'archive_batch',$3)
      `, [user.organization_id, `${fromDate} - ${toDate}`, String(batch.rows[0].id)]);

      return { batch: batch.rows[0], counts };
    });

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error, "Az archiválás sikertelen.");
  }
}
