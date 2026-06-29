"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { dateHU, dateTimeHU } from "@/lib/format";

type Lot = {
  id: number;
  lot_number: string;
  product_name: string;
  best_before: string;
  status: string;
  available_units: number;
};

type RecallDestination = {
  lot_id: number;
  partner_name: string;
  partner_email: string | null;
  order_number: string;
  delivered_at: string | null;
  delivery_address: string | null;
  quantity_units: number;
};

export function RecallForm({
  lots,
  preselectedLotIds = [],
  recallDestinations = []
}: {
  lots: Lot[];
  preselectedLotIds?: number[];
  recallDestinations?: RecallDestination[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLotIds, setSelectedLotIds] = useState<Set<number>>(() => new Set(preselectedLotIds.map(Number)));
  const selectedDestinations = useMemo(
    () => recallDestinations.filter((destination) => selectedLotIds.has(Number(destination.lot_id))),
    [recallDestinations, selectedLotIds]
  );
  const selectedDestinationPartners = useMemo(
    () => new Set(selectedDestinations.map((destination) => destination.partner_name)).size,
    [selectedDestinations]
  );
  const selectedDestinationUnits = useMemo(
    () => selectedDestinations.reduce((sum, destination) => sum + Number(destination.quantity_units ?? 0), 0),
    [selectedDestinations]
  );

  function toggleLot(lotId: number, checked: boolean) {
    setSelectedLotIds((current) => {
      const next = new Set(current);
      if (checked) next.add(lotId);
      else next.delete(lotId);
      return next;
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/recalls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(fd.get("title") ?? ""),
        reason: String(fd.get("reason") ?? ""),
        lotIds: fd.getAll("lotIds").map((value) => Number(value))
      })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "A visszahívás sikertelen.");
      return;
    }
    form.reset();
    setSelectedLotIds(new Set());
    setMessage(`A visszahívás létrejött. Érintett partner: ${data.affectedPartners ?? 0}.`);
    router.refresh();
  }

  return (
    <form className="card stack" onSubmit={submit}>
      <h2>Új LOT visszahívás</h2>
      <div className="form-grid">
        <label>Cím<input name="title" required placeholder="Pl. Minőségi visszahívás" /></label>
        <label className="full">Indoklás<textarea name="reason" minLength={5} required /></label>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th></th><th>LOT</th><th>Termék</th><th>Lejárat</th><th>Szabad készlet</th><th>Kint partnereknél</th><th>Állapot</th></tr></thead>
          <tbody>
            {lots.map((lot) => (
              <tr key={lot.id}>
                <td><input type="checkbox" name="lotIds" value={lot.id} checked={selectedLotIds.has(Number(lot.id))} onChange={(event) => toggleLot(Number(lot.id), event.target.checked)} /></td>
                <td className="mono">{lot.lot_number}</td>
                <td>{lot.product_name}</td>
                <td>{dateHU(lot.best_before)}</td>
                <td>{lot.available_units} db</td>
                <td>{recallDestinations.filter((destination) => Number(destination.lot_id) === Number(lot.id)).reduce((sum, destination) => sum + Number(destination.quantity_units ?? 0), 0)} db</td>
                <td>{lot.status}</td>
              </tr>
            ))}
            {!lots.length ? <tr><td colSpan={7}>Nincs visszahívható LOT.</td></tr> : null}
          </tbody>
        </table>
      </div>
      <section className="stack">
        <div className="card-title-row">
          <div>
            <h3>Visszahívási előnézet</h3>
            <div className="text-muted">
              {selectedDestinations.length
                ? `${selectedDestinationPartners} partner · ${selectedDestinationUnits} db kiszállított termék`
                : "A kiválasztott LOT-oknál nincs kiszállított partneri tétel."}
            </div>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Partner</th><th>Rendelés</th><th>Átadás</th><th>Cím</th><th>Darab</th></tr></thead>
            <tbody>
              {selectedDestinations.map((destination) => (
                <tr key={`${destination.lot_id}-${destination.partner_name}-${destination.order_number}-${destination.delivered_at ?? "none"}`}>
                  <td>{destination.partner_name}<div className="text-muted">{destination.partner_email ?? "Nincs e-mail"}</div></td>
                  <td className="mono">{destination.order_number}</td>
                  <td>{dateTimeHU(destination.delivered_at)}</td>
                  <td>{destination.delivery_address || "Nincs címadat"}</td>
                  <td>{destination.quantity_units} db</td>
                </tr>
              ))}
              {!selectedDestinations.length ? <tr><td colSpan={5}>Válassz ki olyan LOT-ot, amelyből már történt partneri átadás.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
      {message ? <div className={message.includes("létrejött") ? "alert alert-success" : "alert alert-danger"}>{message}</div> : null}
      <button className="button button-danger" disabled={loading || !lots.length || selectedLotIds.size === 0}>Visszahívás indítása</button>
    </form>
  );
}
