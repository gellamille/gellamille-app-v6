# Telepítés lépésről lépésre

## 1. GitHub

1. Töltsd le és csomagold ki a `gellamille-app-v6-single.zip` fájlt.
2. GitHubon hozz létre egy új repositoryt: `gellamille-app-v6`.
3. A kicsomagolt mappa **tartalmát** töltsd fel.
4. A repository tetején ezt kell látnod: `src`, `public`, `prisma`, `database`, `package.json`.

## 2. Vercel

1. Vercel → Add New → Project.
2. Importáld a `gellamille-app-v6` repositoryt.
3. Framework: Next.js.
4. Root Directory: hagyd üresen vagy `/`.
5. Ne állíts be külön Build Commandot vagy Output Directoryt.

## 3. Környezeti változók

A Vercel Project → Settings → Environment Variables alatt add hozzá:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
DATABASE_URL
```

A `DATABASE_URL` a Supabase → Connect → Transaction pooler → URI értéke legyen.

## 4. Deploy és ellenőrzés

Deploy után nyisd meg:

```text
https://A-TE-VERCEL-CIMED.vercel.app/api/health
```

Ha `status: ok`, az adatbázis-kapcsolat működik.

## 5. Supabase Auth

Supabase → Authentication → URL Configuration → Redirect URLs:

```text
https://A-TE-VERCEL-CIMED.vercel.app/**
```

## 6. Belépés

- admin/staff szerepkör: automatikusan `/internal/lots/new`
- partner szerepkör: automatikusan `/partner/catalog`

## 7. Partnerfiók

1. A belső oldalon hozd létre vagy nyisd meg a partnert.
2. Állíts be legalább egy heti szállítási napot.
3. Supabase Authentication → Users alatt hozd létre a partner fiókját.
4. Futtasd a `database/operations/link-partner-user.sql` segédfájlt a megfelelő e-maillel és partner ID-val.

## 8. Próbarendelés

1. Partnerként lépj be.
2. Tegyél legalább 5 kartont a kosárba.
3. Válassz szállítási napot és fizetési módot.
4. Küldd be a rendelést.
5. Belső felületen: `/internal/orders`.
6. A rendelésnek azonnal meg kell jelennie.
