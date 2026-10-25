/* eslint-disable @next/next/no-img-element */
// src/app/admin/team/TeamEditor.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2, Upload, User } from "lucide-react";
import { Field, PageHeader, VisibilityToggle } from "@/components/admin/ui";

type Member = {
  id?: string;
  name: string;
  position: string;
  group: string | null;
  bio: string | null;
  imageUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  order: number;
  isVisible: boolean;
};

// Local list item: keeps a stable React key before a member has been saved
type Row = Member & { rowKey: string };

const toRows = (list: Member[]): Row[] =>
  list.map((m) => ({ ...m, rowKey: m.id ?? crypto.randomUUID() }));

export default function TeamEditor({ initialMembers }: { initialMembers: Member[] }) {
  const [rows, setRows] = useState<Row[]>(() => toRows(initialMembers));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const patch = (rowKey: string, p: Partial<Member>) =>
    setRows((prev) => prev.map((r) => (r.rowKey === rowKey ? { ...r, ...p } : r)));

  const add = () => {
    const maxOrder = rows.length ? Math.max(...rows.map((r) => r.order)) : 0;
    setRows((prev) => [
      ...prev,
      {
        rowKey: crypto.randomUUID(),
        name: "New member",
        position: "Member",
        group: "Core Team",
        bio: null,
        imageUrl: null,
        linkedinUrl: null,
        githubUrl: null,
        order: maxOrder + 1,
        isVisible: true,
      },
    ]);
  };

  const remove = (row: Row) => {
    if (!window.confirm(`Remove ${row.name} from the team?`)) return;
    setRows((prev) => prev.filter((r) => r.rowKey !== row.rowKey));
  };

  async function upload(rowKey: string, file: File) {
    setUploading(rowKey);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Upload failed");
      patch(rowKey, { imageUrl: data.url });
      toast.success("Photo uploaded. Remember to save.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setSaving(true);
    try {
      const members = rows.map((row) => {
        const { rowKey, ...member } = row;
        void rowKey;
        return member;
      });
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Failed to save");
      setRows(toRows(data.members));
      toast.success("Team saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Team"
        subtitle="People shown on the public page. Same Group = same heading. Lower Order shows first."
        actions={
          <>
            <button onClick={add} className="btn">
              <Plus className="h-4 w-4" />
              Add member
            </button>
            <button onClick={save} disabled={saving} className="btn btn-primary">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save changes"}
            </button>
          </>
        }
      />

      <div className="space-y-4">
        {rows.length === 0 && (
          <div className="glass p-12 text-center text-sm text-white/45">
            No team members yet.{" "}
            <button onClick={add} className="text-cyan underline">
              Add the first one
            </button>
          </div>
        )}

        {rows.map((m) => (
          <div key={m.rowKey} className="glass flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
            <div className="flex shrink-0 flex-col items-center gap-3">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl bg-white/8 ring-1 ring-white/15">
                {m.imageUrl ? (
                  <img src={m.imageUrl} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-white/30" />
                )}
              </div>
              <label className="btn cursor-pointer !px-4 !py-2 !text-xs">
                <Upload className="h-3.5 w-3.5" />
                {uploading === m.rowKey ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) upload(m.rowKey, file);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr_80px]">
                <Field label="Name">
                  <input
                    className="field"
                    value={m.name}
                    onChange={(e) => patch(m.rowKey, { name: e.target.value })}
                  />
                </Field>
                <Field label="Position">
                  <input
                    className="field"
                    value={m.position}
                    onChange={(e) => patch(m.rowKey, { position: e.target.value })}
                  />
                </Field>
                <Field label="Group">
                  <input
                    className="field"
                    placeholder="Core Team, Tech..."
                    value={m.group ?? ""}
                    onChange={(e) => patch(m.rowKey, { group: e.target.value || null })}
                  />
                </Field>
                <Field label="Order">
                  <input
                    type="number"
                    min={0}
                    className="field text-center"
                    value={m.order}
                    onChange={(e) => patch(m.rowKey, { order: Number(e.target.value) })}
                  />
                </Field>
              </div>

              <Field label="Photo URL" hint="Filled automatically by Upload, or paste any image link.">
                <input
                  className="field"
                  placeholder="https://..."
                  value={m.imageUrl ?? ""}
                  onChange={(e) => patch(m.rowKey, { imageUrl: e.target.value || null })}
                />
              </Field>

              <Field label="Short bio (optional)">
                <textarea
                  rows={2}
                  className="field resize-y"
                  value={m.bio ?? ""}
                  onChange={(e) => patch(m.rowKey, { bio: e.target.value || null })}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="LinkedIn URL (optional)">
                  <input
                    className="field"
                    value={m.linkedinUrl ?? ""}
                    onChange={(e) => patch(m.rowKey, { linkedinUrl: e.target.value || null })}
                  />
                </Field>
                <Field label="GitHub URL (optional)">
                  <input
                    className="field"
                    value={m.githubUrl ?? ""}
                    onChange={(e) => patch(m.rowKey, { githubUrl: e.target.value || null })}
                  />
                </Field>
              </div>

              <div className="flex items-center justify-end gap-2">
                <VisibilityToggle
                  value={m.isVisible}
                  onChange={(v) => patch(m.rowKey, { isVisible: v })}
                  onLabel="Visible"
                  offLabel="Hidden"
                />
                <button
                  onClick={() => remove(m)}
                  aria-label={`Remove ${m.name}`}
                  className="btn btn-danger !h-9 !w-9 !p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
