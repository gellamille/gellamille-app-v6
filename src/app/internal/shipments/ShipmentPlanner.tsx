"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { dateHU } from "@/lib/format";

type CandidateOrder = {
  id: number | string;
  order_number: string;
  partner_name: string;
  requested_delivery_date: string;
  fulfillment_status: string;
  total_cartons: number;
  delivery_id: number | string | null;
  delivery_status: string | null;
  shipping_run_id: number | string | null;
  run_number: string | null;
  delivery_address: string | null;
};

type Run = {
  id: number | string;
  run_number: string;
  planned_date: string;
  status: string;
  driver_name: string | null;
  vehicle: string | null;
  note: string | null;
};

type RunDelivery = {
  id: number | string;
  shipping_run_id: number | string;
  sequence_no: number | null;
  status: string;
  planned_date: string;
  partner_name: string;
  order_number: string;
  requested_delivery_date: string;
  fulfillment_status: string;
  total_cartons: number;
  delivery_address: string | null;
};

const statuses = [
  ["planned", "Tervezett"],
  ["loading", "Pakolás"],
  ["in_transit", "Úton"],
  ["completed", "Kész"],
  ["cancelled", "Törölve"]
] as const;

const fulfillmentLabels: Record<string, string> = {
  reserved: "Foglalva",
  partially_reserved: "Részben foglalva",
  picking: "Összekészítés alatt",
  packed: "Átadásra kész",
  partially_delivered: "Részben átadva"
};

const deliveryStatusLabels: Record<string, string> = {
  planned: "Tervezett",
  picking: "Pakolás alatt",
  loaded: "Felpakolva",
  in_transit: "Úton",
  delivered: "Átadva",
  cancelled: "Törölve"
};

const editableDeliveryStatuses = [
  ["planned", "Tervezett"],
  ["picking", "Pakolás alatt"],
  ["loaded", "Felpakolva"],
  ["in_transit", "Úton"],
  ["cancelled", "Törölve"]
] as const;

