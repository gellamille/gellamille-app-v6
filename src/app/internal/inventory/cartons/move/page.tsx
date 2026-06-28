import { PageHeader } from "@/components/PageHeader";
import { query } from "@/lib/db";
import { requireAppUser } from "@/lib/auth";
import { CartonMoveClient } from "./CartonMoveClient";

export default async function CartonMovePage() {
  const user = await requireAppUser(["admin", "management", "warehouse", "production"]);
  const locations = await query<any>(`
    select id,name,code,type
      from public.inventory_locations
     where organization_id=$1 and active=true and type <> 'partner_consignment'
     order by type,name
  `, [user.organization_id]);

  return (
    <div className="page">
      <PageHeader
        title="Karton áthelyezés"
        description="Raktárhelyek közötti fizikai kartonmozgatás scannerrel. Minden áthelyezés készletmozgást és karton eseményt naplóz."
      />
      <CartonMoveClient locations={locations} />
    </div>
  );
}
