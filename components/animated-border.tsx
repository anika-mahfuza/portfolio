"use client"

import type { ReactNode } from "react"

interface AnimatedBorderProps {
  children: ReactNode
  className?: string
  borderColor?: string
}

export function AnimatedBorder({
  children,
  className = "",
  borderColor = "rgba(255, 255, 255, 0.5)",
}: AnimatedBorderProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{
          borderRadius: "inherit",
          background: `linear-gradient(145deg, ${borderColor}, rgba(255, 255, 255, 0.05))`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
    </div>
  )
}
