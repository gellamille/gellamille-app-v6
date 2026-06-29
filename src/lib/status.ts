export const orderStatusLabels: Record<string, string> = {
  draft: "Piszkozat",
  submitted: "Beérkezett",
  approved: "Elfogadva",
  partially_approved: "Részben elfogadva",
  rejected: "Elutasítva",
  cancelled: "Törölve",
  closed: "Lezárva",
  stock_shortage: "Készlethiány",
  allocating: "Összekészítés",
  shipment_created: "Szállítmány létrehozva",
  shipped: "Kiszállítva",
  void: "Sztornózva"
};

export const fulfillmentLabels: Record<string, string> = {
  unreserved: "Foglalásra vár",
  partially_reserved: "Részben foglalva",
  reserved: "Lefoglalva",
  picking: "Összekészítés alatt",
  packed: "Összekészítve",
  partially_delivered: "Részben átadva",
  delivered: "Átadva",
  cancelled: "Törölve"
};

export const financeStatusLabels: Record<string, string> = {
  not_due: "Még nem esedékes",
  receivable: "Követelés",
  partially_paid: "Részben fizetve",
  paid: "Kifizetve",
  overdue: "Lejárt",
  void: "Sztornózva"
};

export const paymentMethodLabels: Record<string, string> = {
  bank_transfer: "Átutalás",
  cash_on_delivery: "Készpénz átadáskor",
  card_on_delivery: "Kártya átadáskor",
  cash: "Készpénz",
  card: "Bankkártya"
};

export const inventoryMovementLabels: Record<string, string> = {
  production_receipt: "Gyártásból készletre vétel",
  correction: "Korrekció",
  sample: "Partneri minta",
  marketing: "Marketing / fotózás",
  tasting: "Kóstoltatás",
  internal_use: "Belső felhasználás",
  damage: "Sérülés",
  scrap: "Selejt",
  production: "Gyártás",
  sale: "Értékesítés",
  transfer_out: "Áthelyezés ki",
  transfer_in: "Áthelyezés be",
  recall: "Visszahívás",
  carton_created: "Karton létrehozva",
  carton_move_out: "Karton áthelyezés ki",
  carton_move_in: "Karton áthelyezés be",
  carton_picked: "Karton rendeléshez csippantva",
  carton_unpicked: "Karton csippantás visszavonva"
};

export const lotStatusLabels: Record<string, string> = {
  active: "Aktív",
  depleted: "Elfogyott",
  recalled: "Visszahívott",
  scrapped: "Selejt",
  expired: "Lejárt",
  void: "Sztornózott"
};

export const recipeStatusLabels: Record<string, string> = {
  draft: "Piszkozat",
  active: "Aktív",
  archived: "Archivált"
};

export const recallStatusLabels: Record<string, string> = {
  open: "Nyitott",
  in_progress: "Folyamatban",
  closed: "Lezárva",
  cancelled: "Törölve"
};

export const taskStatusLabels: Record<string, string> = {
  open: "Nyitott",
  in_progress: "Folyamatban",
  done: "Kész",
  cancelled: "Törölve"
};

export const taskPriorityLabels: Record<string, string> = {
  low: "Alacsony",
  normal: "Normál",
  medium: "Közepes",
  high: "Magas",
  urgent: "Sürgős"
};

export const taskSourceLabels: Record<string, string> = {
  manual: "Kézi",
  order: "Rendelés",
  shipment: "Szállítás",
  inventory: "Készlet",
  recall: "Visszahívás",
  system: "Rendszer"
};

export const expenseStatusLabels: Record<string, string> = {
  unpaid: "Kifizetetlen",
  paid: "Kifizetett"
};

export const billingDocumentStatusLabels: Record<string, string> = {
  draft: "Piszkozat",
  ready: "Számlázásra vár",
  queued: "Küldésre vár",
  sent: "Elküldve",
  issued: "Kiállítva",
  partially_paid: "Részben fizetve",
  paid: "Kifizetve",
  overdue: "Lejárt",
  failed: "Hibás",
  void: "Sztornózva",
  cancelled: "Törölve"
};

export const billingDocumentTypeLabels: Record<string, string> = {
  invoice: "Számla",
  proforma: "Díjbekérő",
  storno: "Sztornó számla",
  credit_note: "Jóváíró számla"
};

export const billingPaymentStatusLabels: Record<string, string> = {
  unknown: "Ismeretlen",
  unpaid: "Nincs fizetve",
  partially_paid: "Részben fizetve",
  paid: "Kifizetve",
  overpaid: "Túlfizetve"
};

export const billingProviderStatusLabels: Record<string, string> = {
  not_configured: "Nincs beállítva",
  configured: "Beállítva",
  disabled: "Kikapcsolva",
  error: "Hibás beállítás"
};

export const allocationStatusLabels: Record<string, string> = {
  active: "Aktív",
  allocated: "Lefoglalva",
  picked: "Csippantva",
  fulfilled: "Teljesítve",
  cancelled: "Törölve",
  released: "Feloldva"
};

export function huLabel(labels: Record<string, string>, value: string | null | undefined) {
  if (!value) return "—";
  return labels[value] ?? value.replaceAll("_", " ");
}
