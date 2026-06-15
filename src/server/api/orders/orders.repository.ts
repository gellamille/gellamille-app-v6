import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { ListOrdersQueryDto } from './orders.dto';

export interface OrderRow {
  id: bigint;
  order_number: string;
  partner_id: bigint;
  partner_name: string;
  requested_delivery_date: Date;
  payment_method: string | null;
  status: string;
  total_cartons: number;
  total_units: number;
  net_total_huf: number;
  vat_total_huf: number;
  gross_total_huf: number;
  note: string | null;
  rejection_reason: string | null;
  void_reason: string | null;
  created_at: Date;
  submitted_at: Date | null;
  approved_at: Date | null;
  item_count: number;
  version: number;
}

export interface OrderPartnerRow {
  id: bigint;
  name: string;
  shipping_address: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
}

export interface OrderItemRow {
  id: bigint;
  product_id: bigint;
  product_code_snapshot: string;
  product_name_snapshot: string;
  flavor_code_snapshot: string;
  size_ml_snapshot: number;
  cartons: number;
  units_per_carton_snapshot: number;
  unit_quantity: number;
  net_unit_price_huf_snapshot: number;
  net_total_huf: number;
  vat_rate_bps_snapshot: number;
  vat_total_huf: number;
  gross_total_huf: number;
  allocated_quantity: number;
}

