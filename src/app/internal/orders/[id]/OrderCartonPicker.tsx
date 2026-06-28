"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PackagePlus, ScanBarcode } from "lucide-react";

type PickResult = {
  carton_code: string;
  product_name: string;
  product_code: string;
  lot_number: string;
  location_name: string | null;
  quantity_units: number;
  missing_after: number;
  fulfillment_status: string;
};

export function OrderCartonPicker({ orderId, enabled }: { orderId: number; enabled: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [picks, setPicks] = useState<PickResult[]>([]);

  useEffect(() => {
    if (enabled) inputRef.current?.focus();
  }, [enabled]);

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const cleanCode = code.trim();
    if (!enabled || !cleanCode) return;
    setLoading(true);
    setError("");
    const response = await fetch(`/api/orders/${orderId}/carton-picks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: cleanCode })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "A karton összekészítése sikertelen.");
      inputRef.current?.select();
      return;
    }
    setPicks((current) => [data, ...current].slice(0, 10));
    setCode("");
    router.refresh();
    inputRef.current?.focus();
  }

  return (
    <section className="card stack">
      <div className="card-title-row">
        <div>
          <h2>Karton csippantásos összekészítés</h2>
          <p className="text-muted">Csippantsd a rendeléshez előkészített karton címkéjét. A rendszer ellenőrzi, hogy a termék szerepel-e a rendelésben.</p>
        </div>
      </div>
      {!enabled ? (
        <div className="alert alert-warning">Csak elfogadott, még nem lezárt rendeléshez lehet kartont csippantással összekészíteni.</div>
      ) : (
        <form className="scan-card" onSubmit={submit}>
          <div>
            <h3>Beolvasás</h3>
            <p className="text-muted">A scanner Entert küld, ezért a karton azonnal rögzül.</p>
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
          <button className="button button-primary" disabled={loading || !code.trim()}>
            <PackagePlus size={16} /> {loading ? "Rögzítés..." : "Rögzítés"}
          </button>
        </form>
      )}

      {error ? <div className="alert alert-danger">{error}</div> : null}

      <div className="event-list">
        {picks.map((pick, index) => (
          <div className="event-row" key={`${pick.carton_code}-${index}`}>
            <div>
              <strong className="mono">{pick.carton_code}</strong>
              <div>{pick.product_name}</div>
              <div className="text-muted">{pick.lot_number} · {pick.quantity_units} db · {pick.location_name ?? "Nincs hely"}</div>
            </div>
            <div className="event-meta">
              <strong>{pick.missing_after > 0 ? `${pick.missing_after} db még hiányzik` : "Tétel kész"}</strong>
              <span>{pick.product_code}</span>
            </div>
          </div>
        ))}
        {!picks.length ? <div className="empty-inline">Ebben a munkamenetben még nem csippantottál kartont ehhez a rendeléshez.</div> : null}
      </div>
    </section>
  );
}
