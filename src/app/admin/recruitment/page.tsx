// src/app/admin/recruitment/page.tsx
import { requireAdminPage } from "@/lib/session";
import { getRecruitment } from "@/services/recruitment";
import RecruitmentEditor from "./RecruitmentEditor";

export const dynamic = "force-dynamic";

export default async function RecruitmentPage() {
  await requireAdminPage();
  const { settings, roles } = await getRecruitment();

  return (
    <RecruitmentEditor
      initialSettings={settings}
      initialRoles={roles.map((r) => ({
        key: r.key,
        title: r.title,
        team: r.team,
        description: r.description,
        requirements: r.requirements,
        isOpen: r.isOpen,
        order: r.order,
      }))}
    />
  );
}
