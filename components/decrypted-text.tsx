"use client"

import { useState, useEffect, useRef } from "react"

interface DecryptedTextProps {
  text: string
  className?: string
  speed?: number
  revealDelay?: number
  characters?: string
  animateOnView?: boolean
}

export function DecryptedText({
  text,
  className = "",
  speed = 30,
  revealDelay = 500,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*",
  animateOnView = true,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (hasAnimated && animateOnView) return

    const startAnimation = () => {
      setHasAnimated(true)
      let currentIndex = 0
      const textLength = text.length

      // First show random characters
      const scrambleInterval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, i) => {
              if (char === " ") return " "
              if (i < currentIndex) return text[i]
              return characters[Math.floor(Math.random() * characters.length)]
            })
            .join(""),
        )
      }, 50)

      // Then reveal one by one
      setTimeout(() => {
        const revealInterval = setInterval(() => {
          currentIndex++
          if (currentIndex > textLength) {
            clearInterval(scrambleInterval)
            clearInterval(revealInterval)
            setDisplayText(text)
          }
        }, speed)
      }, revealDelay)
    }

    if (animateOnView) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated) {
            startAnimation()
          }
        },
        { threshold: 0.5 },
      )

      if (ref.current) observer.observe(ref.current)
      return () => observer.disconnect()
    } else {
      const timer = setTimeout(startAnimation, 300)
      return () => clearTimeout(timer)
    }
  }, [text, speed, revealDelay, characters, animateOnView, hasAnimated])

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {displayText ||
        text
          .split("")
          .map(() => " ")
          .join("")}
    </span>
  )
}
