# CyberShield Recruit — database setup

## 1. Configure environment
Create `.env` in the same folder as `package.json`. Copy `.env.example` and set `DATABASE_URL` to the PostgreSQL URI copied from Supabase **Connect → Connection string → URI**. Keep passwords and secret keys private.

## 2. Apply the included database migration
From this folder, run:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

The migration creates the Better Auth tables (`user`, `session`, `account`, `verification`) and the app tables (`recruitment`, `recruitment_role`, `team_member`, `application`).

If you previously created some of these tables manually, inspect the database before applying the migration. Do not reset or drop tables containing data.

## 3. Optional sample content
```bash
npm run seed:demo
```
This inserts sample roles and team members only when those tables are empty.

## 4. Start the site
```bash
npm run dev
```

If you want Prisma to create tables directly from the schema without migrations during local development, this project also defines `npm run db:push`. Prefer the migration workflow above for repeatable setup.
