import { PageHeader } from "@/components/PageHeader";
import { requireAppUser } from "@/lib/auth";
import { CartonCheckClient } from "./CartonCheckClient";

export default async function CartonCheckPage() {
  await requireAppUser(["admin", "management", "staff", "production", "warehouse"]);

  return (
    <div className="page">
      <PageHeader
        title="Karton ellenőrzés"
        description="Scannerrel vagy kézi kóddal ellenőrizhető, hogy egy karton melyik LOT-hoz tartozik, hol van és milyen események történtek vele."
      />
      <CartonCheckClient />
    </div>
  );
}
