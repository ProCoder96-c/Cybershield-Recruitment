// src/app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { adminGuard } from "@/lib/session";

const MAX_BYTES = 5 * 1024 * 1024;

// POST (admin only): upload a team photo to Vercel Blob
export async function POST(request: Request) {
  const denied = await adminGuard();
  if (denied) return denied;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Photo upload isn't configured (BLOB_READ_WRITE_TOKEN is missing). Paste an image URL instead.",
      },
      { status: 501 },
    );
  }

  try {
    const file = (await request.formData()).get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/") || file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Only image files up to 5MB are allowed" },
        { status: 400 },
      );
    }

    const ext = file.name.match(/\.[a-zA-Z0-9]+$/)?.[0].toLowerCase() ?? ".jpg";
    const blob = await put(`team/${crypto.randomUUID()}${ext}`, file, {
      access: "public",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Error uploading team photo", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
