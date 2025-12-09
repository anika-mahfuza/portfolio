"use client"

import { useEffect, useRef, useState } from "react"

interface BlurTextProps {
  text: string
  delay?: number
  className?: string
  animateBy?: "words" | "letters"
}

export function BlurText({ text, delay = 100, className = "", animateBy = "words" }: BlurTextProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

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

  const items = animateBy === "words" ? text.split(" ") : text.split("")

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {items.map((item, index) => (
        <span
          key={index}
          className="inline-block transition-all duration-500 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? "blur(0px)" : "blur(10px)",
            transform: isVisible ? "translateY(0)" : "translateY(8px)",
            transitionDelay: isVisible ? `${index * delay}ms` : "0ms",
          }}
        >
          {item}
          {animateBy === "words" && index < items.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  )
}
