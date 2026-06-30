# E-mail értesítések beállítása

## Mi működik a rendszerben

- Új partneri rendeléskor belső értesítés készül az `new_order` címzetteknek.
- Új partneri rendeléskor a partner is kap rendelés-visszaigazoló e-mailt.
- A kiküldés az `email_outbox` sorból történik.
- A napi Vercel cron feldolgozza az e-mail sort.
- Kézzel is futtatható: `POST /api/email/process`, `Authorization: Bearer <CRON_SECRET>`.
- Bekötés előtt `EMAIL_DELIVERY_MODE=dry_run` módban külső API hívás nélkül végigpróbálható a queue feldolgozás.

## Szükséges Vercel környezeti változók

```text
EMAIL_PROVIDER=resend
EMAIL_DELIVERY_MODE=live
RESEND_API_KEY=...
EMAIL_FROM=Gellamille <rendeles@domain.hu>
CRON_SECRET=...
```

Bekötés előtti próbához:

```text
EMAIL_DELIVERY_MODE=dry_run
EMAIL_FROM=Gellamille <rendeles@domain.hu>
```

Ebben a módban az outbox sorok `sent` állapotba kerülnek, `provider_message_id` értékük `dry-run-...` lesz, de nem történik külső küldés.

Állapot ellenőrzése:

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" https://<app-domain>/api/email/process
```

Kézi feldolgozás:

```bash
curl -X POST -H "Authorization: Bearer <CRON_SECRET>" https://<app-domain>/api/email/process
```

## Belső címzettek

Admin felületen:

```text
Beállítások -> E-mail címzettek
```

Az "Új rendelés érkezett" eseményhez add meg azokat a címeket, akik nálatok kapjanak e-mailt, ha partner rendelést ad le.

## Google Workspace e-mail cím használata

Ha Google Workspace alatt van a céges domain, a legjobb út:

1. Hozzatok létre egy külön címet vagy aliast, például `rendeles@...`.
2. A küldő szolgáltatásban hitelesítsétek a domaint DNS rekordokkal.
3. Vercelben az `EMAIL_FROM` legyen ez a cím.

A jelenlegi kód Resend API-t használ. Google Workspace cím akkor használható szépen, ha a domain hitelesítve van a küldő szolgáltatásban. Közvetlen Google SMTP/App Password alapú küldéshez külön SMTP provider-réteget kell hozzáadni.

## Bekötési checklist

1. Futtasd a `018_email_delivery_readiness.sql` migrációt.
2. Resendben hitelesítsd a küldő domaint DNS rekordokkal.
3. Vercelben állítsd be: `EMAIL_PROVIDER=resend`, `EMAIL_DELIVERY_MODE=dry_run`, `EMAIL_FROM`, `RESEND_API_KEY`.
4. Adj hozzá legalább egy belső címzettet a Beállítások / E-mail címzettek felületen.
5. Hozz létre egy teszt rendelést, majd futtasd: `POST /api/email/process`.
6. Ha az outbox és a címzettek rendben vannak, állítsd `EMAIL_DELIVERY_MODE=live` értékre.
