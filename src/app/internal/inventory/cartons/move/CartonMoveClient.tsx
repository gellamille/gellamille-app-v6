"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRightLeft, ScanBarcode } from "lucide-react";

type Location = {
  id: number;
  name: string;
  code: string;
  type: string;
};

type MoveResult = {
  carton_code: string;
  quantity_units: number;
  product_name: string;
  product_code: string;
  lot_number: string;
  from_location_name: string | null;
  to_location_name: string;
};

export function CartonMoveClient({ locations }: { locations: Location[] }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [code, setCode] = useState("");
  const [toLocationId, setToLocationId] = useState(locations[0]?.id ? String(locations[0].id) : "");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [moves, setMoves] = useState<MoveResult[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const cleanCode = code.trim();
    if (!cleanCode || !toLocationId) return;
    setLoading(true);
    setError("");

    const response = await fetch("/api/inventory/cartons/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: cleanCode,
        toLocationId: Number(toLocationId),
        note
      })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Az áthelyezés sikertelen.");
      inputRef.current?.select();
      return;
    }

    setMoves((current) => [data, ...current].slice(0, 12));
    setCode("");
    inputRef.current?.focus();
  }

  return (
    <div className="stack">
      <form className="card scan-card" onSubmit={submit}>
        <div>
          <h3>Karton áthelyezése</h3>
          <p className="text-muted">Válaszd ki a cél raktárhelyet, majd csippantsd a kartont. A kiinduló helyet a rendszer a kartonból tudja.</p>
        </div>
        <label>Cél raktárhely
          <select value={toLocationId} onChange={(event) => setToLocationId(event.target.value)}>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>{location.name} ({location.code})</option>
            ))}
          </select>
        </label>
        <button className="button button-primary" disabled={loading || !code.trim() || !toLocationId}>
          <ArrowRightLeft size={16} /> {loading ? "Mozgatás..." : "Mozgatás"}
        </button>
        <label className="scan-input-label">
          <ScanBarcode size={24} />
          <input
            ref={inputRef}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="GM-C-2026-000123"
            autoComplete="off"
          />
        </label>
        <label className="full">Megjegyzés
          <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Opcionális, pl. átrendezés, komissiózás előkészítése" />
        </label>
      </form>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <section className="card">
        <h2>Legutóbbi áthelyezések</h2>
        <div className="event-list">
          {moves.map((move, index) => (
            <div className="event-row" key={`${move.carton_code}-${index}`}>
              <div>
                <strong className="mono">{move.carton_code}</strong>
                <div>{move.product_name}</div>
                <div className="text-muted">{move.lot_number} · {move.quantity_units} db</div>
              </div>
              <div className="event-meta">
                <strong>{move.from_location_name ?? "-"} - {move.to_location_name}</strong>
                <span>{move.product_code}</span>
              </div>
            </div>
          ))}
          {!moves.length ? <div className="empty-inline">Még nem történt áthelyezés ebben a munkamenetben.</div> : null}
        </div>
      </section>
    </div>
  );
}
