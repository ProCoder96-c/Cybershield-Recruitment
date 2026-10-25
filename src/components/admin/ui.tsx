// src/components/admin/ui.tsx
import type { ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-white/40">{hint}</span>}
    </label>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-white md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-white/55">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

export function VisibilityToggle({
  value,
  onChange,
  onLabel,
  offLabel,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
  onLabel: string;
  offLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      aria-pressed={value}
      className={`btn !px-4 !py-2 !text-xs ${
        value
          ? "!border-emerald-300/40 !text-emerald-200"
          : "!border-red-300/40 !text-red-200"
      }`}
    >
      {value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      {value ? onLabel : offLabel}
    </button>
  );
}
