import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Color note (DESIGN.md «Галерея» + globals.css slot mapping):
// the tobacco accent #6B5D4F is the `primary` slot (bg-primary / bg-primary-hover /
// bg-primary-active / outline-ring). shadcn's `accent` slot maps to the SAND surface,
// so accent-colored TEXT uses [var(--accent)], never text-accent. The disabled/ghost
// gray #9B9489 has no bg-* utility (bg-secondary = surface), so it uses [var(--secondary)].
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-none border border-transparent text-sm font-medium whitespace-nowrap transition-colors duration-150 ease-out outline-none select-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        // Primary (DESIGN §7): solid accent, ghosted-gray disabled (no opacity).
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active disabled:bg-[var(--secondary)] disabled:text-primary-foreground",
        // Secondary / outline (DESIGN §7): hairline border, surface hover, subtle active.
        outline:
          "border-border-default bg-transparent text-foreground hover:bg-muted hover:border-border-hover active:bg-border-subtle active:border-border-strong disabled:bg-transparent disabled:text-[var(--secondary)] disabled:border-border-subtle",
        // Tertiary / text (DESIGN §7): no fill; underline appears on hover (1px) / active (2px) at 4px offset.
        ghost:
          "bg-transparent text-foreground underline-offset-4 hover:text-[var(--accent)] hover:underline hover:decoration-1 active:text-[var(--accent)] active:underline active:decoration-2 disabled:text-[var(--secondary)] disabled:no-underline",
      },
      size: {
        // DESIGN §3 button padding: medium 12/24, large 16/32 (padding-driven, no fixed height).
        default: "px-6 py-3",
        lg: "px-8 py-4",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
