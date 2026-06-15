import { Injectable } from '@nestjs/common';
import { formatDateOnly } from '../common/utils/date.utils';
import { normalizePagination } from '../common/utils/pagination.utils';
import { PrismaService } from '../prisma/prisma.service';
import type { InventoryQueryDto } from './inventory.dto';

interface StockRow {
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
  total_count: bigint;
}

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: InventoryQueryDto) {
    const { page, pageSize, skip } = normalizePagination(query.page, query.pageSize);
    const flavorCode = query.flavorCode?.trim().toUpperCase() || null;
    const search = query.q?.trim() || null;
    const availability = query.availability ?? 'all';

    const rows = await this.prisma.$queryRaw<StockRow[]>`
      SELECT
        ls.*,
        f.name AS flavor_name,
        COUNT(*) OVER() AS total_count
      FROM public.lot_stock ls
      JOIN public.flavors f ON f.code = ls.flavor_code
      WHERE ls.lot_status = 'active'
        AND (${flavorCode}::text IS NULL OR ls.flavor_code = ${flavorCode})
        AND (
          ${search}::text IS NULL
          OR ls.lot_number ILIKE '%' || ${search} || '%'
          OR f.name ILIKE '%' || ${search} || '%'
        )
        AND (
          ${availability} = 'all'
          OR (${availability} = 'available' AND ls.available_quantity > 0)
          OR (${availability} = 'empty' AND ls.available_quantity = 0)
        )
      ORDER BY ls.best_before ASC, ls.production_date ASC, ls.lot_id ASC
      LIMIT ${pageSize}
      OFFSET ${skip}
    `;

    const total = Number(rows[0]?.total_count ?? 0n);
    return {
      items: rows.map((row) => ({
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
      })),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async summary() {
    const rows = await this.prisma.$queryRaw<
      Array<{
        physical: number;
        reserved: number;
        shipped: number;
        available: number;
      }>
    >`
      SELECT
        COALESCE(SUM(produced_quantity - shipped_quantity), 0)::int AS physical,
        COALESCE(SUM(reserved_quantity), 0)::int AS reserved,
        COALESCE(SUM(shipped_quantity), 0)::int AS shipped,
        COALESCE(SUM(available_quantity), 0)::int AS available
      FROM public.lot_stock
      WHERE lot_status = 'active'
    `;
    return rows[0] ?? { physical: 0, reserved: 0, shipped: 0, available: 0 };
  }
}
