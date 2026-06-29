import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { one, query } from "@/lib/db";

const schema = z.object({
  title: z.string().min(3).max(250),
  description: z.string().max(2000).optional().default(""),
  partnerId: z.number().int().positive().optional(),
  orderId: z.number().int().positive().optional(),
  assignedTo: z.string().uuid().optional(),
  dueAt: z.string().datetime().optional(),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal")
});

export async function POST(request: Request) {
  const auth = await apiUser(["admin", "management", "sales"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  try {
    const input = schema.parse(await request.json());
    let partnerId = input.partnerId ?? null;

    if (input.partnerId) {
      const partner = await query(`select 1 from public.partners where id=$1 and organization_id=$2`, [input.partnerId, user.organization_id]);
      if (!partner.length) throw new Error("A partner nem található.");
    }
    if (input.orderId) {
      const order = await one<{ partner_id: number }>(`
        select partner_id
          from public.orders
         where id=$1 and organization_id=$2 and archived_at is null
      `, [input.orderId, user.organization_id]);
      if (!order) throw new Error("A rendelés nem található.");
      if (partnerId && Number(order.partner_id) !== partnerId) {
        throw new Error("A feladathoz megadott partner nem egyezik a rendelés partnerével.");
      }
      partnerId = Number(order.partner_id);
    }
    if (input.assignedTo) {
      const assignee = await query(`
        select 1
          from public.app_users
         where user_id=$1 and organization_id=$2 and active=true and role<>'partner'
      `, [input.assignedTo, user.organization_id]);
      if (!assignee.length) throw new Error("A kiválasztott címzett nem található.");
    }

    const rows = await query<any>(`
      insert into public.tasks(
        organization_id,title,description,partner_id,order_id,assigned_to,due_at,priority,source,created_by
      ) values($1,$2,$3,$4,$5,$6,$7,$8,'manual',$9) returning *
    `, [user.organization_id, input.title.trim(), input.description || null, partnerId,
      input.orderId ?? null, input.assignedTo ?? null, input.dueAt ?? null, input.priority, user.user_id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return apiError(error, "A feladat létrehozása sikertelen.");
  }
}
