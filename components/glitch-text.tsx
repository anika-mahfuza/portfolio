"use client"

import { useState, useEffect } from "react"

interface GlitchTextProps {
  text: string
  className?: string
  speed?: number
  enableHover?: boolean
}

export function GlitchText({ text, className = "", speed = 50, enableHover = true }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)

  const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`"

  useEffect(() => {
    if (!isGlitching) {
      setDisplayText(text)
      return
    }

    let iteration = 0
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index]
            if (char === " ") return " "
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          })
          .join(""),
      )

      if (iteration >= text.length) {
        setIsGlitching(false)
        clearInterval(interval)
      }

      iteration += 1 / 3
    }, speed)

    return () => clearInterval(interval)
  }, [isGlitching, text, speed])

  // Initial glitch on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsGlitching(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <span
      className={`inline-block font-mono ${className}`}
      onMouseEnter={enableHover ? () => setIsGlitching(true) : undefined}
      style={{ minWidth: `${text.length}ch` }}
    >
      {displayText}
    </span>
  )
}
