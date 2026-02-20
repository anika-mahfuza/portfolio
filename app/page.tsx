"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTheme } from "next-themes"
import { MusicPlayer } from "@/components/music-player"
import { LyricsDisplay } from "@/components/lyrics-display"
import { AudioControls } from "@/components/audio-controls"
import { DiscordIcon, ExternalLinkIcon } from "@/components/custom-icons"
import { VisitCounter } from "@/components/visit-counter"
import { ThemeToggle } from "@/components/theme-toggle"
import { ParallaxScale } from "@/components/parallax"
import { TextReveal } from "@/components/text-reveal"
import { CompilationSkills } from "@/components/compilation-skills"
import { LightRays, BlurText, GlareHover, Threads, Aurora } from "@/components/react-bits"
import { ReactBitsShowcase } from "@/components/react-bits-showcase"

export default function Portfolio() {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -80])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden">
      {/* Systems */}
      <MusicPlayer isActive={true} onAudioRef={setAudioElement} />
      <AudioControls audioElement={audioElement} isVisible={true} />
      <LyricsDisplay audioElement={audioElement} isVisible={true} />


      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="font-mono text-sm text-[var(--foreground)] tracking-wider">
              anika@dev:~$
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <motion.section
        className="relative min-h-screen flex items-center overflow-hidden bg-[var(--background)]"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        {/* Background LightRays */}
        <div className="absolute inset-0 z-0" style={{ opacity: isDark ? 0.4 : 0.45 }}>
          <LightRays 
            raysOrigin="top-center"
            raysColor="#e63946"
            raysSpeed={0.8}
            lightSpread={1.2}
            rayLength={2.0}
            followMouse={true}
            mouseInfluence={0.2}
            fadeDistance={1.2}
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-24">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left — Typography */}
            <div className="lg:col-span-8">
              {/* Name */}
              <div className="mb-8">
                <BlurText
                  text="Anika Mahfuza"
                  delay={150}
                  className="text-display text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-[var(--foreground)]"
                  animateBy="words"
                  direction="top"
                />
              </div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-base sm:text-lg text-[var(--foreground-secondary)] max-w-xl leading-relaxed mb-8"
              >
                Building robust systems and exploring the boundaries of code.
                Specializing in low-level programming, security research, and web technologies.
              </motion.p>

              {/* Tech Tags */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="flex flex-wrap gap-3 mb-10"
              >
                {["C#", "C++", "Python", "TypeScript", "Security"].map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.08 }}
                    className={`px-4 py-2 border text-xs font-mono uppercase tracking-wider transition-all duration-300 hover:text-[var(--foreground)] hover:border-[var(--foreground)] ${
                      tech === "C++" 
                        ? "border-[var(--foreground)] text-[var(--foreground)]" 
                        : "border-[var(--border-strong)] text-[var(--foreground-secondary)]"
                    }`}
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="flex items-center gap-3"
              >
                <GlareHover
                  width="48px"
                  height="48px"
                  background="transparent"
                  borderColor="var(--border-strong)"
                  borderRadius="0px"
                  glareColor="#e63946"
                  glareOpacity={0.4}
                  className="border border-[var(--border-strong)]"
                >
                  <a
                    href="https://discord.gg/68gVSXp74k"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors duration-300"
                    title="Discord"
                  >
                    <DiscordIcon className="w-5 h-5" />
                  </a>
                </GlareHover>
                <GlareHover
                  width="48px"
                  height="48px"
                  background="transparent"
                  borderColor="var(--border-strong)"
                  borderRadius="0px"
                  glareColor="#e63946"
                  glareOpacity={0.4}
                  className="border border-[var(--border-strong)]"
                >
                  <a
                    href="https://guns.lol/mahfuza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors duration-300"
                    title="Links"
                  >
                    <ExternalLinkIcon className="w-5 h-5" />
                  </a>
                </GlareHover>
              </motion.div>
            </div>

            {/* Right — Profile Image */}
            <div className="lg:col-span-4">
              <ParallaxScale>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="relative"
                >
                  <div className="relative aspect-square w-48 sm:w-56 lg:w-64 mx-auto overflow-hidden">
                    <img
                      src="/profile.png"
                      alt="Anika Mahfuza"
                      className="w-full h-full object-cover transition-all duration-700"
                    />
                  </div>
                  {/* Visit Counter */}
                  <div className="mt-4 flex justify-center">
                    <VisitCounter />
                  </div>
                </motion.div>
              </ParallaxScale>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════
          ABOUT SECTION
          ═══════════════════════════════════════ */}
      <section id="about" className="relative section-padding border-t border-[var(--border)] overflow-hidden">
        {/* Background Threads */}
        <div className="absolute inset-0 z-0" style={{ opacity: isDark ? 0.3 : 0.35 }}>
          <Threads 
            color={isDark ? [0.3, 0.3, 0.3] : [0.45, 0.45, 0.45]} 
            amplitude={0.5} 
            distance={0.2}
          />
        </div>

        {/* Large decorative background number */}
        <div className="absolute top-0 right-0 text-[12rem] sm:text-[16rem] lg:text-[20rem] font-bold leading-none text-[var(--foreground)] opacity-[0.03] select-none pointer-events-none translate-x-[10%] -translate-y-[10%] z-10">
          01
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column — Sticky Header */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-label mb-6 block">About</span>
                  
                  <TextReveal className="text-heading text-4xl lg:text-6xl text-[var(--foreground)]">
                    Building in the shadows
                  </TextReveal>
                </motion.div>
              </div>
            </div>

            {/* Right Column — Content */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <TextReveal className="text-lg lg:text-xl text-[var(--foreground-secondary)] leading-relaxed">
                  I'm a developer with a deep passion for understanding how things work under the hood. My journey spans from writing performance-critical C++ applications to crafting modern web experiences, with a particular fascination for security research and reverse engineering.
                </TextReveal>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <TextReveal className="text-lg lg:text-xl text-[var(--foreground-secondary)] leading-relaxed">
                  Currently focused on building robust, efficient systems that solve real problems. I believe in the power of clean code, thoughtful architecture, and the constant pursuit of knowledge.
                </TextReveal>
              </motion.div>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-16 relative"
              >
                <div className="border-l-2 border-[var(--pop)] pl-8 lg:pl-12 py-4">
                  <blockquote>
                    <p className="text-2xl lg:text-4xl text-heading text-[var(--foreground)] leading-snug mb-6">
                      "Vibe coders are next generation copy pasters"
                    </p>
                    <footer className="text-label">
                      — Anika Mahfuza
                    </footer>
                  </blockquote>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SKILLS SECTION
          ═══════════════════════════════════════ */}
      <CompilationSkills />

      {/* ═══════════════════════════════════════
          CONTACT SECTION
          ═══════════════════════════════════════ */}
      <section id="contact" className="relative section-padding border-t border-[var(--border)] overflow-hidden">
        {/* Background Aurora */}
        <div className="absolute inset-0 z-0" style={{ opacity: isDark ? 0.2 : 0.3 }}>
          <Aurora 
            colorStops={isDark ? ['#e63946', '#0a0a0a', '#e63946'] : ['#e63946', '#d8d8d8', '#e63946']}
            amplitude={0.8}
            blend={0.4}
            speed={0.5}
          />
        </div>

        {/* Large decorative background number */}
        <div className="absolute top-0 right-0 text-[12rem] sm:text-[16rem] lg:text-[20rem] font-bold leading-none text-[var(--foreground)] opacity-[0.03] select-none pointer-events-none translate-x-[10%] -translate-y-[10%] z-10">
          03
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-label mb-6 block">Contact</span>
                <TextReveal className="text-heading text-4xl lg:text-6xl text-[var(--foreground)]">
                  Let's build something together
                </TextReveal>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-12"
              >
                <TextReveal className="text-xl lg:text-2xl text-[var(--foreground-secondary)] leading-relaxed">
                  Interested in collaborating or have a project in mind? I'm always open to discussing new opportunities and interesting challenges.
                </TextReveal>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4"
              >
                <GlareHover
                  width="auto"
                  height="auto"
                  background="var(--pop)"
                  borderColor="var(--pop)"
                  borderRadius="0px"
                  glareColor="#ffffff"
                  glareOpacity={0.6}
                  className="inline-flex"
                >
                  <a
                    href="https://discord.gg/68gVSXp74k"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-8 py-4 text-white font-medium text-sm tracking-wide uppercase"
                  >
                    <DiscordIcon className="w-5 h-5" />
                    <span>Connect on Discord</span>
                  </a>
                </GlareHover>
                <GlareHover
                  width="auto"
                  height="auto"
                  background="transparent"
                  borderColor="var(--border-strong)"
                  borderRadius="0px"
                  glareColor="#e63946"
                  glareOpacity={0.5}
                  className="inline-flex border border-[var(--border-strong)]"
                >
                  <a
                    href="https://guns.lol/mahfuza"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-8 py-4 text-[var(--foreground)] font-medium text-sm tracking-wide uppercase"
                  >
                    <ExternalLinkIcon className="w-5 h-5" />
                    <span>View All Links</span>
                  </a>
                </GlareHover>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          REACT BITS SHOWCASE
          ═══════════════════════════════════════ */}
      <ReactBitsShowcase />

      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer className="py-8 pb-24 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--foreground-muted)] font-mono">
              © {new Date().getFullYear()} Anika Mahfuza
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://discord.gg/68gVSXp74k"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors duration-300"
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
              <a
                href="https://guns.lol/mahfuza"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors duration-300"
              >
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
