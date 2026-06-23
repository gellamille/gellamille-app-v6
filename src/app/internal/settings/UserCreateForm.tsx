"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const roles = [
  ["admin", "Admin"],
  ["management", "Vezetőség"],
  ["staff", "Belső munkatárs"],
  ["production", "Gyártás"],
  ["warehouse", "Raktár"],
  ["finance", "Pénzügy"],
  ["sales", "Értékesítés"]
] as const;

export function UserCreateForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    setLoading(true);
    setMessage("");
    setTemporaryPassword("");
    setUsername("");

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(fd.get("email") ?? ""),
        displayName: String(fd.get("displayName") ?? ""),
        role: String(fd.get("role") ?? "staff")
      })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "A felhasználó létrehozása sikertelen.");
      return;
    }

    form.reset();
    setUsername(data.user?.email ?? "");
    setTemporaryPassword(data.temporaryPassword ?? "");
    setMessage("A felhasználó létrejött. Az ideiglenes jelszó csak most látható.");
    router.refresh();
  }

  return (
    <form className="card stack" onSubmit={submit}>
      <h3>Új belső felhasználó</h3>
      <div className="form-grid">
        <label>Név<input name="displayName" required /></label>
        <label>Felhasználónév / e-mail<input name="email" type="email" required /></label>
        <label>Szerepkör<select name="role">{roles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div>
      {message ? <div className={temporaryPassword ? "alert alert-success" : "alert alert-danger"}>{message}</div> : null}
      {temporaryPassword ? (
        <div className="temporary-password">
          <div><strong>Felhasználónév:</strong> <span className="mono">{username}</span></div>
          <div><strong>Ideiglenes jelszó:</strong> <span className="mono">{temporaryPassword}</span></div>
        </div>
      ) : null}
      <button className="button button-primary" disabled={loading}>Felhasználó létrehozása</button>
    </form>
  );
}
