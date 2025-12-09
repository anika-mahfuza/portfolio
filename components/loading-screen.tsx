"use client"

import { useEffect, useState } from "react"
import { DecryptedText } from "./decrypted-text"
import { GlitchText } from "./glitch-text"

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
          setTimeout(() => setShowClickPrompt(true), 500)
          return 100
        }
        return prev + Math.random() * 12
      })
    }, 120)

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  const displayProgress = Math.min(Math.floor(progress), 100)
  const rotation = (displayProgress / 100) * 360

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-1000 ${showClickPrompt ? "cursor-pointer" : ""
        }`}
      onClick={showClickPrompt ? onComplete : undefined}
    >
      <div className="relative z-10 flex flex-col items-center">
        {!showClickPrompt ? (
          <>
            {/* Orbital loader */}
            <div className="relative w-40 h-40 mb-8">
              {/* Outer ring - rotating */}
              <svg
                className="absolute inset-0 w-full h-full"
                style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s ease-out' }}
              >
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-foreground/[0.06]"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${displayProgress * 4.4} 440`}
                  className="text-foreground/60"
                />
              </svg>

              {/* Inner decorative rings */}
              <div className="absolute inset-4 border border-foreground/[0.04] rounded-full" />
              <div className="absolute inset-8 border border-foreground/[0.06] rounded-full" />

              {/* Center percentage with GlitchText effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl font-extralight text-foreground/90 tracking-tighter tabular-nums">
                    {displayProgress}
                  </span>
                  <span className="text-sm text-foreground/30 ml-0.5">%</span>
                </div>
              </div>
            </div>

            {/* Status text with DecryptedText effect */}
            <div className="flex flex-col items-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
              <p className="text-foreground/40 text-[10px] tracking-[0.4em] uppercase font-light">
                <DecryptedText
                  text="LOADING THE PORTFOLIO"
                  speed={40}
                  revealDelay={300}
                  animateOnView={false}
                />
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {/* Completion state */}
            <div className="relative w-20 h-20 mb-2">
              <div className="absolute inset-0 border border-foreground/20 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-0 border border-foreground/10 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-foreground/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <p className="text-foreground/60 text-xs tracking-[0.3em] uppercase font-light">
                <GlitchText text="Ready" speed={40} />
              </p>
              <p className="text-foreground/30 text-[10px] tracking-[0.2em]">
                <DecryptedText
                  text="Click anywhere to continue"
                  speed={30}
                  revealDelay={200}
                  animateOnView={false}
                />
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
