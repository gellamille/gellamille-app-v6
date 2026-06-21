import { redirect } from "next/navigation";
import { currentAppUser } from "@/lib/auth";

export default async function Home() {
  const user = await currentAppUser();
  if (!user) { redirect("/login"); throw new Error("Nincs bejelentkezve."); }
  if (!user.active) redirect("/access-pending");
  redirect(user.role === "partner" ? "/partner" : "/internal");
}
