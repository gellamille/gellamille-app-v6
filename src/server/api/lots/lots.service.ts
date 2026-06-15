import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '@/contracts';
import { PrismaService } from '../prisma/prisma.service';
import {
  addCalendarMonths,
  formatDateOnly,
  lotNumber,
  parseDateOnly,
} from '../common/utils/date.utils';
import { normalizePagination } from '../common/utils/pagination.utils';
import type { CreateLotDto, ListLotsQueryDto } from './lots.dto';


interface LotRecord {
  id: bigint;
  lotNumber: string;
  productionDate: Date;
  productionPeriod: string;
  flavorCode: string;
  flavor?: { name: string } | null;
  sizeMl: number;
  batchNo: number;
  quantity: number;
  bestBefore: Date;
  operatorId: bigint;
  operatorName: string;
  note: string | null;
  status: string;
  voidReason: string | null;
  createdAt: Date;
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

@Injectable()
export class LotsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListLotsQueryDto) {
    const { page, pageSize, skip } = normalizePagination(query.page, query.pageSize);
    const q = query.q?.trim();
    const where: Record<string, unknown> = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.flavorCode
        ? { flavorCode: query.flavorCode.toUpperCase().replace(/[^A-Z0-9]/g, '') }
        : {}),
      ...((query.from || query.to)
        ? {
            productionDate: {
              ...(query.from ? { gte: parseDateOnly(query.from) } : {}),
              ...(query.to ? { lte: parseDateOnly(query.to) } : {}),
            },
          }
        : {}),
      ...(q
        ? {
            OR: [
              { lotNumber: { contains: q, mode: 'insensitive' } },
              { flavor: { name: { contains: q, mode: 'insensitive' } } },
              { operatorName: { contains: q, mode: 'insensitive' } },
              { note: { contains: q, mode: 'insensitive' } },
              { voidReason: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.lot.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        include: {
          flavor: { select: { name: true } },
          operator: { select: { name: true } },
        },
      }),
      this.prisma.lot.count({ where }),
    ]);

    return {
      items: items.map((lot) => this.mapLot(lot)),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async recent(limit = 8) {
    const lots = await this.prisma.lot.findMany({
      where: { status: 'active' },
      take: Math.min(25, Math.max(1, limit)),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: { flavor: { select: { name: true } } },
    });
    return lots.map((lot) => this.mapLot(lot));
  }

  async findOne(id: bigint) {
    const lot = await this.prisma.lot.findUnique({
      where: { id },
      include: {
        flavor: { select: { name: true } },
        operator: { select: { name: true } },
        shipmentItems: {
          include: {
            shipment: {
              include: { partner: { select: { name: true } } },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!lot) throw new NotFoundException('A LOT nem található.');

    return {
      ...this.mapLot(lot),
      allocations: lot.shipmentItems.map((item) => ({
        shipmentItemId: item.id,
        shipmentId: item.shipmentId,
        shipmentNumber: item.shipment.shipmentNumber,
        partnerName: item.shipment.partner.name,
        shipmentStatus: item.shipment.status,
        quantity: item.quantity,
      })),
    };
  }

  async create(
    dto: CreateLotDto,
    user: AuthenticatedUser,
    requestId: string,
  ) {
    const productionDate = parseDateOnly(dto.productionDate);
    const productionYear = productionDate.getUTCFullYear();
    const flavorCode = dto.flavorCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const operatorId = this.parseId(dto.operatorId, 'Érvénytelen felelősazonosító.');
    const note = dto.note?.trim() || null;

    return this.prisma.$transaction(async (tx) => {
      const [flavor, operator] = await Promise.all([
        tx.flavor.findFirst({ where: { code: flavorCode, active: true } }),
        tx.operator.findFirst({ where: { id: operatorId, active: true } }),
      ]);
      if (!flavor) throw new BadRequestException('Ismeretlen vagy inaktív íz.');
      if (!operator) throw new BadRequestException('Ismeretlen vagy inaktív felelős.');

      const lockKey = `${productionYear}:${flavorCode}:${dto.sizeMl}`;
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))`;

      const counters = await tx.$queryRaw<Array<{ next_batch: number }>>`
        SELECT (COALESCE(MAX(batch_no), 0) + 1)::int AS next_batch
        FROM public.lots
        WHERE flavor_code = ${flavorCode}
          AND size_ml = ${dto.sizeMl}
          AND EXTRACT(YEAR FROM production_date)::int = ${productionYear}
      `;
      const batchNo = counters[0]?.next_batch ?? 1;
      if (batchNo > 9999) {
        throw new ConflictException('Az adott termék éves LOT-sorszáma elérte a 9999-et.');
      }

      const bestBefore = addCalendarMonths(productionDate, 3);
      const number = lotNumber(flavorCode, dto.sizeMl, productionDate, batchNo);

      const lot = await tx.lot.create({
        data: {
          lotNumber: number,
          productionDate,
          productionPeriod: dto.productionPeriod,
          flavorCode,
          sizeMl: dto.sizeMl,
          batchNo,
          quantity: dto.quantity,
          bestBefore,
          operatorId,
          operatorName: operator.name,
          note,
          status: 'active',
          createdBy: user.id,
        },
        include: { flavor: { select: { name: true } } },
      });

      await tx.lotEvent.create({
        data: {
          lotId: lot.id,
          eventType: 'created',
          actorUserId: user.id,
          snapshot: jsonSnapshot(lot),
        },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'lot.create',
          entityType: 'lot',
          entityId: lot.id.toString(),
          afterData: jsonSnapshot(lot),
          requestId,
        },
      });

      return this.mapLot(lot);
    });
  }

  async void(
    id: bigint,
    reasonInput: string,
    user: AuthenticatedUser,
    requestId: string,
  ) {
    const reason = reasonInput.trim().replace(/\s+/g, ' ');
    if (reason.length < 5) throw new BadRequestException('Az indok túl rövid.');

    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM public.lots WHERE id = ${id} FOR UPDATE`;
      const lot = await tx.lot.findUnique({
        where: { id },
        include: { flavor: { select: { name: true } } },
      });
      if (!lot) throw new NotFoundException('A LOT nem található.');
      if (lot.status === 'void') throw new ConflictException('Ez a LOT már sztornózva van.');

      const allocation = await tx.shipmentItem.findFirst({
        where: {
          lotId: id,
          shipment: { status: { in: ['draft', 'closed', 'shipped'] } },
        },
        select: { id: true },
      });
      if (allocation) {
        throw new ConflictException(
          'A LOT aktív vagy kiszállított szállítmányhoz kapcsolódik.',
        );
      }

      const updated = await tx.lot.update({
        where: { id },
        data: {
          status: 'void',
          voidReason: reason,
          voidedBy: user.id,
          voidedAt: new Date(),
          updatedAt: new Date(),
          version: { increment: 1 },
        },
        include: { flavor: { select: { name: true } } },
      });

      await tx.lotEvent.create({
        data: {
          lotId: id,
          eventType: 'voided',
          reason,
          actorUserId: user.id,
          snapshot: jsonSnapshot(updated),
        },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'lot.void',
          entityType: 'lot',
          entityId: id.toString(),
          beforeData: jsonSnapshot(lot),
          afterData: jsonSnapshot(updated),
          requestId,
        },
      });

      return this.mapLot(updated);
    });
  }

  private parseId(value: string, message: string): bigint {
    try {
      return BigInt(value);
    } catch {
      throw new BadRequestException(message);
    }
  }

  private mapLot(lot: LotRecord) {
    return {
      id: lot.id,
      lotNumber: lot.lotNumber,
      productionDate: formatDateOnly(lot.productionDate),
      productionPeriod: lot.productionPeriod,
      flavorCode: lot.flavorCode,
      flavorName: lot.flavor?.name,
      sizeMl: lot.sizeMl,
      batchNo: lot.batchNo,
      quantity: lot.quantity,
      bestBefore: formatDateOnly(lot.bestBefore),
      operatorId: lot.operatorId,
      operatorName: lot.operatorName,
      note: lot.note,
      status: lot.status,
      voidReason: lot.voidReason,
      createdAt: lot.createdAt,
    };
  }
}
