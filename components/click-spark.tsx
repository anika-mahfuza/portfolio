"use client"

import type React from "react"

import { useRef, useCallback, type ReactNode } from "react"

interface ClickSparkProps {
  children: ReactNode
  sparkColor?: string
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
}

interface Spark {
  id: number
  x: number
  y: number
  angle: number
}

export function ClickSpark({
  children,
  sparkColor = "rgba(255, 255, 255, 0.8)",
  sparkSize = 10,
  sparkRadius = 20,
  sparkCount = 8,
  duration = 400,
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sparksRef = useRef<HTMLDivElement>(null)

  const createSpark = useCallback(
    (e: React.MouseEvent) => {
      if (!sparksRef.current || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement("div")
        const angle = (360 / sparkCount) * i
        const radians = (angle * Math.PI) / 180

        spark.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: ${sparkSize}px;
          height: 2px;
          background: ${sparkColor};
          border-radius: 1px;
          transform-origin: 0 50%;
          transform: rotate(${angle}deg);
          pointer-events: none;
          z-index: 9999;
        `

        sparksRef.current.appendChild(spark)

        // Animate
        spark.animate(
          [
            { opacity: 1, transform: `rotate(${angle}deg) translateX(0)` },
            { opacity: 0, transform: `rotate(${angle}deg) translateX(${sparkRadius}px)` },
          ],
          {
            duration,
            easing: "ease-out",
            fill: "forwards",
          },
        ).onfinish = () => spark.remove()
      }
    },
    [sparkColor, sparkSize, sparkRadius, sparkCount, duration],
  )

  return (
    <div ref={containerRef} onClick={createSpark} className="relative">
      <div ref={sparksRef} className="absolute inset-0 overflow-visible pointer-events-none" />
      {children}
    </div>
  )
}
