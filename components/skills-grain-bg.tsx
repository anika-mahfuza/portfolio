"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function SkillsGrainBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* SVG Grain Filter */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        style={{ position: "fixed" }}
      >
        <defs>
          <filter
            id="skills-grain"
            colorInterpolationFilters="sRGB"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="saturate"
              values="0"
              result="monoNoise"
            />
            <feBlend
              in="SourceGraphic"
              in2="monoNoise"
              mode="multiply"
            />
          </filter>
        </defs>
      </svg>

      {/* Gradient Layers */}
      <div
        className="absolute inset-0"
        style={{
          filter: "url(#skills-grain)",
          opacity: isDark ? 0.4 : 0.3,
        }}
      >
        {/* Blob 1 - Top Left */}
        <div
          className="absolute rounded-full"
          style={{
            width: "60%",
            height: "60%",
            top: "-10%",
            left: "-10%",
            background: isDark
              ? "radial-gradient(circle, rgba(255,42,61,0.35) 0%, rgba(255,42,61,0.1) 40%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,71,87,0.3) 0%, rgba(255,71,87,0.08) 40%, transparent 70%)",
            animation: "grainDrift1 25s ease-in-out infinite",
          }}
        />

        {/* Blob 2 - Bottom Right */}
        <div
          className="absolute rounded-full"
          style={{
            width: "50%",
            height: "50%",
            bottom: "-5%",
            right: "-5%",
            background: isDark
              ? "radial-gradient(circle, rgba(231,76,60,0.3) 0%, rgba(231,76,60,0.08) 45%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,107,107,0.25) 0%, rgba(255,107,107,0.06) 45%, transparent 70%)",
            animation: "grainDrift2 30s ease-in-out infinite",
          }}
        />

        {/* Blob 3 - Center */}
        <div
          className="absolute rounded-full"
          style={{
            width: "45%",
            height: "45%",
            top: "30%",
            left: "30%",
            background: isDark
              ? "radial-gradient(circle, rgba(255,42,61,0.2) 0%, rgba(255,42,61,0.05) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,71,87,0.18) 0%, rgba(255,71,87,0.04) 50%, transparent 70%)",
            animation: "grainDrift3 22s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes grainDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, 3%) scale(1.05); }
          66% { transform: translate(-3%, 5%) scale(0.97); }
        }
        @keyframes grainDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-4%, -3%) scale(0.95); }
          66% { transform: translate(3%, -5%) scale(1.04); }
        }
        @keyframes grainDrift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(2%, -4%) scale(1.06); }
        }
      `}</style>
    </div>
  )
}
