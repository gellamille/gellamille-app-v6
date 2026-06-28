import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Code39Barcode } from "@/components/barcode/Code39Barcode";
import { query } from "@/lib/db";
import { dateHU } from "@/lib/format";
import { requireAppUser } from "@/lib/auth";
import { PrintLabelsButton } from "./PrintLabelsButton";
import { GenerateCartonsButton } from "./GenerateCartonsButton";

type LotRow = {
  id: number;
  lot_number: string;
  production_date: string;
  best_before: string;
  quantity: number;
  product_name: string;
  product_code: string;
  size_ml: number;
  units_per_carton: number;
  location_name: string | null;
};

type CartonRow = {
  id: number;
  carton_code: string;
  quantity_units: number;
  status: string;
  location_name: string | null;
  printed_at: string | null;
};

export default async function CartonLabelsPage({ params }: { params: Promise<{ lotId: string }> }) {
  const user = await requireAppUser(["admin", "management", "production", "warehouse"]);
  const { lotId } = await params;
  const id = Number(lotId);

  const lots = Number.isInteger(id) ? await query<LotRow>(`
    select l.id,l.lot_number,l.production_date,l.best_before,l.quantity,
           p.name as product_name,p.code as product_code,p.size_ml,p.units_per_carton,
           loc.name as location_name
      from public.lots l
      join public.products p on p.flavor_code=l.flavor_code and p.size_ml=l.size_ml and p.organization_id=l.organization_id
      left join public.inventory_locations loc on loc.organization_id=l.organization_id and loc.code='CENTRAL'
     where l.id=$1 and l.organization_id=$2 and l.archived_at is null
     limit 1
  `, [id, user.organization_id]) : [];
  const lot = lots[0];

  const cartons = lot ? await query<CartonRow>(`
    select c.id,c.carton_code,c.quantity_units,c.status,
           loc.name as location_name,
           (
             select max(e.created_at)
               from public.inventory_carton_events e
              where e.carton_id=c.id and e.event_type in ('label_printed','label_reprinted') and e.archived_at is null
           ) as printed_at
      from public.inventory_cartons c
      left join public.inventory_locations loc on loc.id=c.location_id
     where c.organization_id=$1 and c.lot_id=$2 and c.archived_at is null
     order by c.carton_code
  `, [user.organization_id, id]) : [];
  const unprintedCartons = cartons.filter((carton) => !carton.printed_at);
  const cartonUnits = cartons.reduce((sum, carton) => sum + Number(carton.quantity_units ?? 0), 0);
  const remainingUnits = lot ? Math.max(0, Number(lot.quantity ?? 0) - cartonUnits) : 0;

  if (!lot) {
    return (
      <div className="page">
        <PageHeader title="Karton címkék" />
        <div className="alert alert-danger">A LOT nem található.</div>
      </div>
    );
  }

  return (
    <div className="page labels-page">
      <Link href="/internal/production" className="back-link">← Vissza</Link>
      <PageHeader
        title="Karton címkék"
        description={`${lot.lot_number} · ${lot.product_name} · ${cartons.length} karton`}
        actions={
          <>
            <GenerateCartonsButton lotId={lot.id} remainingUnits={remainingUnits} unitsPerCarton={lot.units_per_carton} />
            <PrintLabelsButton
              lotId={lot.id}
              cartonIds={cartons.map((carton) => carton.id)}
              unprintedCartonIds={unprintedCartons.map((carton) => carton.id)}
            />
          </>
        }
      />

      <section className="card print-hide">
        <h2>Előnézet</h2>
        <p className="text-muted">
          Itt történik a fizikai kartonozás adminisztrációja: add meg, ebből a LOT-ból most ténylegesen hány darabot kartonoztatok.
          A nyomtatás 100 × 70 mm-es kartoncímkére van optimalizálva, a vonalkód tartalma csak a karton azonosító.
        </p>
        <p className="text-muted">{remainingUnits} db még kartonozatlan · {cartonUnits} db kartonban · {unprintedCartons.length} még nem nyomtatott címke · {cartons.length - unprintedCartons.length} korábban nyomtatott címke.</p>
        {!cartons.length ? <div className="alert alert-warning">Ehhez a LOT-hoz még nincs létrehozott karton. Indítsd a kartonozás/címkék generálását.</div> : null}
      </section>

      <section className="label-sheet">
        {cartons.map((carton) => (
          <article className={`carton-label ${carton.printed_at ? "is-printed" : "is-unprinted"}`} key={carton.id}>
            <div className="label-brand">Gellamille</div>
            <div className="label-product">{lot.product_name}</div>
            <div className="label-muted">{lot.size_ml} ml · {carton.quantity_units} db / karton</div>
            <div className="label-grid">
              <span>LOT</span><strong>{lot.lot_number}</strong>
              <span>Karton</span><strong>{carton.carton_code}</strong>
              <span>Gyártás</span><strong>{dateHU(lot.production_date)}</strong>
              <span>Lejárat</span><strong>{dateHU(lot.best_before)}</strong>
              <span>Hely</span><strong>{carton.location_name ?? lot.location_name ?? "Központi raktár"}</strong>
            </div>
            <Code39Barcode value={carton.carton_code} />
            <div className="label-code">{carton.carton_code}</div>
            <div className="label-footer">Fagyasztva tárolandó · {lot.product_code}</div>
            {carton.printed_at ? <div className="label-reprint">Újranyomtatás</div> : null}
          </article>
        ))}
      </section>
    </div>
  );
}
