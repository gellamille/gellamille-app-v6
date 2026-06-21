"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { money } from "@/lib/format";

type Cart = Record<string, number>;

export function Catalog({ products }: { products: any[] }) {
  const [cart, setCart] = useState<Cart>({});
  const [saved, setSaved] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("gellamille-cart");
    if (!raw) return;
    try {
      setCart(JSON.parse(raw));
    } catch {
      localStorage.removeItem("gellamille-cart");
    }
  }, []);

  function add(productId: number, cartons: number) {
    if (cartons < 1) return;
    const next = { ...cart, [productId]: (cart[String(productId)] ?? 0) + cartons };
    setCart(next);
    localStorage.setItem("gellamille-cart", JSON.stringify(next));
    setSaved("Kosár frissítve.");
    setTimeout(() => setSaved(""), 1500);
  }

  return (
    <>
      {saved ? <div className="alert alert-success">{saved}</div> : null}
      {Object.values(cart).some((quantity) => quantity > 0) ? (
        <div className="card-title-row">
          <h2>Kosárban: {Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)} karton</h2>
          <Link href="/partner/cart" className="button button-primary">Rendelés véglegesítése</Link>
        </div>
      ) : null}
      <div className="product-grid section-gap">
        {products.map(p => <Product key={p.id} product={p} add={add} />)}
      </div>
    </>
  );
}

function Product({ product, add }: { product: any; add: (id:number, cartons:number)=>void }) {
  const [qty, setQty] = useState(1);
  const cartonNet = product.net_unit_price_huf * product.units_per_carton;
  return (
    <article className="product-card">
      <h3>{product.name}</h3>
      <div className="product-meta">{product.size_ml} ml · {product.code}</div>
      <div className="product-price">{money(product.net_unit_price_huf)} <small>+ áfa / db</small></div>
      <div className="product-carton">{product.units_per_carton} db / karton · {money(cartonNet)} + áfa / karton</div>
      <div className="product-carton">Szabad készlet: {product.available_units} db</div>
      <div className="quantity-row">
        <label>Karton<input type="number" min="1" value={qty} onChange={(e)=>setQty(Number(e.target.value))} /></label>
        <button className="button button-primary" disabled={qty < 1} onClick={()=>add(product.id,qty)}>Kosárba</button>
      </div>
    </article>
  );
}
