// src/app/page.tsx
import Hero from "@/components/public/Hero";
import SiteNav from "@/components/public/SiteNav";
import Positions from "@/components/public/Positions";
import TeamGrid from "@/components/public/TeamGrid";
import Footer from "@/components/public/Footer";
import { getRecruitment } from "@/services/recruitment";
import { listTeamMembers } from "@/services/team";

// Content comes from the database, so render on every request
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ settings, roles }, members] = await Promise.all([
    getRecruitment(),
    listTeamMembers({ visibleOnly: true }),
  ]);

  const openRoles = roles
    .filter((r) => r.isOpen)
    .map((r) => ({
      key: r.key,
      title: r.title,
      team: r.team,
      description: r.description,
      requirements: r.requirements,
    }));

  const team = members.map((m) => ({
    id: m.id,
    name: m.name,
    position: m.position,
    group: m.group,
    bio: m.bio,
    imageUrl: m.imageUrl,
    linkedinUrl: m.linkedinUrl,
    githubUrl: m.githubUrl,
  }));

  return (
    <>
      <SiteNav showTeam={team.length > 0} />
      <main>
        <Hero settings={settings} openRoles={openRoles.length} teamCount={team.length} />
        <Positions settings={settings} roles={openRoles} />
        <TeamGrid members={team} />
      </main>
      <Footer />
    </>
  );
}
