"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { dateHU } from "@/lib/format";

type CandidateOrder = {
  id: number;
  order_number: string;
  partner_name: string;
  requested_delivery_date: string;
  fulfillment_status: string;
  total_cartons: number;
  run_number: string | null;
};

type Run = {
  id: number;
  run_number: string;
  planned_date: string;
  status: string;
  driver_name: string | null;
  vehicle: string | null;
  note: string | null;
};

const statuses = [
  ["planned", "Tervezett"],
  ["loading", "Pakolás"],
  ["in_transit", "Úton"],
  ["completed", "Kész"],
  ["cancelled", "Törölve"]
] as const;

export function ShipmentPlanner({ candidates, runs }: { candidates: CandidateOrder[]; runs: Run[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

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

  async function update(event: FormEvent<HTMLFormElement>, runId: number) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    setMessage("");
    const response = await fetch(`/api/shipments/${runId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plannedDate: String(fd.get("plannedDate")),
        driverName: String(fd.get("driverName")),
        vehicle: String(fd.get("vehicle") || ""),
        note: String(fd.get("note") || ""),
        status: String(fd.get("status"))
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
    <section className="grid grid-2 section-gap">
      <form className="card stack" onSubmit={create}>
        <h2>Új szállítási járat</h2>
        <div className="form-grid">
          <label>Dátum<input name="plannedDate" type="date" defaultValue={today} required /></label>
          <label>Futár / szállító<input name="driverName" required /></label>
          <label>Jármű<input name="vehicle" /></label>
          <label className="full">Megjegyzés<textarea name="note" /></label>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th></th><th>Rendelés</th><th>Partner</th><th>Kért nap</th><th>Teljesítés</th><th>Karton</th><th>Jelenlegi járat</th></tr></thead>
            <tbody>
              {candidates.map((order) => (
                <tr key={order.id}>
                  <td><input type="checkbox" name="orderIds" value={order.id} /></td>
                  <td className="mono">{order.order_number}</td>
                  <td>{order.partner_name}</td>
                  <td>{dateHU(order.requested_delivery_date)}</td>
                  <td>{order.fulfillment_status}</td>
                  <td>{order.total_cartons}</td>
                  <td>{order.run_number ?? "—"}</td>
                </tr>
              ))}
              {!candidates.length ? <tr><td colSpan={7}>Nincs szállításra tervezhető rendelés.</td></tr> : null}
            </tbody>
          </table>
        </div>
        {message ? <div className={message.includes("sikertelen") ? "alert alert-danger" : "alert alert-success"}>{message}</div> : null}
        <button className="button button-primary" disabled={loading || !candidates.length}>Járat létrehozása</button>
      </form>

      <div className="stack">
        <h2>Járatok szerkesztése</h2>
        {runs.map((run) => (
          <form className="card stack" key={run.id} onSubmit={(event) => update(event, run.id)}>
            <div className="card-title-row"><h3 className="mono">{run.run_number}</h3></div>
            <div className="form-grid">
              <label>Dátum<input name="plannedDate" type="date" defaultValue={run.planned_date?.slice(0, 10)} required /></label>
              <label>Állapot<select name="status" defaultValue={run.status}>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label>Futár / szállító<input name="driverName" defaultValue={run.driver_name ?? ""} required /></label>
              <label>Jármű<input name="vehicle" defaultValue={run.vehicle ?? ""} /></label>
              <label className="full">Megjegyzés<textarea name="note" defaultValue={run.note ?? ""} /></label>
            </div>
            <button className="button" disabled={loading}>Járat mentése</button>
          </form>
        ))}
        {!runs.length ? <div className="empty-state">Még nincs szerkeszthető járat.</div> : null}
      </div>
    </section>
  );
}
