
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Waves } from "@/components/react-bits"
import { SectionNumber } from "@/components/section-number"

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

      <SectionNumber number="02" />

      {/* Content */}
      <div className="relative z-20 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-32">
        {/* Restored Custom Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[var(--foreground-muted)] text-sm uppercase tracking-[0.3em] font-mono">
              Expertise
            </span>
            <div className="h-px w-12 bg-[var(--pop)]" />
          </div>
          <h2 className="text-display text-4xl sm:text-5xl lg:text-7xl text-[var(--foreground)] leading-tight">
            CORE <span className="text-[var(--pop)] drop-shadow-[var(--pop-glow)]">SKILLS</span>
          </h2>
          <p className="mt-8 text-lg text-[var(--foreground-muted)] max-w-2xl font-mono text-sm tracking-wide">
            // Import statements from my development toolkit
          </p>
        </motion.div>

        {/* Premium Glassmorphic Code Display */}
        <div className="relative backdrop-blur-2xl bg-[var(--card)]/80 border border-[var(--border-strong)] rounded-lg shadow-2xl overflow-hidden p-[1px]">
          {/* subtle inner border glow */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[var(--foreground)]/5 to-transparent pointer-events-none rounded-lg" />

          <div className="relative z-10 bg-[var(--surface)]/60 rounded-lg pb-12">
            {/* Editor Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-[var(--border)]/50 bg-[var(--background)]/40">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
              <span className="ml-4 font-mono text-xs text-[var(--foreground-subtle)] tracking-wider">skills.ts — Anika/Portfolio</span>
            </div>

            {/* Import Statements */}
            <div className="space-y-1 mt-6 px-4 sm:px-8">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`group relative cursor-pointer transition-all duration-500 rounded-md ${hoveredSkill && hoveredSkill !== skill.name ? "opacity-20 blur-[1px]" : "hover:bg-[var(--foreground)]/5"
                    }`}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}

                >
                  {/* Active Line Indicator */}
                  {hoveredSkill === skill.name && (
                    <motion.div
                      layoutId="activeLine"
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--pop)] shadow-[var(--pop-glow)] rounded-l-md"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <div className="flex items-start gap-4 sm:gap-6 py-4 px-2 sm:px-4">
                    {/* Line Number */}
                    <span className={`font-mono text-sm w-6 sm:w-8 text-right select-none transition-colors duration-300 ${hoveredSkill === skill.name ? "text-[var(--pop)]" : "text-[var(--foreground-subtle)]"}`}>
                      {skill.lineNumber}
                    </span>

                    {/* Import Statement */}
                    <div className="flex-1 font-mono text-[15px] sm:text-lg lg:text-xl tracking-tight flex flex-wrap gap-x-2">
                      <span className="text-[#c678dd]">import</span>
                      <span className="text-[var(--foreground)]">{"{"}</span>
                      <span className={`${levelColors[skill.level]} font-bold tracking-normal drop-shadow-md`}>
                        {skill.name}
                      </span>
                      <span className="text-[var(--foreground)]">{"}"}</span>
                      <span className="text-[#c678dd]">from</span>
                      <span className="text-[#98c379]">"{skill.from}"</span>
                      <span className="text-[var(--foreground-muted)]">;</span>
                    </div>

                    {/* Proficiency Badge */}
                    <div className="hidden md:flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`h-[2px] rounded-full transition-all duration-500 shadow-[0_0_10px_currentColor] ${skill.level === "Expert" ? "w-8 text-[var(--pop)] bg-[var(--pop)]" :
                        skill.level === "Advanced" ? "w-6 text-[var(--foreground)] bg-[var(--foreground)]" :
                          "w-4 text-[var(--foreground-muted)] bg-[var(--foreground-muted)]"
                        }`} />
                      <span className="font-mono text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider">
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
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden bg-[var(--background)]/20"
                      >
                        <div className="flex gap-4 sm:gap-6 py-4 px-2 sm:px-4">
                          <span className="font-mono text-sm text-[var(--foreground-subtle)] w-6 sm:w-8 text-right opacity-0 border-r border-transparent">
                            +
                          </span>
                          <div className="flex-1 pl-4 border-l-[2px] border-[var(--border-strong)]">
                            <p className="font-mono text-[13px] sm:text-sm text-[#5c6370] italic mb-2">
                              /* {skill.description} */
                            </p>
                            <p className="font-mono text-[13px] sm:text-sm text-[var(--foreground)]">
                              <span className="text-[#c678dd]">const</span> <span className="text-[#e5c07b]">expertise</span> <span className="text-[#56b6c2]">=</span> <span className="text-[#98c379]">"{skill.level}"</span>;
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
              className="mt-8 pt-6 border-t border-[var(--border)]/50 px-4 sm:px-8"
            >
              <div className="flex items-start gap-4 sm:gap-6 px-2 sm:px-4">
                <span className="font-mono text-sm text-[var(--foreground-subtle)] w-6 sm:w-8 text-right">
                  6
                </span>
                <div className="font-mono text-[15px] sm:text-lg lg:text-xl text-[var(--foreground-muted)] flex flex-wrap gap-x-2">
                  <span className="text-[#c678dd]">export</span>
                  <span className="text-[var(--foreground)]">{"{"}</span>
                  <span className="text-[#e5c07b]">C++</span><span className="text-[var(--foreground)]">, </span>
                  <span className="text-[#e5c07b]">C#</span><span className="text-[var(--foreground)]">, </span>
                  <span className="text-[#e5c07b]">Python</span><span className="text-[var(--foreground)]">, </span>
                  <span className="text-[#e5c07b]">TypeScript</span><span className="text-[var(--foreground)]">, </span>
                  <span className="text-[#e5c07b]">Malware</span>
                  <span className="text-[var(--foreground)]">{"}"}</span>
                  <span className="text-[var(--foreground-muted)]">;</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
