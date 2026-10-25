// src/lib/defaults.ts
// Used until an admin saves the recruitment settings for the first time.
export const RECRUITMENT_ID = "recruitment-default";

export type RecruitmentSettings = {
  eyebrow: string;
  heading: string;
  intro: string;
  isOpen: boolean;
  deadline: string | null;
  applyLabel: string;
  closedNotice: string;
};

export const DEFAULT_SETTINGS: RecruitmentSettings = {
  eyebrow: "Recruitment",
  heading: "Join CyberShield",
  intro:
    "We're looking for curious, driven students to help us run events, build projects and grow the community. Pick a role below and apply.",
  isOpen: true,
  deadline: null,
  applyLabel: "Apply now",
  closedNotice:
    "Recruitment is currently closed. Check back soon for the next round.",
};
