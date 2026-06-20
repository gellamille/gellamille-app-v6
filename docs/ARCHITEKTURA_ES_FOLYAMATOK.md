# Architektúra és üzleti folyamatok

## Egyalkalmazásos felépítés

```text
GitHub repository
└── Next.js alkalmazás
    ├── /internal
    ├── /partner
    └── /api
         ↓
Supabase PostgreSQL + Auth
```

## Fő folyamat

A gyártás nem rendelésvezérelt:

```text
LOT létrehozás
→ készletre vétel
→ eladható készlet
```

A rendelési folyamat:

```text
Partner beküldi
→ admin elfogadja
→ termékmennyiség foglalódik
→ FEFO szerint konkrét LOT-ok kerülnek kiosztásra
→ összekészítés
→ átadás
→ készletcsökkentés
→ pénzügyi követelés
→ pénz beérkezése
```

## Státuszok

### Rendelés

- draft
- submitted
- approved
- partially_approved
- stock_shortage
- rejected
- cancelled
- closed
- void

### Teljesítés

- unreserved
- partially_reserved
- reserved
- picking
- packed
- partially_delivered
- delivered
- cancelled

### Pénzügy

- not_due
- receivable
- partially_paid
- paid
- overdue
- void

### LOT

- active
- void
- expired
- recalled
- quarantine
- depleted
- scrapped

## Készlet

- alapegység: darab
- partneri rendelési egység: karton
- 150 ml: 20 db/karton
- 300 ml: 10 db/karton
- bontott karton belsőleg nyilvántartható, partnernek nem adható ki
- negatív készlet normál művelettel tiltott
- konkrét LOT csak összekészítéskor kerül rendelési tételhez
- LOT-választás FEFO szerint történik

## Pénzügy

A rendszer nem banki egyenleg és nem számlázóprogram.

Külön kezeli:

- átadásból keletkező árbevételt/követelést
- ténylegesen beérkezett pénzt
- lejárt követelést
- ELÁBÉ-t
- működési költséget
- eredményt
- tagi kölcsönt, amely nem árbevétel és nem nyereség

Számlázás továbbra is a Számlázz.hu rendszerben történik.

## Jogosultságok

A frontend menüje és az útvonalak is szerepkör szerint korlátozottak. A böngésző nem kap közvetlen írási jogot az üzleti táblákhoz; a módosítások szerveroldali API-n mennek keresztül.
