import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassPanelProps {
  children: ReactNode
  className?: string
  variant?: "default" | "strong"
  showBorder?: boolean
}

export function GlassPanel({ children, className, variant = "default", showBorder = true }: GlassPanelProps) {
  return (
    <div
      className={cn("rounded-2xl p-6", variant === "default" ? "glass" : "glass-strong", className)}
      style={!showBorder ? { border: "none" } : undefined}
    >
      {children}
    </div>
  )
}
