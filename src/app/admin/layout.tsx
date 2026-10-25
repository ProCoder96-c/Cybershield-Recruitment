// src/app/admin/layout.tsx
import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/session";

export const metadata: Metadata = {
  title: "Admin | CyberShield",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdminPage();
  const newApplications = await prisma.application.count({ where: { status: "NEW" } });

  return (
    <AdminShell email={session.user.email} newApplications={newApplications}>
      {children}
    </AdminShell>
  );
}
