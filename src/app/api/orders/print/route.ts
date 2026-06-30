import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
import { NextResponse } from "next/server";
import { apiUser } from "@/lib/api-auth";
import { query } from "@/lib/db";
import { dateHU } from "@/lib/format";
import { INTERNAL_ROLES } from "@/lib/auth";
import { huLabel, paymentMethodLabels } from "@/lib/status";

export const runtime = "nodejs";

type OrderRow = {
  id: number;
  order_number: string;
  partner_name: string;
  billing_name: string | null;
  tax_number: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  default_payment_method: string | null;
  payment_terms_days: number;
  requested_delivery_date: string | Date | null;
  delivery_address: string | null;
  status: string;
  fulfillment_status: string;
  total_cartons: number;
  total_units: number;
  note: string | null;
};

type ItemRow = {
  order_id: number;
  order_number: string;
  partner_name: string;
  product_id: number;
  product_code: string | null;
  product_name: string;
  size_ml: number | null;
  cartons: number;
  unit_quantity: number;
  remaining_units: number;
  units_per_carton: number;
};

function safeText(value: unknown) {
  return String(value ?? "")
    .replace(/[ő]/g, "o")
    .replace(/[Ő]/g, "O")
    .replace(/[ű]/g, "u")
    .replace(/[Ű]/g, "U");
}

function parseIds(url: URL) {
  const raw = [...url.searchParams.getAll("orderId"), ...url.searchParams.getAll("ids").flatMap((value) => value.split(","))];
  return [...new Set(raw.map((value) => Number(value)).filter((value) => Number.isInteger(value) && value > 0))];
}

function addFilter(where: string[], values: unknown[], clause: string, value: unknown) {
  values.push(value);
  where.push(clause.replace("?", `$${values.length}`));
}

function productLabel(item: Pick<ItemRow, "product_name" | "size_ml">) {
  const name = item.product_name.trim();
  if (!item.size_ml) return name;
  const size = `${item.size_ml} ml`;
  return name.toLowerCase().includes(size.toLowerCase()) ? name : `${name} ${size}`;
}

async function selectedOrders(organizationId: number, url: URL) {
  const ids = parseIds(url);
  const selectedMode = url.searchParams.get("mode") === "selected";
  const where = ["o.organization_id=$1", "o.archived_at is null"];
  const values: unknown[] = [organizationId];

  if (ids.length) {
    values.push(ids);
    where.push(`o.id = any($${values.length}::bigint[])`);
  } else if (selectedMode) {
    return [];
  } else {
    const from = url.searchParams.get("from") || "";
    const to = url.searchParams.get("to") || "";
    const partnerId = Number(url.searchParams.get("partnerId") || 0);
    const status = url.searchParams.get("status") || "";
    const fulfillment = url.searchParams.get("fulfillment") || "";
    if (from) addFilter(where, values, "o.requested_delivery_date >= ?::date", from);
    if (to) addFilter(where, values, "o.requested_delivery_date <= ?::date", to);
    if (Number.isInteger(partnerId) && partnerId > 0) addFilter(where, values, "o.partner_id = ?", partnerId);
    if (status) addFilter(where, values, "o.status = ?", status);
    if (fulfillment) addFilter(where, values, "o.fulfillment_status = ?", fulfillment);
  }

  return query<OrderRow>(`
    select o.id,o.order_number,o.requested_delivery_date,o.status,o.fulfillment_status,
           o.total_cartons,o.total_units,o.note,
           p.name as partner_name,p.billing_name,p.tax_number,p.contact_name,p.email,p.phone,
           p.default_payment_method,p.payment_terms_days,
           concat_ws(', ', pa.postal_code, pa.city, pa.address_line1) as delivery_address
      from public.orders o
      join public.partners p on p.id=o.partner_id and p.organization_id=o.organization_id
      left join public.partner_addresses pa on pa.id=o.delivery_address_id
     where ${where.join(" and ")}
     order by o.requested_delivery_date nulls last, p.name, o.order_number
     limit 250
  `, values);
}

