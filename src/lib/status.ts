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
