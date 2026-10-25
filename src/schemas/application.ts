// src/schemas/application.ts
import { z } from "zod";

const text = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max} characters`);

// Public form submission (POST /api/applications)
export const applicationSubmitSchema = z.object({
  roleKey: text("Role", 100),
  name: text("Name", 100),
  department: text("Department", 100),
  rollNo: text("Roll number", 30),
  email: z
    .union([z.literal(""), z.string().trim().email("Enter a valid email").max(150)])
    .optional(),
  reason: text("Reason", 2000),
  experience: text("Experience", 2000),
  // Honeypot: real people never see or fill this field
  website: z.string().optional(),
});

export const applicationStatusSchema = z.enum([
  "NEW",
  "SHORTLISTED",
  "SELECTED",
  "REJECTED",
]);

export const applicationUpdateSchema = z.object({
  status: applicationStatusSchema,
});

export type ApplicationSubmitInput = z.infer<typeof applicationSubmitSchema>;
export type ApplicationStatusValue = z.infer<typeof applicationStatusSchema>;
