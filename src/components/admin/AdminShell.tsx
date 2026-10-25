// src/components/admin/AdminShell.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/recruitment", label: "Recruitment", icon: Megaphone },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/applications", label: "Applications", icon: Inbox },
];

export default function AdminShell({
  email,
  newApplications,
  children,
}: {
  email: string;
  newApplications: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 p-4 md:flex-row md:p-6">
      <aside className="md:w-64 md:shrink-0">
        <div className="glass flex flex-col gap-1 p-4 md:sticky md:top-6 md:min-h-[calc(100vh-3rem)]">
          <Link href="/admin" className="mb-4 flex items-center gap-3 px-2 py-2">
            <Image src="/logo.svg" alt="" width={26} height={28} className="invert" />
            <div>
              <p className="font-display text-lg leading-none text-white">CYBERSHIELD</p>
              <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan">
                Admin
              </p>
            </div>
          </Link>

          <nav aria-label="Admin" className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
                      : "text-white/65 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {href === "/admin/applications" && newApplications > 0 && (
                    <span className="ml-auto rounded-full bg-cyan px-2 py-0.5 text-[0.65rem] font-bold text-[#04121a]">
                      {newApplications}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto hidden flex-col gap-2 pt-6 md:flex">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn !justify-start !rounded-2xl !text-xs"
            >
              <ExternalLink className="h-4 w-4" />
              View public site
            </a>
            <p className="truncate px-2 text-xs text-white/40">{email}</p>
            <button type="button" onClick={signOut} className="btn !justify-start !rounded-2xl !text-xs">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 pb-10">
        {children}
        <div className="mt-10 flex gap-3 md:hidden">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn !text-xs">
            View site
          </a>
          <button type="button" onClick={signOut} className="btn !text-xs">
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}
