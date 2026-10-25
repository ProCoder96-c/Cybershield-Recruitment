// src/schemas/team.ts
import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().nullable();

export const teamMemberSchema = z.object({
  id: z.string().min(1).max(191).optional(),
  name: z.string().trim().min(1, "Name is required").max(100),
  position: z.string().trim().min(1, "Position is required").max(100),
  group: optionalText(60),
  bio: optionalText(500),
  imageUrl: optionalText(1000),
  linkedinUrl: optionalText(500),
  githubUrl: optionalText(500),
  order: z.number().int().nonnegative(),
  isVisible: z.boolean(),
});

export const teamUpdateSchema = z.object({
  members: z.array(teamMemberSchema).max(300),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
