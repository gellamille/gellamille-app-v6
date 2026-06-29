"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";

type Cart = Record<string, number>;
type ProductImage = { src: string; alt: string };

const productImages: Array<ProductImage & { matches: string[] }> = [
  { src: "/products/too-much-chocolate.webp", alt: "Too Much Chocolate", matches: ["too much chocolate"] },
  { src: "/products/dubai-chocolate.webp", alt: "Dubai Chocolate", matches: ["dubai chocolate", "dubai"] },
  { src: "/products/frutta-di-pistacchio.webp", alt: "Frutta di Pistacchio", matches: ["frutta di pistacchio", "pistacchio"] },
  { src: "/products/mara-mango.webp", alt: "Mara Mango", matches: ["mara mango", "mango"] },
  { src: "/products/brown-berry.webp", alt: "Brown Berry", matches: ["brown berry"] },
  { src: "/products/cheesecake-crumble.webp", alt: "Cheesecake Crumble", matches: ["cheesecake crumble", "cheesecake"] },
  { src: "/products/chunky-p-nut.webp", alt: "Chunky P-Nut", matches: ["chunky p nut", "chunky pnut", "chunky peanut", "chunky"] },
  { src: "/products/the-cherry-one.webp", alt: "The Cherry One", matches: ["the cherry one", "cherry"] }
];

function searchable(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function imageForProduct(product: any): ProductImage | null {
  const text = searchable(`${product.name ?? ""} ${product.code ?? ""} ${product.sku ?? ""}`);
  const match = productImages.find((image) => image.matches.some((term) => text.includes(searchable(term))));
  return match ? { src: match.src, alt: match.alt } : null;
}

function notifyCartUpdated() {
  window.dispatchEvent(new Event("gellamille-cart-updated"));
}

export function Catalog({ products }: { products: any[] }) {
  const [cart, setCart] = useState<Cart>({});
  const [saved, setSaved] = useState("");
  const groups = [
    {
      title: "150 ml termékek",
      description: "Kisebb poharas kiszerelés, jellemzően nagyobb kartonmennyiséggel.",
      tone: "small",
      items: products.filter((product) => Number(product.size_ml) === 150)
    },
    {
      title: "300 ml termékek",
      description: "Nagyobb poharas kiszerelés, külön rendelési blokkban kezelve.",
      tone: "large",
      items: products.filter((product) => Number(product.size_ml) === 300)
    },
    {
      title: "Egyéb kiszerelés",
      description: "Minden olyan termék, amely nem 150 ml vagy 300 ml.",
      tone: "other",
      items: products.filter((product) => ![150, 300].includes(Number(product.size_ml)))
    }
  ].filter((group) => group.items.length > 0);

  useEffect(() => {
    const raw = localStorage.getItem("gellamille-cart");
    if (!raw) return;
    try {
      setCart(JSON.parse(raw));
    } catch {
      localStorage.removeItem("gellamille-cart");
    }
  }, []);

  function add(product: any, cartons: number) {
    if (cartons < 1) return;
    const productId = Number(product.id);
    const currentCartons = Number(cart[String(productId)] ?? 0);
    const requestedUnits = (currentCartons + cartons) * Number(product.units_per_carton ?? 0);
    const availableUnits = Number(product.available_units ?? 0);
    if (availableUnits <= 0) {
      window.alert("Ez a termék jelenleg nincs készleten.");
      return;
    }
    if (requestedUnits > availableUnits) {
      window.alert("Ebből a termékből jelenleg nincs elég készlet a választott mennyiséghez.");
      return;
    }
    const next = { ...cart, [productId]: (cart[String(productId)] ?? 0) + cartons };
    setCart(next);
    localStorage.setItem("gellamille-cart", JSON.stringify(next));
    notifyCartUpdated();
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
      <div className="catalog-size-sections">
        {groups.map((group) => (
          <section className={`catalog-size-section catalog-size-section-${group.tone}`} key={group.title}>
            <div className="catalog-size-header">
              <div>
                <span className="catalog-size-kicker">{group.title.includes("150") ? "150 ml" : group.title.includes("300") ? "300 ml" : "Egyéb"}</span>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
              </div>
              <strong>{group.items.length} termék</strong>
            </div>
            <div className="product-grid section-gap-small">
            {group.items.map(p => <Product key={p.id} product={p} add={add} />)}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function Product({ product, add }: { product: any; add: (product:any, cartons:number)=>void }) {
  const [qty, setQty] = useState(1);
  const cartonNet = product.net_unit_price_huf * product.units_per_carton;
  const image = imageForProduct(product);
  return (
    <article className="product-card">
      {image ? (
        <div className="product-image-frame">
          <Image className="product-image" src={image.src} alt={image.alt} width={1000} height={1000} sizes="(max-width: 560px) 92vw, (max-width: 1150px) 44vw, 280px" />
        </div>
      ) : null}
      <h3>{product.name}</h3>
      <div className="product-meta">{product.size_ml} ml · {product.code}</div>
      <div className="product-price">{money(product.net_unit_price_huf)} <small>+ áfa / db</small></div>
      <div className="product-carton">{product.units_per_carton} db / karton · {money(cartonNet)} + áfa / karton</div>
      <div className="quantity-row">
        <label>Karton<input type="number" min="1" value={qty} onChange={(e)=>setQty(Number(e.target.value))} /></label>
        <button className="button button-primary" disabled={qty < 1} onClick={()=>add(product,qty)}>Kosárba</button>
      </div>
    </article>
  );
}
