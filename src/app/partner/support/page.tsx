import { Phone, TicketCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { requireAppUser } from "@/lib/auth";
import { SupportTicketForm } from "./SupportTicketForm";

export default async function PartnerSupportPage() {
  await requireAppUser(["partner"]);

  return (
    <div>
      <PageHeader title="Ügyfélszolgálat" description="Panasz, rendelési kérdés vagy termékkel kapcsolatos jelzés beküldése." />
      <section className="support-layout">
        <SupportTicketForm />
        <aside className="support-contact-card">
          <div className="support-contact-icon"><Phone size={22} /></div>
          <h2>Telefonos kapcsolat</h2>
          <p>Sürgős vagy személyes egyeztetést igénylő ügyben keresd közvetlenül az ügyfélszolgálatot.</p>
          <strong>Petyánszki Krisztián</strong>
          <a href="tel:+36708020689">+36 70 802 0689</a>
          <div className="support-note">
            <TicketCheck size={18} />
            <span>A beküldött panasz ticketként bekerül a Gellamille belső feladatlistájába.</span>
          </div>
        </aside>
      </section>
    </div>
  );
}
