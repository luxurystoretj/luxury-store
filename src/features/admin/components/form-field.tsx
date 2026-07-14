import type { ReactNode } from "react"

// No Label primitive exists in src/components/ui — this is a feature-level composition
// (label + control + inline error), not a new base primitive, so it doesn't need the
// same sign-off as Switch/AlertDialog/Table. Micro/Label treatment per DESIGN §2 (11px
// uppercase, Inter 600, +0.12em tracking) — same style already used by StatCard's label.

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, required, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase"
      >
        {label}
        {required && <span className="text-[var(--error)]"> *</span>}
      </label>
      {children}
      {error && <p className="text-sm text-[var(--error)]">{error}</p>}
    </div>
  );
}
