# Biztonság

- A Content Security Policy kérésenként generált nonce-szal működik a `src/proxy.ts` fájlban.
- `X-Frame-Options: DENY` és `frame-ancestors 'none'` tiltja az oldal beágyazását.
- A `DATABASE_URL` kizárólag szerveroldalon használható.
- Böngészőbe csak a Supabase publishable key kerülhet.
- A belső és partneri jogosultságot a `public.app_users` tábla alapján a szerver ellenőrzi.
- A partneri lekérdezések minden esetben a bejelentkezett felhasználó `partner_id` értékére szűrnek.
- A Service Worker nem gyorsítótáraz autentikált oldalakat vagy üzleti adatokat.
- Offline módban rendelés és adatmódosítás nem küldhető be.
