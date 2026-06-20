import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";

const schema = z.object({ reason: z.string().min(5).max(1000) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(["partner"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  try {
    const { reason } = schema.parse(await request.json());
    const { id } = await params;
    const orderId = Number(id);
    const order = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const current = await client.query<any>(`select * from public.orders where id=$1 and partner_id=$2 for update`, [orderId, user.partner_id]);
      if (!current.rows[0]) throw new Error("A rendelés nem található.");
      if (current.rows[0].status !== "submitted") throw new Error("Csak a még el nem fogadott rendelés vonható vissza.");
      const updated = await client.query<any>(`
        update public.orders set status='cancelled',fulfillment_status='cancelled',
          voided_by=$2,voided_at=now(),void_reason=$3 where id=$1 returning *
      `, [orderId, user.user_id, reason.trim()]);
      return updated.rows[0];
    });
    return NextResponse.json(order);
  } catch (error) {
    return apiError(error, "A rendelés visszavonása sikertelen.");
  }
}
