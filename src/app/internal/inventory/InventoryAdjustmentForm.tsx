"use client";
import { FormEvent,useState } from "react";
import { useRouter } from "next/navigation";

type Lot={id:number;lot_number:string;product_name:string;physical_units:number};
type Location={id:number;name:string};
export function InventoryAdjustmentForm({lots,locations}:{lots:Lot[];locations:Location[]}){
 const router=useRouter();const[message,setMessage]=useState("");const[loading,setLoading]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const form=event.currentTarget;const fd=new FormData(form);setLoading(true);setMessage("");
  const response=await fetch("/api/inventory/corrections",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lotId:Number(fd.get("lotId")),locationId:Number(fd.get("locationId")),movementType:String(fd.get("movementType")),quantityUnits:Number(fd.get("quantityUnits")),reason:String(fd.get("reason"))})});
  const data=await response.json();setLoading(false);if(!response.ok){setMessage(data.error??"A mentés sikertelen.");return;}form.reset();setMessage("A készletmozgás mentve.");router.refresh();}
 return <form className="card stack" onSubmit={submit}><h3>Készletkorrekció vagy belső felhasználás</h3><div className="form-grid">
  <label>LOT<select name="lotId" required><option value="">Válassz</option>{lots.map(l=><option key={l.id} value={l.id}>{l.lot_number} · {l.product_name} · {l.physical_units} db</option>)}</select></label>
  <label>Készlethely<select name="locationId" required>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
  <label>Típus<select name="movementType"><option value="correction">Korrekció (+ vagy −)</option><option value="sample">Partneri minta</option><option value="marketing">Marketing / fotózás</option><option value="tasting">Kóstoltatás</option><option value="internal_use">Belső felhasználás</option><option value="damage">Sérülés</option><option value="scrap">Selejt</option></select></label>
  <label>Darabszám<input name="quantityUnits" type="number" required /><span className="text-muted">Korrekciónál + vagy −. Más típusnál pozitív darabszámot adj meg.</span></label>
  <label className="full">Indoklás<textarea name="reason" minLength={5} required /></label>
 </div>{message?<div className={message.includes("mentve")?"alert alert-success":"alert alert-danger"}>{message}</div>:null}<button className="button button-primary" disabled={loading||!lots.length}>Készletmozgás rögzítése</button></form>;
}
