"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const periodLabels = [
  ["day", "Nap"],
  ["week", "Hét"],
  ["month", "Hónap"],
  ["quarter", "Negyedév"]
] as const;

export function DataArchiveForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    setMessage("");
    setCounts(null);
    const response = await fetch("/api/admin/archive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        periodType: String(fd.get("periodType")),
        referenceDate: String(fd.get("referenceDate")),
        reason: String(fd.get("reason") || ""),
        confirm: fd.get("confirm") === "on"
      })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "Az archiválás sikertelen.");
      return;
    }
    setCounts(data.counts ?? null);
    setMessage("Az időszak adatai archiválva. Nem történt fizikai törlés.");
    router.refresh();
  }

  return (
    <form className="card stack" onSubmit={submit}>
      <h2>Tesztadat archiválás</h2>
      <div className="form-grid">
        <label>Időszak típusa<select name="periodType" defaultValue="day">{periodLabels.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Időszak dátuma<input name="referenceDate" type="date" defaultValue={today} required /></label>
        <label className="full">Indoklás<textarea name="reason" minLength={10} required /></label>
        <label className="full checkbox-line"><input name="confirm" type="checkbox" required /> Tudomásul veszem, hogy ez soft archive: az adatok megmaradnak, de a normál listákból kikerülnek.</label>
      </div>
      {message ? <div className={message.includes("archiválva") ? "alert alert-success" : "alert alert-danger"}>{message}</div> : null}
      {counts ? (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Terület</th><th>Archivált sor</th></tr></thead>
            <tbody>{Object.entries(counts).map(([label, count]) => <tr key={label}><td>{label}</td><td>{count}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
      <button className="button button-danger" disabled={loading}>Archiválás indoklással</button>
    </form>
  );
}
