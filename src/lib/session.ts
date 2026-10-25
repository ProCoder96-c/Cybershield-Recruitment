// src/lib/session.ts
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

// For admin pages / layouts: redirects to the login screen if signed out.
export async function requireAdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

// For admin API routes. Returns a 401 response when signed out, else null.
export async function adminGuard() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
