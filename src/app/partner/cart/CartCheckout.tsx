"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { money } from "@/lib/format";

const weekdayLabels: Record<number, string> = {
  1: "Hétfő",
  2: "Kedd",
  3: "Szerda",
  4: "Csütörtök",
  5: "Péntek",
  6: "Szombat",
  7: "Vasárnap"
};

function isoWeekday(date: Date) {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

function localIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isBeforeCutoff(value: string, cutoffDays: number | null | undefined) {
  const latestOrderDate = new Date(`${value}T12:00:00`);
  latestOrderDate.setDate(latestOrderDate.getDate() - Number(cutoffDays ?? 0));
  latestOrderDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today <= latestOrderDate;
}

function deliveryDateOptions(deliveryDays: any[]) {
  const policiesByWeekday = new Map(deliveryDays.map((day) => [Number(day.weekday), day]));
  const options: Array<{ value: string; label: string }> = [];
  const date = new Date();
  date.setHours(12, 0, 0, 0);

  for (let index = 0; index < 84; index += 1) {
    const weekday = isoWeekday(date);
    const policy = policiesByWeekday.get(weekday);
    const value = localIsoDate(date);
    if (policy && isBeforeCutoff(value, policy.cutoff_business_days)) {
      options.push({ value, label: `${value} · ${weekdayLabels[weekday]}` });
    }
    date.setDate(date.getDate() + 1);
  }

  return options;
}

function notifyCartUpdated() {
  window.dispatchEvent(new Event("gellamille-cart-updated"));
}

export function CartCheckout({ products, addresses, deliveryDays, minimum, defaultPayment, blockedReason }: any) {
  const router = useRouter();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [addressId, setAddressId] = useState(addresses[0]?.id ? String(addresses[0].id) : "");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(defaultPayment);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("gellamille-cart");
    if (!raw) return;
    try {
      setCart(JSON.parse(raw));
    } catch {
      localStorage.removeItem("gellamille-cart");
    }
  }, []);

  const rows = useMemo(() => products.filter((p:any)=>Number(cart[String(p.id)]||0)>0).map((p:any)=>({...p,cartons:Number(cart[String(p.id)])})), [cart,products]);
  const deliveryOptions = useMemo(() => deliveryDateOptions(deliveryDays), [deliveryDays]);
  const totalCartons = rows.reduce((s:number,r:any)=>s+r.cartons,0);
  const net = rows.reduce((s:number,r:any)=>s+r.cartons*r.units_per_carton*r.net_unit_price_huf,0);
  const vat = rows.reduce((s:number,r:any)=>s+Math.round(r.cartons*r.units_per_carton*r.net_unit_price_huf*r.vat_rate_bps/10000),0);

  function stockMessage(product: any, cartons: number) {
    if (cartons < 1) return "";
    const requestedUnits = cartons * Number(product.units_per_carton ?? 0);
    const availableUnits = Number(product.available_units ?? 0);
    if (availableUnits <= 0) return `${product.name} jelenleg nincs készleten.`;
    if (requestedUnits > availableUnits) return `${product.name} jelenleg nincs elég készleten a választott mennyiséghez.`;
    return "";
  }

  function update(id:number, value:number) {
    const cartons = Math.max(0, value);
    const product = products.find((p:any) => Number(p.id) === Number(id));
    const message = product ? stockMessage(product, cartons) : "";
    if (message) {
      window.alert(message);
      return;
    }
    const next = {...cart,[id]:cartons};
    setCart(next); localStorage.setItem("gellamille-cart",JSON.stringify(next));
    notifyCartUpdated();
  }

  async function submit() {
    setError("");
    if (blockedReason) return setError(blockedReason);
    const stockIssue = rows.map((row:any) => stockMessage(row, Number(row.cartons))).find(Boolean);
    if (stockIssue) {
      window.alert(stockIssue);
      return setError(stockIssue);
    }
    const weekday = deliveryDate ? new Date(`${deliveryDate}T12:00:00`).getDay() || 7 : 0;
    const deliveryPolicy = deliveryDays.find((d:any)=>d.weekday===weekday);
    if (deliveryDays.length && !deliveryPolicy) return setError("A kiválasztott nap nem engedélyezett szállítási nap.");
    if (deliveryPolicy?.cutoff_business_days) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const latestOrderDate = new Date(`${deliveryDate}T00:00:00`);
      latestOrderDate.setDate(latestOrderDate.getDate() - Number(deliveryPolicy.cutoff_business_days));
      if (today > latestOrderDate) return setError(`Erre a szállítási napra a rendelési zárás már lejárt (${deliveryPolicy.cutoff_business_days} naptári nap).`);
    }
    const response = await fetch("/api/orders", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        requestedDeliveryDate:deliveryDate,
        paymentMethod,
        deliveryAddressId:addressId ? Number(addressId) : undefined,
        note,
        submit:true,
        items:rows.map((r:any)=>({productId:Number(r.id),cartons:Number(r.cartons)}))
      })
    });
    const data=await response.json();
    if(!response.ok) {
      const validationError = Array.isArray(data.error) || (typeof data.error === "string" && data.error.trim().startsWith("["));
      return setError(validationError ? "A kosár adatai hibásak. Frissítsd az oldalt, majd próbáld újra." : data.error??"A rendelés beküldése sikertelen.");
    }
    localStorage.removeItem("gellamille-cart");
    notifyCartUpdated();
    router.push(`/partner/orders/${data.id}`); router.refresh();
  }

  return (
    <div className="stack">
      <div className="table-wrap"><table><thead><tr><th>Termék</th><th>Karton</th><th>Darab</th><th>Nettó</th></tr></thead><tbody>
        {rows.map((r:any)=><tr key={r.id}><td>{r.name} · {r.size_ml} ml</td><td><input type="number" min="0" value={r.cartons} onChange={(e)=>update(r.id,Number(e.target.value))} /></td><td>{r.cartons*r.units_per_carton}</td><td>{money(r.cartons*r.units_per_carton*r.net_unit_price_huf)}</td></tr>)}
        {!rows.length?<tr><td colSpan={4}>A kosár üres.</td></tr>:null}
      </tbody></table></div>
      <section className="grid grid-2">
        <div className="card form-grid">
          <label className="full">Szállítási cím<select value={addressId} onChange={e=>setAddressId(e.target.value)} disabled={!addresses.length}>{addresses.length ? addresses.map((a:any)=><option key={a.id} value={a.id}>{a.name} – {a.postal_code} {a.city}, {a.address_line1}</option>) : <option value="">Nincs külön cím rögzítve</option>}</select></label>
          <label>Kért szállítási nap<select value={deliveryDate} onChange={e=>setDeliveryDate(e.target.value)} disabled={!deliveryOptions.length}><option value="">{deliveryOptions.length ? "Válassz szállítási napot" : "Nincs rendelhető nap"}</option>{deliveryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <label>Fizetési mód<select value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}><option value="bank_transfer">Átutalás</option><option value="cash_on_delivery">Készpénz átadáskor</option><option value="card_on_delivery">Kártya átadáskor</option></select></label>
          <label className="full">Megjegyzés<textarea value={note} onChange={e=>setNote(e.target.value)} /></label>
        </div>
        <div className="card">
          <h2>Összesítés</h2>
          <dl className="kv"><dt>Karton</dt><dd>{totalCartons}</dd><dt>Nettó</dt><dd>{money(net)}</dd><dt>Áfa</dt><dd>{money(vat)}</dd><dt>Bruttó</dt><dd>{money(net+vat)}</dd></dl>
          {totalCartons<minimum?<div className="alert alert-warning section-gap">Még {minimum-totalCartons} karton hiányzik a minimumhoz.</div>:null}
          {!deliveryOptions.length?<div className="alert alert-warning section-gap">Ehhez a partnerhez nincs aktív, még rendelhető szállítási nap beállítva.</div>:null}
          {blockedReason?<div className="alert alert-danger section-gap">{blockedReason} A kosarat összeállíthatod, de beküldeni most nem lehet.</div>:null}
          {error?<div className="alert alert-danger section-gap">{error}</div>:null}
          <button className="button button-primary section-gap" disabled={!!blockedReason||!rows.length||totalCartons<minimum||!deliveryDate||(addresses.length>0&&!addressId)} onClick={submit}>Rendelés beküldése</button>
        </div>
      </section>
    </div>
  );
}
