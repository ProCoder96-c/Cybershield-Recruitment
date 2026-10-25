// src/app/login/LoginForm.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    setError("");

    const { error } = await authClient.signIn.email({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });

    if (error) {
      setError("Wrong email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="glass glass-strong w-full max-w-md space-y-5 p-8 md:p-10">
      <div className="flex flex-col items-center text-center">
        <Image src="/logo.svg" alt="" width={44} height={47} className="invert" priority />
        <h1 className="font-display mt-4 text-3xl text-white">Admin login</h1>
        <p className="mt-1 text-sm text-white/55">CyberShield recruitment</p>
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-2xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary w-full !py-3">
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
