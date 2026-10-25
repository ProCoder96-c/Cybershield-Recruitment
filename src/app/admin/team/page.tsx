// src/app/admin/team/page.tsx
import { requireAdminPage } from "@/lib/session";
import { listTeamMembers } from "@/services/team";
import TeamEditor from "./TeamEditor";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  await requireAdminPage();
  const members = await listTeamMembers();

  return (
    <TeamEditor
      initialMembers={members.map((m) => ({
        id: m.id,
        name: m.name,
        position: m.position,
        group: m.group,
        bio: m.bio,
        imageUrl: m.imageUrl,
        linkedinUrl: m.linkedinUrl,
        githubUrl: m.githubUrl,
        order: m.order,
        isVisible: m.isVisible,
      }))}
    />
  );
}
