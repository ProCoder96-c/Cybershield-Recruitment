// src/app/admin/applications/page.tsx
import { requireAdminPage } from "@/lib/session";
import { listApplications } from "@/services/applications";
import ApplicationsManager from "./ApplicationsManager";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  await requireAdminPage();
  const applications = await listApplications();

  return (
    <ApplicationsManager
      initial={applications.map((a) => ({
        id: a.id,
        roleKey: a.roleKey,
        roleTitle: a.roleTitle,
        name: a.name,
        department: a.department,
        rollNo: a.rollNo,
        email: a.email,
        reason: a.reason,
        experience: a.experience,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
      }))}
    />
  );
}
