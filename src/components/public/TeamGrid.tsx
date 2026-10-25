/* eslint-disable @next/next/no-img-element */
// src/components/public/TeamGrid.tsx
import type { PublicMember } from "@/lib/types";

const DEFAULT_GROUP = "The Team";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

// Group members by `group`, keeping the order in which groups first appear
function groupMembers(members: PublicMember[]) {
  const groups = new Map<string, PublicMember[]>();
  for (const m of members) {
    const key = m.group?.trim() || DEFAULT_GROUP;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  }
  return Array.from(groups.entries());
}

function MemberCard({ member }: { member: PublicMember }) {
  return (
    <article className="glass glass-lift group flex flex-col overflow-hidden !rounded-3xl p-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white/5">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="font-display flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/30 to-cyan/20 text-5xl text-white/70">
            {initials(member.name)}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/15" />
      </div>

      <div className="px-2 pb-2 pt-4">
        <h3 className="text-lg font-semibold leading-tight text-white">{member.name}</h3>
        <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-cyan">
          {member.position}
        </p>
        {member.bio && (
          <p className="mt-3 text-sm leading-relaxed text-white/65">{member.bio}</p>
        )}
        {(member.linkedinUrl || member.githubUrl) && (
          <div className="mt-4 flex gap-2">
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="chip transition-colors hover:bg-white/15"
              >
                LinkedIn
              </a>
            )}
            {member.githubUrl && (
              <a
                href={member.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="chip transition-colors hover:bg-white/15"
              >
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function TeamGrid({ members }: { members: PublicMember[] }) {
  if (members.length === 0) return null;
  const groups = groupMembers(members);

  return (
    <section id="team" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 md:px-8">
      <p className="label !text-cyan">Team</p>
      <h2 className="font-display text-4xl text-white md:text-5xl">The people behind CyberShield</h2>

      {groups.map(([group, list]) => (
        <div key={group} className="mt-14">
          <h3 className="label mb-5 border-b border-white/10 pb-3">{group}</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {list.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
