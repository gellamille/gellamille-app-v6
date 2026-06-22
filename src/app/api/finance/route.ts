import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const paymentSchema = z.object({
  type: z.literal("payment"),
  receivableId: z.number().int().positive(),
  paymentDate: z.string().date(),
  amountHuf: z.number().int().positive(),
  paymentMethod: z.enum(["bank_transfer", "cash", "card"]),
  reference: z.string().max(200).optional().default(""),
  note: z.string().max(1000).optional().default("")
});

const expenseSchema = z.object({
  type: z.literal("expense"),
  categoryId: z.number().int().positive().optional(),
  description: z.string().min(3).max(500),
  performanceDate: z.string().date(),
  paymentDate: z.string().date().optional(),
  netAmountHuf: z.number().int().min(0),
  vatAmountHuf: z.number().int().min(0),
  grossAmountHuf: z.number().int().positive(),
  status: z.enum(["unpaid", "paid"])
});

const memberLoanSchema = z.object({
  type: z.literal("member_loan"),
  memberName: z.string().min(2).max(150),
  transactionType: z.enum(["funding", "repayment"]),
  transactionDate: z.string().date(),
  amountHuf: z.number().int().positive(),
  note: z.string().max(1000).optional().default("")
});

const schema = z.discriminatedUnion("type", [paymentSchema, expenseSchema, memberLoanSchema]);

export async function POST(request: Request) {
  const auth = await apiUser(["admin", "management", "finance"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;

  try {
    const input = schema.parse(await request.json());
    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);

      if (input.type === "payment") {
        const receivableResult = await client.query<any>(`
          select r.id,r.partner_id,r.organization_id,v.outstanding_huf
           from public.receivables r
            join public.v_receivables_open v on v.id=r.id
           where r.id=$1 and r.status<>'void' and r.archived_at is null
           for update of r
        `, [input.receivableId]);
        const receivable = receivableResult.rows[0];
        if (!receivable || receivable.organization_id !== user.organization_id) throw new Error("A követelés nem található.");
        if (input.amountHuf > Number(receivable.outstanding_huf)) throw new Error("A rögzített összeg meghaladja a fennmaradó követelést.");

        const paymentResult = await client.query<any>(`
          insert into public.payments(
            organization_id,partner_id,payment_date,amount_huf,payment_method,reference,note,created_by
          ) values($1,$2,$3,$4,$5,$6,$7,$8) returning *
        `, [user.organization_id, receivable.partner_id, input.paymentDate, input.amountHuf,
          input.paymentMethod, input.reference || null, input.note || null, user.user_id]);
        await client.query(`
          insert into public.payment_allocations(payment_id,receivable_id,amount_huf)
          values($1,$2,$3)
        `, [paymentResult.rows[0].id, input.receivableId, input.amountHuf]);
        return paymentResult.rows[0];
      }

      if (input.type === "expense") {
        if (input.netAmountHuf + input.vatAmountHuf !== input.grossAmountHuf) {
          throw new Error("A bruttó összegnek meg kell egyeznie a nettó és az áfa összegével.");
        }
        if (input.status === "paid" && !input.paymentDate) throw new Error("Kifizetett kiadásnál a kifizetés dátuma kötelező.");
        const expense = await client.query<any>(`
          insert into public.expenses(
            organization_id,category_id,description,performance_date,payment_date,
            net_amount_huf,vat_amount_huf,gross_amount_huf,status,created_by
          ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *
        `, [user.organization_id, input.categoryId ?? null, input.description.trim(), input.performanceDate,
          input.paymentDate || null, input.netAmountHuf, input.vatAmountHuf, input.grossAmountHuf,
          input.status, user.user_id]);
        return expense.rows[0];
      }

      const balanceResult = await client.query<{ outstanding_huf: string }>(`
        select coalesce(sum(case when transaction_type='funding' then amount_huf else -amount_huf end),0)::text as outstanding_huf
          from public.member_loan_transactions
         where organization_id=$1 and lower(trim(member_name))=lower(trim($2)) and archived_at is null
      `, [user.organization_id, input.memberName]);
      const balance = Number(balanceResult.rows[0]?.outstanding_huf ?? 0);
      if (input.transactionType === "repayment" && input.amountHuf > balance) {
        throw new Error("A visszafizetés nem lehet nagyobb a tag fennálló kölcsönénél.");
      }
      const loan = await client.query<any>(`
        insert into public.member_loan_transactions(
          organization_id,member_name,transaction_type,transaction_date,amount_huf,note,created_by
        ) values($1,$2,$3,$4,$5,$6,$7) returning *
      `, [user.organization_id, input.memberName.trim(), input.transactionType, input.transactionDate,
        input.amountHuf, input.note || null, user.user_id]);
      return loan.rows[0];
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error, "A pénzügyi tétel mentése sikertelen.");
  }
}
