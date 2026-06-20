"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Option = { id: number | string; name: string };

export function NewTaskForm({ partners, users }: { partners: Option[]; users: Option[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form=event.currentTarget; const fd=new FormData(form);
    setLoading(true); setMessage("");
    const dueValue=String(fd.get("dueAt") ?? "");
    const response=await fetch("/api/tasks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      title:String(fd.get("title")),description:String(fd.get("description") ?? ""),
      partnerId:Number(fd.get("partnerId"))||undefined,assignedTo:String(fd.get("assignedTo")||"")||undefined,
      dueAt:dueValue ? new Date(dueValue).toISOString() : undefined,priority:String(fd.get("priority"))
    })});
    const data=await response.json(); setLoading(false);
    if(!response.ok){setMessage(data.error??"A mentés sikertelen.");return;}
    form.reset();setMessage("A feladat létrejött.");router.refresh();
  }
  return <form className="card stack" onSubmit={submit}>
    <h3>Új feladat</h3>
    <div className="form-grid">
      <label>Cím<input name="title" required /></label>
      <label>Partner<select name="partnerId"><option value="">Nincs partner</option>{partners.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
      <label>Felelős<select name="assignedTo"><option value="">Nincs kijelölve</option>{users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select></label>
      <label>Határidő<input name="dueAt" type="datetime-local" /></label>
      <label>Prioritás<select name="priority"><option value="low">Alacsony</option><option value="normal">Normál</option><option value="high">Magas</option><option value="urgent">Sürgős</option></select></label>
      <label className="full">Leírás<textarea name="description" /></label>
    </div>
    {message?<div className={message.includes("létrejött")?"alert alert-success":"alert alert-danger"}>{message}</div>:null}
    <button className="button button-primary" disabled={loading}>Feladat létrehozása</button>
  </form>;
}

export function TaskStatusControl({ id, status }: { id: number; status: string }) {
  const router=useRouter(); const [loading,setLoading]=useState(false);
  async function change(next:string){setLoading(true);await fetch(`/api/tasks/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:next})});setLoading(false);router.refresh();}
  if(status==="done"||status==="cancelled") return null;
  return <div className="inline">
    {status==="open"?<button className="button button-small" disabled={loading} onClick={()=>change("in_progress")}>Elkezdés</button>:null}
    <button className="button button-small button-primary" disabled={loading} onClick={()=>change("done")}>Kész</button>
  </div>;
}
