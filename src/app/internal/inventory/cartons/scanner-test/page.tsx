import { PageHeader } from "@/components/PageHeader";
import { requireAppUser } from "@/lib/auth";
import { ScannerTestClient } from "./ScannerTestClient";

export default async function ScannerTestPage() {
  await requireAppUser(["admin", "management", "staff", "production", "warehouse"]);

  return (
    <div className="page">
      <PageHeader
        title="Scanner teszt"
        description="Zebra LI3678-SR és más USB HID vonalkódolvasók gyors ellenőrzése kartoncímkéhez."
      />
      <ScannerTestClient />
    </div>
  );
}
