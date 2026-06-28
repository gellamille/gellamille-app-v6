"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function digitsOnly(value: string, maxLength?: number) {
 const digits=value.replace(/\D/g,"");
 return typeof maxLength==="number"?digits.slice(0,maxLength):digits;
}

export function NewPartnerForm(){
 const router=useRouter();const[message,setMessage]=useState("");const[loading,setLoading]=useState(false);const[open,setOpen]=useState(false);const[username,setUsername]=useState("");const[temporaryPassword,setTemporaryPassword]=useState("");
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const form=event.currentTarget;const fd=new FormData(form);setLoading(true);setMessage("");
  setUsername("");setTemporaryPassword("");
  const response=await fetch("/api/partners",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
   name:String(fd.get("name")),billingName:String(fd.get("billingName")??""),taxNumber:String(fd.get("taxNumber")??""),
   contactName:String(fd.get("contactName")??""),email:String(fd.get("email")??""),phone:String(fd.get("phone")??""),
   postalCode:String(fd.get("postalCode")),city:String(fd.get("city")),addressLine1:String(fd.get("addressLine1")),
   paymentMethod:String(fd.get("paymentMethod")),paymentTermsDays:Number(fd.get("paymentTermsDays")),
   minimumOrderCartons:Number(fd.get("minimumOrderCartons")),overduePolicy:String(fd.get("overduePolicy")),
   deliveryWeekdays:fd.getAll("deliveryWeekdays").map(value=>Number(value)),cutoffBusinessDays:Number(fd.get("cutoffBusinessDays")),note:String(fd.get("note")??"")
  })});const data=await response.json();setLoading(false);
  if(!response.ok){setMessage(data.error??"A mentés sikertelen.");return;}form.reset();setUsername(data.username??"");setTemporaryPassword(data.temporaryPassword??"");setMessage("A partner és a partneri belépés létrejött. Az ideiglenes jelszó 8 napig érvényes, a partner első belépés után saját jelszót állít be.");router.refresh();
 }
 return <>
  <button className="button button-primary" onClick={()=>setOpen(true)}>Új partner</button>
  {open?<div className="modal-backdrop" role="presentation"><div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="new-partner-title">
   <div className="card-title-row"><h2 id="new-partner-title">Új partner és belépés</h2><button className="button button-small" type="button" onClick={()=>setOpen(false)}>Bezárás</button></div>
   <form className="stack" onSubmit={submit}><div className="form-grid">
    <label>Partner neve<input name="name" required /></label><label>Számlázási név<input name="billingName" /></label>
    <label>Adószám<input name="taxNumber" /></label><label>Kapcsolattartó<input name="contactName" /></label>
    <label className="full">E-mail<input name="email" type="email" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" required /></label>
    <label>Telefon<input name="phone" inputMode="numeric" pattern="[0-9]*" onInput={(event)=>{event.currentTarget.value=digitsOnly(event.currentTarget.value);}} /></label>
    <label>Irányítószám<input name="postalCode" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} required onInput={(event)=>{event.currentTarget.value=digitsOnly(event.currentTarget.value,4);}} /></label><label>Város<input name="city" required /></label>
    <label className="full">Szállítási cím<input name="addressLine1" required /></label>
    <label>Fizetési mód<select name="paymentMethod"><option value="bank_transfer">Átutalás</option><option value="cash_on_delivery">Készpénz átadáskor</option><option value="card_on_delivery">Kártya átadáskor</option></select></label>
    <label>Fizetési határidő<input name="paymentTermsDays" type="number" min="0" defaultValue="8" required /></label>
    <label>Minimum rendelés<input name="minimumOrderCartons" type="number" min="1" defaultValue="5" required /></label>
    <label>Lejárt tartozás<select name="overduePolicy"><option value="warn">Figyelmeztetés</option><option value="block">Blokkolás</option></select></label>
    <fieldset className="full checkbox-group"><legend>Szállítási nap</legend>
     <label><input type="checkbox" name="deliveryWeekdays" value="1" defaultChecked />Hétfő</label>
     <label><input type="checkbox" name="deliveryWeekdays" value="2" />Kedd</label>
     <label><input type="checkbox" name="deliveryWeekdays" value="3" />Szerda</label>
     <label><input type="checkbox" name="deliveryWeekdays" value="4" />Csütörtök</label>
     <label><input type="checkbox" name="deliveryWeekdays" value="5" />Péntek</label>
     <label><input type="checkbox" name="deliveryWeekdays" value="6" />Szombat</label>
     <label><input type="checkbox" name="deliveryWeekdays" value="7" />Vasárnap</label>
    </fieldset>
    <label>Rendelési zárás nap<input name="cutoffBusinessDays" type="number" min="0" defaultValue="2" required /></label>
    <label className="full">Megjegyzés<textarea name="note" /></label>
   </div>{message?<div className={message.includes("létrejött")?"alert alert-success":"alert alert-danger"}>{message}</div>:null}
   {username?<div className="temporary-password"><div><strong>Belépési e-mail:</strong> <span className="mono">{username}</span></div><div><strong>Ideiglenes jelszó:</strong> <span className="mono">{temporaryPassword}</span></div><div>Lejárat: 8 nap, vagy amíg a partner saját jelszót nem állít be.</div></div>:null}
   <button className="button button-primary" disabled={loading}>Partner létrehozása</button></form>
  </div></div>:null}
 </>;
}
