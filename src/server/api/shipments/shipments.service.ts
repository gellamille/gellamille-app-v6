import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '@/contracts';
import type { Prisma } from '../generated/prisma/client';
import { formatDateOnly, parseDateOnly } from '../common/utils/date.utils';
import { normalizePagination } from '../common/utils/pagination.utils';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateShipmentDto,
  ListShipmentsQueryDto,
} from './shipments.dto';


interface ShipmentRecord {
  id: bigint;
  shipmentNumber: string;
  partnerId: bigint;
  partner?: { name: string } | null;
  shipmentDate: Date;
  shippingAddress: string | null;
  customerOrderNumber: string | null;
  deliveryNoteNumber: string | null;
  note: string | null;
  status: string;
  voidReason: string | null;
  createdAt: Date;
  items?: Array<{ quantity: number }>;
}

interface AvailableLotRow {
  lot_id: bigint;
  lot_number: string;
  production_date: Date;
  production_period: string;
  flavor_code: string;
  flavor_name: string;
  size_ml: number;
  produced_quantity: number;
  best_before: Date;
  operator_id: bigint;
  operator_name: string;
  lot_status: string;
  reserved_quantity: number;
  shipped_quantity: number;
  available_quantity: number;
  current_quantity: number;
  available_for_shipment: number;
}

