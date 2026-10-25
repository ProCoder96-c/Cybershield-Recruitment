// src/schemas/recruitment.ts
import { z } from "zod";

const required = z.string().trim().min(1, "Required");

export const recruitmentSettingsSchema = z.object({
  eyebrow: required.max(60),
  heading: required.max(120),
  intro: required.max(1000),
  isOpen: z.boolean(),
  deadline: z.string().trim().max(60).optional().nullable(),
  applyLabel: required.max(40),
  closedNotice: required.max(500),
});

export const recruitmentRoleSchema = z.object({
  key: required.max(100),
  title: required.max(120),
  team: z.string().trim().max(60).optional().nullable(),
  description: required.max(1500),
  requirements: z.array(z.string().trim().max(300)).max(20),
  isOpen: z.boolean(),
  order: z.number().int().nonnegative(),
});

export const recruitmentUpdateSchema = z.object({
  settings: recruitmentSettingsSchema,
  roles: z.array(recruitmentRoleSchema).max(100),
});

export type RecruitmentUpdateInput = z.infer<typeof recruitmentUpdateSchema>;
