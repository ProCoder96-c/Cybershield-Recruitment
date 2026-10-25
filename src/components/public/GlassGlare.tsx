// src/components/public/GlassGlare.tsx
"use client";

import { useEffect } from "react";

// One global listener: moves the glare highlight on whichever glass panel
// the pointer is over (sets --mx / --my on it).
export default function GlassGlare() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const el = target?.closest?.<HTMLElement>(".glass");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
