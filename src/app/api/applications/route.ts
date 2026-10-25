// src/app/api/applications/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/session";
import { isRateLimited } from "@/lib/rate-limit";
import { applicationSubmitSchema } from "@/schemas/application";
import {
  ApplicationError,
  createApplication,
  listApplications,
} from "@/services/applications";
import { ZodError } from "zod";

// POST (public): submit an application from the website form
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(`apply:${ip}`)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 },
      );
    }

    const parsed = applicationSubmitSchema.parse(await request.json());

    // Honeypot filled in => a bot. Pretend it worked, store nothing.
    if (parsed.website) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    await createApplication(parsed);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid form data" },
        { status: 400 },
      );
    }
    if (error instanceof ApplicationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    console.error("Error submitting application", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}

// GET (admin only): list all applications
export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;

  try {
    return NextResponse.json({ applications: await listApplications() });
  } catch (error) {
    console.error("Error fetching applications", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
