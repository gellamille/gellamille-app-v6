"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Code39Barcode } from "@/components/barcode/Code39Barcode";
import { dateHU, dateTimeHU } from "@/lib/format";

type Lot = {
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

type Carton = {
  id: number;
  carton_code: string;
  quantity_units: number;
  status: string;
  location_name: string | null;
  printed_at: string | null;
};

export function CartonLabelManager({ lot, cartons }: { lot: Lot; cartons: Carton[] }) {
  const router = useRouter();
  const unprintedCartons = useMemo(() => cartons.filter((carton) => !carton.printed_at), [cartons]);
  const printedCartons = useMemo(() => cartons.filter((carton) => carton.printed_at), [cartons]);
  const [selectedIds, setSelectedIds] = useState<number[]>(() => unprintedCartons.map((carton) => carton.id));
  const [previewIds, setPreviewIds] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const previewCartons = previewIds ? cartons.filter((carton) => previewIds.includes(carton.id)) : [];

  useEffect(() => {
    setSelectedIds(unprintedCartons.map((carton) => carton.id));
  }, [unprintedCartons]);

  function toggleCarton(id: number) {
    setSelectedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  function selectOnly(ids: number[]) {
    setSelectedIds(ids);
  }

  function markPrintSelection(ids: number[]) {
    document.querySelectorAll<HTMLElement>(".carton-label[data-carton-id]").forEach((label) => {
      label.classList.toggle("is-print-selected", ids.includes(Number(label.dataset.cartonId)));
    });
  }

  async function printLabels(ids: number[]) {
    if (!ids.length) {
      setMessage("Válassz ki legalább egy címkét a nyomtatáshoz.");
      return;
    }
    const reprintCount = cartons.filter((carton) => ids.includes(carton.id) && carton.printed_at).length;
    if (reprintCount > 0 && !window.confirm(`${reprintCount} korábban nyomtatott címke is ki van jelölve. Mehet az újranyomtatás?`)) return;

    setLoading(true);
    setMessage("");
    const response = await fetch("/api/inventory/cartons/labels/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lotId: lot.id, cartonIds: ids })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "A címkenyomtatás naplózása sikertelen.");
      return;
    }

    setMessage(`${data.printed ?? ids.length} címke nyomtatása indítva.`);
    markPrintSelection(ids);
    document.body.classList.add("print-selected-labels");
    const cleanup = () => {
      document.body.classList.remove("print-selected-labels");
      markPrintSelection([]);
      window.removeEventListener("afterprint", cleanup);
      router.refresh();
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    window.setTimeout(cleanup, 1500);
  }

  return (
    <div className="label-manager">
      <section className="card print-hide">
        <div className="card-title-row">
          <div>
            <h2>Címkék kezelése</h2>
            <p className="text-muted">A nyomtatatlan címkék alapból kijelölve indulnak. A nyomtatott címkék külön listában maradnak, onnan tudod őket újranyomtatni.</p>
          </div>
          <div className="print-actions">
            <button className="button" type="button" onClick={() => setPreviewIds(selectedIds)} disabled={!selectedIds.length}>
              Kijelöltek előnézete
            </button>
            <button className="button button-primary" type="button" onClick={() => printLabels(selectedIds)} disabled={loading || !selectedIds.length}>
              {loading ? "Indítás..." : `Kijelöltek nyomtatása (${selectedIds.length})`}
            </button>
          </div>
        </div>
        <div className="label-summary-row">
          <span>{unprintedCartons.length} nyomtatásra vár</span>
          <span>{printedCartons.length} nyomtatott</span>
          <span>{selectedIds.length} kijelölve</span>
        </div>
        {message ? <div className={message.includes("sikertelen") || message.includes("Válassz") ? "alert alert-danger" : "alert alert-success"}>{message}</div> : null}
      </section>

      <CartonTable
        title={`Nyomtatásra vár (${unprintedCartons.length})`}
        emptyText="Nincs nyomtatásra váró címke."
        cartons={unprintedCartons}
        selectedIds={selectedIds}
        onToggle={toggleCarton}
        onPreview={(id) => setPreviewIds([id])}
        toolbar={
          <>
            <button className="button button-small" type="button" onClick={() => selectOnly(unprintedCartons.map((carton) => carton.id))} disabled={!unprintedCartons.length}>Nyomtatatlanok kijelölése</button>
            <button className="button button-small button-primary" type="button" onClick={() => printLabels(unprintedCartons.map((carton) => carton.id))} disabled={loading || !unprintedCartons.length}>Új címkék nyomtatása</button>
          </>
        }
      />

      <CartonTable
        title={`Nyomtatott címkék (${printedCartons.length})`}
        emptyText="Még nincs nyomtatott címke ehhez a LOT-hoz."
        cartons={printedCartons}
        selectedIds={selectedIds}
        onToggle={toggleCarton}
        onPreview={(id) => setPreviewIds([id])}
        toolbar={
          <>
            <button className="button button-small" type="button" onClick={() => selectOnly(printedCartons.map((carton) => carton.id))} disabled={!printedCartons.length}>Nyomtatottak kijelölése</button>
            <button className="button button-small" type="button" onClick={() => setPreviewIds(printedCartons.map((carton) => carton.id))} disabled={!printedCartons.length}>Nyomtatottak előnézete</button>
          </>
        }
      />

      {previewIds ? (
        <section className="card print-hide">
          <div className="card-title-row">
            <h2>Előnézet ({previewCartons.length})</h2>
            <div className="inline">
              <button className="button button-primary" type="button" onClick={() => printLabels(previewIds)} disabled={loading || !previewIds.length}>Előnézet nyomtatása</button>
              <button className="button" type="button" onClick={() => setPreviewIds(null)}>Előnézet bezárása</button>
            </div>
          </div>
          <LabelSheet lot={lot} cartons={previewCartons} />
        </section>
      ) : null}

      <div className="print-only-labels" aria-hidden="true">
        <LabelSheet lot={lot} cartons={cartons} />
      </div>
    </div>
  );
}

function CartonTable({
  title,
  emptyText,
  cartons,
  selectedIds,
  toolbar,
  onToggle,
  onPreview
}: {
  title: string;
  emptyText: string;
  cartons: Carton[];
  selectedIds: number[];
  toolbar: ReactNode;
  onToggle: (id: number) => void;
  onPreview: (id: number) => void;
}) {
  return (
    <section className="card print-hide">
      <div className="card-title-row">
        <h2>{title}</h2>
        <div className="inline">{toolbar}</div>
      </div>
      {cartons.length ? (
        <div className="table-wrap label-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kijelölés</th>
                <th>Karton</th>
                <th>Darab</th>
                <th>Hely</th>
                <th>Nyomtatva</th>
                <th>Művelet</th>
              </tr>
            </thead>
            <tbody>
              {cartons.map((carton) => (
                <tr key={carton.id}>
                  <td><input type="checkbox" checked={selectedIds.includes(carton.id)} onChange={() => onToggle(carton.id)} aria-label={`${carton.carton_code} kijelölése`} /></td>
                  <td className="mono">{carton.carton_code}</td>
                  <td>{carton.quantity_units} db</td>
                  <td>{carton.location_name ?? "Központi raktár"}</td>
                  <td>{carton.printed_at ? dateTimeHU(carton.printed_at) : "Még nem"}</td>
                  <td><button className="button button-small" type="button" onClick={() => onPreview(carton.id)}>Előnézet</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div className="empty-inline">{emptyText}</div>}
    </section>
  );
}

function LabelSheet({ lot, cartons }: { lot: Lot; cartons: Carton[] }) {
  return (
    <section className="label-sheet">
      {cartons.map((carton) => (
        <article className={`carton-label ${carton.printed_at ? "is-printed" : "is-unprinted"}`} data-carton-id={carton.id} key={carton.id}>
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
  );
}
