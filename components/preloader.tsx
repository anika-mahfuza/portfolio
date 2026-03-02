"use client"

import { useEffect, useRef, useState } from "react"

interface PreloaderProps {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [showName, setShowName] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Show name immediately
    const showTimer = setTimeout(() => {
      setShowName(true)
    }, 300)

    // Exit animation after 1.5 seconds
    const exitTimer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.clipPath = "inset(100% 0 0 0)"
      }
      setTimeout(onComplete, 800)
    }, 1500)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(exitTimer)
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-all duration-800"
      style={{ 
        clipPath: "inset(0 0 0 0)",
        transitionTimingFunction: "cubic-bezier(0.87, 0, 0.13, 1)"
      }}
    >
      {/* Name display */}
      <div
        className="transition-all duration-700"
        style={{
          opacity: showName ? 1 : 0,
          transform: `translateY(${showName ? 0 : 30}px)`,
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <h1 
          className="text-4xl md:text-6xl font-bold tracking-tight uppercase"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.5)",
            color: "transparent",
          }}
        >
          ANIKA MAHFUZA
        </h1>
      </div>
    </div>
  )
}
