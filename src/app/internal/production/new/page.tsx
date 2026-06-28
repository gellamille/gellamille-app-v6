import { PageHeader } from "@/components/PageHeader";
import { query } from "@/lib/db";
import { requireAppUser } from "@/lib/auth";
import { NewLotForm } from "./NewLotForm";

export default async function NewLotPage() {
  await requireAppUser(["admin", "management", "production"]);

  const products = await query<any>(`
    select p.id, p.code, p.name, p.flavor_code, p.size_ml, p.units_per_carton
      from public.products p
     where p.status in ('active','seasonal') and p.active = true
     order by p.size_ml, p.sort_order
  `);
  const operators = await query<any>(`select id, name from public.operators where active = true order by name`);

  return (
    <div className="page">
      <PageHeader title="Új LOT" description="A LOT létrehozása automatikusan készletbevételezést és eladható készletet hoz létre." />
      <NewLotForm products={products} operators={operators} />
    </div>
  );
}
