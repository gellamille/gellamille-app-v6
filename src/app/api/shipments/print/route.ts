import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
import { NextResponse } from "next/server";
import { apiUser } from "@/lib/api-auth";
import { query } from "@/lib/db";
import { dateHU } from "@/lib/format";
import { huLabel, paymentMethodLabels } from "@/lib/status";

export const runtime = "nodejs";

const ROLES = ["admin", "management", "warehouse", "sales"];

type DeliveryRow = {
  id: number;
  sequence_no: number | null;
  status: string;
  planned_date: string | Date;
  order_id: number;
  order_number: string;
  requested_delivery_date: string | Date | null;
  partner_name: string;
  billing_name: string | null;
  tax_number: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  default_payment_method: string | null;
  payment_terms_days: number;
  delivery_address: string | null;
  total_cartons: number;
  total_units: number;
  run_number: string | null;
  driver_name: string | null;
  vehicle: string | null;
  run_note: string | null;
};

type ShipmentItemRow = {
  delivery_id: number;
  order_id: number;
  product_name: string;
  size_ml: number | null;
  cartons: number;
  unit_quantity: number;
};

function safeText(value: unknown) {
  return String(value ?? "")
    .replace(/[ő]/g, "o")
    .replace(/[Ő]/g, "O")
    .replace(/[ű]/g, "u")
    .replace(/[Ű]/g, "U");
}

function productLabel(item: Pick<ShipmentItemRow, "product_name" | "size_ml">) {
  const name = item.product_name.trim();
  if (!item.size_ml) return name;
  const size = `${item.size_ml} ml`;
  return name.toLowerCase().includes(size.toLowerCase()) ? name : `${name} ${size}`;
}

function positiveParam(url: URL, name: string) {
  const value = Number(url.searchParams.get(name) || 0);
  return Number.isInteger(value) && value > 0 ? value : null;
}

async function selectedDeliveries(organizationId: number, url: URL) {
  const runId = positiveParam(url, "runId");
  const deliveryId = positiveParam(url, "deliveryId");
  if (!runId && !deliveryId) return [];

  const values: unknown[] = [organizationId];
  const where = ["d.organization_id=$1", "d.archived_at is null", "o.archived_at is null"];
  if (runId) {
    values.push(runId);
    where.push(`d.shipping_run_id=$${values.length}`);
  }
  if (deliveryId) {
    values.push(deliveryId);
    where.push(`d.id=$${values.length}`);
  }

  return query<DeliveryRow>(`
    select d.id,d.sequence_no,d.status,d.planned_date,d.order_id,
           o.order_number,o.requested_delivery_date,o.total_cartons,o.total_units,
           p.name as partner_name,p.billing_name,p.tax_number,p.contact_name,p.email,p.phone,
           p.default_payment_method,p.payment_terms_days,
           concat_ws(', ', pa.postal_code, pa.city, pa.address_line1) as delivery_address,
           sr.run_number,sr.driver_name,sr.vehicle,sr.note as run_note
      from public.deliveries d
      join public.orders o on o.id=d.order_id and o.organization_id=d.organization_id
      join public.partners p on p.id=d.partner_id and p.organization_id=d.organization_id
      left join public.partner_addresses pa on pa.id=d.address_id
      left join public.shipping_runs sr on sr.id=d.shipping_run_id and sr.organization_id=d.organization_id
     where ${where.join(" and ")}
     order by d.sequence_no nulls last,d.planned_date,o.order_number
     limit 100
  `, values);
}

async function deliveryItems(deliveryIds: number[]) {
  if (!deliveryIds.length) return [];
  return query<ShipmentItemRow>(`
    select d.id as delivery_id,oi.order_id,
           oi.product_name_snapshot as product_name,
           oi.size_ml_snapshot as size_ml,
           oi.cartons::int as cartons,
           oi.unit_quantity::int as unit_quantity
      from public.deliveries d
      join public.order_items oi on oi.order_id=d.order_id
     where d.id = any($1::bigint[])
       and oi.unit_quantity > 0
     order by d.sequence_no nulls last,oi.product_name_snapshot,oi.size_ml_snapshot
  `, [deliveryIds]);
}

