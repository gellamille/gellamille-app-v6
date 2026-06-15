import 'server-only';
import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import type { AppRole } from '@/contracts';
import { requireUser } from './auth';
import { services } from './services';

type Init = RequestInit & { body?: BodyInit | null };

function number(value: string | null, fallback?: number): number | undefined {
  if (value === null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
function boolean(value: string | null): boolean | undefined {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}
function body(init: Init): any {
  if (!init.body) return {};
  if (typeof init.body !== 'string') throw new BadRequestException('Érvénytelen kérés.');
  try { return JSON.parse(init.body); }
  catch { throw new BadRequestException('Érvénytelen JSON kérés.'); }
}
function big(value: string | undefined, name='azonosító'): bigint {
  if (!value || !/^\d+$/.test(value)) throw new BadRequestException(`Érvénytelen ${name}.`);
  return BigInt(value);
}
function cleanString(value: unknown, max=1000): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0,max);
}
function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_key, nested) => {
    if (typeof nested === 'bigint') return nested.toString();
    if (nested instanceof Date) return nested.toISOString();
    return nested;
  })) as T;
}

export class LocalApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly details?: unknown) {
    super(message);
  }
}

async function internalUser(adminOnly=false) {
  return requireUser(adminOnly ? ['admin'] : ['admin','staff']);
}

