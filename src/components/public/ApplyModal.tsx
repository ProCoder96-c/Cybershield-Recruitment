// src/components/public/ApplyModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  role: { key: string; title: string };
  onClose: () => void;
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ApplyModal({ role, onClose }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Focus the first field, close on Escape, stop the page behind from scrolling
  useEffect(() => {
    firstFieldRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = new FormData(e.currentTarget);
    const payload = {
      roleKey: role.key,
      name: String(form.get("name") ?? ""),
      department: String(form.get("department") ?? ""),
      rollNo: String(form.get("rollNo") ?? ""),
      email: String(form.get("email") ?? ""),
      reason: String(form.get("reason") ?? ""),
      experience: String(form.get("experience") ?? ""),
      website: String(form.get("website") ?? ""), // honeypot
    };

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof TypeError
          ? "Could not reach the server. Check your connection and try again."
          : error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      );
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-title"
        className="glass glass-strong max-h-[92vh] w-full max-w-2xl overflow-y-auto !rounded-b-none sm:max-h-[88vh] sm:!rounded-b-[28px]"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#0a0f20]/60 px-6 py-5 backdrop-blur-xl md:px-8">
          <div>
            <p className="label !mb-1 !text-cyan">Application</p>
            <h2 id="apply-title" className="font-display text-2xl text-white">
              {role.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn !h-9 !w-9 !p-0 text-lg leading-none"
          >
            ×
          </button>
        </div>

        {status === "success" ? (
          <div className="px-6 py-14 text-center md:px-8">
            <div className="btn-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full border text-2xl text-white shadow-[0_0_40px_-5px_rgba(0,216,205,0.8)]">
              ✓
            </div>
            <h3 className="font-display mt-6 text-3xl text-white">Application received</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              Thanks for applying for {role.title}. We&apos;ll review it and get back to you.
            </p>
            <button type="button" onClick={onClose} className="btn mt-8">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6 md:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="apply-name" className="label">
                  Full name
                </label>
                <input
                  ref={firstFieldRef}
                  id="apply-name"
                  name="name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="apply-roll" className="label">
                  Roll number
                </label>
                <input
                  id="apply-roll"
                  name="rollNo"
                  required
                  maxLength={30}
                  autoComplete="off"
                  className="field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="apply-dept" className="label">
                  Department
                </label>
                <input
                  id="apply-dept"
                  name="department"
                  required
                  maxLength={100}
                  placeholder="e.g. Computer Science"
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="apply-email" className="label">
                  Email (optional)
                </label>
                <input
                  id="apply-email"
                  name="email"
                  type="email"
                  maxLength={150}
                  autoComplete="email"
                  className="field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="apply-reason" className="label">
                Why do you want to apply for this position?
              </label>
              <textarea
                id="apply-reason"
                name="reason"
                required
                rows={4}
                maxLength={2000}
                className="field resize-y"
              />
            </div>

            <div>
              <label htmlFor="apply-exp" className="label">
                Past experience or knowledge related to this position
              </label>
              <textarea
                id="apply-exp"
                name="experience"
                required
                rows={4}
                maxLength={2000}
                placeholder={'If you have none yet, write "None" and tell us what you\'d like to learn.'}
                className="field resize-y"
              />
            </div>

            {/* Honeypot: hidden from people, bots tend to fill it in */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {status === "error" && (
              <p
                role="alert"
                className="rounded-2xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-100"
              >
                {message}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="btn">
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn btn-primary"
              >
                {status === "submitting" ? "Submitting..." : "Submit application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
