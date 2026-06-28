import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { requireAppUser } from "@/lib/auth";

const checklist = [
  {
    title: "1. Scanner alapbeállítás",
    items: [
      "USB vevő vagy kábel csatlakoztatva a munkaállomáshoz.",
      "A scanner billentyűzetként ír be a fókuszált mezőbe.",
      "A scanner minden csippantás végén Entert küld.",
      "A billentyűzetkiosztás nem torzítja a kötőjeleket és számokat."
    ]
  },
  {
    title: "2. Tesztcsippantás",
    items: [
      "Nyisd meg a Scanner teszt oldalt.",
      "Csippants be egy valós kartoncímkét.",
      "A kiírt kód egyezzen a címkén olvasható kóddal.",
      "A formátum legyen GM-C-YYYY-XXXXXX jellegű."
    ]
  },
  {
    title: "3. Karton ellenőrzés",
    items: [
      "Nyisd meg a Karton ellenőrzés oldalt.",
      "A csippantott karton jelenjen meg termék, LOT, lejárat és raktárhely adatokkal.",
      "Az eseménynaplóban jelenjen meg az ellenőrző csippantás.",
      "Hibás vagy nem létező kódnál a rendszer adjon egyértelmű hibaüzenetet."
    ]
  },
  {
    title: "4. Rendelés összekészítés",
    items: [
      "Nyiss meg egy elfogadott, még nem átadott rendelést.",
      "Csippants olyan kartont, amelynek terméke szerepel a rendelésben.",
      "A sikeres csippantás után frissüljön a tétel összekészített mennyisége.",
      "Rossz termék vagy már csippantott karton esetén a rendszer állítsa meg a folyamatot."
    ]
  },
  {
    title: "5. Visszavonás és audit",
    items: [
      "Próbáld ki egy csippantott karton visszavonását a rendelésből.",
      "A karton állapota kerüljön vissza készletre.",
      "A karton részletező oldalán látszódjon a picked és unpicked esemény is.",
      "A rendelés LOT követésében már ne szerepeljen aktívként a visszavont karton."
    ]
  }
];

export default async function CartonSetupPage() {
  await requireAppUser(["admin", "management", "staff", "production", "warehouse"]);

  return (
    <div className="page">
      <PageHeader
        title="Karton scanner beüzemelés"
        description="Zebra LI3678-SR munkapadi ellenőrzőlista a karton címkékhez és rendelés-összekészítéshez."
        actions={
          <>
            <Link className="button" href="/internal/inventory/cartons">Dashboard</Link>
            <Link className="button" href="/internal/inventory/cartons/scanner-test">Scanner teszt</Link>
            <Link className="button button-primary" href="/internal/inventory/cartons/check">Karton ellenőrzés</Link>
          </>
        }
      />

      <section className="grid grid-2">
        {checklist.map((group) => (
          <article className="card" key={group.title}>
            <h2>{group.title}</h2>
            <div className="list">
              {group.items.map((item) => (
                <div className="list-item" key={item}>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="alert alert-warning section-gap">
        <strong>Holnaputáni fizikai próba:</strong> egy jó csippantás akkor elfogadható, ha a teszt oldalon pontos a kód,
        a karton ellenőrzés megtalálja a kartont, és rendelésben csak a megfelelő terméket engedi összekészíteni.
      </section>
    </div>
  );
}
