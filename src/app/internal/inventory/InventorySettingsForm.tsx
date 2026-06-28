"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Settings = {
  low_surplus_units: number;
  medium_surplus_units: number;
  high_surplus_units: number;
  overstock_surplus_units: number;
};

export function InventorySettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/inventory/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lowSurplusUnits: Number(fd.get("lowSurplusUnits")),
        mediumSurplusUnits: Number(fd.get("mediumSurplusUnits")),
        highSurplusUnits: Number(fd.get("highSurplusUnits")),
        overstockSurplusUnits: Number(fd.get("overstockSurplusUnits"))
      })
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) return setMessage(data.error ?? "A készletbeállítások mentése sikertelen.");
    setMessage("A készletbeállítások mentve.");
    router.refresh();
  }

  return (
    <details className="card section-gap">
      <summary className="details-summary">Készletbeállítások</summary>
      <form className="form-grid section-gap-small" onSubmit={submit}>
        <label>Alacsony jelzés + db<input name="lowSurplusUnits" type="number" min="0" defaultValue={settings.low_surplus_units} required /></label>
        <label>Közepes jelzés + db<input name="mediumSurplusUnits" type="number" min="0" defaultValue={settings.medium_surplus_units} required /></label>
        <label>Magas jelzés + db<input name="highSurplusUnits" type="number" min="0" defaultValue={settings.high_surplus_units} required /></label>
        <label>Túlteljesített jelzés + db<input name="overstockSurplusUnits" type="number" min="0" defaultValue={settings.overstock_surplus_units} required /></label>
        {message ? <div className={message.includes("mentve") ? "alert alert-success full" : "alert alert-danger full"}>{message}</div> : null}
        <div className="full"><button className="button button-primary" disabled={loading}>{loading ? "Mentés..." : "Készletbeállítások mentése"}</button></div>
      </form>
    </details>
  );
}
