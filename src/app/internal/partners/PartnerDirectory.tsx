"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { dateHU, money } from "@/lib/format";
import { huLabel, paymentMethodLabels } from "@/lib/status";

type PartnerRow = {
  id: number | string;
  name: string;
  billing_name: string | null;
  tax_number: string | null;
  shipping_address: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  note: string | null;
  active: boolean;
  payment_terms_days: number;
  default_payment_method: string | null;
  minimum_order_cartons: number;
  credit_limit_huf: number | string | null;
  overdue_policy: string;
  postal_code: string | null;
  city: string | null;
  address_line1: string | null;
  delivery_weekdays: Array<number | string> | null;
  cutoff_business_days: number | string | null;
  last_order_at: string | null;
  total_revenue: number | string;
  outstanding: number | string;
  delivery_days: string | null;
  login_email: string | null;
  password_change_required: boolean | null;
  temporary_password_plain: string | null;
  temporary_password_expires_at: string | null;
  password_changed_at: string | null;
};

const weekdays = [
  [1, "Hétfő"],
  [2, "Kedd"],
  [3, "Szerda"],
  [4, "Csütörtök"],
  [5, "Péntek"],
  [6, "Szombat"],
  [7, "Vasárnap"]
] as const;

function selectedWeekdays(partner: PartnerRow) {
  return new Set((partner.delivery_weekdays ?? []).map((value) => Number(value)));
}

function digitsOnly(value: string, maxLength?: number) {
  const digits = value.replace(/\D/g, "");
  return typeof maxLength === "number" ? digits.slice(0, maxLength) : digits;
}

