"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

// Base UI Switch (Root renders <span>+hidden <input>, Thumb is the moving indicator).
// No DESIGN.md spec exists for switches specifically — treated as a form control (radius
// 2px, same bucket as Input/Select) rather than a pill, to stay consistent with the
// "no soft/rounded shapes" quiet-luxury language. Off = surface fill + hairline border,
// on = solid accent (mirrors Badge's default/selected split). Boolean state is
// present-when-true, matched via data-[checked] per the established Base UI convention.

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "inline-flex h-5 w-10 shrink-0 items-center rounded-sm border border-border-default bg-surface p-0.5 transition-colors duration-150 ease-out outline-none hover:border-border-hover focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[checked]:border-border-strong data-[checked]:bg-primary disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-surface",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="block size-4 rounded-sm bg-background transition-transform duration-150 ease-out data-[checked]:translate-x-5 disabled:bg-[var(--secondary)]"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
