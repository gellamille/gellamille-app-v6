import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { transaction } from "@/lib/db";
import { enforceRateLimits, RATE_LIMITS, rateLimitOption, requestIp } from "@/lib/rate-limit";

const schema = z.object({ reason: z.string().min(5).max(1000) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await apiUser(["partner"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  const limited = await enforceRateLimits([
    rateLimitOption(RATE_LIMITS.partnerApiIp, requestIp(request)),
    rateLimitOption(RATE_LIMITS.partnerOrderWithdraw, String(user.partner_id ?? user.user_id))
  ]);
  if (limited) return limited;
  try {
    const { reason } = schema.parse(await request.json());
    const { id } = await params;
    const orderId = Number(id);
    if (!Number.isInteger(orderId) || orderId <= 0) throw new Error("Hibás rendelésazonosító.");
    const order = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);
      const current = await client.query<any>(`
        select *
          from public.orders
         where id=$1 and partner_id=$2 and organization_id=$3 and archived_at is null
         for update
      `, [orderId, user.partner_id, user.organization_id]);
      if (!current.rows[0]) throw new Error("A rendelés nem található.");
      if (current.rows[0].status !== "submitted") throw new Error("Csak a még el nem fogadott rendelés vonható vissza.");
      const updated = await client.query<any>(`
        update public.orders set status='cancelled',fulfillment_status='cancelled',
          voided_by=$2,voided_at=now(),void_reason=$3
         where id=$1 and partner_id=$4 and organization_id=$5
         returning *
      `, [orderId, user.user_id, reason.trim(), user.partner_id, user.organization_id]);
      return updated.rows[0];
    });
    return NextResponse.json(order);
  } catch (error) {
    return apiError(error, "A rendelés visszavonása sikertelen.", { route: "/api/orders/[id]/withdraw", userId: user.user_id, partnerId: user.partner_id });
  }
}
