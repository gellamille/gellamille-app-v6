"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, PackagePlus, ScanBarcode, XCircle } from "lucide-react";

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
  const audioRef = useRef<AudioContext | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastStatus, setLastStatus] = useState<"idle" | "success" | "error">("idle");
  const [lastMessage, setLastMessage] = useState("");
  const [picks, setPicks] = useState<PickResult[]>([]);

  useEffect(() => {
    if (enabled) inputRef.current?.focus();
  }, [enabled]);

  function refocus() {
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function signal(success: boolean) {
    if ("vibrate" in navigator) navigator.vibrate(success ? 35 : [45, 30, 45]);
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    const context = audioRef.current ?? new AudioCtor();
    audioRef.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = success ? 880 : 220;
    gain.gain.value = 0.05;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + (success ? 0.08 : 0.16));
  }

  async function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const cleanCode = code.trim();
    if (!enabled || !cleanCode) return;
    setLoading(true);
    setError("");
    setLastStatus("idle");
    setLastMessage("");
    const response = await fetch(`/api/orders/${orderId}/carton-picks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: cleanCode })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      const message = data.error ?? "A karton összekészítése sikertelen.";
      setError(message);
      setLastStatus("error");
      setLastMessage(message);
      signal(false);
      inputRef.current?.select();
      return;
    }
    setLastStatus("success");
    setLastMessage(`${data.carton_code} rögzítve. ${data.missing_after > 0 ? `${data.missing_after} db még hiányzik ebből a tételből.` : "A tétel kész."}`);
    signal(true);
    setPicks((current) => [data, ...current].slice(0, 10));
    setCode("");
    router.refresh();
    refocus();
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
        <form className={`scan-card order-scan-card scan-state-${lastStatus}`} onSubmit={submit}>
          <div>
            <h3>Beolvasás</h3>
            <p className="text-muted">A scanner Entert küld, ezért a karton azonnal rögzül.</p>
          </div>
          <label className={`scan-input-label ${lastStatus === "success" ? "is-valid" : lastStatus === "error" ? "is-invalid" : ""}`}>
            <ScanBarcode size={24} />
            <input
              ref={inputRef}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onBlur={() => window.setTimeout(() => inputRef.current?.focus(), 150)}
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
      {lastMessage ? (
        <div className={lastStatus === "success" ? "scan-result scan-result-success" : "scan-result scan-result-error"}>
          {lastStatus === "success" ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          <strong>{lastMessage}</strong>
        </div>
      ) : null}

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
