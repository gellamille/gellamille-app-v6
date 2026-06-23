# Gellamille egységes rendszer – telepítés

## 0. Fontos

A meglévő Supabase adatbázisban a V6 `006` migráció már lefutott. A csomagban lévő új migráció erre épül.

**Ne futtasd újra a 006 migrációt.**

## 1. Supabase biztonsági mentés

A migráció előtt készíts adatbázis-mentést a Supabase felületén.

## 2. V7 adatbázis-migrációk

Supabase → SQL Editor → New query.

Először másold be és futtasd egyben:

```text
database/migrations/008_v7_unified_operating_system.sql
```

Ezután futtasd a V7.1 kiegészítő migrációt is:

```text
database/migrations/009_v7_1_recipe_nutrition_and_archiving.sql
```

Mindkét migráció siker esetén `commit`-tal zárul. A 009 additív: receptúra tápértékmezőket, soft-archive mezőket és archiválási naplót ad hozzá, adatot nem töröl.

## 3. Ellenőrzés

Futtasd:

```text
database/verification/009_verify_v7.sql
```

A helyes eredmény:

```json
{
  "migration_verified": true,
  "summary": {
    "failed_checks": 0
  }
}
```

## 4. GitHub

A repository neve maradhat:

```text
gellamille-app-v6
```

A ZIP kicsomagolt **tartalmát** tedd a repository gyökerébe. A GitHub tetején ezt kell látnod:

```text
src
public
database
docs
package.json
next.config.ts
vercel.json
README.md
TELEPITES_LEPESROL_LEPESRE.md
```

Commit:

```text
Gellamille unified dashboard and ordering system
```

## 5. Helyi ellenőrzés

A repository gyökerében:

```bash
npm ci
cp .env.example .env.local
```

Töltsd ki a `.env.local` változóit, majd:

```bash
npm run typecheck
npm run build
npm run dev
```

A helyi cím:

```text
http://localhost:3000
```

A `.env.local` fájlt ne commitold. A csomag készítési ellenőrzéseit a `BUILD_REPORT.md` tartalmazza.

## 6. Vercel

Vercel → Add New → Project → importáld a repositoryt.

- Framework: Next.js
- Root Directory: `/`
- Build Command: hagyd alapértelmezetten
- Output Directory: hagyd üresen

### Környezeti változók

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
CRON_SECRET
RESEND_API_KEY
EMAIL_FROM
APP_URL
```

A `DATABASE_URL` értéke a Supabase Transaction Pooler kapcsolati URI-ja legyen. Jelszót ne tölts fel GitHubra.

A `SUPABASE_SERVICE_ROLE_KEY` csak szerveroldali Vercel környezeti változó lehet. Ezzel hoz létre az admin felület Supabase Auth felhasználót; böngészőbe vagy `NEXT_PUBLIC_` változóba nem kerülhet.

Az e-mailhez:

```text
EMAIL_FROM=Gellamille Rendelés <noreply@sajat-domain.hu>
```

A `RESEND_API_KEY` és `EMAIL_FROM` opcionális. Nélkülük a rendelés működik, az e-mail a kimenő sorban marad.

## 7. Supabase Auth URL

Supabase → Authentication → URL Configuration.

Add hozzá:

```text
https://A-TE-VERCEL-CIMED.vercel.app/**
```

A Site URL is a production címed legyen.

## 8. Első admin

Supabase → Authentication → Users → Add user.

Ezután nyisd meg:

```text
database/operations/01_activate_admin.sql
```

Cseréld ki az e-mail-címet, majd futtasd a SQL Editorban.

További belső felhasználóhoz használd:

```text
database/operations/05_activate_internal_user.sql
```

Itt kiválasztható az `admin`, `management`, `staff`, `production`, `warehouse`, `finance` vagy `sales` szerepkör.

## 9. Új rendelési e-mail címzett

Nyisd meg:

```text
database/operations/03_add_order_email_recipient.sql
```

Cseréld ki az e-mail-címet és futtasd. Több címzettet is hozzáadhatsz.

## 10. Partneri belépés

1. A partner rekordja legyen a `partners` táblában.
2. Legyen legalább egy aktív szállítási címe és szállítási napja.
3. Supabase Authentication → Users alatt hozd létre a partner Auth-fiókját.
4. Futtasd a kitöltött:

```text
database/operations/02_link_partner_user.sql
```

Egy partnerhez csak egy partneri belépés kapcsolható.

## 11. Ellenőrzés deploy után

Nyisd meg:

```text
https://A-TE-VERCEL-CIMED.vercel.app/api/health
```

Elvárt válasz:

```json
{
  "status": "ok",
  "service": "gellamille-app-v7"
}
```

Ezután lépj be az adminnal és ellenőrizd:

1. `/internal` vezérlőpult
2. `/internal/production/new` új LOT
3. `/partner/catalog` partneri katalógus
4. partneri próbarendelés
5. belső elfogadás
6. FEFO összekészítés
7. átadás
8. pénzügyben a létrejött követelés

## 12. Régi böngészős hozzáférés lezárása

Csak akkor futtasd, amikor az új rendszerben már sikerült a teljes próba:

```text
database/operations/06_cutover_lockdown_after_deploy.sql
```

Ez letiltja a régi statikus LOT-alkalmazás közvetlen Supabase-tábla- és RPC-hozzáférését. Az új Next.js rendszer továbbra is működik a szerveroldali `DATABASE_URL` kapcsolaton keresztül.

## 13. Napi automatikus karbantartás

A Vercel cron naponta meghívja:

```text
/api/cron/daily
```

Ez:

- létrehozza a 30 napos lejárati feladatokat
- lejártra állítja a lejárt LOT-okat
- felszabadítja a lejárt LOT-kiosztásokat
- frissíti a követelések lejárt/fizetett állapotát

## 14. Amit nem szabad

- `.env` vagy adatbázis-jelszó feltöltése GitHubra
- LOT mennyiség közvetlen átírása
- rendelés vagy készletmozgás végleges törlése
- a régi `gellamille/lot` repository felülírása
- a 006 migráció ismételt futtatása
- a `06_cutover_lockdown_after_deploy.sql` futtatása az új rendszer teljes próbája előtt
