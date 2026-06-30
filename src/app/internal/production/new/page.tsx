import { PageHeader } from "@/components/PageHeader";
import { query } from "@/lib/db";
import { requireAppUser } from "@/lib/auth";
import { NewLotForm } from "./NewLotForm";

export default async function NewLotPage() {
  const user = await requireAppUser(["admin", "management", "production"]);

  const products = await query<any>(`
    select p.id, p.code, p.name, p.flavor_code, p.size_ml, p.units_per_carton
      from public.products p
     where p.organization_id=$1 and p.status in ('active','seasonal') and p.active = true
     order by p.size_ml, p.sort_order
  `, [user.organization_id]);
  const operators = await query<any>(`select id, name from public.operators where active = true order by name`);

  return (
    <div className="page">
      <PageHeader title="Új LOT" description="A LOT létrehozása készletbevételezést hoz létre. A fizikai kartonok a kartonozás/címkézés lépésnél készülnek." />
      <NewLotForm products={products} operators={operators} />
    </div>
  );
}
