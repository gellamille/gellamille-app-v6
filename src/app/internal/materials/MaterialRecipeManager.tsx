"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Material = {
  id: number;
  name: string;
  code: string;
};

type Unit = {
  id: number;
  code: string;
  name: string;
};

type Product = {
  id: number;
  name: string | null;
  sku: string | null;
  flavor_name: string;
  size_ml: number;
};

type ComponentRow = {
  materialId: string;
  quantity: string;
  unitId: string;
};

const materialCategories = [
  ["ingredient", "Alapanyag"],
  ["packaging", "Csomagolóanyag"],
  ["container", "Doboz"],
  ["lid", "Tető"],
  ["label", "Címke"],
  ["auxiliary", "Segédanyag"]
] as const;

const nutritionFields = [
  ["caloriesKcal", "Energia kcal / 100 g"],
  ["fatG", "Zsír g / 100 g"],
  ["saturatedFatG", "Telített zsír g / 100 g"],
  ["carbohydrateG", "Szénhidrát g / 100 g"],
  ["sugarsG", "Cukor g / 100 g"],
  ["proteinG", "Fehérje g / 100 g"],
  ["saltG", "Só g / 100 g"]
] as const;

export function MaterialRecipeManager({
  products,
  materials,
  units,
  recipeUnits,
  canWrite
}: {
  products: Product[];
  materials: Material[];
  units: Unit[];
  recipeUnits: Unit[];
  canWrite: boolean;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [materialOpen, setMaterialOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [components, setComponents] = useState<ComponentRow[]>([
    { materialId: materials[0]?.id ? String(materials[0].id) : "", quantity: "", unitId: recipeUnits[0]?.id ? String(recipeUnits[0].id) : "" }
  ]);

  function setComponent(index: number, patch: Partial<ComponentRow>) {
    setComponents((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row));
  }

  async function createMaterial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: String(fd.get("code") || ""),
        name: String(fd.get("name") || ""),
        category: String(fd.get("category") || "ingredient"),
        baseUnitId: Number(fd.get("baseUnitId")),
        allergenInfo: String(fd.get("allergenInfo") || ""),
        supplierName: String(fd.get("supplierName") || ""),
        minimumStockQuantity: Number(fd.get("minimumStockQuantity") || 0),
        currentUnitCostHuf: Number(fd.get("currentUnitCostHuf") || 0)
      })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "Az alapanyag mentése sikertelen.");
      return;
    }
    form.reset();
    setMaterialOpen(false);
    setMessage("Az alapanyag létrejött.");
    router.refresh();
  }

  async function createRecipeVersion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: Number(fd.get("productId")),
        outputUnits: Number(fd.get("outputUnits") || 1),
        status: String(fd.get("status") || "draft"),
        effectiveFrom: String(fd.get("effectiveFrom") || ""),
        components: components.map((component) => ({
          materialId: Number(component.materialId),
          quantity: Number(component.quantity),
          unitId: Number(component.unitId)
        })),
        nutrition: Object.fromEntries(nutritionFields.map(([key]) => [key, Number(fd.get(key) || 0)]))
      })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "A receptúra mentése sikertelen.");
      return;
    }
    setMessage("A receptúra verzió mentve.");
    router.refresh();
  }

  if (!canWrite) return null;

  return (
    <section className="stack section-gap">
      {message ? <div className={message.includes("sikertelen") ? "alert alert-danger" : "alert alert-success"}>{message}</div> : null}
      <div className="inline">
        <button className="button button-primary" type="button" onClick={() => setMaterialOpen(true)}>Új alapanyag</button>
      </div>

      {materialOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="new-material-title">
            <div className="card-title-row">
              <h2 id="new-material-title">Új alapanyag</h2>
              <button className="button button-small" type="button" onClick={() => setMaterialOpen(false)}>Bezárás</button>
            </div>
            <form className="stack" onSubmit={createMaterial}>
              <div className="form-grid">
                <label>Név<input name="name" required /></label>
                <label>Kód<input name="code" placeholder="Automatikus, ha üres" /></label>
                <label>Kategória<select name="category">{materialCategories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label>Alap egység<select name="baseUnitId">{units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name} ({unit.code})</option>)}</select></label>
                <label>Minimum készlet<input name="minimumStockQuantity" type="number" min="0" step="0.001" defaultValue="0" /></label>
                <label>Egységköltség Ft<input name="currentUnitCostHuf" type="number" min="0" step="0.01" defaultValue="0" /></label>
                <label>Beszállító<input name="supplierName" /></label>
                <label>Allergén információ<input name="allergenInfo" /></label>
              </div>
              <button className="button button-primary" disabled={loading}>Alapanyag létrehozása</button>
            </form>
          </div>
        </div>
      ) : null}

      <form className="card stack" onSubmit={createRecipeVersion}>
        <h2>Receptúra verzió mentése</h2>
        <div className="form-grid">
          <label>Termék<select name="productId" required>{products.map((product) => <option key={product.id} value={product.id}>{product.name ?? product.flavor_name} · {product.size_ml} ml</option>)}</select></label>
          <label>Kimenet darabszám<input name="outputUnits" type="number" min="1" defaultValue="1" required /></label>
          <label>Állapot<select name="status" defaultValue="active"><option value="active">Aktív</option><option value="draft">Piszkozat</option></select></label>
          <label>Érvényes ettől<input name="effectiveFrom" type="date" /></label>
        </div>

        <div className="stack">
          <div className="card-title-row">
            <h3>Összetevők</h3>
            <button
              className="button button-small"
              type="button"
              onClick={() => setComponents((current) => [...current, { materialId: materials[0]?.id ? String(materials[0].id) : "", quantity: "", unitId: recipeUnits[0]?.id ? String(recipeUnits[0].id) : "" }])}
              disabled={!materials.length || !recipeUnits.length}
            >
              Sor hozzáadása
            </button>
          </div>
          {components.map((component, index) => (
            <div className="recipe-row" key={index}>
              <label>Alapanyag<select value={component.materialId} onChange={(event) => setComponent(index, { materialId: event.target.value })} required>{materials.map((material) => <option key={material.id} value={material.id}>{material.name}</option>)}</select></label>
              <label>Mennyiség<input value={component.quantity} onChange={(event) => setComponent(index, { quantity: event.target.value })} type="number" min="0.001" step="0.001" required /></label>
              <label>Egység<select value={component.unitId} onChange={(event) => setComponent(index, { unitId: event.target.value })} required>{recipeUnits.map((unit) => <option key={unit.id} value={unit.id}>{unit.code}</option>)}</select></label>
              <button className="button button-small" type="button" onClick={() => setComponents((current) => current.filter((_, rowIndex) => rowIndex !== index))} disabled={components.length === 1}>Törlés</button>
            </div>
          ))}
        </div>

        <div>
          <h3>Tápértéktábla</h3>
          <div className="form-grid">
            {nutritionFields.map(([key, label]) => (
              <label key={key}>{label}<input name={key} type="number" min="0" step="0.001" defaultValue="0" /></label>
            ))}
          </div>
        </div>
        <button className="button button-primary" disabled={loading || !products.length || !materials.length}>Receptúra mentése</button>
      </form>
    </section>
  );
}
