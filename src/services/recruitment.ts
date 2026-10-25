// src/services/recruitment.ts
import { prisma } from "@/lib/prisma";
import { DEFAULT_SETTINGS, RECRUITMENT_ID } from "@/lib/defaults";
import type { RecruitmentUpdateInput } from "@/schemas/recruitment";

// Settings fall back to defaults until the first save.
export async function getRecruitment() {
  const [row, roles] = await Promise.all([
    prisma.recruitment.findUnique({ where: { id: RECRUITMENT_ID } }),
    prisma.recruitmentRole.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
  ]);

  const settings = row
    ? {
        eyebrow: row.eyebrow,
        heading: row.heading,
        intro: row.intro,
        isOpen: row.isOpen,
        deadline: row.deadline,
        applyLabel: row.applyLabel,
        closedNotice: row.closedNotice,
      }
    : DEFAULT_SETTINGS;

  return { settings, roles };
}

// Save settings and sync roles (roles missing from the payload are deleted).
export async function saveRecruitment({ settings, roles }: RecruitmentUpdateInput) {
  const keys = roles.map((r) => r.key);

  if (new Set(keys).size !== keys.length) {
    throw new Error("Role keys must be unique");
  }

  const data = { ...settings, deadline: settings.deadline?.trim() || null };

  await prisma.$transaction(async (tx) => {
    await tx.recruitment.upsert({
      where: { id: RECRUITMENT_ID },
      create: { id: RECRUITMENT_ID, ...data },
      update: data,
    });

    await tx.recruitmentRole.deleteMany({ where: { key: { notIn: keys } } });

    for (const [index, role] of roles.entries()) {
      const roleData = {
        title: role.title,
        team: role.team?.trim() || null,
        description: role.description,
        requirements: role.requirements.map((r) => r.trim()).filter(Boolean),
        isOpen: role.isOpen,
        order: role.order > 0 ? role.order : index + 1,
      };

      await tx.recruitmentRole.upsert({
        where: { key: role.key },
        create: { key: role.key, ...roleData },
        update: roleData,
      });
    }
  });

  return getRecruitment();
}
