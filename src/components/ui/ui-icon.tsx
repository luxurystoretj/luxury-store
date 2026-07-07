import type { LucideIcon, LucideProps } from "lucide-react"

// DESIGN §9: size presets (px), context-dependent stroke width — 16px uses 2 for
// legibility at low DPI, 20px+ uses 1.5 for the thin luxury look (overrides lucide's
// own default of 2). Color stays lucide's built-in `currentColor` default, untouched.
type UIIconSize = 16 | 20 | 24 | 32

interface UIIconProps extends Omit<LucideProps, "size"> {
  icon: LucideIcon
  size?: UIIconSize
}

function UIIcon({ icon: Icon, size = 20, strokeWidth, ...props }: UIIconProps) {
  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth ?? (size === 16 ? 2 : 1.5)}
      {...props}
    />
  )
}

export { UIIcon }
export type { UIIconProps, UIIconSize }
