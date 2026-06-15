import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import type {
  AuthenticatedUser,
  DeliveryDateOptionDto,
} from '@/contracts';
import { PrismaService } from '../prisma/prisma.service';
import type { CreatePartnerOrderDto } from './partner-portal.dto';
import {
  PartnerPortalRepository,
  type PortalOrderRow,
  type PortalProductRow,
} from './partner-portal.repository';

const BUDAPEST_TIMEZONE = 'Europe/Budapest';
const DELIVERY_HORIZON_DAYS = 100;
const MAX_DELIVERY_OPTIONS = 24;

function dateOnlyUtc(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function isoWeekday(date: Date): number {
  const weekday = date.getUTCDay();
  return weekday === 0 ? 7 : weekday;
}

function subtractBusinessDays(date: Date, businessDays: number): Date {
  let result = new Date(date);
  let remaining = businessDays;

  while (remaining > 0) {
    result = addDays(result, -1);
    if (isoWeekday(result) <= 5) remaining -= 1;
  }

  return result;
}

function todayInBudapest(): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUDAPEST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return dateOnlyUtc(`${values.year}-${values.month}-${values.day}`);
}

function huDateLabel(date: Date): string {
  return new Intl.DateTimeFormat('hu-HU', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

function jsonSnapshot(value: unknown): never {
  return JSON.parse(
    JSON.stringify(value, (_key, nested) =>
      typeof nested === 'bigint'
        ? nested.toString()
        : nested instanceof Date
          ? nested.toISOString()
          : nested,
    ),
  ) as never;
}

function mapProduct(product: PortalProductRow) {
  return {
    id: product.id,
    code: product.code,
    flavorCode: product.flavor_code,
    flavorName: product.flavor_name,
    sizeMl: product.size_ml,
    unitsPerCarton: product.units_per_carton,
    netUnitPriceHuf: product.net_unit_price_huf,
    netCartonPriceHuf:
      product.net_unit_price_huf * product.units_per_carton,
    vatRateBps: product.vat_rate_bps,
    active: product.active,
    sortOrder: product.sort_order,
    version: product.version,
  };
}

function mapOrder(order: PortalOrderRow) {
  return {
    id: order.id,
    orderNumber: order.order_number,
    partnerId: order.partner_id,
    partnerName: order.partner_name,
    requestedDeliveryDate: formatDateOnly(order.requested_delivery_date),
    paymentMethod: order.payment_method,
    status: order.status,
    totalCartons: order.total_cartons,
    totalUnits: order.total_units,
    netTotalHuf: order.net_total_huf,
    vatTotalHuf: order.vat_total_huf,
    grossTotalHuf: order.gross_total_huf,
    note: order.note,
    rejectionReason: order.rejection_reason,
    voidReason: order.void_reason,
    createdAt: order.created_at,
    submittedAt: order.submitted_at,
    approvedAt: order.approved_at,
    itemCount: order.item_count,
  };
}

@Injectable()
export class PartnerPortalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: PartnerPortalRepository,
  ) {}

  private partnerId(user: AuthenticatedUser): bigint {
    if (!user.partnerId) {
      throw new ForbiddenException(
        'A felhasználó nincs partnerhez rendelve.',
      );
    }
    return BigInt(user.partnerId);
  }

  private async settings() {
    const settings = await this.repository.settings();
    if (!settings) {
      throw new ConflictException(
        'A rendelési rendszer nincs megfelelően beállítva.',
      );
    }
    return settings;
  }

  private async deliveryDates(
    partnerId: bigint,
  ): Promise<DeliveryDateOptionDto[]> {
    const rules = await this.repository.deliveryRules(partnerId);
    if (!rules.length) return [];

    const today = todayInBudapest();
    const start = addDays(today, 1);
    const options: DeliveryDateOptionDto[] = [];

    for (let offset = 0; offset <= DELIVERY_HORIZON_DAYS; offset += 1) {
      const candidate = addDays(start, offset);
      const rule = rules.find(
        (item) => item.weekday === isoWeekday(candidate),
      );
      if (!rule) continue;

      const deadline = subtractBusinessDays(
        candidate,
        rule.cutoff_business_days,
      );
      if (today.getTime() > deadline.getTime()) continue;

      options.push({
        date: formatDateOnly(candidate),
        weekday: rule.weekday,
        cutoffBusinessDays: rule.cutoff_business_days,
        orderDeadline: formatDateOnly(deadline),
        label: huDateLabel(candidate),
      });

      if (options.length >= MAX_DELIVERY_OPTIONS) break;
    }

    return options;
  }

  async bootstrap(user: AuthenticatedUser) {
    const partnerId = this.partnerId(user);
    const [partner, products, settings, deliveryDates] = await Promise.all([
      this.repository.partner(partnerId),
      this.repository.products(),
      this.settings(),
      this.deliveryDates(partnerId),
    ]);

    if (!partner) {
      throw new ForbiddenException('A partner nem található vagy inaktív.');
    }

    return {
      profile: {
        userId: user.id,
        email: user.email,
        partnerId: partner.id,
        partnerName: partner.name,
        shippingAddress: partner.shipping_address,
        contactName: partner.contact_name,
        contactEmail: partner.email,
        contactPhone: partner.phone,
      },
      products: products.map(mapProduct),
      deliveryDates,
      minimumOrderCartons: settings.minimum_order_cartons,
      vatRateBps: settings.default_vat_rate_bps,
    };
  }

  async listOrders(user: AuthenticatedUser) {
    const orders = await this.repository.listOrders(this.partnerId(user));
    return orders.map(mapOrder);
  }

  async findOrder(id: bigint, user: AuthenticatedUser) {
    const partnerId = this.partnerId(user);
    const [order, partner, items] = await Promise.all([
      this.repository.findOrder(id, partnerId),
      this.repository.partner(partnerId),
      this.repository.orderItems(id, partnerId),
    ]);

    if (!order || !partner) {
      throw new NotFoundException('A rendelés nem található.');
    }

    return {
      ...mapOrder(order),
      partner: {
        id: partner.id,
        name: partner.name,
        shippingAddress: partner.shipping_address,
        contactName: partner.contact_name,
        email: partner.email,
        phone: partner.phone,
      },
      items: items.map((item) => ({
        id: item.id,
        productId: item.product_id,
        productCode: item.product_code_snapshot,
        productName: item.product_name_snapshot,
        flavorCode: item.flavor_code_snapshot,
        sizeMl: item.size_ml_snapshot,
        cartons: item.cartons,
        unitsPerCarton: item.units_per_carton_snapshot,
        unitQuantity: item.unit_quantity,
        netUnitPriceHuf: item.net_unit_price_huf_snapshot,
        netTotalHuf: item.net_total_huf,
        vatRateBps: item.vat_rate_bps_snapshot,
        vatTotalHuf: item.vat_total_huf,
        grossTotalHuf: item.gross_total_huf,
      })),
    };
  }

  async createOrder(
    dto: CreatePartnerOrderDto,
    user: AuthenticatedUser,
    requestId: string,
  ) {
    const partnerId = this.partnerId(user);
    const [settings, partner] = await Promise.all([
      this.settings(),
      this.repository.partner(partnerId),
    ]);

    if (!partner) {
      throw new ForbiddenException('A partner nem található vagy inaktív.');
    }

    const uniqueProductIds = new Set(dto.items.map((item) => item.productId));
    if (uniqueProductIds.size !== dto.items.length) {
      throw new BadRequestException(
        'Egy termék csak egyszer szerepelhet a rendelésben.',
      );
    }

    let productIds: bigint[];
    try {
      productIds = [...uniqueProductIds].map((id) => BigInt(id));
    } catch {
      throw new BadRequestException('Érvénytelen termékazonosító.');
    }

    const allowedDates = await this.deliveryDates(partnerId);
    if (!allowedDates.some((option) => option.date === dto.requestedDeliveryDate)) {
      throw new BadRequestException(
        'A kiválasztott szállítási dátum nem engedélyezett vagy lejárt a rendelési határidő.',
      );
    }

    const products = await this.repository.products(productIds);
    if (products.length !== productIds.length) {
      throw new BadRequestException(
        'Legalább egy kiválasztott termék nem rendelhető.',
      );
    }

    const productMap = new Map(
      products.map((product) => [product.id.toString(), product]),
    );

    const itemData = dto.items.map((input) => {
      const product = productMap.get(input.productId);
      if (!product) {
        throw new BadRequestException('A kiválasztott termék nem található.');
      }

      const unitQuantity = input.cartons * product.units_per_carton;
      const netTotalHuf = unitQuantity * product.net_unit_price_huf;
      const vatTotalHuf = Math.round(
        (netTotalHuf * product.vat_rate_bps) / 10000,
      );

      return {
        product,
        cartons: input.cartons,
        unitQuantity,
        netTotalHuf,
        vatTotalHuf,
        grossTotalHuf: netTotalHuf + vatTotalHuf,
      };
    });

    const totals = itemData.reduce(
      (sum, item) => ({
        cartons: sum.cartons + item.cartons,
        units: sum.units + item.unitQuantity,
        net: sum.net + item.netTotalHuf,
        vat: sum.vat + item.vatTotalHuf,
        gross: sum.gross + item.grossTotalHuf,
      }),
      { cartons: 0, units: 0, net: 0, vat: 0, gross: 0 },
    );

    if (totals.cartons < settings.minimum_order_cartons) {
      throw new BadRequestException(
        `A minimum rendelés ${settings.minimum_order_cartons} karton.`,
      );
    }

    const deliveryDate = dateOnlyUtc(dto.requestedDeliveryDate);

    const created = await this.prisma.$transaction(async (tx) => {
      const orderRows = await tx.$queryRaw<Array<{ id: bigint }>>(Prisma.sql`
        INSERT INTO public.orders (
          order_number,
          order_year,
          order_sequence,
          partner_id,
          requested_delivery_date,
          payment_method,
          status,
          total_cartons,
          total_units,
          net_total_huf,
          vat_total_huf,
          gross_total_huf,
          note,
          created_by
        )
        VALUES (
          ${`PENDING-${crypto.randomUUID()}`},
          ${deliveryDate.getUTCFullYear()},
          0,
          ${partnerId},
          ${deliveryDate},
          ${dto.paymentMethod},
          'draft',
          0,
          0,
          0,
          0,
          0,
          ${dto.note?.trim() || null},
          ${user.id}::uuid
        )
        RETURNING id
      `);

      const orderId = orderRows[0]?.id;
      if (!orderId) {
        throw new ConflictException('A rendelés létrehozása sikertelen.');
      }

      for (const item of itemData) {
        await tx.$executeRaw(Prisma.sql`
          INSERT INTO public.order_items (
            order_id,
            product_id,
            cartons,
            product_code_snapshot,
            product_name_snapshot,
            flavor_code_snapshot,
            size_ml_snapshot,
            units_per_carton_snapshot,
            net_unit_price_huf_snapshot,
            vat_rate_bps_snapshot,
            unit_quantity,
            net_total_huf,
            vat_total_huf,
            gross_total_huf
          )
          VALUES (
            ${orderId},
            ${item.product.id},
            ${item.cartons},
            ${item.product.code},
            ${item.product.flavor_name},
            ${item.product.flavor_code},
            ${item.product.size_ml},
            ${item.product.units_per_carton},
            ${item.product.net_unit_price_huf},
            ${item.product.vat_rate_bps},
            ${item.unitQuantity},
            ${item.netTotalHuf},
            ${item.vatTotalHuf},
            ${item.grossTotalHuf}
          )
        `);
      }

      await tx.$executeRaw(Prisma.sql`
        UPDATE public.orders
        SET
          status = 'submitted',
          total_cartons = ${totals.cartons},
          total_units = ${totals.units},
          net_total_huf = ${totals.net},
          vat_total_huf = ${totals.vat},
          gross_total_huf = ${totals.gross},
          submitted_by = ${user.id}::uuid,
          submitted_at = now(),
          version = version + 1,
          updated_at = now()
        WHERE id = ${orderId}
      `);

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'partner_order.submitted',
          entityType: 'order',
          entityId: orderId.toString(),
          afterData: jsonSnapshot({
            partnerId,
            requestedDeliveryDate: dto.requestedDeliveryDate,
            paymentMethod: dto.paymentMethod,
            totalCartons: totals.cartons,
            totalUnits: totals.units,
            netTotalHuf: totals.net,
            vatTotalHuf: totals.vat,
            grossTotalHuf: totals.gross,
          }),
          requestId,
        },
      });

      return orderId;
    });

    const order = await this.repository.findOrder(created, partnerId);
    if (!order) {
      throw new ConflictException('A létrehozott rendelés nem olvasható vissza.');
    }

    return mapOrder(order);
  }
}
