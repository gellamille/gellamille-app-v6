"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ReceivableOption = { id: number; receivable_number: string; partner_name: string; outstanding_huf: number };
type CategoryOption = { id: number; name: string };

export function FinanceEntryForms({ receivables, categories }: { receivables: ReceivableOption[]; categories: CategoryOption[] }) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [receivableId, setReceivableId] = useState(receivables[0]?.id ?? 0);
  const selectedReceivable = useMemo(() => receivables.find((r) => r.id === receivableId), [receivables, receivableId]);

  async function send(payload: unknown, form?: HTMLFormElement) {
    setLoading(true); setMessage("");
    const response = await fetch("/api/finance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) { setMessage(data.error ?? "A mentés sikertelen."); return; }
    setMessage("A pénzügyi tétel mentve.");
    form?.reset();
    router.refresh();
  }

  function paymentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget; const fd = new FormData(form);
    void send({
      type: "payment", receivableId: Number(fd.get("receivableId")), paymentDate: String(fd.get("paymentDate")),
      amountHuf: Number(fd.get("amountHuf")), paymentMethod: String(fd.get("paymentMethod")),
      reference: String(fd.get("reference") ?? ""), note: String(fd.get("note") ?? "")
    }, form);
  }

  function expenseSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget; const fd = new FormData(form);
    void send({
      type: "expense", categoryId: Number(fd.get("categoryId")) || undefined,
      description: String(fd.get("description")), performanceDate: String(fd.get("performanceDate")),
      paymentDate: String(fd.get("paymentDate") || "") || undefined, netAmountHuf: Number(fd.get("netAmountHuf")),
      vatAmountHuf: Number(fd.get("vatAmountHuf")), grossAmountHuf: Number(fd.get("grossAmountHuf")),
      status: String(fd.get("status"))
    }, form);
  }

  function loanSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget; const fd = new FormData(form);
    void send({
      type: "member_loan", memberName: String(fd.get("memberName")), transactionType: String(fd.get("transactionType")),
      transactionDate: String(fd.get("transactionDate")), amountHuf: Number(fd.get("amountHuf")), note: String(fd.get("note") ?? "")
    }, form);
  }

  return (
    <section className="section-gap">
      <h2>Új pénzügyi tétel</h2>
      {message ? <div className={message.includes("mentve") ? "alert alert-success" : "alert alert-danger"}>{message}</div> : null}
      <div className="grid grid-3 section-gap-small">
        <form className="card stack" onSubmit={paymentSubmit}>
          <h3>Beérkezett pénz</h3>
          <label>Követelés<select name="receivableId" required value={receivableId || ""} onChange={(e) => setReceivableId(Number(e.target.value))}>
            <option value="">Válassz</option>{receivables.map(r => <option key={r.id} value={r.id}>{r.receivable_number} · {r.partner_name} · {Number(r.outstanding_huf).toLocaleString("hu-HU")} Ft</option>)}
          </select></label>
          <label>Összeg<input key={receivableId} name="amountHuf" type="number" min="1" max={selectedReceivable?.outstanding_huf} defaultValue={selectedReceivable?.outstanding_huf ?? ""} required /></label>
          <label>Dátum<input name="paymentDate" type="date" defaultValue={today} required /></label>
          <label>Fizetési mód<select name="paymentMethod"><option value="bank_transfer">Átutalás</option><option value="cash">Készpénz</option><option value="card">Bankkártya</option></select></label>
          <label>Közlemény<input name="reference" /></label><label>Megjegyzés<textarea name="note" /></label>
          <button className="button button-primary" disabled={loading || !receivables.length}>Rögzítés</button>
        </form>
        <form className="card stack" onSubmit={expenseSubmit}>
          <h3>Kiadás</h3>
          <label>Kategória<select name="categoryId"><option value="">Egyéb</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label>Leírás<input name="description" required /></label>
          <label>Teljesítés<input name="performanceDate" type="date" defaultValue={today} required /></label>
          <label>Kifizetés<input name="paymentDate" type="date" /></label>
          <div className="form-grid"><label>Nettó<input name="netAmountHuf" type="number" min="0" required /></label><label>Áfa<input name="vatAmountHuf" type="number" min="0" defaultValue="0" required /></label></div>
          <label>Bruttó<input name="grossAmountHuf" type="number" min="1" required /></label>
          <label>Állapot<select name="status"><option value="unpaid">Kifizetetlen</option><option value="paid">Kifizetett</option></select></label>
          <button className="button button-primary" disabled={loading}>Rögzítés</button>
        </form>
        <form className="card stack" onSubmit={loanSubmit}>
          <h3>Tagi kölcsön</h3>
          <label>Tag neve<input name="memberName" required /></label>
          <label>Típus<select name="transactionType"><option value="funding">Tagi kölcsön befizetés</option><option value="repayment">Tagi kölcsön visszafizetés</option></select></label>
          <label>Dátum<input name="transactionDate" type="date" defaultValue={today} required /></label>
          <label>Összeg<input name="amountHuf" type="number" min="1" required /></label>
          <label>Megjegyzés<textarea name="note" /></label>
          <button className="button button-primary" disabled={loading}>Rögzítés</button>
        </form>
      </div>
    </section>
  );
}
