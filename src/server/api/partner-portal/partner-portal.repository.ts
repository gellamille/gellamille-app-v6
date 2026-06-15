import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface PortalPartnerRow {
  id: bigint;
  name: string;
  shipping_address: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  active: boolean;
}

export interface PortalProductRow {
  id: bigint;
  code: string;
  flavor_code: string;
  flavor_name: string;
  size_ml: number;
  units_per_carton: number;
  net_unit_price_huf: number;
  vat_rate_bps: number;
  active: boolean;
  sort_order: number;
  version: number;
}

export interface OrderingSettingsRow {
  minimum_order_cartons: number;
  default_vat_rate_bps: number;
}

export interface DeliveryRuleRow {
  weekday: number;
  cutoff_business_days: number;
}

export interface PortalOrderRow {
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
}

export interface PortalOrderItemRow {
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
}

@Injectable()
export class PartnerPortalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async partner(partnerId: bigint): Promise<PortalPartnerRow | null> {
    const rows = await this.prisma.$queryRaw<PortalPartnerRow[]>(Prisma.sql`
      SELECT
        id,
        name,
        shipping_address,
        contact_name,
        email,
        phone,
        active
      FROM public.partners
      WHERE id = ${partnerId}
        AND active = true
    `);
    return rows[0] ?? null;
  }

  products(productIds?: bigint[]): Promise<PortalProductRow[]> {
    const filter = productIds
      ? Prisma.sql`AND p.id IN (${Prisma.join(productIds)})`
      : Prisma.empty;

    if (productIds && productIds.length === 0) {
      return Promise.resolve([]);
    }

    return this.prisma.$queryRaw<PortalProductRow[]>(Prisma.sql`
      SELECT
        p.id,
        p.code,
        p.flavor_code,
        f.name AS flavor_name,
        p.size_ml,
        p.units_per_carton,
        p.net_unit_price_huf,
        p.vat_rate_bps,
        p.active,
        p.sort_order,
        p.version
      FROM public.products p
      JOIN public.flavors f ON f.code = p.flavor_code
      WHERE p.active = true
        ${filter}
      ORDER BY p.size_ml, p.sort_order, p.code
    `);
  }

  async settings(): Promise<OrderingSettingsRow | null> {
    const rows = await this.prisma.$queryRaw<OrderingSettingsRow[]>(Prisma.sql`
      SELECT minimum_order_cartons, default_vat_rate_bps
      FROM public.ordering_settings
      WHERE singleton = true
    `);
    return rows[0] ?? null;
  }

  deliveryRules(partnerId: bigint): Promise<DeliveryRuleRow[]> {
    return this.prisma.$queryRaw<DeliveryRuleRow[]>(Prisma.sql`
      SELECT weekday, cutoff_business_days
      FROM public.partner_delivery_days
      WHERE partner_id = ${partnerId}
        AND active = true
      ORDER BY weekday
    `);
  }

  listOrders(partnerId: bigint): Promise<PortalOrderRow[]> {
    return this.prisma.$queryRaw<PortalOrderRow[]>(Prisma.sql`
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
        count(oi.id)::integer AS item_count
      FROM public.orders o
      JOIN public.partners p ON p.id = o.partner_id
      LEFT JOIN public.order_items oi ON oi.order_id = o.id
      WHERE o.partner_id = ${partnerId}
      GROUP BY o.id, p.name
      ORDER BY o.requested_delivery_date DESC, o.id DESC
      LIMIT 100
    `);
  }

  async findOrder(
    id: bigint,
    partnerId: bigint,
  ): Promise<PortalOrderRow | null> {
    const rows = await this.prisma.$queryRaw<PortalOrderRow[]>(Prisma.sql`
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
        count(oi.id)::integer AS item_count
      FROM public.orders o
      JOIN public.partners p ON p.id = o.partner_id
      LEFT JOIN public.order_items oi ON oi.order_id = o.id
      WHERE o.id = ${id}
        AND o.partner_id = ${partnerId}
      GROUP BY o.id, p.name
    `);
    return rows[0] ?? null;
  }

  orderItems(
    orderId: bigint,
    partnerId: bigint,
  ): Promise<PortalOrderItemRow[]> {
    return this.prisma.$queryRaw<PortalOrderItemRow[]>(Prisma.sql`
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
        oi.gross_total_huf
      FROM public.order_items oi
      JOIN public.orders o ON o.id = oi.order_id
      WHERE oi.order_id = ${orderId}
        AND o.partner_id = ${partnerId}
      ORDER BY oi.id
    `);
  }
}
