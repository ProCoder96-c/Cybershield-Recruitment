// src/app/admin/page.tsx
import Link from "next/link";
import { Inbox, Megaphone, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/session";
import { getRecruitment } from "@/services/recruitment";

export default async function AdminHome() {
  await requireAdminPage();

  const [{ settings, roles }, members, total, fresh, latest] = await Promise.all([
    getRecruitment(),
    prisma.teamMember.count(),
    prisma.application.count(),
    prisma.application.count({ where: { status: "NEW" } }),
    prisma.application.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const openRoles = roles.filter((r) => r.isOpen).length;

  const cards = [
    {
      href: "/admin/applications",
      icon: Inbox,
      label: "Applications",
      value: total,
      note: `${fresh} new`,
    },
    {
      href: "/admin/recruitment",
      icon: Megaphone,
      label: "Open positions",
      value: openRoles,
      note: `${roles.length} total · ${settings.isOpen ? "applications open" : "applications closed"}`,
    },
    {
      href: "/admin/team",
      icon: Users,
      label: "Team members",
      value: members,
      note: "shown on the site",
    },
  ];

  return (
    <>
      <PageHeader title="Overview" subtitle="A quick look at your recruitment drive" />

      <div className="grid gap-5 md:grid-cols-3">
        {cards.map(({ href, icon: Icon, label, value, note }) => (
          <Link key={href} href={href} className="glass glass-lift block p-6">
            <Icon className="h-5 w-5 text-cyan" />
            <p className="label mt-5 !mb-1">{label}</p>
            <p className="font-display text-5xl text-white">{value}</p>
            <p className="mt-2 text-xs text-white/50">{note}</p>
          </Link>
        ))}
      </div>

      <section className="glass mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="label !mb-0">Latest applications</h2>
          <Link href="/admin/applications" className="text-xs text-cyan hover:underline">
            View all
          </Link>
        </div>

        {latest.length === 0 ? (
          <p className="py-6 text-center text-sm text-white/45">No applications yet</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {latest.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    {a.name}
                    <span className="ml-2 font-mono text-xs font-normal text-white/45">{a.rollNo}</span>
                  </p>
                  <p className="text-xs text-white/50">
                    {a.roleTitle} · {a.department}
                  </p>
                </div>
                <span className="chip">{a.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
