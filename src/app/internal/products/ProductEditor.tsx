"use client";

import { useEffect, useMemo, useState } from "react";
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

type Draft = {
  name: string;
  unitsPerCarton: number;
  netUnitPriceHuf: number;
  purchaseUnitPriceHuf: number;
  minimumStockUnits: number;
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

function draftFromProduct(product: Product): Draft {
  return {
    name: product.name ?? product.flavor_name,
    unitsPerCarton: Number(product.units_per_carton),
    netUnitPriceHuf: Number(product.net_unit_price_huf),
    purchaseUnitPriceHuf: Number(product.purchase_unit_price_huf),
    minimumStockUnits: Number(product.minimum_stock_units),
    status: product.status,
    active: product.active
  };
}

function numberFromInput(value: string, fallback: number) {
  if (value.trim() === "") return fallback;
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

export function ProductEditor({ products, canWrite }: { products: Product[]; canWrite: boolean }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());
  const [dirtyIds, setDirtyIds] = useState<Set<number>>(new Set());
  const [drafts, setDrafts] = useState<Record<number, Draft>>(() => Object.fromEntries(products.map((product) => [product.id, draftFromProduct(product)])));
  const dirtyCount = dirtyIds.size;
  const savingAll = useMemo(() => dirtyCount > 0 && [...dirtyIds].every((id) => loadingIds.has(id)), [dirtyCount, dirtyIds, loadingIds]);

  useEffect(() => {
    setDrafts((current) => {
      const productDrafts = Object.fromEntries(products.map((product) => [product.id, draftFromProduct(product)]));
      const merged = { ...productDrafts };
      for (const id of dirtyIds) {
        if (current[id]) merged[id] = current[id];
      }
      return merged;
    });
  }, [products, dirtyIds]);

  function updateDraft(productId: number, patch: Partial<Draft>) {
    setDrafts((current) => ({ ...current, [productId]: { ...current[productId], ...patch } }));
    setDirtyIds((current) => new Set(current).add(productId));
  }

  async function saveProduct(productId: number) {
    const draft = drafts[productId];
    setLoadingIds((current) => new Set(current).add(productId));
    setMessage("");
    const response = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    const data = await response.json();
    setLoadingIds((current) => {
      const next = new Set(current);
      next.delete(productId);
      return next;
    });
    if (!response.ok) throw new Error(data.error ?? "A termék mentése sikertelen.");
    setDrafts((current) => ({ ...current, [productId]: draftFromProduct(data) }));
    setDirtyIds((current) => {
      const next = new Set(current);
      next.delete(productId);
      return next;
    });
  }

  async function saveOne(productId: number) {
    try {
      await saveProduct(productId);
      setMessage("A termék módosítva. A változás csak jövőbeli rendelésekre érvényes.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "A termék mentése sikertelen.");
    }
  }

  async function saveAll() {
    const ids = [...dirtyIds];
    if (!ids.length) return;
    try {
      for (const id of ids) await saveProduct(id);
      setMessage(`${ids.length} termék módosítása mentve. A változások csak jövőbeli rendelésekre érvényesek.`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "A termékek mentése sikertelen.");
    }
  }

  return (
    <div className="stack">
      {message ? <div className={message.includes("sikertelen") ? "alert alert-danger" : "alert alert-success"}>{message}</div> : null}
      {canWrite ? (
        <div className="card-title-row">
          <div className="text-muted">{dirtyCount ? `${dirtyCount} nem mentett termékmódosítás` : "Nincs nem mentett módosítás"}</div>
          <button className="button button-primary" disabled={!dirtyCount || savingAll} onClick={saveAll}>Minden módosítás mentése</button>
        </div>
      ) : null}
      <div className="table-wrap"><table><thead><tr><th>SKU</th><th>Terméknév</th><th>Méret</th><th>Karton</th><th>Nettó átadási ár</th><th>Nettó előállítási ár</th><th>Minimum készlet</th><th>Állapot</th><th>Aktív</th><th>Művelet</th></tr></thead><tbody>
        {products.map((product) => {
          const draft = drafts[product.id] ?? draftFromProduct(product);
          const loading = loadingIds.has(product.id);
          const dirty = dirtyIds.has(product.id);
          return (
            <tr key={product.id}>
              <td className="mono">{product.sku ?? `GM-${product.flavor_code}-${product.size_ml}`}</td>
              <td>{canWrite ? <input value={draft.name} onChange={(event) => updateDraft(product.id, { name: event.target.value })} required /> : draft.name}</td>
              <td>{product.size_ml} ml</td>
              <td>{canWrite ? <input type="number" min="1" value={draft.unitsPerCarton} onChange={(event) => updateDraft(product.id, { unitsPerCarton: numberFromInput(event.target.value, draft.unitsPerCarton) })} required /> : `${draft.unitsPerCarton} db`}</td>
              <td>{canWrite ? <input type="number" min="1" value={draft.netUnitPriceHuf} onChange={(event) => updateDraft(product.id, { netUnitPriceHuf: numberFromInput(event.target.value, draft.netUnitPriceHuf) })} required /> : draft.netUnitPriceHuf}</td>
              <td>{canWrite ? <input type="number" min="0" value={draft.purchaseUnitPriceHuf} onChange={(event) => updateDraft(product.id, { purchaseUnitPriceHuf: numberFromInput(event.target.value, draft.purchaseUnitPriceHuf) })} required /> : draft.purchaseUnitPriceHuf}</td>
              <td>{canWrite ? <input type="number" min="0" value={draft.minimumStockUnits} onChange={(event) => updateDraft(product.id, { minimumStockUnits: numberFromInput(event.target.value, draft.minimumStockUnits) })} required /> : draft.minimumStockUnits}</td>
              <td>{canWrite ? <select value={draft.status} onChange={(event) => updateDraft(product.id, { status: event.target.value })}>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select> : draft.status}</td>
              <td>{canWrite ? <input type="checkbox" checked={draft.active} onChange={(event) => updateDraft(product.id, { active: event.target.checked })} /> : draft.active ? "Igen" : "Nem"}</td>
              <td>{canWrite ? <button className="button button-small" disabled={!dirty || loading} onClick={() => saveOne(product.id)}>{loading ? "Mentés..." : "Mentés"}</button> : "—"}</td>
            </tr>
          );
        })}
      </tbody></table></div>
      {canWrite ? <button className="button button-primary" disabled={!dirtyCount || savingAll} onClick={saveAll}>Minden módosítás mentése</button> : null}
    </div>
  );
}
