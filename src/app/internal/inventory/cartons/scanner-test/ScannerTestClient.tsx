"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { ScanBarcode, Trash2 } from "lucide-react";

type ScanRow = {
  code: string;
  valid: boolean;
  reason: string;
  length: number;
  elapsedMs: number | null;
  endedWithEnter: boolean;
  at: string;
};

const cartonPattern = /^GM-C-\d{4}-\d{6}$/;

function validateCode(code: string) {
  if (!code) return { valid: false, reason: "Nincs beolvasott érték." };
  if (!/^[A-Z0-9-]+$/.test(code)) return { valid: false, reason: "Csak nagybetű, szám és kötőjel lehet a kartonkódban." };
  if (!cartonPattern.test(code)) return { valid: false, reason: "A várt forma: GM-C-2026-000123." };
  return { valid: true, reason: "A kartonkód formátuma megfelelő." };
}

export function ScannerTestClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const firstKeyAtRef = useRef<number | null>(null);
  const [code, setCode] = useState("");
  const [lastKey, setLastKey] = useState("");
  const [scans, setScans] = useState<ScanRow[]>([]);

  const current = useMemo(() => validateCode(code.trim().toUpperCase()), [code]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function record(endedWithEnter: boolean) {
    const cleanCode = code.trim().toUpperCase();
    const result = validateCode(cleanCode);
    const now = performance.now();
    const elapsedMs = firstKeyAtRef.current === null ? null : Math.round(now - firstKeyAtRef.current);
    setScans((currentRows) => [
      {
        code: cleanCode || "(üres)",
        valid: result.valid,
        reason: endedWithEnter ? result.reason : "Nem Enterrel zárult a beolvasás.",
        length: cleanCode.length,
        elapsedMs,
        endedWithEnter,
        at: new Date().toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      },
      ...currentRows
    ].slice(0, 12));
    setCode("");
    firstKeyAtRef.current = null;
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    record(true);
  }

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    setLastKey(event.key === "Enter" ? "Enter" : event.key.length === 1 ? event.key : event.key);
    if (event.key !== "Enter" && firstKeyAtRef.current === null) {
      firstKeyAtRef.current = performance.now();
    }
  }

  function clear() {
    setCode("");
    setScans([]);
    firstKeyAtRef.current = null;
    inputRef.current?.focus();
  }

  return (
    <section className="grid grid-2">
      <div className="card stack">
        <form className="scan-card scanner-test-card" onSubmit={submit}>
          <div>
            <h2>Beolvasás</h2>
            <p className="text-muted">A Zebra LI3678-SR USB HID módban úgy gépel, mint egy billentyűzet.</p>
          </div>
          <label className={`scan-input-label ${current.valid ? "is-valid" : code ? "is-invalid" : ""}`}>
            <ScanBarcode size={24} />
            <input
              ref={inputRef}
              value={code}
              onBlur={() => window.setTimeout(() => inputRef.current?.focus(), 150)}
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={keyDown}
              placeholder="GM-C-2026-000123"
              autoComplete="off"
            />
          </label>
          <button className="button button-primary" disabled={!code.trim()}>Teszt rögzítése</button>
        </form>

        <div className={current.valid ? "alert alert-success" : code ? "alert alert-warning" : "alert"}>
          <strong>{current.valid ? "Formátum rendben." : "Várakozás beolvasásra."}</strong>
          <div>{code ? current.reason : "Csippants egy kartoncímkét. Ha a scanner Entert küld, a sor automatikusan bekerül az eredmények közé."}</div>
        </div>

        <div className="scanner-facts">
          <div><span>Utolsó billentyű</span><strong>{lastKey || "—"}</strong></div>
          <div><span>Aktuális hossz</span><strong>{code.trim().length}</strong></div>
          <div><span>Elvárt forma</span><strong className="mono">GM-C-YYYY-000000</strong></div>
        </div>

        <button className="button" type="button" onClick={clear}><Trash2 size={16} /> Törlés</button>
      </div>

      <div className="card stack">
        <h2>Eredmények</h2>
        <div className="event-list">
          {scans.map((scan, index) => (
            <div className="event-row" key={`${scan.at}-${scan.code}-${index}`}>
              <div>
                <strong className="mono">{scan.code}</strong>
                <div className={scan.valid && scan.endedWithEnter ? "text-success" : "text-warning"}>{scan.reason}</div>
                <div className="text-muted">{scan.length} karakter · {scan.elapsedMs === null ? "nincs időmérés" : `${scan.elapsedMs} ms`} · {scan.endedWithEnter ? "Enter OK" : "Enter hiányzik"}</div>
              </div>
              <div className="event-meta"><strong>{scan.at}</strong></div>
            </div>
          ))}
          {!scans.length ? <div className="empty-inline">Még nincs teszt beolvasás ebben a munkamenetben.</div> : null}
        </div>
      </div>
    </section>
  );
}
