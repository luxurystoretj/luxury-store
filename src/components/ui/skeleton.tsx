import * as React from "react"

import { cn } from "@/lib/utils"

// DESIGN §8: skeleton is the default loading state — flat surface (#F0EEE9), radius 0.
// NO shimmer/pulse: §10 forbids cyclic animation and §8 notes "shimmer reads cheap".
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("rounded-none bg-surface", className)}
      {...props}
    />
  )
}

export { Skeleton }
