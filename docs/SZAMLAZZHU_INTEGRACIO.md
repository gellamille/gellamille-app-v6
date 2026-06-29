# Számlázz.hu integrációs előkészítés

## Cél

A Gellamille rendszerben legyen saját számlázási munkafelület és adatmodell. A Számlázz.hu később szolgáltatóként kapcsolódik ehhez, nem pedig a belső üzleti folyamat helyettesítőjeként.

## Kiindulási dokumentáció

- Számla Agent: https://docs.szamlazz.hu/hu/agent/
- Pénzügyi adatkapcsolat: https://docs.szamlazz.hu/hu/penzugyi-adatkapcsolat/

## Tervezett folyamat

1. Átadás után létrejön a követelés.
2. A követelésből létrejön egy `billing_documents` rekord `ready` állapotban.
3. Később innen indul a Számlázz.hu Számla Agent kérés.
4. A Számlázz.hu válaszát és a küldött/fogadott payloadokat a `billing_provider_messages` és `billing_events` táblák naplózzák.
5. A pénzügyi adatkapcsolat bejövő üzenetei frissítik a számla fizetési státuszát.
6. A belső pénzügyi nézet továbbra is a követelés/fizetés modellre épül, de a számlázási oldal mutatja a számla életútját is.

## Adatmodell

- `billing_documents`: számla, díjbekérő, sztornó vagy jóváíró számla belső fejrekordja.
- `billing_document_items`: számlatételek.
- `billing_events`: belső számlázási eseménynapló.
- `billing_provider_settings`: Számlázz.hu beállítások secret nevekkel, nem közvetlen kulcstárolással.
- `billing_provider_messages`: kimenő Számla Agent és bejövő pénzügyi adatkapcsolat üzenetek naplója.

## Következő fejlesztési lépések

1. Agent kulcs és webhook titok felvétele Vercel env/secret szinten.
2. Számla Agent XML generáló réteg.
3. Számla kiállítás API endpoint.
4. PDF/XML letöltés és tárolási stratégia.
5. Pénzügyi adatkapcsolat fogadó endpoint validációval.
6. Bejövő fizetési státuszok összekötése `payments` és `payment_allocations` rekordokkal.
