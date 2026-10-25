// src/lib/types.ts
// Plain, serialisable shapes passed from server pages to client components.
export type PublicRole = {
  key: string;
  title: string;
  team: string | null;
  description: string;
  requirements: string[];
};

export type PublicMember = {
  id: string;
  name: string;
  position: string;
  group: string | null;
  bio: string | null;
  imageUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
};