export async function dispatchLocalApi<T>(path: string, init: Init = {}): Promise<T> {
  const url = new URL(path, 'http://gellamille.local');
  const p = url.pathname.replace(/\/+$/, '') || '/';
  const method = (init.method ?? 'GET').toUpperCase();
  const requestId = randomUUID();

  try {
    let result: unknown;

    // Flavors / operators
    if (p === '/flavors' && method === 'GET') { await internalUser(); result = await services.flavors.list(); }
    else if (p === '/operators' && method === 'GET') { await internalUser(); result = await services.operators.list(); }
    else if (p === '/operators' && method === 'POST') {
      const user=await internalUser(); const b=body(init);
      if (cleanString(b.name,80).length < 2) throw new BadRequestException('Adj meg legalább 2 karakteres nevet.');
      result=await services.operators.create({name:cleanString(b.name,80)},user,requestId);
    }

    // LOTs
    else if (p === '/lots/recent' && method === 'GET') {
      await internalUser(); result=await services.lots.recent(number(url.searchParams.get('limit')));
    }
    else if (p === '/lots' && method === 'GET') {
      await internalUser(); result=await services.lots.list({
        page:number(url.searchParams.get('page')), pageSize:number(url.searchParams.get('pageSize')),
        q:url.searchParams.get('q')||undefined, status:(url.searchParams.get('status') as any)||undefined,
        flavorCode:url.searchParams.get('flavorCode')||undefined, from:url.searchParams.get('from')||undefined,
        to:url.searchParams.get('to')||undefined,
      });
    }
    else if (p === '/lots' && method === 'POST') {
      const user=await internalUser(); const b=body(init);
      result=await services.lots.create({
        productionDate:cleanString(b.productionDate,10),
        productionPeriod:b.productionPeriod,
        flavorCode:cleanString(b.flavorCode,8), sizeMl:Number(b.sizeMl) as 150|300,
        quantity:Number(b.quantity), operatorId:String(b.operatorId), note:cleanString(b.note,1000)||undefined,
      },user,requestId);
    }
    else if (/^\/lots\/\d+$/.test(p) && method === 'GET') {
      await internalUser(); result=await services.lots.findOne(big(p.split('/')[2]));
    }
    else if (/^\/lots\/\d+\/void$/.test(p) && method === 'POST') {
      const user=await internalUser(); const b=body(init);
      if (cleanString(b.reason,500).length < 5) throw new BadRequestException('Az indok legalább 5 karakter legyen.');
      result=await services.lots.void(big(p.split('/')[2]),cleanString(b.reason,500),user,requestId);
    }

    // Inventory
    else if (p === '/inventory/summary' && method === 'GET') { await internalUser(); result=await services.inventory.summary(); }
    else if (p === '/inventory' && method === 'GET') {
      await internalUser(); result=await services.inventory.list({
        page:number(url.searchParams.get('page')), pageSize:number(url.searchParams.get('pageSize')),
        q:url.searchParams.get('q')||undefined, flavorCode:url.searchParams.get('flavorCode')||undefined,
        availability:(url.searchParams.get('availability') as any)||undefined,
      });
    }

    // Products
    else if (p === '/products' && method === 'GET') {
      await internalUser(); result=await services.products.list({
        q:url.searchParams.get('q')||undefined,
        sizeMl:number(url.searchParams.get('sizeMl')) as 150|300|undefined,
        active:boolean(url.searchParams.get('active')),
      });
    }
    else if (/^\/products\/\d+$/.test(p) && method === 'PATCH') {
      const user=await internalUser(true); const b=body(init);
      result=await services.products.update(big(p.split('/')[2]),{
        netUnitPriceHuf:b.netUnitPriceHuf===undefined?undefined:Number(b.netUnitPriceHuf),
        active:b.active===undefined?undefined:Boolean(b.active), sortOrder:b.sortOrder===undefined?undefined:Number(b.sortOrder),
        version:Number(b.version),
      },user,requestId);
    }

    // Partners
    else if (p === '/partners' && method === 'GET') {
      await internalUser(); result=await services.partners.list({
        page:number(url.searchParams.get('page')), pageSize:number(url.searchParams.get('pageSize')), q:url.searchParams.get('q')||undefined,
      });
    }
    else if (p === '/partners' && method === 'POST') {
      const user=await internalUser(); const b=body(init);
      result=await services.partners.create({
        name:cleanString(b.name,160), billingName:cleanString(b.billingName,200)||undefined,
        taxNumber:cleanString(b.taxNumber,40)||undefined, shippingAddress:cleanString(b.shippingAddress,500)||undefined,
        contactName:cleanString(b.contactName,160)||undefined, email:cleanString(b.email,254)||undefined,
        phone:cleanString(b.phone,50)||undefined, note:cleanString(b.note,1000)||undefined,
      },user,requestId);
    }
    else if (/^\/partners\/\d+\/delivery-days$/.test(p) && method === 'GET') {
      await internalUser(); result=await services.partners.deliveryDays(big(p.split('/')[2]));
    }
    else if (/^\/partners\/\d+\/delivery-days$/.test(p) && method === 'PUT') {
      const user=await internalUser(); const b=body(init);
      if (!Array.isArray(b.days)) throw new BadRequestException('A szállítási napok hibásak.');
      result=await services.partners.setDeliveryDays(big(p.split('/')[2]),b.days.map((d:any)=>({weekday:Number(d.weekday),cutoffBusinessDays:Number(d.cutoffBusinessDays)})),user,requestId);
    }
    else if (/^\/partners\/\d+$/.test(p) && method === 'GET') {
      await internalUser(); result=await services.partners.findOne(big(p.split('/')[2]));
    }

    // Shipments
    else if (p === '/shipments' && method === 'GET') {
      await internalUser(); result=await services.shipments.list({
        page:number(url.searchParams.get('page')), pageSize:number(url.searchParams.get('pageSize')),
        q:url.searchParams.get('q')||undefined, status:(url.searchParams.get('status') as any)||undefined,
      });
    }
    else if (p === '/shipments' && method === 'POST') {
      const user=await internalUser(); const b=body(init);
      result=await services.shipments.create({
        partnerId:String(b.partnerId), shipmentDate:cleanString(b.shipmentDate,10),
        shippingAddress:cleanString(b.shippingAddress,500)||undefined,
        customerOrderNumber:cleanString(b.customerOrderNumber,100)||undefined,
        deliveryNoteNumber:cleanString(b.deliveryNoteNumber,100)||undefined,
        note:cleanString(b.note,1000)||undefined,
      },user,requestId);
    }
    else if (/^\/shipments\/\d+\/available-lots$/.test(p) && method === 'GET') {
      await internalUser(); result=await services.shipments.availableLots(big(p.split('/')[2]),url.searchParams.get('q')||undefined);
    }
    else if (/^\/shipments\/\d+\/items\/\d+$/.test(p) && method === 'PUT') {
      const user=await internalUser(); const parts=p.split('/'); const b=body(init);
      result=await services.shipments.setItem(big(parts[2]),big(parts[4]),Number(b.quantity),user,requestId);
    }
    else if (/^\/shipments\/\d+\/items\/\d+$/.test(p) && method === 'DELETE') {
      const user=await internalUser(); const parts=p.split('/');
      result=await services.shipments.removeItem(big(parts[2]),big(parts[4]),user,requestId);
    }
    else if (/^\/shipments\/\d+\/transition$/.test(p) && method === 'POST') {
      const user=await internalUser(); const b=body(init);
      result=await services.shipments.transition(big(p.split('/')[2]),b.targetStatus,user,requestId);
    }
    else if (/^\/shipments\/\d+\/void$/.test(p) && method === 'POST') {
      const user=await internalUser(); const b=body(init);
      result=await services.shipments.void(big(p.split('/')[2]),cleanString(b.reason,500),user,requestId);
    }
    else if (/^\/shipments\/\d+$/.test(p) && method === 'GET') {
      await internalUser(); result=await services.shipments.findOne(big(p.split('/')[2]));
    }

    // Analytics
    else if (p === '/analytics' && method === 'GET') {
      await internalUser(); result=await services.analytics.get({from:url.searchParams.get('from')||undefined,to:url.searchParams.get('to')||undefined});
    }

    // Internal orders
    else if (p === '/orders' && method === 'GET') {
      await internalUser(); result=await services.orders.list({
        page:number(url.searchParams.get('page')), pageSize:number(url.searchParams.get('pageSize')),
        q:url.searchParams.get('q')||undefined, status:(url.searchParams.get('status') as any)||undefined,
      });
    }
    else if (/^\/orders\/\d+\/transition$/.test(p) && method === 'POST') {
      const user=await internalUser(); const b=body(init);
      result=await services.orders.transition(big(p.split('/')[2]),b.targetStatus,user,requestId);
    }
    else if (/^\/orders\/\d+\/reject$/.test(p) && method === 'POST') {
      const user=await internalUser(); const b=body(init);
      result=await services.orders.reject(big(p.split('/')[2]),cleanString(b.reason,500),user,requestId);
    }
    else if (/^\/orders\/\d+\/void$/.test(p) && method === 'POST') {
      const user=await internalUser(); const b=body(init);
      result=await services.orders.void(big(p.split('/')[2]),cleanString(b.reason,500),user,requestId);
    }
    else if (/^\/orders\/\d+$/.test(p) && method === 'GET') {
      await internalUser(); result=await services.orders.findOne(big(p.split('/')[2]));
    }

    // Partner portal
    else if (p === '/partner-portal/bootstrap' && method === 'GET') {
      const user=await requireUser(['partner']); result=await services.partnerPortal.bootstrap(user);
    }
    else if (p === '/partner-portal/orders' && method === 'GET') {
      const user=await requireUser(['partner']); result=await services.partnerPortal.listOrders(user);
    }
    else if (p === '/partner-portal/orders' && method === 'POST') {
      const user=await requireUser(['partner']); const b=body(init);
      result=await services.partnerPortal.createOrder({
        requestedDeliveryDate:cleanString(b.requestedDeliveryDate,10), paymentMethod:b.paymentMethod,
        note:cleanString(b.note,1000)||undefined,
        items:Array.isArray(b.items)?b.items.map((i:any)=>({productId:String(i.productId),cartons:Number(i.cartons)})):[],
      },user,requestId);
    }
    else if (/^\/partner-portal\/orders\/\d+$/.test(p) && method === 'GET') {
      const user=await requireUser(['partner']); result=await services.partnerPortal.findOrder(big(p.split('/')[3]),user);
    }
    else throw new NotFoundException(`Ismeretlen belső végpont: ${method} ${p}`);

    return serialize(result) as T;
  } catch (error) {
    if (error instanceof LocalApiError) throw error;
    if (error instanceof HttpException) {
      const response=error.getResponse();
      const message=typeof response==='string'?response:(response as any)?.message;
      throw new LocalApiError(Array.isArray(message)?message.join(' '):(message||error.message),error.getStatus(),response);
    }
    throw error;
  }
}
