// src/components/public/Hero.tsx
import type { RecruitmentSettings } from "@/lib/defaults";

export default function Hero({
  settings,
  openRoles,
  teamCount,
}: {
  settings: RecruitmentSettings;
  openRoles: number;
  teamCount: number;
}) {
  const accepting = settings.isOpen && openRoles > 0;

  return (
    <section
      id="top"
      className="mx-auto flex min-h-[92vh] w-full max-w-6xl flex-col justify-center px-5 pb-16 pt-32 md:px-8"
    >
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip glass-pill">{settings.eyebrow}</span>
          <span className="chip">
            <span className={`dot ${accepting ? "" : "dot-off"}`} />
            {accepting ? "Applications open" : "Applications closed"}
          </span>
          {accepting && settings.deadline && (
            <span className="chip">Apply by {settings.deadline}</span>
          )}
        </div>

        <h1 className="font-display text-gradient mt-7 text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          {settings.heading}
        </h1>

        <p className="mt-7 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
          {settings.intro}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a href="#positions" className="btn btn-primary !px-7 !py-3.5 text-sm">
            {accepting ? settings.applyLabel : "View positions"}
          </a>
          {teamCount > 0 && (
            <a href="#team" className="btn !px-7 !py-3.5 text-sm">
              Meet the team
            </a>
          )}
        </div>

        <dl className="mt-14 flex flex-wrap gap-4">
          <div className="glass glass-pill px-6 py-3">
            <dt className="label !mb-0.5">Open positions</dt>
            <dd className="font-display text-3xl text-white">{openRoles}</dd>
          </div>
          {teamCount > 0 && (
            <div className="glass glass-pill px-6 py-3">
              <dt className="label !mb-0.5">Team members</dt>
              <dd className="font-display text-3xl text-white">{teamCount}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