export interface OrderShipmentRow {
  id: bigint;
  shipment_number: string;
  status: string;
}

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    query: ListOrdersQueryDto,
    skip: number,
    take: number,
  ): Promise<{ items: OrderRow[]; total: number }> {
    const q = query.q?.trim();
    const statusFilter = query.status
      ? Prisma.sql`AND o.status = ${query.status}`
      : Prisma.empty;
    const searchFilter = q
      ? Prisma.sql`AND (o.order_number ILIKE ${`%${q}%`} OR p.name ILIKE ${`%${q}%`})`
      : Prisma.empty;

    const [items, countRows] = await this.prisma.$transaction([
      this.prisma.$queryRaw<OrderRow[]>(Prisma.sql`
        SELECT
          o.id,
          o.order_number,
          o.partner_id,
          p.name AS partner_name,
          o.requested_delivery_date,
          o.payment_method,
          o.status,
          o.total_cartons,
          o.total_units,
          o.net_total_huf,
          o.vat_total_huf,
          o.gross_total_huf,
          o.note,
          o.rejection_reason,
          o.void_reason,
          o.created_at,
          o.submitted_at,
          o.approved_at,
          count(oi.id)::integer AS item_count,
          o.version
        FROM public.orders o
        JOIN public.partners p ON p.id = o.partner_id
        LEFT JOIN public.order_items oi ON oi.order_id = o.id
        WHERE TRUE
          ${statusFilter}
          ${searchFilter}
        GROUP BY o.id, p.name
        ORDER BY o.requested_delivery_date DESC, o.id DESC
        OFFSET ${skip}
        LIMIT ${take}
      `),
      this.prisma.$queryRaw<Array<{ total: bigint }>>(Prisma.sql`
        SELECT count(*)::bigint AS total
        FROM public.orders o
        JOIN public.partners p ON p.id = o.partner_id
        WHERE TRUE
          ${statusFilter}
          ${searchFilter}
      `),
    ]);

    return {
      items,
      total: Number(countRows[0]?.total ?? 0n),
    };
  }

  async findBase(id: bigint): Promise<OrderRow | null> {
    const rows = await this.prisma.$queryRaw<OrderRow[]>(Prisma.sql`
      SELECT
        o.id,
        o.order_number,
        o.partner_id,
        p.name AS partner_name,
        o.requested_delivery_date,
        o.payment_method,
        o.status,
        o.total_cartons,
        o.total_units,
        o.net_total_huf,
        o.vat_total_huf,
        o.gross_total_huf,
        o.note,
        o.rejection_reason,
        o.void_reason,
        o.created_at,
        o.submitted_at,
        o.approved_at,
        count(oi.id)::integer AS item_count,
        o.version
      FROM public.orders o
      JOIN public.partners p ON p.id = o.partner_id
      LEFT JOIN public.order_items oi ON oi.order_id = o.id
      WHERE o.id = ${id}
      GROUP BY o.id, p.name
    `);

    return rows[0] ?? null;
  }

  async findPartner(orderId: bigint): Promise<OrderPartnerRow | null> {
    const rows = await this.prisma.$queryRaw<OrderPartnerRow[]>(Prisma.sql`
      SELECT
        p.id,
        p.name,
        p.shipping_address,
        p.contact_name,
        p.email,
        p.phone
      FROM public.orders o
      JOIN public.partners p ON p.id = o.partner_id
      WHERE o.id = ${orderId}
    `);
    return rows[0] ?? null;
  }

  items(orderId: bigint): Promise<OrderItemRow[]> {
    return this.prisma.$queryRaw<OrderItemRow[]>(Prisma.sql`
      SELECT
        oi.id,
        oi.product_id,
        oi.product_code_snapshot,
        oi.product_name_snapshot,
        oi.flavor_code_snapshot,
        oi.size_ml_snapshot,
        oi.cartons,
        oi.units_per_carton_snapshot,
        oi.unit_quantity,
        oi.net_unit_price_huf_snapshot,
        oi.net_total_huf,
        oi.vat_rate_bps_snapshot,
        oi.vat_total_huf,
        oi.gross_total_huf,
        coalesce(sum(oa.quantity), 0)::integer AS allocated_quantity
      FROM public.order_items oi
      LEFT JOIN public.order_allocations oa ON oa.order_item_id = oi.id
      WHERE oi.order_id = ${orderId}
      GROUP BY oi.id
      ORDER BY oi.id
    `);
  }

  shipments(orderId: bigint): Promise<OrderShipmentRow[]> {
    return this.prisma.$queryRaw<OrderShipmentRow[]>(Prisma.sql`
      SELECT id, shipment_number, status
      FROM public.shipments
      WHERE order_id = ${orderId}
      ORDER BY created_at DESC
    `);
  }

  async findForUpdate(
    tx: Prisma.TransactionClient,
    id: bigint,
  ): Promise<OrderRow | null> {
    const rows = await tx.$queryRaw<OrderRow[]>(Prisma.sql`
      SELECT
        o.id,
        o.order_number,
        o.partner_id,
        p.name AS partner_name,
        o.requested_delivery_date,
        o.payment_method,
        o.status,
        o.total_cartons,
        o.total_units,
        o.net_total_huf,
        o.vat_total_huf,
        o.gross_total_huf,
        o.note,
        o.rejection_reason,
        o.void_reason,
        o.created_at,
        o.submitted_at,
        o.approved_at,
        (SELECT count(*)::integer FROM public.order_items WHERE order_id = o.id) AS item_count,
        o.version
      FROM public.orders o
      JOIN public.partners p ON p.id = o.partner_id
      WHERE o.id = ${id}
      FOR UPDATE OF o
    `);
    return rows[0] ?? null;
  }

  async updateStatus(
    tx: Prisma.TransactionClient,
    id: bigint,
    input: {
      status: string;
      actorUserId: string;
      reason?: string;
    },
  ): Promise<OrderRow> {
    const approved = input.status === 'approved';
    const rejected = input.status === 'rejected';
    const voided = input.status === 'void';

    const rows = await tx.$queryRaw<OrderRow[]>(Prisma.sql`
      UPDATE public.orders
      SET
        status = ${input.status},
        approved_by = CASE WHEN ${approved} THEN ${input.actorUserId}::uuid ELSE approved_by END,
        approved_at = CASE WHEN ${approved} THEN now() ELSE approved_at END,
        rejected_by = CASE WHEN ${rejected} THEN ${input.actorUserId}::uuid ELSE rejected_by END,
        rejected_at = CASE WHEN ${rejected} THEN now() ELSE rejected_at END,
        rejection_reason = CASE WHEN ${rejected} THEN ${input.reason ?? null} ELSE rejection_reason END,
        voided_by = CASE WHEN ${voided} THEN ${input.actorUserId}::uuid ELSE voided_by END,
        voided_at = CASE WHEN ${voided} THEN now() ELSE voided_at END,
        void_reason = CASE WHEN ${voided} THEN ${input.reason ?? null} ELSE void_reason END,
        version = version + 1,
        updated_at = now()
      WHERE id = ${id}
      RETURNING
        id,
        order_number,
        partner_id,
        (SELECT name FROM public.partners WHERE id = partner_id) AS partner_name,
        requested_delivery_date,
        payment_method,
        status,
        total_cartons,
        total_units,
        net_total_huf,
        vat_total_huf,
        gross_total_huf,
        note,
        rejection_reason,
        void_reason,
        created_at,
        submitted_at,
        approved_at,
        (SELECT count(*)::integer FROM public.order_items WHERE order_id = id) AS item_count,
        version
    `);

    const order = rows[0];
    if (!order) throw new Error('A rendelés frissítése nem adott vissza rekordot.');
    return order;
  }
}
