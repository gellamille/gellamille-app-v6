import { NextResponse } from "next/server";
import { z } from "zod";
import { apiUser } from "@/lib/api-auth";
import { apiError } from "@/lib/http";
import { query, transaction } from "@/lib/db";
import { dateWithWeekdayHU, money } from "@/lib/format";
import { enforceRateLimits, RATE_LIMITS, rateLimitOption, requestIp } from "@/lib/rate-limit";

const itemSchema = z.object({
  productId: z.number().int().positive(),
  cartons: z.number().int().positive()
});

const orderSchema = z.object({
  partnerId: z.number().int().positive().optional(),
  requestedDeliveryDate: z.string().date(),
  paymentMethod: z.enum(["cash_on_delivery", "card_on_delivery", "bank_transfer"]),
  deliveryAddressId: z.number().int().positive().optional(),
  note: z.string().max(2000).optional().default(""),
  submit: z.boolean().optional().default(true),
  items: z.array(itemSchema).min(1)
});

export async function GET(request: Request) {
  const auth = await apiUser(["admin", "management", "staff", "sales", "warehouse", "finance", "partner"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  if (user.role === "partner") {
    const limited = await enforceRateLimits([
      rateLimitOption(RATE_LIMITS.partnerApiUser, user.user_id),
      rateLimitOption(RATE_LIMITS.partnerApiIp, requestIp(request))
    ]);
    if (limited) return limited;
  }
  const values: unknown[] = [user.organization_id];
  let partnerFilter = "";
  if (user.role === "partner") {
    values.push(user.partner_id);
    partnerFilter = ` and o.partner_id=$2`;
  }
  const rows = await query(`
    select o.*,p.name as partner_name
     from public.orders o join public.partners p on p.id=o.partner_id
     where o.organization_id=$1 and o.archived_at is null ${partnerFilter}
     order by o.created_at desc limit 500
  `, values);
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const auth = await apiUser(["admin", "management", "sales", "partner"]);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });
  const user = auth.user;
  if (user.role === "partner") {
    const limited = await enforceRateLimits([
      rateLimitOption(RATE_LIMITS.partnerApiIp, requestIp(request)),
      rateLimitOption(RATE_LIMITS.partnerOrderSubmit, String(user.partner_id ?? user.user_id))
    ]);
    if (limited) return limited;
  }

  try {
    const input = orderSchema.parse(await request.json());
    const partnerId = user.role === "partner" ? user.partner_id : input.partnerId;
    if (!partnerId) throw new Error("A partner kiválasztása kötelező.");

    const result = await transaction(async (client) => {
      await client.query(`select set_config('request.jwt.claim.sub',$1,true)`, [user.user_id]);

      const partnerResult = await client.query<any>(`
          select id,name,organization_id,active,minimum_order_cartons,default_payment_method,
                 overdue_policy,credit_limit_huf,price_list_id
          from public.partners
         where id=$1 and organization_id=$2 and archived_at is null
         for update
      `, [partnerId, user.organization_id]);
      const partner = partnerResult.rows[0];
      if (!partner?.active) {
        throw new Error("A partner nem található vagy inaktív.");
      }
      if (user.role === "partner" && partner.overdue_policy === "block") {
        const overdue = await client.query(`select coalesce(sum(outstanding_huf),0)::bigint amount from public.v_receivables_open where partner_id=$1 and due_date<current_date`, [partnerId]);
        if (Number(overdue.rows[0]?.amount ?? 0) > 0) {
          throw new Error("A rendelésleadás lejárt tartozás miatt blokkolva van.");
        }
      }

      const merged = new Map<number, number>();
      for (const item of input.items) merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.cartons);
      const items = [...merged.entries()].map(([productId, cartons]) => ({ productId, cartons }));
      const totalCartons = items.reduce((sum, item) => sum + item.cartons, 0);
      if (totalCartons < partner.minimum_order_cartons) {
        throw new Error(`A minimum rendelés ${partner.minimum_order_cartons} karton.`);
      }

      const deliveryDayResult = await client.query<{
        configured_count: number;
        selected_allowed: boolean;
        cutoff_days: number | null;
      }>(`
        select count(*)::int as configured_count,
               coalesce(bool_or(weekday=extract(isodow from $2::date)::int), false) as selected_allowed,
               min(cutoff_business_days) filter (where weekday=extract(isodow from $2::date)::int)::int as cutoff_days
          from public.partner_delivery_days
         where partner_id=$1 and active=true
           and exists(select 1 from public.partners p where p.id=partner_id and p.organization_id=$3 and p.archived_at is null)
      `, [partnerId, input.requestedDeliveryDate, user.organization_id]);
      const deliveryPolicy = deliveryDayResult.rows[0];
      if (Number(deliveryPolicy?.configured_count ?? 0) < 1) {
        throw new Error("Ehhez a partnerhez nincs aktív szállítási nap beállítva.");
      }
      if (!deliveryPolicy?.selected_allowed) {
        throw new Error("A kiválasztott dátum nem engedélyezett szállítási nap ennél a partnernél.");
      }
      const todayIso = new Date().toISOString().slice(0, 10);
      if (input.requestedDeliveryDate < todayIso) throw new Error("Múltbeli szállítási napra nem adható le rendelés.");
      const cutoffDays = Number(deliveryPolicy?.cutoff_days ?? 0);
      if (cutoffDays > 0) {
        const latestOrderDate = new Date(`${input.requestedDeliveryDate}T00:00:00.000Z`);
        latestOrderDate.setUTCDate(latestOrderDate.getUTCDate() - cutoffDays);
        if (todayIso > latestOrderDate.toISOString().slice(0, 10)) {
          throw new Error(`Erre a szállítási napra a rendelési zárás már lejárt (${cutoffDays} naptári nap).`);
        }
      }

      if (input.deliveryAddressId) {
        const address = await client.query(`
          select 1
            from public.partner_addresses a
            join public.partners p on p.id=a.partner_id
           where a.id=$1 and a.partner_id=$2 and p.organization_id=$3 and a.active=true
        `, [input.deliveryAddressId, partnerId, user.organization_id]);
        if (!address.rowCount) throw new Error("A kiválasztott szállítási cím nem érvényes.");
      } else if (user.role === "partner") {
        const addresses = await client.query(`
          select count(*)::int as count
            from public.partner_addresses a
            join public.partners p on p.id=a.partner_id
           where a.partner_id=$1 and p.organization_id=$2 and a.active=true
        `, [partnerId, user.organization_id]);
        if (Number(addresses.rows[0]?.count ?? 0) > 0) {
          throw new Error("A szállítási cím kiválasztása kötelező.");
        }
      }

      const orderResult = await client.query<any>(`
        insert into public.orders(
          order_number,order_year,order_sequence,partner_id,requested_delivery_date,
          payment_method,status,total_cartons,total_units,net_total_huf,vat_total_huf,
          gross_total_huf,note,created_by,organization_id,delivery_address_id,
          fulfillment_status,finance_status
        ) values('TEMP',extract(year from $2::date)::int,0,$1,$2,$3,'draft',0,0,0,0,0,$4,$5,$6,$7,'unreserved','not_due')
        returning *
      `, [partnerId, input.requestedDeliveryDate, input.paymentMethod, input.note || null, user.user_id, user.organization_id, input.deliveryAddressId ?? null]);
      const order = orderResult.rows[0];

      for (const item of items) {
        const productResult = await client.query<any>(`
          select p.*,
                 coalesce(s.available_units,0)::int as available_units,
                 coalesce(
                   (select pli.net_unit_price_huf
                      from public.price_list_items pli
                      join public.price_lists pl on pl.id=pli.price_list_id
                     where pli.product_id=p.id and pl.active=true
                       and current_date>=pl.valid_from
                       and (pl.valid_to is null or current_date<=pl.valid_to)
                       and (pl.id=$2 or (pl.type='general' and pl.organization_id=$3))
                     order by case when pl.id=$2 then 0 else 1 end,pl.valid_from desc limit 1),
                   p.net_unit_price_huf
                 )::int as effective_price
            from public.products p
            left join public.v_product_stock_summary s on s.product_id=p.id
           where p.id=$1 and p.organization_id=$3 and p.active=true
             and p.status in ('active','seasonal')
        `, [item.productId, partner.price_list_id, user.organization_id]);
        const product = productResult.rows[0];
        if (!product) throw new Error(`Nem rendelhető termékazonosító: ${item.productId}`);
        const units = item.cartons * product.units_per_carton;
        if (user.role === "partner" && units > Number(product.available_units ?? 0)) {
          throw new Error(`${product.name} jelenleg nincs elég készleten a választott mennyiséghez.`);
        }

        const inserted = await client.query<any>(`
          insert into public.order_items(order_id,product_id,cartons)
          values($1,$2,$3) returning *
        `, [order.id, product.id, item.cartons]);
        const row = inserted.rows[0];
        const net = units * product.effective_price;
        const vat = Math.round(net * product.vat_rate_bps / 10000);
        const gross = net + vat;
        await client.query(`
          update public.order_items set
            product_code_snapshot=$1,product_name_snapshot=$2,flavor_code_snapshot=$3,
            size_ml_snapshot=$4,units_per_carton_snapshot=$5,
            net_unit_price_huf_snapshot=$6,vat_rate_bps_snapshot=$7,
            unit_quantity=$8,net_total_huf=$9,vat_total_huf=$10,gross_total_huf=$11,
            purchase_unit_price_huf_snapshot=$12
          where id=$13 and order_id=$14
        `, [product.code, product.name, product.flavor_code, product.size_ml, product.units_per_carton,
          product.effective_price, product.vat_rate_bps, units, net, vat, gross,
          product.purchase_unit_price_huf ?? 0, row.id, order.id]);
      }

      const totalsResult = await client.query<any>(`
        select sum(cartons)::int total_cartons,sum(unit_quantity)::int total_units,
               sum(net_total_huf)::int net_total_huf,sum(vat_total_huf)::int vat_total_huf,
               sum(gross_total_huf)::int gross_total_huf
          from public.order_items where order_id=$1
      `, [order.id]);
      const totals = totalsResult.rows[0];

      const finalResult = await client.query<any>(`
        update public.orders set total_cartons=$2,total_units=$3,net_total_huf=$4,
          vat_total_huf=$5,gross_total_huf=$6,
          status=case when $7 then 'submitted' else 'draft' end,
          submitted_by=case when $7 then $8::uuid else null end,
          submitted_at=case when $7 then now() else null end
        where id=$1 and organization_id=$9 returning *
      `, [order.id, totals.total_cartons, totals.total_units, totals.net_total_huf,
        totals.vat_total_huf, totals.gross_total_huf, input.submit, user.user_id, user.organization_id]);

      await client.query(`
        insert into public.audit_log(actor_user_id,action,entity_type,entity_id,after_data)
        values($1,$2,'order',$3,$4::jsonb)
      `, [user.user_id, input.submit ? "order.submitted" : "order.created", String(order.id), JSON.stringify(finalResult.rows[0])]);
      if (input.submit) {
        await client.query(`
          insert into public.notifications(organization_id,role_code,type,title,body,entity_type,entity_id)
          values($1,null,'order.submitted','Új rendelés érkezett',$2,'order',$3)
        `, [user.organization_id, `${partner.name} rendelést küldött be. Bruttó összeg: ${totals.gross_total_huf} Ft.`, String(order.id)]);
        await queuePartnerOrderConfirmation(client, Number(user.organization_id), Number(partnerId), finalResult.rows[0], totals);
      }

      return finalResult.rows[0];
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error, "A rendelés mentése sikertelen.", { route: "/api/orders", userId: user.user_id, role: user.role });
  }
}