async function orderItems(orderIds: number[]) {
  if (!orderIds.length) return [];
  return query<ItemRow>(`
    select oi.order_id,o.order_number,p.name as partner_name,
           oi.product_id,
           oi.product_code_snapshot as product_code,
           oi.product_name_snapshot as product_name,
           oi.size_ml_snapshot as size_ml,
           oi.cartons::int as cartons,
           oi.unit_quantity::int as unit_quantity,
           greatest(oi.unit_quantity-oi.cancelled_quantity-oi.fulfilled_quantity,0)::int as remaining_units,
           oi.units_per_carton_snapshot::int as units_per_carton
      from public.order_items oi
      join public.orders o on o.id=oi.order_id
      join public.partners p on p.id=o.partner_id and p.organization_id=o.organization_id
     where oi.order_id = any($1::bigint[])
       and oi.unit_quantity > 0
     order by oi.product_name_snapshot, oi.size_ml_snapshot, o.requested_delivery_date, o.order_number
  `, [orderIds]);
}

function generatePdf(orders: OrderRow[], items: ItemRow[]) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ layout: "landscape", margin: 32, size: "A4", bufferPages: true });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const left = doc.page.margins.left;
    const right = doc.page.width - doc.page.margins.right;
    const bottom = doc.page.height - doc.page.margins.bottom;
    const tableWidth = right - left;

    const ensureSpace = (height: number) => {
      if (doc.y + height > bottom) {
        doc.addPage();
        doc.x = left;
        doc.y = doc.page.margins.top;
      }
    };

    const drawProductHeader = () => {
      const y = doc.y;
      doc.font("Helvetica-Bold").fontSize(9).fillColor("#111");
      doc.text("Termek", left, y, { width: tableWidth - 260 });
      doc.text("Karton", right - 245, y, { width: 65, align: "right" });
      doc.text("Rendelt db", right - 165, y, { width: 75, align: "right" });
      doc.text("Hatralevo db", right - 80, y, { width: 80, align: "right" });
      doc.moveTo(left, y + 15).lineTo(right, y + 15).strokeColor("#cccccc").stroke();
      doc.fillColor("#111");
      doc.y = y + 21;
    };

    const drawItemRow = (name: string, cartons: number, units: number, remaining: number) => {
      const rowHeight = Math.max(14, doc.heightOfString(safeText(name), { width: tableWidth - 260 }) + 3);
      ensureSpace(rowHeight + 2);
      const y = doc.y;
      doc.font("Helvetica").fontSize(9).fillColor("#111");
      doc.text(safeText(name), left, y, { width: tableWidth - 260 });
      doc.text(String(cartons), right - 245, y, { width: 65, align: "right" });
      doc.text(String(units), right - 165, y, { width: 75, align: "right" });
      doc.text(String(remaining), right - 80, y, { width: 80, align: "right" });
      doc.y = y + rowHeight;
    };

    const drawPartnerBlock = (order: OrderRow) => {
      const payment = huLabel(paymentMethodLabels, order.default_payment_method);
      const paymentLine = order.default_payment_method === "bank_transfer"
        ? `${payment}, ${order.payment_terms_days} nap`
        : payment;
      const lines = [
        ["Partner", order.partner_name],
        ["Szamlazasi nev", order.billing_name || order.partner_name],
        ["Adoszam", order.tax_number || "-"],
        ["Kapcsolattarto", order.contact_name || "-"],
        ["E-mail", order.email || "-"],
        ["Telefon", order.phone || "-"],
        ["Fizetes", paymentLine],
        ["Szallitasi cim", order.delivery_address || "-"]
      ];
      ensureSpace(86);
      const y = doc.y;
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#111").text("Partner adatok", left, y, { width: tableWidth });
      doc.font("Helvetica").fontSize(8.5).fillColor("#111");
      const colWidth = tableWidth / 2;
      for (const [index, [label, value]] of lines.entries()) {
        const x = index % 2 === 0 ? left : left + colWidth;
        const rowY = y + 18 + Math.floor(index / 2) * 14;
        doc.font("Helvetica-Bold").text(`${label}:`, x, rowY, { width: 90 });
        doc.font("Helvetica").text(safeText(value), x + 92, rowY, { width: colWidth - 100 });
      }
      doc.y = y + 78;
    };

    const now = new Date();
    const singleOrder = orders.length === 1 ? orders[0] : null;
    doc.font("Helvetica-Bold").fontSize(17).text(safeText(singleOrder ? "Rendelés nyomtatása" : "Összevont rendelési összesítő"), left, doc.y, { width: tableWidth });
    doc.font("Helvetica").fontSize(9).fillColor("#555").text(`Generalva: ${dateHU(now)} ${now.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}`);
    doc.moveDown(0.6).fillColor("#111");
    doc.fontSize(10);
    if (singleOrder) {
      doc.text(safeText(`${singleOrder.order_number} - ${singleOrder.partner_name}`));
      doc.text(safeText(`Kert nap: ${dateHU(singleOrder.requested_delivery_date)} | Karton: ${singleOrder.total_cartons} | Darab: ${singleOrder.total_units}`));
      doc.moveDown(0.8);
      drawPartnerBlock(singleOrder);
    } else {
      doc.text(`Rendelesek: ${orders.length} db`);
      doc.text(`Osszes karton: ${orders.reduce((sum, order) => sum + Number(order.total_cartons ?? 0), 0)} karton`);
      doc.text(`Osszes darab: ${orders.reduce((sum, order) => sum + Number(order.total_units ?? 0), 0)} db`);
    }

    const summary = new Map<string, ItemRow & { order_count: number }>();
    for (const item of items) {
      const key = String(item.product_id);
      const current = summary.get(key);
      if (current) {
        current.cartons += Number(item.cartons ?? 0);
        current.unit_quantity += Number(item.unit_quantity ?? 0);
        current.remaining_units += Number(item.remaining_units ?? 0);
        current.order_count += 1;
      } else {
        summary.set(key, { ...item, cartons: Number(item.cartons ?? 0), unit_quantity: Number(item.unit_quantity ?? 0), remaining_units: Number(item.remaining_units ?? 0), order_count: 1 });
      }
    }

    doc.moveDown(1);
    doc.font("Helvetica-Bold").fontSize(13).text(safeText(singleOrder ? "Rendelt tételek" : "Termék összesítő"), left, doc.y, { width: tableWidth });
    doc.moveDown(0.3);
    drawProductHeader();
    for (const item of [...summary.values()].sort((a, b) => a.product_name.localeCompare(b.product_name, "hu"))) {
      drawItemRow(productLabel(item), item.cartons, item.unit_quantity, item.remaining_units);
    }

    if (!singleOrder) {
      doc.moveDown(1.1);
      ensureSpace(54);
      doc.font("Helvetica-Bold").fontSize(13).text(safeText("Rendelésenkénti bontás"), left, doc.y, { width: tableWidth });
      for (const order of orders) {
        ensureSpace(132);
        doc.moveDown(0.6);
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#111").text(safeText(`${order.order_number} - ${order.partner_name}`), left, doc.y, { width: tableWidth });
        doc.font("Helvetica").fontSize(9).fillColor("#555")
          .text(safeText(`Kert nap: ${dateHU(order.requested_delivery_date)} | Karton: ${order.total_cartons} | Darab: ${order.total_units}`));
        doc.moveDown(0.5);
        drawPartnerBlock(order);
        doc.fillColor("#111");
        const orderItems = items.filter((item) => Number(item.order_id) === Number(order.id));
        doc.moveDown(0.3);
        drawProductHeader();
        for (const item of orderItems) {
          drawItemRow(productLabel(item), item.cartons, item.unit_quantity, item.remaining_units);
        }
      }
    }

    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc.font("Helvetica").fontSize(8).fillColor("#777").text(`${i + 1}/${pages.count}`, right - 60, bottom + 8, { width: 60, align: "right" });
    }

    doc.end();
  });
}

export async function GET(request: Request) {
  const auth = await apiUser(INTERNAL_ROLES);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });

  const url = new URL(request.url);
  const orders = await selectedOrders(Number(auth.user.organization_id), url);
  if (!orders.length) {
    return NextResponse.json({ error: "Nincs nyomtatható rendelés a megadott szűrésben." }, { status: 404 });
  }

  const items = await orderItems(orders.map((order) => Number(order.id)));
  const pdf = await generatePdf(orders, items);
  const filename = `gellamille-rendeles-osszesito-${new Date().toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store"
    }
  });
}
