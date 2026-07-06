"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// DESIGN §7 "Badges (when clickable, e.g. size filter)": a toggle chip, NOT a solid status
// pill. Default = sand surface + hairline border; selected = solid accent. Disabled via
// ghosted colors (aria-disabled, no opacity). Radius 0 (§4), no shadow (§6). Rendered as a
// <span> by default; pass `render={<button />}` (Base UI's asChild) for the interactive filter.
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-none border px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors duration-150 ease-out outline-none select-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-disabled:pointer-events-none aria-disabled:border-border-subtle aria-disabled:text-[var(--secondary)] [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default:
          "border-border-default bg-surface text-foreground hover:border-border-hover aria-disabled:bg-surface",
        selected:
          "border-border-strong bg-primary text-primary-foreground aria-disabled:bg-surface",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    render,
    state: { slot: "badge" },
    props: mergeProps<"span">(
      { className: cn(badgeVariants({ variant }), className) },
      props
    ),
  })
}

export { Badge, badgeVariants }
