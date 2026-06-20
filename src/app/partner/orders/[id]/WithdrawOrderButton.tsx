"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function WithdrawOrderButton({ orderId }: { orderId: number }) {
  const router = useRouter();
  const [busy,setBusy]=useState(false);
  async function withdraw() {
    const reason=prompt("Miért vonod vissza a rendelést? (legalább 5 karakter)");
    if(!reason)return;
    setBusy(true);
    const response=await fetch(`/api/orders/${orderId}/withdraw`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({reason})});
    const data=await response.json(); setBusy(false);
    if(!response.ok){alert(data.error??"A visszavonás sikertelen.");return;}
    router.refresh();
  }
  return <button className="button button-danger" disabled={busy} onClick={withdraw}>Rendelés visszavonása</button>;
}