export function PartnerDirectory({
  partners,
  canWrite,
  canDelete
}: {
  partners: PartnerRow[];
  canWrite: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<PartnerRow | null>(null);
  const [deleting, setDeleting] = useState<PartnerRow | null>(null);
  const [message, setMessage] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState<{ partnerId: number | string; username: string; password: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const hasActions = canWrite || canDelete;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return partners.filter((partner) => {
      const matchesStatus = status === "all" || (status === "active" ? partner.active : !partner.active);
      const haystack = `${partner.name} ${partner.email ?? ""} ${partner.phone ?? ""}`.toLowerCase();
      return matchesStatus && (!needle || haystack.includes(needle));
    });
  }, [partners, query, status]);

  async function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const form = event.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/partners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Number(editing.id),
        name: String(fd.get("name") ?? ""),
        billingName: String(fd.get("billingName") ?? ""),
        taxNumber: String(fd.get("taxNumber") ?? ""),
        contactName: String(fd.get("contactName") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        postalCode: String(fd.get("postalCode") ?? ""),
        city: String(fd.get("city") ?? ""),
        addressLine1: String(fd.get("addressLine1") ?? ""),
        paymentMethod: String(fd.get("paymentMethod") ?? "bank_transfer"),
        paymentTermsDays: Number(fd.get("paymentTermsDays") ?? 0),
        minimumOrderCartons: Number(fd.get("minimumOrderCartons") ?? 1),
        creditLimitHuf: Number(fd.get("creditLimitHuf") ?? 0),
        overduePolicy: String(fd.get("overduePolicy") ?? "warn"),
        deliveryWeekdays: fd.getAll("deliveryWeekdays").map((value) => Number(value)),
        cutoffBusinessDays: Number(fd.get("cutoffBusinessDays") ?? 2),
        active: fd.get("active") === "on",
        note: String(fd.get("note") ?? "")
      })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "A partner mentése sikertelen.");
      return;
    }
    setEditing(null);
    setMessage("A partner módosítva.");
    router.refresh();
  }

  async function submitDelete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!deleting) return;
    const fd = new FormData(event.currentTarget);
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/partners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Number(deleting.id),
        reason: String(fd.get("reason") ?? ""),
        confirm: fd.get("confirm") === "on"
      })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "A partner törlése sikertelen.");
      return;
    }
    setDeleting(null);
    setMessage("A partner archiválva és inaktiválva.");
    router.refresh();
  }

  async function resetPassword(partner: PartnerRow) {
    if (!window.confirm(`Új ideiglenes jelszót generáljunk ehhez a partnerhez: ${partner.name}?`)) return;
    setLoading(true);
    setMessage("");
    setTemporaryPassword(null);
    const response = await fetch("/api/partners", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(partner.id) })
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "Az ideiglenes jelszó újragenerálása sikertelen.");
      return;
    }
    setTemporaryPassword({ partnerId: partner.id, username: data.username ?? partner.login_email ?? partner.email ?? "", password: data.temporaryPassword ?? "" });
    setMessage("Új ideiglenes jelszó generálva.");
    router.refresh();
  }

  return (
    <section className="stack">
      {message ? <div className={message.includes("sikertelen") ? "alert alert-danger" : "alert alert-success"}>{message}</div> : null}
      {temporaryPassword ? <div className="temporary-password"><div><strong>Belépési e-mail:</strong> <span className="mono">{temporaryPassword.username}</span></div><div><strong>Új ideiglenes jelszó:</strong> <span className="mono">{temporaryPassword.password}</span></div><div>8 napig érvényes, vagy amíg a partner saját jelszót nem állít be.</div></div> : null}
      <div className="filter-bar">
        <label>Keresés<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Név, e-mail vagy telefon" /></label>
        <label>Állapot<select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">Összes</option>
          <option value="active">Aktív</option>
          <option value="inactive">Inaktív</option>
        </select></label>
      </div>
      <div className="table-wrap"><table><thead><tr><th>Partner</th><th>Kapcsolat</th><th>Belépés</th><th>Szállítás</th><th>Fizetés</th><th>Minimum</th><th>Hitelkeret</th><th>Lejárt kezelés</th><th>Utolsó rendelés</th><th>Forgalom</th><th>Követelés</th><th>Állapot</th>{hasActions ? <th>Művelet</th> : null}</tr></thead><tbody>
        {filtered.map(p => <tr key={p.id}><td><strong>{p.name}</strong></td><td>{p.email ?? "—"}<div>{p.phone ?? ""}</div></td><td><div>{p.login_email ?? p.email ?? "—"}</div>{p.password_change_required && p.temporary_password_plain ? <div className="temporary-password-inline"><span className="mono">{p.temporary_password_plain}</span><small>Lejár: {dateHU(p.temporary_password_expires_at)}</small></div> : <small className="text-muted">{p.password_changed_at ? `Saját jelszó: ${dateHU(p.password_changed_at)}` : "Nincs aktív ideiglenes jelszó"}</small>}</td><td>{p.delivery_days ?? "—"}</td><td>{huLabel(paymentMethodLabels, p.default_payment_method)} · {p.payment_terms_days} nap</td><td>{p.minimum_order_cartons} karton</td><td>{money(p.credit_limit_huf)}</td><td>{p.overdue_policy === "block" ? "Blokkolás" : "Figyelmeztetés"}</td><td>{dateHU(p.last_order_at)}</td><td>{money(p.total_revenue)}</td><td>{money(p.outstanding)}</td><td><StatusBadge value={p.active ? "active" : "cancelled"} label={p.active ? "Aktív" : "Inaktív"} /></td>{hasActions ? <td><div className="inline">{canWrite ? <button className="button button-small" type="button" onClick={() => setEditing(p)}>Szerkesztés</button> : null}{canWrite ? <button className="button button-small" type="button" disabled={loading} onClick={() => resetPassword(p)}>Új jelszó</button> : null}{canDelete ? <button className="button button-small button-danger" type="button" onClick={() => setDeleting(p)}>Törlés</button> : null}</div></td> : null}</tr>)}
        {!filtered.length ? <tr><td colSpan={hasActions ? 13 : 12}>Nincs a szűrésnek megfelelő partner.</td></tr> : null}
      </tbody></table></div>

      {editing ? <EditPartnerModal partner={editing} loading={loading} onClose={() => setEditing(null)} onSubmit={submitEdit} /> : null}
      {deleting ? <DeletePartnerModal partner={deleting} loading={loading} onClose={() => setDeleting(null)} onSubmit={submitDelete} /> : null}
    </section>
  );
}

