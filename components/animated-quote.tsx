"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface AnimatedQuoteProps {
  quote: string
  author: string
  className?: string
}

export function AnimatedQuote({ quote, author, className = "" }: AnimatedQuoteProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={`mt-16 relative ${className}`}
    >
      <div className="relative pl-8 lg:pl-12 py-4">
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--pop)] origin-top"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        />
        
        <blockquote className="relative">
          <p className="text-2xl lg:text-4xl text-heading text-[var(--foreground)] leading-snug mb-6">
            "{quote}"
          </p>
          <footer className="text-label">
            — {author}
          </footer>
        </blockquote>
      </div>
    </motion.div>
  )
}
