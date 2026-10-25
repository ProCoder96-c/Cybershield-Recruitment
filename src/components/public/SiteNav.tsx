// src/components/public/SiteNav.tsx
import Image from "next/image";

export default function SiteNav({ showTeam }: { showTeam: boolean }) {
  return (
    <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <nav
        aria-label="Main"
        className="glass glass-pill flex w-full max-w-3xl items-center justify-between gap-2 py-2 pl-3 pr-2"
      >
        <a href="#top" className="flex items-center gap-2.5 rounded-full pr-2">
          <Image src="/logo.svg" alt="" width={24} height={26} className="invert" priority />
          <span className="font-display text-lg tracking-wide text-white">CYBERSHIELD</span>
        </a>

        <div className="flex items-center gap-1">
          <a
            href="#positions"
            className="hidden rounded-full px-4 py-2 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:block"
          >
            Positions
          </a>
          {showTeam && (
            <a
              href="#team"
              className="hidden rounded-full px-4 py-2 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:block"
            >
              Team
            </a>
          )}
          <a href="#positions" className="btn btn-primary !py-2">
            Apply
          </a>
        </div>
      </nav>
    </header>
  );
}