function clean(value?: string): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function snapshot(value: unknown): never {
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

@Injectable()
export class ShipmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListShipmentsQueryDto) {
    const { page, pageSize, skip } = normalizePagination(query.page, query.pageSize);
    const q = query.q?.trim();
    const where: Record<string, unknown> = {
      ...(query.status ? { status: query.status } : {}),
      ...(q
        ? {
            OR: [
              { shipmentNumber: { contains: q, mode: 'insensitive' } },
              { partner: { name: { contains: q, mode: 'insensitive' } } },
              { customerOrderNumber: { contains: q, mode: 'insensitive' } },
              { deliveryNoteNumber: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.shipment.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ shipmentDate: 'desc' }, { id: 'desc' }],
        include: {
          partner: { select: { name: true } },
          items: { select: { quantity: true } },
        },
      }),
      this.prisma.shipment.count({ where }),
    ]);

    return {
      items: items.map((shipment) => this.mapShipment(shipment)),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: bigint) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      include: {
        partner: true,
        items: {
          orderBy: { createdAt: 'asc' },
          include: {
            lot: { include: { flavor: { select: { name: true } } } },
          },
        },
        events: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    });
    if (!shipment) throw new NotFoundException('A szállítmány nem található.');

    return {
      ...this.mapShipment(shipment),
      partner: shipment.partner,
      items: shipment.items.map((item) => ({
        id: item.id,
        lotId: item.lotId,
        lotNumber: item.lot.lotNumber,
        flavorCode: item.lot.flavorCode,
        flavorName: item.lot.flavor.name,
        sizeMl: item.lot.sizeMl,
        bestBefore: formatDateOnly(item.lot.bestBefore),
        quantity: item.quantity,
      })),
      events: shipment.events,
    };
  }

  async availableLots(id: bigint, searchInput?: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      select: { id: true, status: true },
    });
    if (!shipment) throw new NotFoundException('A szállítmány nem található.');

    const search = searchInput?.trim() || null;
    const rows = await this.prisma.$queryRaw<AvailableLotRow[]>`
      SELECT
        ls.*,
        f.name AS flavor_name,
        COALESCE(current_item.quantity, 0)::int AS current_quantity,
        (ls.available_quantity + COALESCE(current_item.quantity, 0))::int
          AS available_for_shipment
      FROM public.lot_stock ls
      JOIN public.flavors f ON f.code = ls.flavor_code
      LEFT JOIN public.shipment_items current_item
        ON current_item.lot_id = ls.lot_id
       AND current_item.shipment_id = ${id}
      WHERE ls.lot_status = 'active'
        AND (ls.available_quantity + COALESCE(current_item.quantity, 0)) > 0
        AND (
          ${search}::text IS NULL
          OR ls.lot_number ILIKE '%' || ${search} || '%'
          OR f.name ILIKE '%' || ${search} || '%'
        )
      ORDER BY ls.best_before ASC, ls.production_date ASC, ls.lot_id ASC
      LIMIT 250
    `;

    return rows.map((row) => ({
      id: row.lot_id,
      lotNumber: row.lot_number,
      productionDate: formatDateOnly(row.production_date),
      productionPeriod: row.production_period,
      flavorCode: row.flavor_code,
      flavorName: row.flavor_name,
      sizeMl: row.size_ml,
      quantity: row.produced_quantity,
      producedQuantity: row.produced_quantity,
      bestBefore: formatDateOnly(row.best_before),
      operatorId: row.operator_id,
      operatorName: row.operator_name,
      status: row.lot_status,
      reservedQuantity: row.reserved_quantity,
      shippedQuantity: row.shipped_quantity,
      availableQuantity: row.available_quantity,
      currentQuantity: row.current_quantity,
      availableForShipment: row.available_for_shipment,
    }));
  }

  async create(
    dto: CreateShipmentDto,
    user: AuthenticatedUser,
    requestId: string,
  ) {
    const partnerId = this.parseId(dto.partnerId, 'Érvénytelen partnerazonosító.');
    const shipmentDate = parseDateOnly(dto.shipmentDate);
    const year = shipmentDate.getUTCFullYear();

    return this.prisma.$transaction(async (tx) => {
      const partner = await tx.partner.findFirst({ where: { id: partnerId, active: true } });
      if (!partner) throw new BadRequestException('Ismeretlen vagy inaktív partner.');

      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${'gellamille-shipment:' + year}))`;
      const counters = await tx.$queryRaw<Array<{ next_sequence: number }>>`
        SELECT (COALESCE(MAX(shipment_sequence), 0) + 1)::int AS next_sequence
        FROM public.shipments
        WHERE shipment_year = ${year}
      `;
      const sequence = counters[0]?.next_sequence ?? 1;
      if (sequence > 9999) {
        throw new ConflictException('Az éves szállítmánysorszám elérte a 9999-et.');
      }

      const shipment = await tx.shipment.create({
        data: {
          shipmentNumber: `SZ-${String(year).slice(-2)}-${String(sequence).padStart(4, '0')}`,
          shipmentYear: year,
          shipmentSequence: sequence,
          partnerId,
          shipmentDate,
          shippingAddress: clean(dto.shippingAddress) ?? partner.shippingAddress,
          customerOrderNumber: clean(dto.customerOrderNumber),
          deliveryNoteNumber: clean(dto.deliveryNoteNumber),
          note: clean(dto.note),
          status: 'draft',
          createdBy: user.id,
        },
        include: { partner: { select: { name: true } }, items: true },
      });

      await tx.shipmentEvent.create({
        data: {
          shipmentId: shipment.id,
          eventType: 'created',
          actorUserId: user.id,
          snapshot: snapshot(shipment),
        },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'shipment.create',
          entityType: 'shipment',
          entityId: shipment.id.toString(),
          afterData: snapshot(shipment),
          requestId,
        },
      });
      return this.mapShipment(shipment);
    });
  }

  async setItem(
    shipmentId: bigint,
    lotId: bigint,
    quantity: number,
    user: AuthenticatedUser,
    requestId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM public.shipments WHERE id = ${shipmentId} FOR UPDATE`;
      await tx.$queryRaw`SELECT id FROM public.lots WHERE id = ${lotId} FOR UPDATE`;
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lotId})`;

      const [shipment, lot] = await Promise.all([
        tx.shipment.findUnique({ where: { id: shipmentId } }),
        tx.lot.findUnique({ where: { id: lotId } }),
      ]);
      if (!shipment) throw new NotFoundException('A szállítmány nem található.');
      if (shipment.status !== 'draft') {
        throw new ConflictException('Csak piszkozat szállítmány módosítható.');
      }
      if (!lot) throw new NotFoundException('A LOT nem található.');
      if (lot.status !== 'active') {
        throw new ConflictException('Sztornózott LOT nem rendelhető szállítmányhoz.');
      }

      const allocated = await tx.shipmentItem.aggregate({
        where: {
          lotId,
          shipmentId: { not: shipmentId },
          shipment: { status: { in: ['draft', 'closed', 'shipped'] } },
        },
        _sum: { quantity: true },
      });
      const available = lot.quantity - (allocated._sum.quantity ?? 0);
      if (quantity > available) {
        throw new ConflictException(
          `Nincs elegendő készlet. Legfeljebb ${available} db rendelhető hozzá.`,
        );
      }

      const existing = await tx.shipmentItem.findUnique({
        where: { shipmentId_lotId: { shipmentId, lotId } },
      });
      const item = await tx.shipmentItem.upsert({
        where: { shipmentId_lotId: { shipmentId, lotId } },
        create: { shipmentId, lotId, quantity, createdBy: user.id },
        update: {
          quantity,
          updatedAt: new Date(),
          version: { increment: 1 },
        },
      });
      await tx.shipment.update({
        where: { id: shipmentId },
        data: { updatedAt: new Date(), version: { increment: 1 } },
      });
      await tx.shipmentEvent.create({
        data: {
          shipmentId,
          eventType: 'item_set',
          actorUserId: user.id,
          snapshot: snapshot({ item, lotNumber: lot.lotNumber, available }),
        },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'shipment.item.set',
          entityType: 'shipment_item',
          entityId: item.id.toString(),
          ...(existing ? { beforeData: snapshot(existing) } : {}),
          afterData: snapshot(item),
          requestId,
        },
      });
      return item;
    });
  }

  async removeItem(
    shipmentId: bigint,
    itemId: bigint,
    user: AuthenticatedUser,
    requestId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM public.shipments WHERE id = ${shipmentId} FOR UPDATE`;
      const shipment = await tx.shipment.findUnique({ where: { id: shipmentId } });
      if (!shipment) throw new NotFoundException('A szállítmány nem található.');
      if (shipment.status !== 'draft') {
        throw new ConflictException('Csak piszkozat szállítmány módosítható.');
      }
      const item = await tx.shipmentItem.findFirst({ where: { id: itemId, shipmentId } });
      if (!item) throw new NotFoundException('A szállítmánytétel nem található.');

      await tx.shipmentItem.delete({ where: { id: itemId } });
      await tx.shipment.update({
        where: { id: shipmentId },
        data: { updatedAt: new Date(), version: { increment: 1 } },
      });
      await tx.shipmentEvent.create({
        data: {
          shipmentId,
          eventType: 'item_removed',
          actorUserId: user.id,
          snapshot: snapshot(item),
        },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'shipment.item.remove',
          entityType: 'shipment_item',
          entityId: item.id.toString(),
          beforeData: snapshot(item),
          requestId,
        },
      });
      return { success: true };
    });
  }

  async transition(
    id: bigint,
    targetStatus: 'closed' | 'shipped',
    user: AuthenticatedUser,
    requestId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM public.shipments WHERE id = ${id} FOR UPDATE`;
      const shipment = await tx.shipment.findUnique({
        where: { id },
        include: { items: true, partner: { select: { name: true } } },
      });
      if (!shipment) throw new NotFoundException('A szállítmány nem található.');

      if (shipment.status === 'draft' && targetStatus === 'closed') {
        if (!shipment.items.length) {
          throw new BadRequestException('Üres szállítmány nem zárható le.');
        }
        const updated = await tx.shipment.update({
          where: { id },
          data: {
            status: 'closed',
            closedBy: user.id,
            closedAt: new Date(),
            updatedAt: new Date(),
            version: { increment: 1 },
          },
          include: { items: true, partner: { select: { name: true } } },
        });
        await this.writeTransition(tx, shipment, updated, 'closed', user.id, requestId);
        return this.mapShipment(updated);
      }

      if (shipment.status === 'closed' && targetStatus === 'shipped') {
        const updated = await tx.shipment.update({
          where: { id },
          data: {
            status: 'shipped',
            shippedBy: user.id,
            shippedAt: new Date(),
            updatedAt: new Date(),
            version: { increment: 1 },
          },
          include: { items: true, partner: { select: { name: true } } },
        });
        await this.writeTransition(tx, shipment, updated, 'shipped', user.id, requestId);
        return this.mapShipment(updated);
      }

      throw new ConflictException(
        `Érvénytelen státuszváltás: ${shipment.status} → ${targetStatus}.`,
      );
    });
  }

  async void(
    id: bigint,
    reasonInput: string,
    user: AuthenticatedUser,
    requestId: string,
  ) {
    const reason = reasonInput.trim().replace(/\s+/g, ' ');
    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM public.shipments WHERE id = ${id} FOR UPDATE`;
      const shipment = await tx.shipment.findUnique({
        where: { id },
        include: { items: true, partner: { select: { name: true } } },
      });
      if (!shipment) throw new NotFoundException('A szállítmány nem található.');
      if (shipment.status === 'void') {
        throw new ConflictException('Ez a szállítmány már sztornózva van.');
      }
      if (shipment.status === 'shipped') {
        throw new ConflictException('Kiszállított szállítmány nem sztornózható.');
      }

      const updated = await tx.shipment.update({
        where: { id },
        data: {
          status: 'void',
          voidReason: reason,
          voidedBy: user.id,
          voidedAt: new Date(),
          updatedAt: new Date(),
          version: { increment: 1 },
        },
        include: { items: true, partner: { select: { name: true } } },
      });
      await tx.shipmentEvent.create({
        data: {
          shipmentId: id,
          eventType: 'voided',
          reason,
          actorUserId: user.id,
          snapshot: snapshot(updated),
        },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'shipment.void',
          entityType: 'shipment',
          entityId: id.toString(),
          beforeData: snapshot(shipment),
          afterData: snapshot(updated),
          requestId,
        },
      });
      return this.mapShipment(updated);
    });
  }

  private async writeTransition(
    tx: Prisma.TransactionClient,
    before: unknown,
    after: ShipmentRecord,
    eventType: 'closed' | 'shipped',
    userId: string,
    requestId: string,
  ) {
    await tx.shipmentEvent.create({
      data: {
        shipmentId: after.id,
        eventType,
        actorUserId: userId,
        snapshot: snapshot(after),
      },
    });
    await tx.auditLog.create({
      data: {
        actorUserId: userId,
        action: `shipment.${eventType}`,
        entityType: 'shipment',
        entityId: after.id.toString(),
        beforeData: snapshot(before),
        afterData: snapshot(after),
        requestId,
      },
    });
  }

  private parseId(value: string, message: string): bigint {
    try {
      return BigInt(value);
    } catch {
      throw new BadRequestException(message);
    }
  }

  private mapShipment(shipment: ShipmentRecord) {
    const items = shipment.items ?? [];
    return {
      id: shipment.id,
      shipmentNumber: shipment.shipmentNumber,
      partnerId: shipment.partnerId,
      partnerName: shipment.partner?.name,
      shipmentDate: formatDateOnly(shipment.shipmentDate),
      shippingAddress: shipment.shippingAddress,
      customerOrderNumber: shipment.customerOrderNumber,
      deliveryNoteNumber: shipment.deliveryNoteNumber,
      note: shipment.note,
      status: shipment.status,
      voidReason: shipment.voidReason,
      lotCount: items.length,
      units: items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0),
      createdAt: shipment.createdAt,
    };
  }
}
