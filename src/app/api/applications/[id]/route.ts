// src/app/api/applications/[id]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminGuard } from "@/lib/session";
import { applicationUpdateSchema } from "@/schemas/application";
import { deleteApplication, updateApplicationStatus } from "@/services/applications";

type Ctx = { params: Promise<{ id: string }> };

// PATCH (admin only): change an application's status
export async function PATCH(request: NextRequest, { params }: Ctx) {
  const denied = await adminGuard();
  if (denied) return denied;

  try {
    const { id } = await params;
    const { status } = applicationUpdateSchema.parse(await request.json());
    const application = await updateApplicationStatus(id, status);
    return NextResponse.json({ application });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("Error updating application", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

// DELETE (admin only)
export async function DELETE(_request: NextRequest, { params }: Ctx) {
  const denied = await adminGuard();
  if (denied) return denied;

  try {
    const { id } = await params;
    await deleteApplication(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("Error deleting application", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
