# Biztonsági alapelvek

- A `DATABASE_URL` kizárólag Vercel környezeti változóban tárolható.
- A böngésző csak Supabase Authot használ; üzleti adatot közvetlenül nem ír.
- A V7 táblákon RLS aktív, az `anon` és `authenticated` közvetlen jogai vissza vannak vonva.
- Minden kritikus művelet auditálható.
- LOT, rendelés, készletmozgás és pénzügyi esemény nem törlendő véglegesen.
- A cron végpontot `CRON_SECRET` védi.
- A Supabase service-role kulcs kizárólag szerveroldali admin műveletekhez használható, és nem kerülhet `NEXT_PUBLIC_` változóba.
