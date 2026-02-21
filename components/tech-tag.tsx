"use client"

import { motion } from "framer-motion"

interface TechTagProps {
  children: React.ReactNode
  active?: boolean
  delay?: number
  className?: string
}

export function TechTag({ children, active = false, delay = 0, className = "" }: TechTagProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={`
        px-4 py-2 rounded-full border text-xs font-mono uppercase tracking-wider
        transition-colors duration-300 cursor-default
        ${active 
          ? "border-[var(--foreground)] text-[var(--foreground)]" 
          : "border-[var(--border-strong)] text-[var(--foreground-secondary)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
        }
        ${className}
      `}
    >
      {children}
    </motion.span>
  )
}

interface TechTagGroupProps {
  tags: string[]
  activeTag?: string
  className?: string
}

export function TechTagGroup({ tags, activeTag, className = "" }: TechTagGroupProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {tags.map((tag, i) => (
        <TechTag key={tag} active={tag === activeTag} delay={1.2 + i * 0.08}>
          {tag}
        </TechTag>
      ))}
    </div>
  )
}
