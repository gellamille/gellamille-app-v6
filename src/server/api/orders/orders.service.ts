import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AuthenticatedUser,
  OrderStatus,
} from '@/contracts';
import { formatDateOnly } from '../common/utils/date.utils';
import { normalizePagination } from '../common/utils/pagination.utils';
import { PrismaService } from '../prisma/prisma.service';
import type { ListOrdersQueryDto } from './orders.dto';
import {
  OrdersRepository,
  type OrderRow,
} from './orders.repository';

function snapshot(value: unknown): never {
  return JSON.parse(
    JSON.stringify(value, (_key, nested) =>
      typeof nested === 'bigint' ? nested.toString() : nested,
    ),
  ) as never;
}

const allowedTransitions: Record<string, OrderStatus[]> = {
  submitted: ['approved', 'stock_shortage'],
  stock_shortage: ['approved', 'allocating'],
  approved: ['allocating', 'stock_shortage'],
};

function mapOrder(order: OrderRow) {
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
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: OrdersRepository,
  ) {}

  async list(query: ListOrdersQueryDto) {
    const { page, pageSize, skip } = normalizePagination(
      query.page,
      query.pageSize,
    );
    const { items, total } = await this.repository.list(
      query,
      skip,
      pageSize,
    );

    return {
      items: items.map(mapOrder),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: bigint) {
    const [order, partner, items, shipments] = await Promise.all([
      this.repository.findBase(id),
      this.repository.findPartner(id),
      this.repository.items(id),
      this.repository.shipments(id),
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
        allocatedQuantity: item.allocated_quantity,
      })),
      shipments: shipments.map((shipment) => ({
        id: shipment.id,
        shipmentNumber: shipment.shipment_number,
        status: shipment.status,
      })),
    };
  }

  async transition(
    id: bigint,
    targetStatus: 'approved' | 'stock_shortage' | 'allocating',
    user: AuthenticatedUser,
    requestId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const before = await this.repository.findForUpdate(tx, id);
      if (!before) {
        throw new NotFoundException('A rendelés nem található.');
      }

      const allowed = allowedTransitions[before.status] ?? [];
      if (!allowed.includes(targetStatus)) {
        throw new ConflictException(
          `Érvénytelen státuszváltás: ${before.status} → ${targetStatus}.`,
        );
      }

      const order = await this.repository.updateStatus(tx, id, {
        status: targetStatus,
        actorUserId: user.id,
      });

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: `order.${targetStatus}`,
          entityType: 'order',
          entityId: order.id.toString(),
          beforeData: snapshot(before),
          afterData: snapshot(order),
          requestId,
        },
      });

      return mapOrder(order);
    });
  }

  async reject(
    id: bigint,
    reason: string,
    user: AuthenticatedUser,
    requestId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const before = await this.repository.findForUpdate(tx, id);
      if (!before) {
        throw new NotFoundException('A rendelés nem található.');
      }

      if (!['submitted', 'approved', 'stock_shortage'].includes(before.status)) {
        throw new ConflictException(
          'Ezt a rendelést ebben az állapotban nem lehet elutasítani.',
        );
      }

      const order = await this.repository.updateStatus(tx, id, {
        status: 'rejected',
        actorUserId: user.id,
        reason: reason.trim(),
      });

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'order.rejected',
          entityType: 'order',
          entityId: order.id.toString(),
          beforeData: snapshot(before),
          afterData: snapshot(order),
          requestId,
        },
      });

      return mapOrder(order);
    });
  }

  async void(
    id: bigint,
    reason: string,
    user: AuthenticatedUser,
    requestId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const before = await this.repository.findForUpdate(tx, id);
      if (!before) {
        throw new NotFoundException('A rendelés nem található.');
      }

      if (['shipped', 'void'].includes(before.status)) {
        throw new ConflictException(
          'Kiszállított vagy már sztornózott rendelés nem sztornózható.',
        );
      }

      const order = await this.repository.updateStatus(tx, id, {
        status: 'void',
        actorUserId: user.id,
        reason: reason.trim(),
      });

      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'order.voided',
          entityType: 'order',
          entityId: order.id.toString(),
          beforeData: snapshot(before),
          afterData: snapshot(order),
          requestId,
        },
      });

      return mapOrder(order);
    });
  }
}
