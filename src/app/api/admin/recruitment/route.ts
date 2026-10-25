// src/app/api/admin/recruitment/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { adminGuard } from "@/lib/session";
import { recruitmentUpdateSchema } from "@/schemas/recruitment";
import { saveRecruitment } from "@/services/recruitment";

// PUT (admin only): save page settings + roles
export async function PUT(request: NextRequest) {
  const denied = await adminGuard();
  if (denied) return denied;

  try {
    const parsed = recruitmentUpdateSchema.parse(await request.json());
    const data = await saveRecruitment(parsed);
    revalidatePath("/");
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 },
      );
    }
    if (error instanceof Error && error.message === "Role keys must be unique") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Error saving recruitment", error);
    return NextResponse.json({ error: "Failed to save recruitment" }, { status: 500 });
  }
}
