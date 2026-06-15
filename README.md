# Gellamille V6 – egyalkalmazásos rendszer

Egyetlen Next.js alkalmazás, egyetlen GitHub repository és egyetlen Vercel projekt.

## Útvonalak

- `/internal` – belső LOT-, készlet-, termék-, rendelés-, partner- és szállítmánykezelés
- `/partner` – partneri termékkatalógus, kosár és rendelési előzmények
- `/login` – közös belépés, szerepkör alapján automatikus továbbirányítással
- `/api/health` – adatbázis-kapcsolat ellenőrzése

## Architektúra

```text
Next.js UI
  ├─ internal felület
  ├─ partner felület
  └─ server-only szolgáltatási réteg
          ↓
    Prisma / PostgreSQL
          ↓
    meglévő Supabase adatbázis
```

Nincs Railway, külön API-projekt, Docker vagy CORS-konfiguráció.

## Telepítés

1. Hozz létre új GitHub repositoryt: `gellamille-app-v6`.
2. A ZIP tartalmát töltsd fel a repository gyökerébe.
3. Vercel → Add New → Project → importáld a repositoryt.
4. Root Directory: `/`.
5. Add meg a `.env.example` három változóját a Vercel Environment Variables alatt.
6. Deploy.
7. Ellenőrizd: `/api/health`.
8. Supabase Authentication → URL Configuration alatt add hozzá a Vercel URL-t: `https://A-TE-CIMED.vercel.app/**`.

## Fontos

A V6 adatbázis-migráció már sikeresen lefutott, ezért a `database/VERIFIED_ALREADY_RAN_006_V5_TO_V6.sql` fájlt ne futtasd újra. Csak dokumentációként maradt a repositoryban.

A működő V5 oldalt addig ne cseréld le, amíg az új V6 oldalt nem tesztelted végig.
