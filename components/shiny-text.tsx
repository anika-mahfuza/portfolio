"use client"

import { useEffect, useRef } from "react"

interface ShinyTextProps {
  text: string
  className?: string
  shimmerWidth?: number
  speed?: number
}

export function ShinyText({ text, className = "", shimmerWidth = 100, speed = 3 }: ShinyTextProps) {
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = textRef.current
    if (!el) return

    let animationFrame: number
    let position = -shimmerWidth

    const animate = () => {
      position += speed
      if (position > el.offsetWidth + shimmerWidth) {
        position = -shimmerWidth
      }

      el.style.backgroundImage = `
        linear-gradient(
          90deg,
          currentColor 0%,
          currentColor ${Math.max(0, position - shimmerWidth)}px,
          rgba(255, 255, 255, 0.8) ${position}px,
          currentColor ${position + shimmerWidth}px,
          currentColor 100%
        )
      `

      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [shimmerWidth, speed])

  return (
    <span
      ref={textRef}
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: "linear-gradient(90deg, currentColor, currentColor)",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }}
    >
      {text}
    </span>
  )
}
