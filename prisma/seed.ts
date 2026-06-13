/**
 * prisma/seed.ts
 * Seeds the database with an initial Surveillant account.
 * Run with: npx prisma db seed
 */

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient, Role, UserStatus } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Surveillant ────────────────────────────────────────────────────────────
  const surveillantEmail =
    process.env.SEED_SURVEILLANT_EMAIL ?? "admin@school.mg";
  const surveillantPassword =
    process.env.SEED_SURVEILLANT_PASSWORD ?? "Admin@1234!";

  const existing = await prisma.user.findUnique({
    where: { email: surveillantEmail },
  });

  if (!existing) {
    const passwordHash = await bcrypt.hash(surveillantPassword, 12);
    await prisma.user.create({
      data: {
        email: surveillantEmail,
        passwordHash,
        role: Role.SURVEILLANT,
        status: UserStatus.ACTIVE,
      },
    });
    console.log(`✅ Created Surveillant: ${surveillantEmail}`);
    console.log(`   Default password: ${surveillantPassword}`);
    console.log("   ⚠️  Change this password immediately after first login!");
  } else {
    console.log(`ℹ️  Surveillant already exists: ${surveillantEmail}`);
  }

  // ── Sample Academic Year (optional, comment out for production) ────────────
  if (process.env.SEED_SAMPLE_DATA === "true") {
    const year = await prisma.academicYear.upsert({
      where: { id: "seed-academic-year-2025" },
      update: {},
      create: {
        id: "seed-academic-year-2025",
        label: "2024-2025",
        periodType: "TRIMESTER",
        periodCount: 3,
        startDate: new Date("2024-10-01"),
        endDate: new Date("2025-07-31"),
        isActive: true,
        periods: {
          create: [
            {
              number: 1,
              label: "Trimestre 1",
              startDate: new Date("2024-10-01"),
              endDate: new Date("2024-12-31"),
            },
            {
              number: 2,
              label: "Trimestre 2",
              startDate: new Date("2025-01-06"),
              endDate: new Date("2025-03-31"),
            },
            {
              number: 3,
              label: "Trimestre 3",
              startDate: new Date("2025-04-07"),
              endDate: new Date("2025-07-31"),
            },
          ],
        },
      },
    });
    console.log(`✅ Created sample academic year: ${year.label}`);

    // Sample subjects
    const subjects = await Promise.all([
      prisma.subject.upsert({
        where: { id: "seed-sub-math" },
        update: {},
        create: { id: "seed-sub-math", name: "Mathématiques", coefficient: 4 },
      }),
      prisma.subject.upsert({
        where: { id: "seed-sub-fr" },
        update: {},
        create: { id: "seed-sub-fr", name: "Français", coefficient: 3 },
      }),
      prisma.subject.upsert({
        where: { id: "seed-sub-mg" },
        update: {},
        create: { id: "seed-sub-mg", name: "Malagasy", coefficient: 2 },
      }),
      prisma.subject.upsert({
        where: { id: "seed-sub-sci" },
        update: {},
        create: {
          id: "seed-sub-sci",
          name: "Sciences Physiques",
          coefficient: 3,
        },
      }),
    ]);
    console.log(`✅ Created ${subjects.length} sample subjects`);

    // Sample class
    const sampleClass = await prisma.class.upsert({
      where: { id: "seed-class-term-a" },
      update: {},
      create: {
        id: "seed-class-term-a",
        name: "Terminale A",
        level: "Terminale",
        academicYearId: year.id,
      },
    });
    console.log(`✅ Created sample class: ${sampleClass.name}`);
  }

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
