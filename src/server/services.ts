import 'server-only';
import { prisma } from './prisma';
import { AuditService } from './api/prisma/audit.service';
import { FlavorsService } from './api/flavors/flavors.service';
import { OperatorsService } from './api/operators/operators.service';
import { LotsService } from './api/lots/lots.service';
import { InventoryService } from './api/inventory/inventory.service';
import { PartnersService } from './api/partners/partners.service';
import { ShipmentsService } from './api/shipments/shipments.service';
import { AnalyticsService } from './api/analytics/analytics.service';
import { ProductsRepository } from './api/products/products.repository';
import { ProductsService } from './api/products/products.service';
import { OrdersRepository } from './api/orders/orders.repository';
import { OrdersService } from './api/orders/orders.service';
import { PartnerPortalRepository } from './api/partner-portal/partner-portal.repository';
import { PartnerPortalService } from './api/partner-portal/partner-portal.service';

const audit = new AuditService(prisma);
const productsRepository = new ProductsRepository(prisma);
const ordersRepository = new OrdersRepository(prisma);
const partnerPortalRepository = new PartnerPortalRepository(prisma);

export const services = {
  flavors: new FlavorsService(prisma),
  operators: new OperatorsService(prisma, audit),
  lots: new LotsService(prisma),
  inventory: new InventoryService(prisma),
  partners: new PartnersService(prisma),
  shipments: new ShipmentsService(prisma),
  analytics: new AnalyticsService(prisma),
  products: new ProductsService(prisma, productsRepository),
  orders: new OrdersService(prisma, ordersRepository),
  partnerPortal: new PartnerPortalService(prisma, partnerPortalRepository),
};
