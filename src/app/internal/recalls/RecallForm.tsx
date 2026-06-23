"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { dateHU } from "@/lib/format";

type Lot = {
  id: number;
  lot_number: string;
  product_name: string;
  best_before: string;
  status: string;
  available_units: number;
};

export function RecallForm({ lots, preselectedLotIds = [] }: { lots: Lot[]; preselectedLotIds?: number[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const selected = useMemo(() => new Set(preselectedLotIds.map(Number)), [preselectedLotIds]);

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
          <thead><tr><th></th><th>LOT</th><th>Termék</th><th>Lejárat</th><th>Szabad készlet</th><th>Állapot</th></tr></thead>
          <tbody>
            {lots.map((lot) => (
              <tr key={lot.id}>
                <td><input type="checkbox" name="lotIds" value={lot.id} defaultChecked={selected.has(Number(lot.id))} /></td>
                <td className="mono">{lot.lot_number}</td>
                <td>{lot.product_name}</td>
                <td>{dateHU(lot.best_before)}</td>
                <td>{lot.available_units} db</td>
                <td>{lot.status}</td>
              </tr>
            ))}
            {!lots.length ? <tr><td colSpan={6}>Nincs visszahívható LOT.</td></tr> : null}
          </tbody>
        </table>
      </div>
      {message ? <div className={message.includes("létrejött") ? "alert alert-success" : "alert alert-danger"}>{message}</div> : null}
      <button className="button button-danger" disabled={loading || !lots.length}>Visszahívás indítása</button>
    </form>
  );
}
