import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

// DESIGN §7 Inputs: bg #FAFAF8 / border #D4CFC4 (default) → #9B9489 (hover) → #6B5D4F
// (focus, + accent outline). Error via aria-invalid → #B53F3F. Disabled: surface bg,
// subtle border, ghosted #9B9489 text (no opacity). Radius 2px (§4), padding 12/14 (§3).
// Placeholder gray #9B9489 has no bg/text utility (text-muted-foreground would work but
// bg-secondary=surface), so the exact token [var(--secondary)] is used explicitly.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full min-w-0 rounded-sm border border-border-default bg-background px-3.5 py-3 text-base text-foreground transition-colors duration-150 ease-out outline-none placeholder:text-[var(--secondary)] hover:border-border-hover focus-visible:border-border-strong focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:bg-surface disabled:border-border-subtle disabled:text-[var(--secondary)] aria-[invalid=true]:border-[var(--error)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
