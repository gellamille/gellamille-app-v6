# Gellamille V7.1 – build és ellenőrzési riport

Dátum: 2026-06-28

## Elkészült csomag

- egyetlen Next.js alkalmazás
- `/internal` belső működési rendszer
- `/partner` partneri rendelési felület
- Supabase Auth
- meglévő V6 adatbázisra épülő `008` additív migráció
- `009` V7.1 receptura/tápanyag és admin archiválás migráció
- `010` partner ideiglenes jelszó kezelés
- `011` készlet minimum és rendelési beállítások
- `012` ideiglenes partnerjelszó láthatóság
- `013` fizikai karton nyomonkövetés
- `014` rendelési összekészítés fizikai kartonnal
- `database/verification/009_verify_v7.sql` telepítés-ellenőrző SQL
- Vercel konfiguráció és napi cron
- e-mail kimenő sor, opcionális Resend küldéssel
- belső értesítések
- partner jelszócsere és ideiglenes jelszó kérés
- fizikai karton címke, ellenőrzés, mozgatás és rendeléshez kötött összekészítés

## Statikus ellenőrzések

Sikeresen lefutott:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Helyi runtime ellenőrzés

- `npm run dev` elindult a `http://localhost:3000` címen
- `GET /` válasz: `307 Temporary Redirect` a `/login` oldalra
- `GET /login` válasz: `200 OK`
- a login oldal renderelt tartalma tartalmazza a Gellamille logót, e-mail és jelszó mezőt, belépés gombot, valamint ideiglenes jelszó kérési gombot

## Fontos korlát

Élő Supabase migráció ebben az ellenőrzésben nem futott. A telepítés előtt adatbázis-mentés szükséges. A migrációk után kötelező futtatni a `database/verification/009_verify_v7.sql` fájlt, és csak `failed_checks = 0` eredménnyel továbblépni.
