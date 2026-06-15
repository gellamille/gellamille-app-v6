export type AppRole = 'admin' | 'staff' | 'partner';
export type ProductionPeriod = 'AM' | 'PM';
export type LotStatus = 'active' | 'void';
export type ShipmentStatus = 'draft' | 'closed' | 'shipped' | 'void';
export type SizeMl = 150 | 300;
export type PaymentMethod =
  | 'cash_on_delivery'
  | 'card_on_delivery'
  | 'bank_transfer';
export type OrderStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'stock_shortage'
  | 'allocating'
  | 'shipment_created'
  | 'shipped'
  | 'rejected'
  | 'void';

export interface AuthenticatedUser {
  id: string;
  email: string | null;
  role: AppRole;
  partnerId: string | null;
}

export interface FlavorDto {
  code: string;
  name: string;
  active: boolean;
}

export interface OperatorDto {
  id: string;
  name: string;
  active: boolean;
}

export interface LotDto {
  id: string;
  lotNumber: string;
  productionDate: string;
  productionPeriod: ProductionPeriod;
  flavorCode: string;
  flavorName?: string;
  sizeMl: SizeMl;
  batchNo: number;
  quantity: number;
  bestBefore: string;
  operatorId: string;
  operatorName: string;
  note: string | null;
  status: LotStatus;
  voidReason: string | null;
  createdAt: string;
}

export interface LotStockDto extends LotDto {
  reservedQuantity: number;
  shippedQuantity: number;
  availableQuantity: number;
}

export interface PartnerDto {
  id: string;
  name: string;
  billingName: string | null;
  taxNumber: string | null;
  shippingAddress: string | null;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  note: string | null;
  active: boolean;
  shipmentCount?: number;
  allocatedUnits?: number;
}

export interface ShipmentAvailableLotDto extends LotStockDto {
  currentQuantity: number;
  availableForShipment: number;
}

export interface ShipmentItemDto {
  id: string;
  lotId: string;
  lotNumber: string;
  flavorCode: string;
  flavorName?: string;
  sizeMl: SizeMl;
  bestBefore: string;
  quantity: number;
}

export interface ShipmentDto {
  id: string;
  shipmentNumber: string;
  partnerId: string;
  partnerName: string;
  shipmentDate: string;
  shippingAddress: string | null;
  customerOrderNumber: string | null;
  deliveryNoteNumber: string | null;
  note: string | null;
  status: ShipmentStatus;
  voidReason: string | null;
  lotCount: number;
  units: number;
  items?: ShipmentItemDto[];
  createdAt: string;
}

export interface AnalyticsBucketDto {
  key: string;
  activeLots: number;
  voidedLots: number;
  units: number;
}

export interface AnalyticsResponseDto {
  summary: {
    activeLots: number;
    voidedLots: number;
    units: number;
  };
  daily: AnalyticsBucketDto[];
  weekly: AnalyticsBucketDto[];
  monthly: AnalyticsBucketDto[];
  products: Array<AnalyticsBucketDto & {
    flavorCode: string;
    flavorName: string;
    sizeMl: SizeMl;
  }>;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorBody {
  statusCode: number;
  code: string;
  message: string;
  requestId?: string;
  details?: unknown;
}


export interface ProductDto {
  id: string;
  code: string;
  flavorCode: string;
  flavorName: string;
  sizeMl: SizeMl;
  unitsPerCarton: number;
  netUnitPriceHuf: number;
  netCartonPriceHuf: number;
  vatRateBps: number;
  active: boolean;
  sortOrder: number;
  version: number;
}

export interface PartnerDeliveryDayDto {
  id: string;
  weekday: number;
  cutoffBusinessDays: number;
  active: boolean;
}

export interface OrderItemDto {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  flavorCode: string;
  sizeMl: SizeMl;
  cartons: number;
  unitsPerCarton: number;
  unitQuantity: number;
  netUnitPriceHuf: number;
  netTotalHuf: number;
  vatRateBps: number;
  vatTotalHuf: number;
  grossTotalHuf: number;
  allocatedQuantity?: number;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  partnerId: string;
  partnerName: string;
  requestedDeliveryDate: string;
  paymentMethod: PaymentMethod | null;
  status: OrderStatus;
  totalCartons: number;
  totalUnits: number;
  netTotalHuf: number;
  vatTotalHuf: number;
  grossTotalHuf: number;
  note: string | null;
  rejectionReason: string | null;
  voidReason: string | null;
  createdAt: string;
  submittedAt: string | null;
  approvedAt: string | null;
  itemCount: number;
  items?: OrderItemDto[];
  shipments?: Array<{
    id: string;
    shipmentNumber: string;
    status: ShipmentStatus;
  }>;
}


export interface PartnerPortalProfileDto {
  userId: string;
  email: string | null;
  partnerId: string;
  partnerName: string;
  shippingAddress: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
}

export interface DeliveryDateOptionDto {
  date: string;
  weekday: number;
  cutoffBusinessDays: number;
  orderDeadline: string;
  label: string;
}

export interface PartnerPortalBootstrapDto {
  profile: PartnerPortalProfileDto;
  products: ProductDto[];
  deliveryDates: DeliveryDateOptionDto[];
  minimumOrderCartons: number;
  vatRateBps: number;
}

export interface CreatePartnerOrderItemInput {
  productId: string;
  cartons: number;
}

export interface CreatePartnerOrderInput {
  requestedDeliveryDate: string;
  paymentMethod: PaymentMethod;
  note?: string;
  items: CreatePartnerOrderItemInput[];
}
