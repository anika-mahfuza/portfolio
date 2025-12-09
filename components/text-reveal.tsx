"use client"

import { useEffect, useRef, useState } from "react"

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

export function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <span
        className="inline-block transition-transform duration-700 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
        }}
      >
        {text}
      </span>
    </span>
  )
}
