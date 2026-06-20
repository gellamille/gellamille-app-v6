"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function NewPartnerForm(){
 const router=useRouter();const[message,setMessage]=useState("");const[loading,setLoading]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const form=event.currentTarget;const fd=new FormData(form);setLoading(true);setMessage("");
  const response=await fetch("/api/partners",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
   name:String(fd.get("name")),billingName:String(fd.get("billingName")??""),taxNumber:String(fd.get("taxNumber")??""),
   contactName:String(fd.get("contactName")??""),email:String(fd.get("email")??""),phone:String(fd.get("phone")??""),
   postalCode:String(fd.get("postalCode")),city:String(fd.get("city")),addressLine1:String(fd.get("addressLine1")),
   paymentMethod:String(fd.get("paymentMethod")),paymentTermsDays:Number(fd.get("paymentTermsDays")),
   minimumOrderCartons:Number(fd.get("minimumOrderCartons")),overduePolicy:String(fd.get("overduePolicy")),
   deliveryWeekday:Number(fd.get("deliveryWeekday")),cutoffBusinessDays:Number(fd.get("cutoffBusinessDays")),note:String(fd.get("note")??"")
  })});const data=await response.json();setLoading(false);
  if(!response.ok){setMessage(data.error??"A mentés sikertelen.");return;}form.reset();setMessage("A partner létrejött.");router.refresh();
 }
 return <form className="card stack" onSubmit={submit}><h3>Új partner</h3><div className="form-grid">
  <label>Partner neve<input name="name" required /></label><label>Számlázási név<input name="billingName" /></label>
  <label>Adószám<input name="taxNumber" /></label><label>Kapcsolattartó<input name="contactName" /></label>
  <label>E-mail<input name="email" type="email" /></label><label>Telefon<input name="phone" /></label>
  <label>Irányítószám<input name="postalCode" required /></label><label>Város<input name="city" required /></label>
  <label className="full">Szállítási cím<input name="addressLine1" required /></label>
  <label>Fizetési mód<select name="paymentMethod"><option value="bank_transfer">Átutalás</option><option value="cash_on_delivery">Készpénz átadáskor</option><option value="card_on_delivery">Kártya átadáskor</option></select></label>
  <label>Fizetési határidő<input name="paymentTermsDays" type="number" min="0" defaultValue="8" required /></label>
  <label>Minimum rendelés<input name="minimumOrderCartons" type="number" min="1" defaultValue="5" required /></label>
  <label>Lejárt tartozás<select name="overduePolicy"><option value="warn">Figyelmeztetés</option><option value="block">Blokkolás</option></select></label>
  <label>Szállítási nap<select name="deliveryWeekday"><option value="1">Hétfő</option><option value="2">Kedd</option><option value="3">Szerda</option><option value="4">Csütörtök</option><option value="5">Péntek</option><option value="6">Szombat</option><option value="7">Vasárnap</option></select></label>
  <label>Rendelési zárás munkanap<input name="cutoffBusinessDays" type="number" min="0" defaultValue="2" required /></label>
  <label className="full">Megjegyzés<textarea name="note" /></label>
 </div>{message?<div className={message.includes("létrejött")?"alert alert-success":"alert alert-danger"}>{message}</div>:null}<button className="button button-primary" disabled={loading}>Partner létrehozása</button></form>;
}
