// src/services/team.ts
import { prisma } from "@/lib/prisma";
import type { TeamMemberInput } from "@/schemas/team";

export async function listTeamMembers(options?: { visibleOnly?: boolean }) {
  return prisma.teamMember.findMany({
    where: options?.visibleOnly ? { isVisible: true } : {},
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

// Sync the whole list: members missing from the payload are deleted,
// members with an id are updated, members without one are created.
export async function saveTeamMembers(items: TeamMemberInput[]) {
  const keepIds = items.map((i) => i.id).filter((id): id is string => !!id);

  await prisma.$transaction(async (tx) => {
    await tx.teamMember.deleteMany({ where: { id: { notIn: keepIds } } });

    for (const [index, item] of items.entries()) {
      const data = {
        name: item.name,
        position: item.position,
        group: item.group?.trim() || null,
        bio: item.bio?.trim() || null,
        imageUrl: item.imageUrl?.trim() || null,
        linkedinUrl: item.linkedinUrl?.trim() || null,
        githubUrl: item.githubUrl?.trim() || null,
        order: item.order > 0 ? item.order : index + 1,
        isVisible: item.isVisible,
      };

      if (item.id) {
        await tx.teamMember.upsert({
          where: { id: item.id },
          create: { id: item.id, ...data },
          update: data,
        });
      } else {
        await tx.teamMember.create({ data });
      }
    }
  });

  return listTeamMembers();
}