function generatePdf(deliveries: DeliveryRow[], items: ShipmentItemRow[]) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ layout: "landscape", margin: 30, size: "A4", bufferPages: true });
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

    const drawHeader = () => {
      const first = deliveries[0];
      const title = deliveries.length === 1 ? "Fuvarlevel" : "Fuvarlevel - jarat";
      doc.font("Helvetica-Bold").fontSize(17).fillColor("#111").text(title, left, doc.y, { width: tableWidth });
      doc.font("Helvetica").fontSize(9).fillColor("#555").text(`Generalva: ${dateHU(new Date())}`);
      doc.moveDown(0.6).fillColor("#111").fontSize(10);
      doc.text(`Jarat: ${safeText(first.run_number || "-")} | Tervezett nap: ${dateHU(first.planned_date)} | Megallo: ${deliveries.length}`);
      doc.text(`Futar: ${safeText(first.driver_name || "-")} | Jarmu: ${safeText(first.vehicle || "-")}`);
      if (first.run_note) doc.text(safeText(`Megjegyzes: ${first.run_note}`));
      doc.moveDown(0.8);
    };

    const drawItemHeader = () => {
      const y = doc.y;
      doc.font("Helvetica-Bold").fontSize(8.5).fillColor("#111");
      doc.text("Termek", left, y, { width: tableWidth - 230 });
      doc.text("Karton", right - 210, y, { width: 60, align: "right" });
      doc.text("Darab", right - 140, y, { width: 60, align: "right" });
      doc.text("Atadva", right - 70, y, { width: 70, align: "right" });
      doc.moveTo(left, y + 14).lineTo(right, y + 14).strokeColor("#cccccc").stroke();
      doc.fillColor("#111");
      doc.y = y + 19;
    };

    const drawItemRow = (item: ShipmentItemRow) => {
      const name = productLabel(item);
      const rowHeight = Math.max(14, doc.heightOfString(safeText(name), { width: tableWidth - 230 }) + 3);
      ensureSpace(rowHeight + 2);
      const y = doc.y;
      doc.font("Helvetica").fontSize(8.5).fillColor("#111");
      doc.text(safeText(name), left, y, { width: tableWidth - 230 });
      doc.text(String(item.cartons), right - 210, y, { width: 60, align: "right" });
      doc.text(String(item.unit_quantity), right - 140, y, { width: 60, align: "right" });
      doc.text("____", right - 70, y, { width: 70, align: "right" });
      doc.y = y + rowHeight;
    };

    const drawDelivery = (delivery: DeliveryRow) => {
      ensureSpace(150);
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#111")
        .text(safeText(`${delivery.sequence_no ?? "-"} · ${delivery.order_number} · ${delivery.partner_name}`), left, doc.y, { width: tableWidth });
      doc.font("Helvetica").fontSize(8.5).fillColor("#555")
        .text(safeText(`Kert nap: ${dateHU(delivery.requested_delivery_date)} | Karton: ${delivery.total_cartons} | Darab: ${delivery.total_units}`));

      const payment = huLabel(paymentMethodLabels, delivery.default_payment_method);
      const paymentLine = delivery.default_payment_method === "bank_transfer"
        ? `${payment}, ${delivery.payment_terms_days} nap`
        : payment;
      const lines = [
        `Szamlazasi nev: ${delivery.billing_name || delivery.partner_name}`,
        `Adoszam: ${delivery.tax_number || "-"}`,
        `Kapcsolattarto: ${delivery.contact_name || "-"}`,
        `E-mail: ${delivery.email || "-"}`,
        `Telefon: ${delivery.phone || "-"}`,
        `Fizetes: ${paymentLine}`,
        `Szallitasi cim: ${delivery.delivery_address || "-"}`
      ];
      doc.moveDown(0.2);
      doc.font("Helvetica").fontSize(8.5).fillColor("#111");
      for (const line of lines) doc.text(safeText(line), { width: tableWidth / 2 });
      doc.moveDown(0.4);
      drawItemHeader();
      for (const item of items.filter((row) => Number(row.delivery_id) === Number(delivery.id))) {
        drawItemRow(item);
      }
      doc.moveDown(0.8);
      ensureSpace(34);
      const y = doc.y;
      doc.font("Helvetica").fontSize(8.5).fillColor("#555");
      doc.text("Atvevo neve: ____________________", left, y, { width: 230 });
      doc.text("Atvevo alairasa: ____________________", left + 260, y, { width: 250 });
      doc.text("Megjegyzes: ____________________", left + 540, y, { width: 250 });
      doc.y = y + 34;
    };

    drawHeader();
    for (const delivery of deliveries) drawDelivery(delivery);

    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc.font("Helvetica").fontSize(8).fillColor("#777").text(`${i + 1}/${pages.count}`, right - 60, bottom + 8, { width: 60, align: "right" });
    }
    doc.end();
  });
}

export async function GET(request: Request) {
  const auth = await apiUser(ROLES);
  if (auth.error || !auth.user) return auth.error ?? NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 });

  const url = new URL(request.url);
  const deliveries = await selectedDeliveries(Number(auth.user.organization_id), url);
  if (!deliveries.length) {
    return NextResponse.json({ error: "Nincs nyomtatható fuvarlevél a megadott szűrésben." }, { status: 404 });
  }

  const items = await deliveryItems(deliveries.map((delivery) => Number(delivery.id)));
  const pdf = await generatePdf(deliveries, items);
  const filename = `gellamille-fuvarlevel-${new Date().toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store"
    }
  });
}
