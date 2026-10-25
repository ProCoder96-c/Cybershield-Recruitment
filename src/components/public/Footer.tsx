// src/components/public/Footer.tsx
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pb-10 pt-6 md:px-8">
      <div className="glass flex flex-wrap items-center justify-between gap-4 !rounded-3xl px-6 py-5">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="" width={22} height={24} className="invert" />
          <span className="font-display tracking-wide text-white">CYBERSHIELD</span>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/50">
          © {new Date().getFullYear()} CyberShield. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
