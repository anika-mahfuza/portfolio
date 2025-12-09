"use client"

import { useEffect, useState, useRef } from "react"
import { ShinyText } from "@/components/shiny-text"

interface SkillDisplayProps {
    skills: Array<{ name: string; level: string; years?: number }>
}

export function SkillDisplay({ skills }: SkillDisplayProps) {
    const [visibleLines, setVisibleLines] = useState(0)
    const [isTyping, setIsTyping] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isTyping) {
                    setIsTyping(true)
                }
            },
            { threshold: 0.3 }
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [isTyping])

    useEffect(() => {
        if (!isTyping) return

        const totalLines = skills.length + 2 // header + skills + footer
        let currentLine = 0

        const interval = setInterval(() => {
            currentLine++
            setVisibleLines(currentLine)

            if (currentLine >= totalLines) {
                clearInterval(interval)
            }
        }, 200)

        return () => clearInterval(interval)
    }, [isTyping, skills.length])

    const getLevelBar = (level: string) => {
        const levels: Record<string, number> = {
            'Advanced': 4,
            'Proficient': 3,
            'Intermediate': 2,
            'Beginner': 1
        }
        const filled = levels[level] || 2
        return '█'.repeat(filled) + '░'.repeat(4 - filled)
    }

    return (
        <div
            ref={containerRef}
            className="font-mono text-sm"
        >
            {/* Terminal-style output */}
            <div className="space-y-1">
                {/* Command line */}
                {visibleLines >= 1 && (
                    <div className="flex items-center gap-2 text-muted-foreground/60">
                        <span className="text-foreground/40">$</span>
                        <span className="typing-effect">./show_skills</span>
                    </div>
                )}

                {/* Skill entries */}
                {skills.map((skill, index) => (
                    visibleLines >= index + 2 && (
                        <div
                            key={skill.name}
                            className="flex items-center gap-4 py-1 group cursor-default"
                        >
                            <span className="text-foreground/30 w-4 text-right text-xs">
                                {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <span className="text-foreground/80 w-16 group-hover:text-foreground transition-colors">
                                {skill.name}
                            </span>
                            <span className="text-foreground/30 tracking-widest text-xs">
                                {getLevelBar(skill.level)}
                            </span>
                            <span className="text-muted-foreground/50 text-xs uppercase tracking-wider">
                                {skill.level}
                            </span>
                        </div>
                    )
                ))}

                {/* Footer */}
                {visibleLines >= skills.length + 2 && (
                    <div className="text-muted-foreground/40 text-xs pt-2">
                        Build successful · 0 errors, 0 warnings
                    </div>
                )}
            </div>

            <style jsx>{`
        .typing-effect {
          overflow: hidden;
          white-space: nowrap;
          animation: typing 0.8s steps(20, end);
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
        </div>
    )
}
