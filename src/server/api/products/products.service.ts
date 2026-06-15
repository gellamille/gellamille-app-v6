import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '@/contracts';
import { PrismaService } from '../prisma/prisma.service';
import type {
  ListProductsQueryDto,
  UpdateProductDto,
} from './products.dto';
import {
  ProductsRepository,
  type ProductRow,
} from './products.repository';

function snapshot(value: unknown): never {
  return JSON.parse(
    JSON.stringify(value, (_key, nested) =>
      typeof nested === 'bigint' ? nested.toString() : nested,
    ),
  ) as never;
}

function mapProduct(product: ProductRow) {
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

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: ProductsRepository,
  ) {}

  async list(query: ListProductsQueryDto) {
    const products = await this.repository.list(query);
    return products.map(mapProduct);
  }

  async update(
    id: bigint,
    dto: UpdateProductDto,
    user: AuthenticatedUser,
    requestId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const before = await this.repository.findForUpdate(tx, id);

      if (!before) {
        throw new NotFoundException('A termék nem található.');
      }

      if (before.version !== dto.version) {
        throw new ConflictException(
          'A terméket időközben más módosította. Frissítsd az oldalt.',
        );
      }

      const product = await this.repository.update(tx, id, dto);

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'product.update',
          entityType: 'product',
          entityId: product.id.toString(),
          beforeData: snapshot(before),
          afterData: snapshot(product),
          requestId,
        },
      });

      return mapProduct(product);
    });
  }
}
