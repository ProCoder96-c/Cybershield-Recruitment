// src/app/admin/recruitment/RecruitmentEditor.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import { Field, PageHeader, VisibilityToggle } from "@/components/admin/ui";
import type { RecruitmentSettings } from "@/lib/defaults";

type Role = {
  key: string;
  title: string;
  team: string | null;
  description: string;
  requirements: string[];
  isOpen: boolean;
  order: number;
};

export default function RecruitmentEditor({
  initialSettings,
  initialRoles,
}: {
  initialSettings: RecruitmentSettings;
  initialRoles: Role[];
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [roles, setRoles] = useState(initialRoles);
  const [saving, setSaving] = useState(false);

  const setField = <K extends keyof RecruitmentSettings>(
    field: K,
    value: RecruitmentSettings[K],
  ) => setSettings((prev) => ({ ...prev, [field]: value }));

  const patchRole = (key: string, patch: Partial<Role>) =>
    setRoles((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const addRole = () => {
    const maxOrder = roles.length ? Math.max(...roles.map((r) => r.order)) : 0;
    setRoles((prev) => [
      ...prev,
      {
        key: `role-${crypto.randomUUID().slice(0, 8)}`,
        title: "New role",
        team: "",
        description: "Describe the role.",
        requirements: [],
        isOpen: true,
        order: maxOrder + 1,
      },
    ]);
  };

  const removeRole = (role: Role) => {
    if (!window.confirm(`Remove "${role.title}"? Existing applications are kept.`)) return;
    setRoles((prev) => prev.filter((r) => r.key !== role.key));
  };

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/recruitment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, roles }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Failed to save");
      setSettings(data.settings);
      setRoles(
        data.roles.map((r: Role) => ({
          key: r.key,
          title: r.title,
          team: r.team,
          description: r.description,
          requirements: r.requirements,
          isOpen: r.isOpen,
          order: r.order,
        })),
      );
      toast.success("Recruitment saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Recruitment"
        subtitle="The text on the page and the positions people can apply for"
        actions={
          <button onClick={save} disabled={saving} className="btn btn-primary">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </button>
        }
      />

      <section className="glass space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="label !mb-0">Page content</h2>
          <VisibilityToggle
            value={settings.isOpen}
            onChange={(v) => setField("isOpen", v)}
            onLabel="Applications open"
            offLabel="Applications closed"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Small label above heading">
            <input
              className="field"
              value={settings.eyebrow}
              onChange={(e) => setField("eyebrow", e.target.value)}
            />
          </Field>
          <Field label="Heading">
            <input
              className="field"
              value={settings.heading}
              onChange={(e) => setField("heading", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Intro">
          <textarea
            rows={3}
            className="field resize-y"
            value={settings.intro}
            onChange={(e) => setField("intro", e.target.value)}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Deadline (free text, optional)">
            <input
              className="field"
              placeholder="31 March 2027"
              value={settings.deadline ?? ""}
              onChange={(e) => setField("deadline", e.target.value || null)}
            />
          </Field>
          <Field label="Apply button label">
            <input
              className="field"
              value={settings.applyLabel}
              onChange={(e) => setField("applyLabel", e.target.value)}
            />
          </Field>
        </div>

        <Field
          label="Message shown when applications are closed"
          hint="Also shown when there are no open positions."
        >
          <textarea
            rows={2}
            className="field resize-y"
            value={settings.closedNotice}
            onChange={(e) => setField("closedNotice", e.target.value)}
          />
        </Field>
      </section>

      <section className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="label !mb-0">Positions ({roles.length})</h2>
          <button onClick={addRole} className="btn !py-2 !text-xs">
            <Plus className="h-4 w-4" />
            Add position
          </button>
        </div>

        {roles.length === 0 && (
          <div className="glass p-10 text-center text-sm text-white/45">
            No positions yet. Add one to start taking applications.
          </div>
        )}

        {roles.map((role) => (
          <div key={role.key} className="glass space-y-4 p-6">
            <div className="grid gap-4 sm:grid-cols-[1fr_1fr_90px]">
              <Field label="Title">
                <input
                  className="field"
                  value={role.title}
                  onChange={(e) => patchRole(role.key, { title: e.target.value })}
                />
              </Field>
              <Field label="Team">
                <input
                  className="field"
                  placeholder="Tech, Design, Events..."
                  value={role.team ?? ""}
                  onChange={(e) => patchRole(role.key, { team: e.target.value })}
                />
              </Field>
              <Field label="Order">
                <input
                  type="number"
                  min={0}
                  className="field text-center"
                  value={role.order}
                  onChange={(e) => patchRole(role.key, { order: Number(e.target.value) })}
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                rows={2}
                className="field resize-y"
                value={role.description}
                onChange={(e) => patchRole(role.key, { description: e.target.value })}
              />
            </Field>

            <Field label="Requirements (one per line)">
              <textarea
                rows={3}
                className="field resize-y"
                value={role.requirements.join("\n")}
                onChange={(e) =>
                  patchRole(role.key, { requirements: e.target.value.split("\n") })
                }
              />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs text-white/35">key: {role.key}</span>
              <div className="flex items-center gap-2">
                <VisibilityToggle
                  value={role.isOpen}
                  onChange={(v) => patchRole(role.key, { isOpen: v })}
                  onLabel="Open"
                  offLabel="Closed"
                />
                <button
                  onClick={() => removeRole(role)}
                  aria-label={`Remove ${role.title}`}
                  className="btn btn-danger !h-9 !w-9 !p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
