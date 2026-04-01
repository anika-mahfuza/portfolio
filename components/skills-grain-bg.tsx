"use client"

import { useEffect, useState } from "react"

export function SkillsGrainBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

      {/* Gradient Layers - theme colors via CSS variables */}
      <div
        className="absolute inset-0 grain-layer"
        style={{
          filter: "url(#skills-grain)",
        }}
      >
        {/* Blob 1 - Top Left */}
        <div
          className="absolute rounded-full grain-blob-1"
          style={{
            width: "60%",
            height: "60%",
            top: "-10%",
            left: "-10%",
          }}
        />

        {/* Blob 2 - Bottom Right */}
        <div
          className="absolute rounded-full grain-blob-2"
          style={{
            width: "50%",
            height: "50%",
            bottom: "-5%",
            right: "-5%",
          }}
        />

        {/* Blob 3 - Center */}
        <div
          className="absolute rounded-full grain-blob-3"
          style={{
            width: "45%",
            height: "45%",
            top: "30%",
            left: "30%",
          }}
        />
      </div>

      <style>{`
        .grain-layer {
          opacity: 0.35;
        }
        .grain-blob-1 {
          background: radial-gradient(circle, var(--pop) 0%, rgba(255,42,61,0.1) 40%, transparent 70%);
          animation: grainDrift1 25s ease-in-out infinite;
        }
        .grain-blob-2 {
          background: radial-gradient(circle, var(--pop-cool) 0%, var(--pop-cool) 0%, transparent 70%);
          animation: grainDrift2 30s ease-in-out infinite;
        }
        .grain-blob-3 {
          background: radial-gradient(circle, var(--pop-warm) 0%, transparent 50%);
          animation: grainDrift3 22s ease-in-out infinite;
        }
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
