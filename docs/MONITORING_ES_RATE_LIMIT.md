# Monitoring és rate limit

## Mi került előkészítésre

- Strukturált JSON runtime logok a Vercel log viewerhez.
- Opcionális hibajelentő webhook: `ERROR_WEBHOOK_URL`.
- Next.js `instrumentation.ts`, ami induláskor jelzi a monitoring állapotot.
- DB-alapú rate limit tábla: `rate_limit_counters`.
- Saját szerveroldali login endpoint: `POST /api/auth/login`.
- Rate limit a loginra, jelszó-visszaállításra, partner API-kra, rendelés beküldésre, ticket beküldésre és partner ticket üzenetekre.

## Éles környezeti változók

```text
ERROR_WEBHOOK_URL=
RATE_LIMIT_SALT=
```

Az `ERROR_WEBHOOK_URL` opcionális. Ha nincs megadva, a hibák akkor is bekerülnek a Vercel runtime logba strukturált JSON-ként.

A `RATE_LIMIT_SALT` ajánlott productionben, mert a rate-limit kulcsok hash-elése ezzel stabil és nem visszafejthető.

## Migrációk

Futtatandó:

```text
database/migrations/019_rate_limit_and_monitoring.sql
```

Ha az e-mail előkészítés még nincs fent:

```text
database/migrations/018_email_delivery_readiness.sql
```

## Vercel monitoring

Minimális működéshez elég a Vercel runtime log. Production élesítés után ajánlott:

1. Vercel Dashboard / Deployments / Logs ellenőrzése.
2. Pro csomag esetén Log Drain beállítása külső gyűjtőbe.
3. Opcionálisan `ERROR_WEBHOOK_URL` megadása Slack/Make/Zapier/saját webhook felé.
4. Deploy után `vercel logs <deployment-url> --level error --since 1h` futtatása.
