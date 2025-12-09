"use client"

import { useEffect, useRef } from "react"

interface RainEffectProps {
  isActive: boolean
}

interface RainDrop {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
  thickness: number
}

export function RainEffect({ isActive }: RainEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dropsRef = useRef<RainDrop[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    // Initialize rain drops
    const dropCount = Math.floor((canvas.width * canvas.height) / 15000)
    dropsRef.current = Array.from({ length: dropCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 4 + 2,
      opacity: Math.random() * 0.3 + 0.1,
      thickness: Math.random() * 1.5 + 0.5,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      dropsRef.current.forEach((drop) => {
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x + drop.length * 0.1, drop.y + drop.length)
        ctx.strokeStyle = `rgba(200, 220, 255, ${drop.opacity})`
        ctx.lineWidth = drop.thickness
        ctx.lineCap = "round"
        ctx.stroke()

        // Update position
        drop.y += drop.speed
        drop.x += drop.speed * 0.1

        // Reset when off screen
        if (drop.y > canvas.height) {
          drop.y = -drop.length
          drop.x = Math.random() * canvas.width
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive])

  if (!isActive) return null

  return <canvas ref={canvasRef} className="fixed inset-0 z-10 pointer-events-none opacity-60" />
}
