"use client"

import { useEffect, useRef, useState } from "react"

interface StaggerTextProps {
  text: string
  className?: string
  staggerDelay?: number
  as?: "h1" | "h2" | "h3" | "p" | "span"
}

export function StaggerText({ text, className = "", staggerDelay = 30, as: Tag = "span" }: StaggerTextProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const letters = text.split("")

  return (
    <Tag ref={ref as any} className={`inline-block ${className}`}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className="inline-block transition-all duration-300 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
            transitionDelay: `${index * staggerDelay}ms`,
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </Tag>
  )
}
