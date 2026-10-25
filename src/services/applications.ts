// src/services/applications.ts
import { prisma } from "@/lib/prisma";
import { RECRUITMENT_ID, DEFAULT_SETTINGS } from "@/lib/defaults";
import type {
  ApplicationStatusValue,
  ApplicationSubmitInput,
} from "@/schemas/application";

export class ApplicationError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

// Create an application after checking the role is actually open.
export async function createApplication(input: ApplicationSubmitInput) {
  const [settings, role] = await Promise.all([
    prisma.recruitment.findUnique({ where: { id: RECRUITMENT_ID } }),
    prisma.recruitmentRole.findUnique({ where: { key: input.roleKey } }),
  ]);

  const isOpen = settings ? settings.isOpen : DEFAULT_SETTINGS.isOpen;
  if (!isOpen) {
    throw new ApplicationError("Applications are currently closed.", 403);
  }
  if (!role || !role.isOpen) {
    throw new ApplicationError("This position is not open.", 404);
  }

  const rollNo = input.rollNo.trim().toUpperCase();

  const existing = await prisma.application.findFirst({
    where: { roleKey: role.key, rollNo },
    select: { id: true },
  });
  if (existing) {
    throw new ApplicationError("You have already applied for this position.", 409);
  }

  try {
    return await prisma.application.create({
      data: {
        roleKey: role.key,
        roleTitle: role.title,
        name: input.name,
        department: input.department,
        rollNo,
        email: input.email?.trim() || null,
        reason: input.reason,
        experience: input.experience,
      },
      select: { id: true },
    });
  } catch (error: unknown) {
    // Two simultaneous submissions: the unique index catches the second one
    if ((error as { code?: string })?.code === "P2002") {
      throw new ApplicationError("You have already applied for this position.", 409);
    }
    throw error;
  }
}

export async function listApplications() {
  return prisma.application.findMany({ orderBy: { createdAt: "desc" } });
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatusValue,
) {
  return prisma.application.update({ where: { id }, data: { status } });
}

export async function deleteApplication(id: string) {
  await prisma.application.delete({ where: { id } });
}
