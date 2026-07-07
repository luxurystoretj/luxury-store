import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

// DESIGN §3/§5: 1440px max content width, gutters 16/24/48 (mobile/tablet/desktop).
function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1440px] px-4 md:px-6 lg:px-12", className)}
      {...props}
    />
  )
}

export { Container }
