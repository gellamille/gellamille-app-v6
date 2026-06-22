"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  sku: string | null;
  flavor_code: string;
  flavor_name: string;
  name: string | null;
  size_ml: number;
  units_per_carton: number;
  net_unit_price_huf: number;
  purchase_unit_price_huf: number;
  minimum_stock_units: number;
  status: string;
  active: boolean;
};

const statuses = [
  ["active", "Aktív"],
  ["seasonal", "Szezonális"],
  ["temporarily_unavailable", "Átmenetileg nem elérhető"],
  ["phasing_out", "Kivezetés alatt"],
  ["discontinued", "Megszűnt"]
] as const;

export function ProductEditor({ products, canWrite }: { products: Product[]; canWrite: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>, productId: number) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setLoadingId(productId);
    setMessage("");
    const response = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(fd.get("name") ?? ""),
        unitsPerCarton: Number(fd.get("unitsPerCarton")),
        netUnitPriceHuf: Number(fd.get("netUnitPriceHuf")),
        purchaseUnitPriceHuf: Number(fd.get("purchaseUnitPriceHuf")),
        minimumStockUnits: Number(fd.get("minimumStockUnits")),
        status: String(fd.get("status")),
        active: fd.get("active") === "on"
      })
    });
    const data = await response.json();
    setLoadingId(null);
    if (!response.ok) {
      setMessage(data.error ?? "A termék mentése sikertelen.");
      return;
    }
    setMessage("A termék módosítva. A változás csak jövőbeli rendelésekre érvényes.");
    router.refresh();
  }

  return (
    <div className="stack">
      {message ? <div className={message.includes("módosítva") ? "alert alert-success" : "alert alert-danger"}>{message}</div> : null}
      <div className="table-wrap"><table><thead><tr><th>SKU</th><th>Terméknév</th><th>Méret</th><th>Karton</th><th>Nettó átadási ár</th><th>Nettó előállítási ár</th><th>Minimum készlet</th><th>Állapot</th><th>Aktív</th><th>Művelet</th></tr></thead><tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td className="mono">{product.sku ?? `GM-${product.flavor_code}-${product.size_ml}`}</td>
            <td>
              {canWrite ? <form id={`product-${product.id}`} onSubmit={(event) => submit(event, product.id)} /> : null}
              {canWrite ? <input form={`product-${product.id}`} name="name" defaultValue={product.name ?? product.flavor_name} required /> : product.name ?? product.flavor_name}
            </td>
            <td>{product.size_ml} ml</td>
            <td>{canWrite ? <input form={`product-${product.id}`} name="unitsPerCarton" type="number" min="1" defaultValue={product.units_per_carton} required /> : `${product.units_per_carton} db`}</td>
            <td>{canWrite ? <input form={`product-${product.id}`} name="netUnitPriceHuf" type="number" min="1" defaultValue={product.net_unit_price_huf} required /> : product.net_unit_price_huf}</td>
            <td>{canWrite ? <input form={`product-${product.id}`} name="purchaseUnitPriceHuf" type="number" min="0" defaultValue={product.purchase_unit_price_huf} required /> : product.purchase_unit_price_huf}</td>
            <td>{canWrite ? <input form={`product-${product.id}`} name="minimumStockUnits" type="number" min="0" defaultValue={product.minimum_stock_units} required /> : product.minimum_stock_units}</td>
            <td>{canWrite ? <select form={`product-${product.id}`} name="status" defaultValue={product.status}>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select> : product.status}</td>
            <td>{canWrite ? <input form={`product-${product.id}`} type="checkbox" name="active" defaultChecked={product.active} /> : product.active ? "Igen" : "Nem"}</td>
            <td>{canWrite ? <button form={`product-${product.id}`} className="button button-small" disabled={loadingId === product.id}>Mentés</button> : "—"}</td>
          </tr>
        ))}
      </tbody></table></div>
    </div>
  );
}
