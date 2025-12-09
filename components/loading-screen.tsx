"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  onComplete: () => void
  isVisible: boolean
}

export function LoadingScreen({ onComplete, isVisible }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [showClickPrompt, setShowClickPrompt] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setShowClickPrompt(true), 300)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 150)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-1000 ${
        showClickPrompt ? "cursor-pointer" : ""
      }`}
      onClick={showClickPrompt ? onComplete : undefined}
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {!showClickPrompt ? (
          <>
            {/* Loading bar */}
            <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground/60 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-muted-foreground text-sm tracking-widest uppercase">Loading experience</p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 animate-fade-in-up">
            <p className="text-foreground/80 text-sm tracking-[0.2em] uppercase">Click anywhere to enter</p>
            <div className="w-8 h-px bg-foreground/30 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  )
}
