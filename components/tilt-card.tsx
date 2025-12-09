"use client"

import type React from "react"

import { useRef, useState, type ReactNode } from "react"

interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltAmount?: number
  glareEnable?: boolean
  glareMaxOpacity?: number
}

export function TiltCard({
  children,
  className = "",
  tiltAmount = 10,
  glareEnable = true,
  glareMaxOpacity = 0.15,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState("")
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -tiltAmount
    const rotateY = ((x - centerX) / centerX) * tiltAmount

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
    setGlarePosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 })
  }

  const handleMouseLeave = () => {
    setTransform("")
    setIsHovering(false)
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-200 ease-out ${className}`}
      style={{ transform, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {children}
      {glareEnable && isHovering && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glareMaxOpacity}) 0%, transparent 60%)`,
            }}
          />
        </div>
      )}
    </div>
  )
}
