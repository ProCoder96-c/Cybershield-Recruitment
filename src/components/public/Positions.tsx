// src/components/public/Positions.tsx
"use client";

import { useState } from "react";
import type { RecruitmentSettings } from "@/lib/defaults";
import type { PublicRole } from "@/lib/types";
import ApplyModal from "./ApplyModal";

export default function Positions({
  settings,
  roles,
}: {
  settings: RecruitmentSettings;
  roles: PublicRole[];
}) {
  const [applyingTo, setApplyingTo] = useState<PublicRole | null>(null);
  const hasOpenRoles = settings.isOpen && roles.length > 0;

  return (
    <section
      id="positions"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 md:px-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label !text-cyan">Open positions</p>
          <h2 className="font-display text-4xl text-white md:text-5xl">
            Find your role
          </h2>
        </div>
        {hasOpenRoles && settings.deadline && (
          <span className="chip">Apply by {settings.deadline}</span>
        )}
      </div>

      {!hasOpenRoles ? (
        <div className="glass mt-10 p-8 text-white/75 md:p-10">{settings.closedNotice}</div>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {roles.map((role) => (
            <li key={role.key} className="glass glass-lift flex flex-col p-7 md:p-8">
              {role.team && <span className="chip mb-4 w-fit">{role.team}</span>}
              <h3 className="font-display text-2xl text-white">{role.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{role.description}</p>

              {role.requirements.length > 0 && (
                <ul className="mt-5 space-y-2.5 text-sm text-white/80">
                  {role.requirements.map((req, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto pt-8">
                <button
                  type="button"
                  onClick={() => setApplyingTo(role)}
                  className="btn btn-primary"
                >
                  {settings.applyLabel}
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {applyingTo && (
        <ApplyModal
          role={{ key: applyingTo.key, title: applyingTo.title }}
          onClose={() => setApplyingTo(null)}
        />
      )}
    </section>
  );
}
