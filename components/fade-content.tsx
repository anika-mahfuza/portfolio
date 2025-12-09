"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

interface FadeContentProps {
  children: ReactNode
  className?: string
  blur?: boolean
  duration?: number
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  threshold?: number
}

export function FadeContent({
  children,
  className = "",
  blur = true,
  duration = 700,
  delay = 0,
  direction = "up",
  distance = 30,
  threshold = 0.1,
}: FadeContentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)"
    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`
      case "down":
        return `translate3d(0, -${distance}px, 0)`
      case "left":
        return `translate3d(${distance}px, 0, 0)`
      case "right":
        return `translate3d(-${distance}px, 0, 0)`
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        filter: blur && !isVisible ? "blur(10px)" : "blur(0)",
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms, filter ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
