import { FormField } from "@/features/admin/components/form-field"
import { Input } from "@/components/ui/input"

export type Lang = "ru" | "tj" | "en";

export interface TrilingualValues {
  ru: string;
  tj: string;
  en: string;
}

interface TrilingualFieldProps {
  legend: string;
  required?: boolean;
  multiline?: boolean;
  idPrefix: string;
  values: TrilingualValues;
  onChange: (lang: Lang, value: string) => void;
  errors?: Partial<Record<Lang, string>>;
}

const LANG_LABELS: Record<Lang, string> = { ru: "RU", tj: "TJ", en: "EN" };

// Renders one field group across all three languages — used for every trilingual column
// (name/description/composition/color on Product, name on Category, description on Brand).
// Admin UI is Russian-only chrome, but the underlying data is trilingual per schema, so all
// three variants are always shown and editable together, not resolved via pickLocale.
export function TrilingualField({
  legend,
  required,
  multiline,
  idPrefix,
  values,
  onChange,
  errors,
}: TrilingualFieldProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-[11px] font-semibold tracking-[0.12em] text-foreground uppercase">
        {legend}
        {required && <span className="text-[var(--error)]"> *</span>}
      </legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(["ru", "tj", "en"] as const).map((lang) => {
          const id = `${idPrefix}-${lang}`;
          return (
            <FormField
              key={lang}
              label={LANG_LABELS[lang]}
              htmlFor={id}
              error={errors?.[lang]}
            >
              {multiline ? (
                <textarea
                  id={id}
                  value={values[lang]}
                  onChange={(e) => onChange(lang, e.target.value)}
                  rows={3}
                  aria-invalid={Boolean(errors?.[lang])}
                  className="flex w-full min-w-0 resize-y rounded-sm border border-border-default bg-background px-3.5 py-3 text-base text-foreground transition-colors duration-150 ease-out outline-none placeholder:text-[var(--secondary)] hover:border-border-hover focus-visible:border-border-strong focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[invalid=true]:border-[var(--error)]"
                />
              ) : (
                <Input
                  id={id}
                  value={values[lang]}
                  onChange={(e) => onChange(lang, e.target.value)}
                  aria-invalid={Boolean(errors?.[lang])}
                />
              )}
            </FormField>
          );
        })}
      </div>
    </fieldset>
  );
}