export function ShipmentPlanner({
  candidates,
  runs,
  runDeliveries
}: {
  candidates: CandidateOrder[];
  runs: Run[];
  runDeliveries: RunDelivery[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState(runs[0]?.id ? String(runs[0].id) : "");
  const today = new Date().toISOString().slice(0, 10);
  const selectedRun = useMemo(
    () => runs.find((run) => String(run.id) === selectedRunId) ?? runs[0],
    [runs, selectedRunId]
  );
  const deliveriesByRun = useMemo(() => {
    const grouped = new Map<string, RunDelivery[]>();
    for (const delivery of runDeliveries) {
      const runId = String(delivery.shipping_run_id);
      const current = grouped.get(runId) ?? [];
      current.push(delivery);
      grouped.set(runId, current);
    }
    return grouped;
  }, [runDeliveries]);
  const selectedDeliveries = useMemo(
    () => selectedRun ? deliveriesByRun.get(String(selectedRun.id)) ?? [] : [],
    [deliveriesByRun, selectedRun]
  );
  const selectedRunOrderIds = useMemo(() => {
    const ids = new Set<string>();
    const selectedDeliveryIds = new Set(selectedDeliveries.map((delivery) => String(delivery.id)));
    for (const order of candidates) {
      if (order.delivery_id && selectedDeliveryIds.has(String(order.delivery_id))) ids.add(String(order.id));
    }
    return ids;
  }, [candidates, selectedDeliveries]);
  const availableForSelectedRun = selectedRun
    ? candidates.filter((order) => String(order.shipping_run_id ?? "") !== String(selectedRun.id))
    : [];

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plannedDate: String(fd.get("plannedDate") || today),
        driverName: String(fd.get("driverName") || ""),
        vehicle: String(fd.get("vehicle") || ""),
        note: String(fd.get("note") || ""),
        orderIds: fd.getAll("orderIds").map((value) => Number(value))
      })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "A járat létrehozása sikertelen.");
      return;
    }
    form.reset();
    setMessage("A szállítási járat létrejött.");
    router.refresh();
  }

  async function update(event: FormEvent<HTMLFormElement>, runId: number | string) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    setMessage("");
    const deliveryIds = fd.getAll("deliveryIds").map((value) => String(value));
    const removeDeliveryIds = fd.getAll("removeDeliveryIds").map((value) => Number(value));
    const deliveryUpdates = deliveryIds
      .filter((id) => !removeDeliveryIds.includes(Number(id)))
      .map((id) => ({
        deliveryId: Number(id),
        sequenceNo: Number(fd.get(`sequenceNo:${id}`) || 0),
        status: String(fd.get(`deliveryStatus:${id}`) || "planned")
      }));
    const response = await fetch(`/api/shipments/${runId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plannedDate: String(fd.get("plannedDate")),
        driverName: String(fd.get("driverName")),
        vehicle: String(fd.get("vehicle") || ""),
        note: String(fd.get("note") || ""),
        status: String(fd.get("status")),
        deliveryUpdates,
        removeDeliveryIds,
        addOrderIds: fd.getAll("addOrderIds").map((value) => Number(value))
      })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "A járat módosítása sikertelen.");
      return;
    }
    setMessage("A szállítási járat módosítva.");
    router.refresh();
  }

  return (
    <section className="stack section-gap">
      <form className="card stack" onSubmit={create}>
        <div className="card-title-row">
          <h2>Új szállítási járat</h2>
          <span className="text-muted">{candidates.length} tervezhető rendelés</span>
        </div>
        <div className="form-grid">
          <label>Dátum<input name="plannedDate" type="date" defaultValue={today} required /></label>
          <label>Futár / szállító<input name="driverName" required /></label>
          <label>Jármű<input name="vehicle" /></label>
          <label className="full">Megjegyzés<textarea name="note" /></label>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th></th><th>Rendelés</th><th>Partner</th><th>Cím</th><th>Kért nap</th><th>Teljesítés</th><th>Karton</th><th>Jelenlegi járat</th></tr></thead>
            <tbody>
              {candidates.map((order) => (
                <tr key={order.id}>
                  <td><input type="checkbox" name="orderIds" value={order.id} /></td>
                  <td className="mono">{order.order_number}</td>
                  <td>{order.partner_name}</td>
                  <td>{order.delivery_address || "—"}</td>
                  <td>{dateHU(order.requested_delivery_date)}</td>
                  <td>{fulfillmentLabels[order.fulfillment_status] ?? order.fulfillment_status}</td>
                  <td>{order.total_cartons}</td>
                  <td>{order.run_number ?? "—"}{order.delivery_status ? <div className="text-muted">{deliveryStatusLabels[order.delivery_status] ?? order.delivery_status}</div> : null}</td>
                </tr>
              ))}
              {!candidates.length ? <tr><td colSpan={8}>Nincs szállításra tervezhető rendelés.</td></tr> : null}
            </tbody>
          </table>
        </div>
        {message ? <div className={message.includes("sikertelen") ? "alert alert-danger" : "alert alert-success"}>{message}</div> : null}
        <button className="button button-primary" disabled={loading || !candidates.length}>Járat létrehozása</button>
      </form>

      <div className="stack">
        <h2>Járatok szerkesztése</h2>
        {runs.length ? (
          <form className="card stack" key={selectedRun?.id ?? "no-run"} onSubmit={(event) => selectedRun ? update(event, selectedRun.id) : event.preventDefault()}>
            <label>Szerkesztendő járat
              <select value={selectedRun?.id ? String(selectedRun.id) : ""} onChange={(event) => setSelectedRunId(event.target.value)}>
                {runs.map((run) => <option key={run.id} value={String(run.id)}>{run.run_number} · {dateHU(run.planned_date)} · {run.driver_name ?? "nincs futár"}</option>)}
              </select>
            </label>
            {selectedRun ? (
              <>
                <div className="card-title-row"><h3 className="mono">{selectedRun.run_number}</h3><span className="text-muted">{selectedDeliveries.length} rendelés</span></div>
                <div className="form-grid">
                  <label>Dátum<input name="plannedDate" type="date" defaultValue={selectedRun.planned_date?.slice(0, 10)} required /></label>
                  <label>Állapot<select name="status" defaultValue={selectedRun.status}>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                  <label>Futár / szállító<input name="driverName" defaultValue={selectedRun.driver_name ?? ""} required /></label>
                  <label>Jármű<input name="vehicle" defaultValue={selectedRun.vehicle ?? ""} /></label>
                  <label className="full">Megjegyzés<textarea name="note" defaultValue={selectedRun.note ?? ""} /></label>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Sorrend</th><th>Rendelés</th><th>Partner</th><th>Cím</th><th>Kért nap</th><th>Teljesítés</th><th>Karton</th><th>Átadás</th><th>Levesz</th></tr></thead>
                    <tbody>
                      {selectedDeliveries.map((delivery) => (
                        <tr key={delivery.id}>
                          <td>
                            <input type="hidden" name="deliveryIds" value={String(delivery.id)} />
                            <input name={`sequenceNo:${delivery.id}`} type="number" min="1" defaultValue={delivery.sequence_no ?? ""} style={{ maxWidth: 86 }} />
                          </td>
                          <td className="mono">{delivery.order_number}</td>
                          <td>{delivery.partner_name}</td>
                          <td>{delivery.delivery_address || "—"}</td>
                          <td>{dateHU(delivery.requested_delivery_date)}</td>
                          <td>{fulfillmentLabels[delivery.fulfillment_status] ?? delivery.fulfillment_status}</td>
                          <td>{delivery.total_cartons}</td>
                          <td>
                            <select name={`deliveryStatus:${delivery.id}`} defaultValue={delivery.status}>
                              {editableDeliveryStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </select>
                          </td>
                          <td><input type="checkbox" name="removeDeliveryIds" value={String(delivery.id)} /></td>
                        </tr>
                      ))}
                      {!selectedDeliveries.length ? <tr><td colSpan={9}>Ezen a járaton nincs nyitott rendelés.</td></tr> : null}
                    </tbody>
                  </table>
                </div>
                <div className="stack">
                  <div className="card-title-row">
                    <h3>Rendelés hozzáadása ehhez a járathoz</h3>
                    <span className="text-muted">{availableForSelectedRun.length} rendelés</span>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th></th><th>Rendelés</th><th>Partner</th><th>Cím</th><th>Kért nap</th><th>Karton</th><th>Jelenlegi járat</th></tr></thead>
                      <tbody>
                        {availableForSelectedRun.map((order) => (
                          <tr key={order.id}>
                            <td><input type="checkbox" name="addOrderIds" value={String(order.id)} disabled={selectedRunOrderIds.has(String(order.id))} /></td>
                            <td className="mono">{order.order_number}</td>
                            <td>{order.partner_name}</td>
                            <td>{order.delivery_address || "—"}</td>
                            <td>{dateHU(order.requested_delivery_date)}</td>
                            <td>{order.total_cartons}</td>
                            <td>{order.run_number ?? "—"}</td>
                          </tr>
                        ))}
                        {!availableForSelectedRun.length ? <tr><td colSpan={7}>Nincs hozzáadható rendelés.</td></tr> : null}
                      </tbody>
                    </table>
                  </div>
                </div>
                <button className="button" disabled={loading}>Járat mentése</button>
              </>
            ) : null}
          </form>
        ) : null}
        {!runs.length ? <div className="empty-state">Még nincs szerkeszthető járat.</div> : null}
      </div>
    </section>
  );
}
