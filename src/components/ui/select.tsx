"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Base UI Select parts (Root/Trigger/Value/Icon/Portal/Positioner/Popup/Item/ItemText/
// ItemIndicator/GroupLabel/Separator) restyled to DESIGN §7. Trigger reads as an Input
// (radius 2px, hairline border → hover #9B9489 → focus #6B5D4F + accent outline). Popup:
// opaque bg, hairline border, dropdown shadow, opacity+translateY(-4px) enter/exit (§10)
// via Base UI's data-[starting-style]/[ending-style] transitions. Item highlight = surface;
// selected = accent text + weight 500. Boolean states are present-when-true → matched with
// bracketed presence selectors (data-[highlighted], data-[selected], data-[disabled]).
// Icons use lucide directly for now — TODO(T2.4): swap to <UIIcon>.

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-sm border border-border-default bg-background px-3.5 py-3 text-base text-foreground transition-colors duration-150 ease-out outline-none select-none data-[placeholder]:text-[var(--secondary)] hover:border-border-hover focus-visible:border-border-strong focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[disabled]:cursor-not-allowed data-[disabled]:border-border-subtle data-[disabled]:bg-surface data-[disabled]:text-[var(--secondary)] [&>span]:truncate",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="flex text-[var(--secondary)]">
        <ChevronDownIcon size={16} strokeWidth={2} aria-hidden />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Popup> & { sideOffset?: number }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        sideOffset={sideOffset}
        className="z-50 outline-none"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "max-h-[var(--available-height)] min-w-[var(--anchor-width)] overflow-y-auto rounded-sm border border-border-default bg-popover p-1 text-popover-foreground shadow-dropdown outline-none transition-[opacity,transform] duration-200 ease-out data-[starting-style]:-translate-y-1 data-[starting-style]:opacity-0 data-[ending-style]:-translate-y-1 data-[ending-style]:opacity-0",
            className
          )}
          {...props}
        >
          {children}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-none py-2 pr-8 pl-3 text-base text-foreground outline-none select-none transition-colors duration-150 ease-out data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[selected]:bg-muted data-[selected]:font-medium data-[selected]:text-[var(--accent)] data-[disabled]:pointer-events-none data-[disabled]:text-[var(--secondary)]",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-2 flex items-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon
            size={16}
            strokeWidth={2}
            className="text-[var(--accent)]"
            aria-hidden
          />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.GroupLabel>) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        "px-3 py-1.5 text-xs font-medium tracking-[0.12em] text-[var(--secondary)] uppercase",
        className
      )}
      {...props}
    />
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border-subtle", className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
}
