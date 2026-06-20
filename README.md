# Gellamille V6/V7 – egységes működési rendszer

Egyetlen Next.js alkalmazás, egy GitHub repository, egy Vercel projekt és a meglévő Supabase PostgreSQL + Auth.

## Fő útvonalak

- `/internal` – belső vezérlőpult és operáció
- `/partner` – partneri rendelési felület
- `/api/health` – telepítési állapot

## Beépített működés

- vezérlőpult: rendelések, készlet, lejáratok, követelések, Top 3 termék és partner
- LOT létrehozás a végleges `FDP15-26-0001` jellegű formátummal
- LOT létrehozáskor automatikus készletre vétel
- rendelés kartonban, készlet darabban
- minimum 5 karton vagy partnerenként felülírt minimum
- elfogadáskor termékszintű készletfoglalás
- összekészítéskor FEFO-alapú LOT-kiosztás
- részleges elfogadás és részleges átadás adatmodellje
- átadáskor automatikus követelés
- követelés, beérkezett pénz, ELÁBÉ, árrés és kiadás külön kezelve
- több raktárhely adatbázis-szinten
- visszáru, karantén, selejt, visszahívás és leltár adatmodell
- alapanyagok és verziózott receptek minimális felülete
- feladatok és alkalmazáson belüli értesítések
- új rendelésről e-mail a kijelölt címzetteknek
- szerepkörök: admin, vezetőség, belső munkatárs, gyártás, raktár, pénzügy, értékesítés, partner
- egy partnerhez egy belépés, több cím és több kapcsolattartó
- auditnapló és közvetlen böngészős adatbázis-írás tiltása

## Technológia

- Next.js App Router
- React
- Supabase Auth
- PostgreSQL / Supabase
- közvetlen szerveroldali `pg` kapcsolat
- Vercel
- Resend opcionális e-mail-küldéshez

A pontos telepítési sorrend: [`TELEPITES_LEPESROL_LEPESRE.md`](./TELEPITES_LEPESROL_LEPESRE.md).

## Adminfelületi lefedettség

Teljes operációs felület készült a vezérlőpulthoz, LOT-létrehozáshoz, készlethez, rendeléshez, partneri rendeléshez, FEFO-kiosztáshoz, átadáshoz, követeléshez, pénzbeérkezéshez, kiadásokhoz, tagi kölcsönhöz, partnerekhez és feladatokhoz.

Az alapanyagok, receptek, visszáru, visszahívás, leltár, több raktárhely és szállítási járatok adatbázis-szinten ki vannak építve; az első felületük szándékosan minimális, hogy később külön folyamatként lehessen továbbfejleszteni.

A kiadás ellenőrzési állapota: [`BUILD_REPORT.md`](./BUILD_REPORT.md).
