"use client";

import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { dateHU, money } from "@/lib/format";

type PartnerRow = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  active: boolean;
  payment_terms_days: number;
  default_payment_method: string | null;
  minimum_order_cartons: number;
  credit_limit_huf: number | string | null;
  overdue_policy: string;
  last_order_at: string | null;
  total_revenue: number | string;
  outstanding: number | string;
  delivery_days: string | null;
};

export function PartnerDirectory({ partners }: { partners: PartnerRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return partners.filter((partner) => {
      const matchesStatus = status === "all" || (status === "active" ? partner.active : !partner.active);
      const haystack = `${partner.name} ${partner.email ?? ""} ${partner.phone ?? ""}`.toLowerCase();
      return matchesStatus && (!needle || haystack.includes(needle));
    });
  }, [partners, query, status]);

  return (
    <section className="stack">
      <div className="filter-bar">
        <label>Keresés<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Név, e-mail vagy telefon" /></label>
        <label>Állapot<select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">Összes</option>
          <option value="active">Aktív</option>
          <option value="inactive">Inaktív</option>
        </select></label>
      </div>
      <div className="table-wrap"><table><thead><tr><th>Partner</th><th>Kapcsolat</th><th>Szállítás</th><th>Fizetés</th><th>Minimum</th><th>Hitelkeret</th><th>Lejárt kezelés</th><th>Utolsó rendelés</th><th>Forgalom</th><th>Követelés</th><th>Állapot</th></tr></thead><tbody>
        {filtered.map(p => <tr key={p.id}><td><strong>{p.name}</strong></td><td>{p.email ?? "—"}<div>{p.phone ?? ""}</div></td><td>{p.delivery_days ?? "—"}</td><td>{p.default_payment_method ?? "—"} · {p.payment_terms_days} nap</td><td>{p.minimum_order_cartons} karton</td><td>{money(p.credit_limit_huf)}</td><td>{p.overdue_policy === "block" ? "Blokkolás" : "Figyelmeztetés"}</td><td>{dateHU(p.last_order_at)}</td><td>{money(p.total_revenue)}</td><td>{money(p.outstanding)}</td><td><StatusBadge value={p.active ? "active" : "cancelled"} label={p.active ? "Aktív" : "Inaktív"} /></td></tr>)}
        {!filtered.length ? <tr><td colSpan={11}>Nincs a szűrésnek megfelelő partner.</td></tr> : null}
      </tbody></table></div>
    </section>
  );
}
