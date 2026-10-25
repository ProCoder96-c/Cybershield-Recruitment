// src/scripts/seed-demo.ts
// Optional: inserts sample roles and team members so the site isn't empty on
// first run. Only inserts into tables that are completely empty.
// Usage: npm run seed:demo
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  try {
    if ((await prisma.recruitmentRole.count()) === 0) {
      await prisma.recruitmentRole.createMany({
        data: [
          {
            key: "web-developer",
            title: "Web Developer",
            team: "Tech",
            description: "Build and maintain the club website and internal tools.",
            requirements: ["Basic HTML, CSS and JavaScript", "Willingness to learn React"],
            order: 1,
          },
          {
            key: "ctf-lead",
            title: "CTF & Security Lead",
            team: "Security",
            description: "Design challenges and run our capture-the-flag events and workshops.",
            requirements: ["Interest in web or crypto challenges", "Comfortable teaching beginners"],
            order: 2,
          },
          {
            key: "event-coordinator",
            title: "Event Coordinator",
            team: "Events",
            description: "Plan and run talks, workshops and club meetups from start to finish.",
            requirements: ["Good communication", "Organised and reliable"],
            order: 3,
          },
        ],
      });
      console.log("Added sample roles");
    }

    if ((await prisma.teamMember.count()) === 0) {
      await prisma.teamMember.createMany({
        data: [
          { name: "Aarav Mehta", position: "President", group: "Core Team", bio: "Leads the club and the CTF track.", order: 1 },
          { name: "Riya Sharma", position: "Vice President", group: "Core Team", order: 2 },
          { name: "Kabir Singh", position: "Web Lead", group: "Tech", order: 3 },
          { name: "Isha Patel", position: "Design Lead", group: "Tech", order: 4 },
        ],
      });
      console.log("Added sample team members");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
