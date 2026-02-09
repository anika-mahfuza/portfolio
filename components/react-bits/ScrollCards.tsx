"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

interface Skill {
  name: string
  level: string
}

interface Category {
  id: string
  label: string
  skills: Skill[]
}

interface ScrollCardsProps {
  categories: Category[]
}

const levelWidths: Record<string, string> = {
  Expert: "100%",
  Advanced: "70%",
  Intermediate: "40%",
}

export function ScrollCards({ categories }: ScrollCardsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 px-6 lg:px-8 pb-32">
      {categories.map((category, index) => (
        <StackCard key={category.id} category={category} index={index} />
      ))}
    </div>
  )
}

interface StackCardProps {
  category: Category
  index: number
}

function StackCard({ category, index }: StackCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  })

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.95, 0.9, 0.82, 0.9, 0.95]),
    { stiffness: 100, damping: 20 }
  )

  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [1, 0.95, 0.75, 0.95, 1]),
    { stiffness: 100, damping: 20 }
  )

  const y = useSpring(
    useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [30, 15, 0, -15, -30]),
    { stiffness: 80, damping: 20 }
  )

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, opacity, y }}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-[24px] p-8 lg:p-10 will-change-transform"
    >
      <div className="mb-6">
        <h3 className="text-heading text-2xl lg:text-4xl text-[var(--foreground)]">
          {category.label}
        </h3>
      </div>

      <div className="space-y-0">
        {category.skills.map((skill) => (
          <div
            key={skill.name}
            className="group relative py-4 border-b border-[var(--border)] last:border-0"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg lg:text-xl text-[var(--foreground)] font-medium">
                {skill.name}
              </span>
              <span className="text-xs text-[var(--foreground-muted)] font-mono uppercase tracking-wider">
                {skill.level}
              </span>
            </div>
            
            <div className="h-[2px] w-full bg-[var(--border)] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[var(--pop)] rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: levelWidths[skill.level] }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default ScrollCards
