// src/scripts/create-admin.ts
// Creates (or resets the password of) an admin account.
// Usage: npm run seed:admin   (reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from .env)
//
// Sign-up is disabled in the app on purpose, so this talks to the database
// directly and uses better-auth's own password hashing.
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? "Site Admin";

async function main() {
  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file");
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  try {
    const passwordHash = await hashPassword(password);
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      await prisma.account.updateMany({
        where: { userId: existing.id, providerId: "credential" },
        data: { password: passwordHash },
      });
      console.log(`Admin already existed. Password reset for ${email}`);
      return;
    }

    const userId = randomUUID();
    await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        emailVerified: true,
        accounts: {
          create: {
            id: randomUUID(),
            accountId: userId,
            providerId: "credential",
            password: passwordHash,
          },
        },
      },
    });
    console.log(`Admin created: ${email}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
