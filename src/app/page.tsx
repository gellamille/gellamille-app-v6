import { redirect } from "next/navigation";
import { currentAppUser } from "@/lib/auth";

export default async function Home() {
  const user = await currentAppUser();
  if (!user) { redirect("/login"); throw new Error("Nincs bejelentkezve."); }
  redirect(user.role === "partner" ? "/partner" : "/internal");
}
