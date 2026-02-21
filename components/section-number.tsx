"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

interface SectionNumberProps {
  number: string
  className?: string
}

export function SectionNumber({ number, className = "" }: SectionNumberProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [displayNumber, setDisplayNumber] = useState("00")
  
  useEffect(() => {
    if (isInView) {
      const targetNum = parseInt(number, 10)
      let currentNum = 0
      const duration = 1000
      const steps = 20
      const increment = targetNum / steps
      const stepDuration = duration / steps
      
      const interval = setInterval(() => {
        currentNum += increment
        if (currentNum >= targetNum) {
          setDisplayNumber(number.padStart(2, "0"))
          clearInterval(interval)
        } else {
          setDisplayNumber(Math.floor(currentNum).toString().padStart(2, "0"))
        }
      }, stepDuration)
      
      return () => clearInterval(interval)
    }
  }, [isInView, number])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 0.03, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`
        absolute top-0 right-0 text-[12rem] sm:text-[16rem] lg:text-[20rem] 
        font-bold leading-none text-[var(--foreground)] 
        select-none pointer-events-none translate-x-[10%] -translate-y-[10%] z-10
        ${className}
      `}
    >
      {displayNumber}
    </motion.div>
  )
}
