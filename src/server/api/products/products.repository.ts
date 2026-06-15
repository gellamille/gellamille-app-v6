import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { ListProductsQueryDto, UpdateProductDto } from './products.dto';

export interface ProductRow {
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
  updated_at: Date;
}

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  list(query: ListProductsQueryDto): Promise<ProductRow[]> {
    const q = query.q?.trim();
    const sizeFilter = query.sizeMl
      ? Prisma.sql`AND p.size_ml = ${query.sizeMl}`
      : Prisma.empty;
    const activeFilter =
      typeof query.active === 'boolean'
        ? Prisma.sql`AND p.active = ${query.active}`
        : Prisma.empty;
    const searchFilter = q
      ? Prisma.sql`AND (p.code ILIKE ${`%${q}%`} OR f.name ILIKE ${`%${q}%`})`
      : Prisma.empty;

    return this.prisma.$queryRaw<ProductRow[]>(Prisma.sql`
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
        p.version,
        p.updated_at
      FROM public.products p
      JOIN public.flavors f ON f.code = p.flavor_code
      WHERE TRUE
        ${sizeFilter}
        ${activeFilter}
        ${searchFilter}
      ORDER BY p.size_ml, p.sort_order, p.code
    `);
  }

  async findForUpdate(
    tx: Prisma.TransactionClient,
    id: bigint,
  ): Promise<ProductRow | null> {
    const rows = await tx.$queryRaw<ProductRow[]>(Prisma.sql`
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
        p.version,
        p.updated_at
      FROM public.products p
      JOIN public.flavors f ON f.code = p.flavor_code
      WHERE p.id = ${id}
      FOR UPDATE OF p
    `);

    return rows[0] ?? null;
  }

  async update(
    tx: Prisma.TransactionClient,
    id: bigint,
    dto: UpdateProductDto,
  ): Promise<ProductRow> {
    const rows = await tx.$queryRaw<ProductRow[]>(Prisma.sql`
      UPDATE public.products
      SET
        net_unit_price_huf = COALESCE(
          ${dto.netUnitPriceHuf ?? null}::integer,
          net_unit_price_huf
        ),
        active = COALESCE(${dto.active ?? null}::boolean, active),
        sort_order = COALESCE(${dto.sortOrder ?? null}::integer, sort_order),
        version = version + 1,
        updated_at = now()
      WHERE id = ${id}
      RETURNING
        id,
        code,
        flavor_code,
        (SELECT name FROM public.flavors WHERE code = flavor_code) AS flavor_name,
        size_ml,
        units_per_carton,
        net_unit_price_huf,
        vat_rate_bps,
        active,
        sort_order,
        version,
        updated_at
    `);

    const product = rows[0];
    if (!product) throw new Error('A termék frissítése nem adott vissza rekordot.');
    return product;
  }
}
