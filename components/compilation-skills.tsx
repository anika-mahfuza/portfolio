"use client"

import { SkillsBackground } from "@/components/skills-background"

export function CompilationSkills() {
  return (
    <section
      id="skills"
      className="relative border-t border-[var(--border)] bg-[var(--background)] min-h-screen overflow-hidden"
    >
      {/* Custom Energy Matrix Background */}
      <SkillsBackground />
      
      {/* Large decorative background number */}
      <div className="absolute top-0 right-0 text-[12rem] sm:text-[16rem] lg:text-[20rem] font-bold leading-none text-[var(--foreground)] opacity-[0.03] select-none pointer-events-none translate-x-[10%] -translate-y-[10%] z-10">
        02
      </div>
      
      {/* Skills content placeholder */}
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-sm text-[var(--foreground-muted)] mb-2 uppercase tracking-wider">
            Coming Soon
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)]">
            Skills
          </h2>
        </div>
      </div>
    </section>
  )
}