async function queuePartnerOrderConfirmation(client: any, organizationId: number, partnerId: number, order: any, totals: any) {
  const partnerResult = await client.query(`
    select email,name from public.partners where id=$1 and organization_id=$2
  `, [partnerId, organizationId]);
  const partner = partnerResult.rows[0] as { email: string | null; name: string } | undefined;
  if (!partner?.email) return;

  type OrderEmailItem = {
    product_name_snapshot: string;
    cartons: number;
    unit_quantity: number;
    gross_total_huf: number;
  };
  const items = await client.query(`
    select product_name_snapshot,cartons,unit_quantity,gross_total_huf
      from public.order_items
     where order_id=$1 and cartons>0
     order by product_name_snapshot
  `, [order.id]);
  const itemLines = (items.rows as OrderEmailItem[]).map((item) => (
    `- ${item.product_name_snapshot}: ${item.cartons} karton / ${item.unit_quantity} db, bruttó ${money(item.gross_total_huf)}`
  )).join("\n");
  const body = [
    `Kedves ${partner.name}!`,
    "",
    `Köszönjük, a rendelésedet rögzítettük: ${order.order_number}.`,
    `Kért szállítási nap: ${dateWithWeekdayHU(order.requested_delivery_date)}`,
    `Összesen: ${totals.total_cartons} karton / ${totals.total_units} db`,
    `Bruttó összeg: ${money(totals.gross_total_huf)}`,
    "",
    "Rendelt tételek:",
    itemLines || "- Nincs tétel",
    "",
    "A rendelést feldolgozzuk, és a szállítás előtt jelentkezünk, ha egyeztetés szükséges.",
    "",
    "Gellamille"
  ].join("\n");

  await client.query(`
    insert into public.email_outbox(organization_id,event_type,recipient_email,subject,body_text,payload)
    values($1,'order_confirmation',$2,$3,$4,$5::jsonb)
  `, [
    organizationId,
    partner.email,
    `Gellamille rendelés visszaigazolás - ${order.order_number}`,
    body,
    JSON.stringify({ order_id: order.id, order_number: order.order_number, partner_id: partnerId })
  ]);
}
