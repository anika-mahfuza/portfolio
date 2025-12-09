"use client"

import type { ReactNode } from "react"

interface AnimatedBorderProps {
  children: ReactNode
  className?: string
  borderColor?: string
  duration?: number
}

export function AnimatedBorder({
  children,
  className = "",
  borderColor = "rgba(255, 255, 255, 0.5)",
  duration = 3,
}: AnimatedBorderProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{
          borderRadius: "inherit",
          background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)`,
          backgroundSize: "200% 100%",
          animation: `border-shimmer ${duration}s linear infinite`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      {children}
    </div>
  )
}