function EditPartnerModal({
  partner,
  loading,
  onClose,
  onSubmit
}: {
  partner: PartnerRow;
  loading: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const days = selectedWeekdays(partner);
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="edit-partner-title">
        <div className="card-title-row">
          <h2 id="edit-partner-title">Partner szerkesztése</h2>
          <button className="button button-small" type="button" onClick={onClose}>Bezárás</button>
        </div>
        <form className="stack" onSubmit={onSubmit}>
          <div className="form-grid">
            <label>Partner neve<input name="name" defaultValue={partner.name} required /></label>
            <label>Számlázási név<input name="billingName" defaultValue={partner.billing_name ?? ""} /></label>
            <label>Adószám<input name="taxNumber" defaultValue={partner.tax_number ?? ""} /></label>
            <label>Kapcsolattartó<input name="contactName" defaultValue={partner.contact_name ?? ""} /></label>
            <label>E-mail<input name="email" type="email" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" defaultValue={partner.email ?? ""} required /></label>
            <label>Telefon<input name="phone" inputMode="numeric" pattern="[0-9]*" defaultValue={digitsOnly(partner.phone ?? "")} onInput={(event) => { event.currentTarget.value = digitsOnly(event.currentTarget.value); }} /></label>
            <label>Irányítószám<input name="postalCode" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} defaultValue={digitsOnly(partner.postal_code ?? "", 4)} required onInput={(event) => { event.currentTarget.value = digitsOnly(event.currentTarget.value, 4); }} /></label>
            <label>Város<input name="city" defaultValue={partner.city ?? ""} required /></label>
            <label className="full">Szállítási cím<input name="addressLine1" defaultValue={partner.address_line1 ?? partner.shipping_address ?? ""} required /></label>
            <label>Fizetési mód<select name="paymentMethod" defaultValue={partner.default_payment_method ?? "bank_transfer"}><option value="bank_transfer">Átutalás</option><option value="cash_on_delivery">Készpénz átadáskor</option><option value="card_on_delivery">Kártya átadáskor</option></select></label>
            <label>Fizetési határidő<input name="paymentTermsDays" type="number" min="0" defaultValue={partner.payment_terms_days} required /></label>
            <label>Minimum rendelés<input name="minimumOrderCartons" type="number" min="1" defaultValue={partner.minimum_order_cartons} required /></label>
            <label>Hitelkeret Ft<input name="creditLimitHuf" type="number" min="0" defaultValue={Number(partner.credit_limit_huf ?? 0)} /></label>
            <label>Lejárt tartozás<select name="overduePolicy" defaultValue={partner.overdue_policy}><option value="warn">Figyelmeztetés</option><option value="block">Blokkolás</option></select></label>
            <label>Rendelési zárás nap<input name="cutoffBusinessDays" type="number" min="0" defaultValue={Number(partner.cutoff_business_days ?? 2)} required /></label>
            <fieldset className="full checkbox-group"><legend>Szállítási nap</legend>
              {weekdays.map(([value, label]) => <label key={value}><input type="checkbox" name="deliveryWeekdays" value={value} defaultChecked={days.has(value)} />{label}</label>)}
            </fieldset>
            <label className="full checkbox-line"><input name="active" type="checkbox" defaultChecked={partner.active} /> Aktív partner és aktív partneri belépés</label>
            <label className="full">Megjegyzés<textarea name="note" defaultValue={partner.note ?? ""} /></label>
          </div>
          <button className="button button-primary" disabled={loading}>Mentés</button>
        </form>
      </div>
    </div>
  );
}

function DeletePartnerModal({
  partner,
  loading,
  onClose,
  onSubmit
}: {
  partner: PartnerRow;
  loading: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="delete-partner-title">
        <div className="card-title-row">
          <h2 id="delete-partner-title">Partner törlése</h2>
          <button className="button button-small" type="button" onClick={onClose}>Bezárás</button>
        </div>
        <form className="stack" onSubmit={onSubmit}>
          <div className="alert alert-warning">A törlés archiválást jelent: a korábbi rendelések és pénzügyi adatok megmaradnak, a partner eltűnik a normál listából és a partneri belépés inaktív lesz.</div>
          <dl className="kv">
            <dt>Partner</dt><dd>{partner.name}</dd>
            <dt>E-mail</dt><dd>{partner.email ?? "—"}</dd>
          </dl>
          <label>Indoklás<textarea name="reason" minLength={5} required /></label>
          <label className="checkbox-line"><input name="confirm" type="checkbox" required /> Megerősítem az archiválást.</label>
          <button className="button button-danger" disabled={loading}>Partner törlése</button>
        </form>
      </div>
    </div>
  );
}
