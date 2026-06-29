# E-mail értesítések beállítása

## Mi működik a rendszerben

- Új partneri rendeléskor belső értesítés készül az `new_order` címzetteknek.
- Új partneri rendeléskor a partner is kap rendelés-visszaigazoló e-mailt.
- A kiküldés az `email_outbox` sorból történik.
- A napi Vercel cron feldolgozza az e-mail sort.
- Kézzel is futtatható: `POST /api/email/process`, `Authorization: Bearer <CRON_SECRET>`.

## Szükséges Vercel környezeti változók

```text
RESEND_API_KEY=...
EMAIL_FROM=Gellamille <rendeles@domain.hu>
CRON_SECRET=...
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
