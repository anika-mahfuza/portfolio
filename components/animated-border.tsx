"use client"

import { motion, useInView, type Easing } from "framer-motion"
import { useRef } from "react"

interface AnimatedBorderProps {
  children: React.ReactNode
  className?: string
  borderWidth?: number
  cornerSize?: number
}

export function AnimatedBorder({
  children,
  className = "",
  borderWidth = 2
}: AnimatedBorderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
      
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        <motion.rect
          x={borderWidth / 2}
          y={borderWidth / 2}
          width={`calc(100% - ${borderWidth}px)`}
          height={`calc(100% - ${borderWidth}px)`}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={borderWidth}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isInView ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" as Easing }}
        />
      </svg>
    </div>
  )
}

export function AnimatedCorners({
  children,
  className = "",
  cornerLength = 16,
  strokeWidth = 2
}: { 
  children: React.ReactNode
  className?: string
  cornerLength?: number
  strokeWidth?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
      
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      >
        <motion.path
          d={`M ${strokeWidth} ${cornerLength} L ${strokeWidth} ${strokeWidth} L ${cornerLength} ${strokeWidth}`}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={strokeWidth}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as Easing }}
        />
        <motion.path
          d={`M calc(100% - ${cornerLength}px) ${strokeWidth} L calc(100% - ${strokeWidth}px) ${strokeWidth} L calc(100% - ${strokeWidth}px) ${cornerLength}`}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={strokeWidth}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" as Easing }}
        />
        <motion.path
          d={`M calc(100% - ${strokeWidth}px) calc(100% - ${cornerLength}px) L calc(100% - ${strokeWidth}px) calc(100% - ${strokeWidth}px) L calc(100% - ${cornerLength}px) calc(100% - ${strokeWidth}px)`}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={strokeWidth}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" as Easing }}
        />
        <motion.path
          d={`M ${cornerLength} calc(100% - ${strokeWidth}px) L ${strokeWidth} calc(100% - ${strokeWidth}px) L ${strokeWidth} calc(100% - ${cornerLength}px)`}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={strokeWidth}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" as Easing }}
        />
      </svg>
    </div>
  )
}
