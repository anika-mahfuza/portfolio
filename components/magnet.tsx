"use client"

import { useRef, useState, type ReactNode, type MouseEvent } from "react"

interface MagnetProps {
  children: ReactNode
  padding?: number
  strength?: number
  className?: string
}

export function Magnet({ children, padding = 100, strength = 0.3, className = "" }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
    const maxDistance = padding + Math.max(rect.width, rect.height) / 2

    if (distance < maxDistance) {
      setPosition({
        x: distanceX * strength,
        y: distanceY * strength,
      })
    }
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 && position.y === 0 ? "transform 0.5s ease-out" : "transform 0.15s ease-out",
      }}
    >
      {children}
    </div>
  )
}
