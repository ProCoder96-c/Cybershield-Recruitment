// src/app/api/admin/team/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { adminGuard } from "@/lib/session";
import { teamUpdateSchema } from "@/schemas/team";
import { saveTeamMembers } from "@/services/team";

// PUT (admin only): save the whole team list
export async function PUT(request: NextRequest) {
  const denied = await adminGuard();
  if (denied) return denied;

  try {
    const { members } = teamUpdateSchema.parse(await request.json());
    const saved = await saveTeamMembers(members);
    revalidatePath("/");
    return NextResponse.json({ members: saved });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 },
      );
    }
    console.error("Error saving team", error);
    return NextResponse.json({ error: "Failed to save team" }, { status: 500 });
  }
}
