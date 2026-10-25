// src/app/login/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin login | CyberShield",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      <LoginForm />
    </main>
  );
}
