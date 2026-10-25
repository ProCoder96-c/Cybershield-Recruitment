# CyberShield Recruitment

A standalone recruitment site for the CyberShield club, built with a liquid-glass look over an animated CyberShield background.

- **Public site (`/`)**: open positions, team, and an in-site application form
  (name, roll number, department, why you want the role, past experience, optional email).
- **Admin (`/admin`)**: edit the page text, positions and team; review applications,
  change their status and export them to CSV.
- **Database**: its own Postgres database (Prisma). Nothing is shared with the old admin panel.

Stack: Next.js 16 (App Router), React 19, Tailwind 4, Prisma 7 + Postgres, better-auth, Zod.

## 1. Set up

```bash
npm install
cp .env.example .env      # then fill in the values (see below)
npx prisma db push        # creates the tables in your database
npm run seed:admin        # creates your admin login from ADMIN_EMAIL / ADMIN_PASSWORD
npm run seed:demo         # optional: sample positions and team members
npm run dev               # http://localhost:3000
```

Open `http://localhost:3000/login` to sign in, then edit everything from `/admin`.

### Environment variables

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Postgres connection string (Neon, Supabase, Railway, local...) |
| `BETTER_AUTH_SECRET` | Long random string, e.g. `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | The public URL of this app (`http://localhost:3000` in dev) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | Used once by `npm run seed:admin` |
| `BLOB_READ_WRITE_TOKEN` | Optional. Only needed for uploading team photos (Vercel Blob). Without it, paste a photo URL instead. |

## 2. Deploy (Vercel)

1. Push this folder to GitHub and import it in Vercel.
2. Add the environment variables above. Set `BETTER_AUTH_URL` to your real site URL.
3. Run `npx prisma db push` once against the production database
   (with the production `DATABASE_URL` in your local `.env`), then `npm run seed:admin`.
4. Optional: add a Vercel Blob store to get `BLOB_READ_WRITE_TOKEN` for photo uploads.

## 3. How it works

- Content changes in the admin show up on the public page straight away.
  There is no rebuild step, because the page reads from the database.
- Admin accounts can only be created with `npm run seed:admin`. Public sign-up is switched off.
  Running the script again with the same email resets that admin's password.
- Applications are checked on the server: the role must exist and be open, and the master
  "Applications open" switch must be on. A person can apply once per role (matched by roll number).
- Spam protection is a hidden trap field plus a limit of 5 submissions per IP every 10 minutes.
  The limit is held in memory, so on serverless hosting it is approximate; the one-application-per-role
  rule is the dependable guard.
- Deleting a position does not delete the applications for it.

## 4. Project map

```
prisma/schema.prisma          database tables
src/app/page.tsx              public page
src/app/admin/...             admin pages (overview, recruitment, team, applications)
src/app/login/                admin login
src/app/api/applications/     public submit + admin list/status/delete
src/app/api/admin/...         admin saves and photo upload
src/components/public/        hero, positions, team, apply form, background
src/components/admin/         admin shell and shared bits
src/app/globals.css           the liquid-glass theme and background (edit colours at the top)
src/scripts/                  seed:admin and seed:demo
public/logo.svg               the shield used in the nav and as the background
```

## 5. Changing the look

All glass styling lives in `src/app/globals.css`: `.glass` (panels), `.btn`, `.field`, and the `.bg-*`
classes for the background. Brand colours are `--brand`, `--cyan` and `--glow` at the top of that file.
