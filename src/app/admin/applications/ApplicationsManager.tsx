// src/app/admin/applications/ApplicationsManager.tsx
"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Download, RefreshCw, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";

type Status = "NEW" | "SHORTLISTED" | "SELECTED" | "REJECTED";

type Application = {
  id: string;
  roleKey: string;
  roleTitle: string;
  name: string;
  department: string;
  rollNo: string;
  email: string | null;
  reason: string;
  experience: string;
  status: Status;
  createdAt: string;
};

const STATUSES: Status[] = ["NEW", "SHORTLISTED", "SELECTED", "REJECTED"];

const statusTone: Record<Status, string> = {
  NEW: "!border-sky-300/40 !text-sky-200",
  SHORTLISTED: "!border-amber-300/40 !text-amber-200",
  SELECTED: "!border-emerald-300/40 !text-emerald-200",
  REJECTED: "!border-red-300/40 !text-red-200",
};

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

export default function ApplicationsManager({ initial }: { initial: Application[] }) {
  const [apps, setApps] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | Status>("ALL");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const roles = useMemo(
    () => Array.from(new Set(apps.map((a) => a.roleTitle))).sort(),
    [apps],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return apps.filter(
      (a) =>
        (roleFilter === "ALL" || a.roleTitle === roleFilter) &&
        (statusFilter === "ALL" || a.status === statusFilter) &&
        (!q ||
          a.name.toLowerCase().includes(q) ||
          a.rollNo.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q)),
    );
  }, [apps, roleFilter, statusFilter, search]);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setApps(
        data.applications.map((a: Application & { createdAt: string }) => ({
          ...a,
          createdAt: new Date(a.createdAt).toISOString(),
        })),
      );
    } catch {
      toast.error("Failed to refresh applications");
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: string, status: Status) {
    const previous = apps;
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setApps(previous);
      toast.error("Failed to update status");
    }
  }

  async function remove(a: Application) {
    if (!window.confirm(`Delete the application from ${a.name}?`)) return;
    try {
      const res = await fetch(`/api/applications/${a.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setApps((prev) => prev.filter((x) => x.id !== a.id));
      toast.success("Application deleted");
    } catch {
      toast.error("Failed to delete application");
    }
  }

  function exportCsv() {
    const header = [
      "Submitted",
      "Role",
      "Name",
      "Department",
      "Roll No",
      "Email",
      "Status",
      "Why this position",
      "Experience",
    ];
    const rows = filtered.map((a) => [
      a.createdAt,
      a.roleTitle,
      a.name,
      a.department,
      a.rollNo,
      a.email ?? "",
      a.status,
      a.reason,
      a.experience,
    ]);
    const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");

    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        title="Applications"
        subtitle={`${apps.length} total · ${filtered.length} shown`}
        actions={
          <>
            <button onClick={refresh} className="btn">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button onClick={exportCsv} disabled={filtered.length === 0} className="btn btn-primary">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <input
          className="field !w-auto min-w-56 flex-1"
          placeholder="Search name, roll no or department"
          aria-label="Search applications"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="field !w-auto"
          aria-label="Filter by role"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          className="field !w-auto"
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "ALL" | Status)}
        >
          <option value="ALL">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 && (
        <div className="glass p-12 text-center text-sm text-white/45">
          {apps.length === 0 ? "No applications yet" : "No applications match these filters"}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((a) => {
          const isOpen = openId === a.id;
          return (
            <div key={a.id} className="glass !rounded-3xl">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <button
                  onClick={() => setOpenId(isOpen ? null : a.id)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-white/45 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {a.name}
                      <span className="ml-2 font-mono text-xs font-normal text-white/45">
                        {a.rollNo}
                      </span>
                    </p>
                    <p className="truncate text-xs text-white/50">
                      {a.roleTitle} · {a.department} ·{" "}
                      {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>

                <select
                  value={a.status}
                  onChange={(e) => changeStatus(a.id, e.target.value as Status)}
                  aria-label={`Status for ${a.name}`}
                  className={`btn !px-4 !py-2 !text-xs ${statusTone[a.status]}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-[#0b1020] text-white">
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => remove(a)}
                  aria-label={`Delete application from ${a.name}`}
                  className="btn btn-danger !h-9 !w-9 !p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {isOpen && (
                <div className="grid gap-5 border-t border-white/10 p-5 sm:grid-cols-2">
                  <div>
                    <p className="label">Why do they want this position?</p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
                      {a.reason}
                    </p>
                  </div>
                  <div>
                    <p className="label">Past experience / knowledge</p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
                      {a.experience}
                    </p>
                  </div>
                  {a.email && (
                    <div className="sm:col-span-2">
                      <p className="label">Email</p>
                      <a href={`mailto:${a.email}`} className="text-sm text-cyan hover:underline">
                        {a.email}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
