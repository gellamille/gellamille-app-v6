import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { AuthenticatedUser } from '@/contracts';
import { Prisma } from '../generated/prisma/client';
import { normalizePagination } from '../common/utils/pagination.utils';
import { PrismaService } from '../prisma/prisma.service';
import type { CreatePartnerDto, ListPartnersQueryDto } from './partners.dto';

interface DeliveryDayRow {
  id: bigint;
  partner_id: bigint;
  weekday: number;
  cutoff_business_days: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

function clean(value?: string): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function snapshot(value: unknown): never {
  return JSON.parse(
    JSON.stringify(value, (_key, nested) =>
      typeof nested === 'bigint' ? nested.toString() : nested,
    ),
  ) as never;
}

function mapDeliveryDay(row: DeliveryDayRow) {
  return {
    id: row.id,
    partnerId: row.partner_id,
    weekday: row.weekday,
    cutoffBusinessDays: row.cutoff_business_days,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListPartnersQueryDto) {
    const { page, pageSize, skip } = normalizePagination(query.page, query.pageSize);
    const q = query.q?.trim();
    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { billingName: { contains: q, mode: 'insensitive' as const } },
            { contactName: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.partner.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ active: 'desc' }, { name: 'asc' }],
        include: {
          shipments: {
            where: { status: { not: 'void' } },
            select: { items: { select: { quantity: true } } },
          },
        },
      }),
      this.prisma.partner.count({ where }),
    ]);

    return {
      items: items.map((partner) => ({
        ...partner,
        shipmentCount: partner.shipments.length,
        allocatedUnits: partner.shipments.reduce(
          (sum, shipment) =>
            sum + shipment.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
          0,
        ),
        shipments: undefined,
      })),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: bigint) {
    const [partner, deliveryDays] = await Promise.all([
      this.prisma.partner.findUnique({
        where: { id },
        include: {
          shipments: {
            orderBy: { shipmentDate: 'desc' },
            include: { items: { select: { quantity: true } } },
          },
        },
      }),
      this.deliveryDaysRaw(id),
    ]);

    if (!partner) throw new NotFoundException('A partner nem található.');

    return {
      ...partner,
      deliveryDays: deliveryDays.map(mapDeliveryDay),
      shipments: partner.shipments.map((shipment) => ({
        ...shipment,
        lotCount: shipment.items.length,
        units: shipment.items.reduce((sum, item) => sum + item.quantity, 0),
        items: undefined,
      })),
    };
  }

  private deliveryDaysRaw(id: bigint): Promise<DeliveryDayRow[]> {
    return this.prisma.$queryRaw<DeliveryDayRow[]>(Prisma.sql`
      SELECT
        id,
        partner_id,
        weekday,
        cutoff_business_days,
        active,
        created_at,
        updated_at
      FROM public.partner_delivery_days
      WHERE partner_id = ${id}
        AND active = true
      ORDER BY weekday
    `);
  }

  async deliveryDays(id: bigint) {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!partner) throw new NotFoundException('A partner nem található.');

    const rows = await this.deliveryDaysRaw(id);
    return rows.map(mapDeliveryDay);
  }

  async setDeliveryDays(
    id: bigint,
    days: Array<{ weekday: number; cutoffBusinessDays: number }>,
    user: AuthenticatedUser,
    requestId: string,
  ) {
    const uniqueWeekdays = new Set(days.map((day) => day.weekday));
    if (uniqueWeekdays.size !== days.length) {
      throw new ConflictException(
        'Ugyanaz a szállítási nap csak egyszer szerepelhet.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const partner = await tx.partner.findUnique({ where: { id } });
      if (!partner) throw new NotFoundException('A partner nem található.');

      const before = await tx.$queryRaw<DeliveryDayRow[]>(Prisma.sql`
        SELECT *
        FROM public.partner_delivery_days
        WHERE partner_id = ${id}
        ORDER BY weekday
        FOR UPDATE
      `);

      await tx.$executeRaw(Prisma.sql`
        DELETE FROM public.partner_delivery_days
        WHERE partner_id = ${id}
      `);

      for (const day of days) {
        await tx.$executeRaw(Prisma.sql`
          INSERT INTO public.partner_delivery_days (
            partner_id,
            weekday,
            cutoff_business_days,
            active
          )
          VALUES (
            ${id},
            ${day.weekday},
            ${day.cutoffBusinessDays},
            true
          )
        `);
      }

      const after = await tx.$queryRaw<DeliveryDayRow[]>(Prisma.sql`
        SELECT *
        FROM public.partner_delivery_days
        WHERE partner_id = ${id}
        ORDER BY weekday
      `);

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'partner.delivery_days.update',
          entityType: 'partner',
          entityId: id.toString(),
          beforeData: snapshot(before),
          afterData: snapshot(after),
          requestId,
        },
      });

      return after.map(mapDeliveryDay);
    });
  }

  async create(
    dto: CreatePartnerDto,
    user: AuthenticatedUser,
    requestId: string,
  ) {
    const name = dto.name.trim().replace(/\s+/g, ' ');
    const duplicate = await this.prisma.$queryRaw<Array<{ id: bigint }>>`
      SELECT id FROM public.partners
      WHERE lower(trim(name)) = lower(${name})
      LIMIT 1
    `;
    if (duplicate.length) throw new ConflictException('Már létezik ilyen nevű partner.');

    return this.prisma.$transaction(async (tx) => {
      const partner = await tx.partner.create({
        data: {
          name,
          billingName: clean(dto.billingName),
          taxNumber: clean(dto.taxNumber),
          shippingAddress: clean(dto.shippingAddress),
          contactName: clean(dto.contactName),
          email: clean(dto.email)?.toLowerCase() ?? null,
          phone: clean(dto.phone),
          note: clean(dto.note),
          createdBy: user.id,
        },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'partner.create',
          entityType: 'partner',
          entityId: partner.id.toString(),
          afterData: snapshot(partner),
          requestId,
        },
      });
      return partner;
    });
  }
}
