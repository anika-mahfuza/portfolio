
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Waves } from "@/components/react-bits"

interface Skill {
  name: string
  level: "Expert" | "Advanced" | "Intermediate"
  description: string
  from: string
  lineNumber: number
}

const skills: Skill[] = [
  { name: "C++", level: "Expert", description: "Systems programming & performance optimization", from: "./core/systems", lineNumber: 1 },
  { name: "C#", level: "Expert", description: "Application development & architecture", from: "./core/applications", lineNumber: 2 },
  { name: "Python", level: "Advanced", description: "Automation, scripting & tooling", from: "./automation/scripts", lineNumber: 3 },
  { name: "TypeScript", level: "Advanced", description: "Modern web development & type safety", from: "./web/frontend", lineNumber: 4 },
  { name: "Malware", level: "Intermediate", description: "Reverse engineering & security analysis", from: "./security/research", lineNumber: 5 },
]

const levelColors: Record<string, string> = {
  "Expert": "text-[var(--pop)]",
  "Advanced": "text-[var(--foreground)]",
  "Intermediate": "text-[var(--foreground-muted)]",
}

export function CompilationSkills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <section
      id="skills"
      className="relative border-t border-[var(--border)] bg-[var(--background)] min-h-screen overflow-hidden"
    >
      {/* Waves Background */}
      <div className="absolute inset-0 z-0">
        <Waves 
          lineColor={isDark ? "rgba(230, 57, 70, 0.15)" : "rgba(220, 38, 38, 0.2)"}
          backgroundColor="transparent"
          waveSpeedX={0.0125}
          waveSpeedY={0.005}
          waveAmpX={32}
          waveAmpY={16}
          xGap={10}
          yGap={32}
          friction={0.925}
          tension={0.005}
          maxCursorMove={0}
          style={{
            opacity: isDark ? 0.35 : 0.6,
            mixBlendMode: "normal"
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-32">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[var(--foreground-muted)] text-sm uppercase tracking-[0.3em] font-mono">
              Expertise
            </span>
            <div className="h-px w-12 bg-[var(--pop)]" />
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] leading-tight">
            Core <span className="text-[var(--pop)]">Skills</span>
          </h2>
          <p className="mt-6 text-lg text-[var(--foreground-muted)] max-w-2xl font-mono text-sm">
            // Import statements from my development toolkit
          </p>
        </motion.div>

        {/* Code-style Skills Display */}
        <div className="relative">
          {/* Editor Header */}
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-[var(--border)]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--foreground-muted)]" />
              <div className="w-3 h-3 rounded-full bg-[var(--foreground-muted)]" />
            </div>
            <span className="ml-4 font-mono text-sm text-[var(--foreground-muted)]">skills.ts</span>
          </div>

          {/* Import Statements */}
          <div className="space-y-0">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`group cursor-pointer transition-all duration-300 ${
                  hoveredSkill && hoveredSkill !== skill.name ? "opacity-30" : ""
                }`}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                
              >
                <div className="flex items-start gap-6 py-4 hover:bg-[var(--surface)]/30 transition-colors">
                  {/* Line Number */}
                  <span className="font-mono text-sm text-[var(--foreground-muted)] w-8 text-right select-none">
                    {skill.lineNumber}
                  </span>
                  
                  {/* Import Statement */}
                  <div className="flex-1 font-mono text-lg sm:text-xl lg:text-2xl">
                    <span className="text-[var(--pop)]">import</span>
                    <span className="text-[var(--foreground)]">{" "}</span>
                    <span className="text-[var(--foreground-muted)]">{"{"}</span>
                    <span className={`${levelColors[skill.level]} font-semibold`}>
                      {skill.name}
                    </span>
                    <span className="text-[var(--foreground-muted)]">{"}"}</span>
                    <span className="text-[var(--foreground)]">{" "}</span>
                    <span className="text-[var(--pop)]">from</span>
                    <span className="text-[var(--foreground)]">{" "}</span>
                    <span className="text-[#0891b2]">"{skill.from}"</span>
                    <span className="text-[var(--foreground-muted)]">;</span>
                  </div>

                  {/* Proficiency Badge */}
                  <div className="hidden sm:flex items-center gap-2">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${
                      skill.level === "Expert" ? "w-8 bg-[var(--pop)]" :
                      skill.level === "Advanced" ? "w-6 bg-[var(--foreground)]" :
                      "w-4 bg-[var(--foreground-muted)]"
                    }`} />
                    <span className="font-mono text-xs text-[var(--foreground-muted)] uppercase">
                      {skill.level}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {hoveredSkill === skill.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-6 pb-6">
                        <span className="font-mono text-sm text-[var(--foreground-muted)] w-8 text-right">
                          +
                        </span>
                        <div className="flex-1 pl-4 border-l-2 border-[var(--border)]">
                          <p className="font-mono text-sm text-[var(--foreground-muted)] mb-2">
                            // {skill.description}
                          </p>
                          <p className="font-mono text-sm text-[var(--foreground)]">
                            const expertise = <span className="text-[var(--pop)]">{skill.level}</span>;
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Export Statement */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-[var(--border)]"
          >
            <div className="flex items-start gap-6">
              <span className="font-mono text-sm text-[var(--foreground-muted)] w-8 text-right">
                6
              </span>
              <div className="font-mono text-lg text-[var(--foreground-muted)]">
                <span className="text-[var(--pop)]">export</span>
                <span className="text-[var(--foreground)]">{" "}</span>
                <span className="text-[var(--foreground)]">{"{"}</span>
                <span className="text-[var(--foreground)]"> C++, C#, Python, TypeScript, Malware </span>
                <span className="text-[var(--foreground)]">{"}"}</span>
                <span className="text-[var(--foreground-muted)]">;</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
