"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { CalendarDays, MapPin, PackageCheck, ScanBarcode } from "lucide-react";
import { dateHU } from "@/lib/format";

const statusLabels: Record<string, string> = {
  created: "Létrehozva",
  in_stock: "Készleten",
  reserved: "Foglalva",
  picked: "Összekészítve",
  delivered: "Átadva",
  returned: "Visszavéve",
  recalled: "Visszahívott",
  scrapped: "Selejt",
  archived: "Archivált"
};

const eventLabels: Record<string, string> = {
  created: "Létrehozva",
  received: "Bevételezve",
  moved: "Áthelyezve",
  reserved: "Foglalva",
  picked: "Összekészítve",
  unpicked: "Összekészítés visszavonva",
  delivered: "Átadva",
  returned: "Visszavéve",
  scrapped: "Selejtezve",
  recalled: "Visszahívva",
  archived: "Archiválva",
  label_printed: "Címke nyomtatva",
  label_reprinted: "Címke újranyomtatva",
  checked: "Ellenőrizve"
};

type CheckResult = {
  carton: {
    carton_code: string;
    quantity_units: number;
    status: string;
    created_at: string;
    product_name: string;
    product_code: string;
    size_ml: number;
    lot_number: string;
    production_date: string;
    best_before: string;
    location_name: string | null;
    location_code: string | null;
    location_type: string | null;
  };
  events: Array<{
    event_type: string;
    note: string | null;
    created_at: string;
    from_location_name: string | null;
    to_location_name: string | null;
    actor_name: string | null;
    order_number: string | null;
  }>;
};

function dateTimeHU(value: string) {
  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function CartonCheckClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const cleanCode = code.trim();
    if (!cleanCode) return;
    setLoading(true);
    setError("");
    const response = await fetch("/api/inventory/cartons/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: cleanCode })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setResult(null);
      setError(data.error ?? "Nem sikerült ellenőrizni a kartont.");
      inputRef.current?.select();
      return;
    }
    setResult(data);
    setCode("");
    inputRef.current?.focus();
  }

  return (
    <div className="stack">
      <form className="card scan-card" onSubmit={submit}>
        <div>
          <h3>Karton csippantása</h3>
          <p className="text-muted">Olvasd be a karton címkéjét. A scanner Entert küld, ezért a keresés automatikusan indul.</p>
        </div>
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
        <button className="button button-primary" disabled={loading || !code.trim()}>{loading ? "Ellenőrzés..." : "Ellenőrzés"}</button>
      </form>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {result ? (
        <section className="carton-check-grid">
          <article className="card">
            <div className="carton-check-header">
              <div>
                <div className="text-muted">Karton</div>
                <h2 className="mono">{result.carton.carton_code}</h2>
              </div>
              <span className={`badge badge-${result.carton.status}`}>{statusLabels[result.carton.status] ?? result.carton.status}</span>
            </div>
            <div className="carton-facts">
              <div><PackageCheck size={18} /><span>{result.carton.product_name}</span></div>
              <div><span className="mono">{result.carton.product_code}</span><span>{result.carton.size_ml} ml · {result.carton.quantity_units} db</span></div>
              <div><span>LOT</span><strong className="mono">{result.carton.lot_number}</strong></div>
              <div><CalendarDays size={18} /><span>Gyártás: {dateHU(result.carton.production_date)} · Lejárat: {dateHU(result.carton.best_before)}</span></div>
              <div><MapPin size={18} /><span>{result.carton.location_name ?? "Nincs raktárhely"}{result.carton.location_code ? ` (${result.carton.location_code})` : ""}</span></div>
            </div>
          </article>

          <article className="card">
            <h2>Események</h2>
            <div className="event-list">
              {result.events.map((event, index) => (
                <div className="event-row" key={`${event.event_type}-${event.created_at}-${index}`}>
                  <div>
                    <strong>{eventLabels[event.event_type] ?? event.event_type}</strong>
                    {event.order_number ? <div className="mono text-muted">{event.order_number}</div> : null}
                    {event.from_location_name || event.to_location_name ? (
                      <div className="text-muted">{event.from_location_name ?? "-"} - {event.to_location_name ?? "-"}</div>
                    ) : null}
                    {event.note ? <div className="text-muted">{event.note}</div> : null}
                  </div>
                  <div className="event-meta">
                    <strong>{event.actor_name ?? "Rendszer"}</strong>
                    <span>{dateTimeHU(event.created_at)}</span>
                  </div>
                </div>
              ))}
              {!result.events.length ? <div className="empty-inline">Nincs esemény ehhez a kartonhoz.</div> : null}
            </div>
          </article>
        </section>
      ) : null}
    </div>
  );
}
