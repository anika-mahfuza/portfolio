"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function SkillsMeshBackground() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  const isDark = resolvedTheme === "dark"
  
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity: isDark ? 0.4 : 0.45 }}>
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Blob 1 - Top Left */}
          <radialGradient id="blob1" cx="30%" cy="30%" r="60%">
            <stop 
              offset="0%" 
              stopColor={isDark ? "#dc2626" : "#ef4444"} 
              stopOpacity={isDark ? "0.6" : "0.8"} 
            />
            <stop 
              offset="50%" 
              stopColor={isDark ? "#991b1b" : "#f87171"} 
              stopOpacity={isDark ? "0.3" : "0.5"} 
            />
            <stop 
              offset="100%" 
              stopColor="transparent" 
              stopOpacity="0" 
            />
          </radialGradient>
          
          {/* Blob 2 - Bottom Right */}
          <radialGradient id="blob2" cx="70%" cy="70%" r="50%">
            <stop 
              offset="0%" 
              stopColor={isDark ? "#b91c1c" : "#f97316"} 
              stopOpacity={isDark ? "0.5" : "0.7"} 
            />
            <stop 
              offset="60%" 
              stopColor={isDark ? "#7f1d1d" : "#fb923c"} 
              stopOpacity={isDark ? "0.2" : "0.4"} 
            />
            <stop 
              offset="100%" 
              stopColor="transparent" 
              stopOpacity="0" 
            />
          </radialGradient>
          
          {/* Blob 3 - Center */}
          <radialGradient id="blob3" cx="50%" cy="50%" r="45%">
            <stop 
              offset="0%" 
              stopColor={isDark ? "#ef4444" : "#fb7185"} 
              stopOpacity={isDark ? "0.4" : "0.6"} 
            />
            <stop 
              offset="70%" 
              stopColor={isDark ? "#991b1b" : "#fca5a5"} 
              stopOpacity={isDark ? "0.15" : "0.35"} 
            />
            <stop 
              offset="100%" 
              stopColor="transparent" 
              stopOpacity="0" 
            />
          </radialGradient>
        </defs>
        
        {/* Animated Blobs */}
        <circle 
          className="animate-blob-1"
          cx="25" 
          cy="25" 
          r="35" 
          fill="url(#blob1)" 
        />
        <circle 
          className="animate-blob-2"
          cx="75" 
          cy="75" 
          r="30" 
          fill="url(#blob2)" 
        />
        <circle 
          className="animate-blob-3"
          cx="50" 
          cy="50" 
          r="25" 
          fill="url(#blob3)" 
        />
      </svg>
      
      <style jsx>{`
        @keyframes blob1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(10%, 5%) scale(1.1);
          }
          50% {
            transform: translate(5%, 10%) scale(0.95);
          }
          75% {
            transform: translate(-5%, 5%) scale(1.05);
          }
        }
        
        @keyframes blob2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-8%, -5%) scale(1.15);
          }
          66% {
            transform: translate(5%, -8%) scale(0.9);
          }
        }
        
        @keyframes blob3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(0%, 8%) scale(1.08);
          }
        }
        
        .animate-blob-1 {
          animation: blob1 20s ease-in-out infinite;
          transform-origin: center;
        }
        
        .animate-blob-2 {
          animation: blob2 25s ease-in-out infinite;
          transform-origin: center;
        }
        
        .animate-blob-3 {
          animation: blob3 18s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  )
}
