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
import { LightRays, BlurText, Threads, Aurora } from "@/components/react-bits"
import { ReactBitsShowcase } from "@/components/react-bits-showcase"
import { LinkButton, IconButton } from "@/components/button"
import { TechTagGroup } from "@/components/tech-tag"
import { SectionNumber } from "@/components/section-number"
import { AnimatedQuote } from "@/components/animated-quote"
import { TextType } from "@/components/text-type"

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
      <MusicPlayer isActive={true} onAudioRef={setAudioElement} />
      <AudioControls audioElement={audioElement} isVisible={true} />
      <LyricsDisplay audioElement={audioElement} isVisible={true} />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#" className="font-mono text-sm text-[var(--foreground)] tracking-wider">
              anika@dev:~$
            </a>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <motion.section
        className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[var(--background)]"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: isDark ? 0.6 : 0.8 }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="var(--pop)"
            raysSpeed={0.5}
            lightSpread={1.5}
            rayLength={2.5}
            followMouse={true}
            mouseInfluence={0.3}
            fadeDistance={1.0}
          />
        </div>

        {/* Cinematic Content Grid */}
        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6 lg:px-16 pt-20 h-full flex flex-col justify-center">
          <div className="magazine-grid items-center justify-between w-full">

            {/* Left: Typography Focus */}
            <div className="content-main flex flex-col items-start justify-center pt-10 md:pt-0">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // smooth cinematic ease
                className="mb-6 flex flex-col"
              >
                <span className="text-label mb-6 block tracking-[0.2em] text-[var(--foreground-subtle)] letter-reveal">
                  Creative Developer & Security Researcher
                </span>

                <h1 className="text-hero text-[var(--foreground)] m-0 p-0 transform -ml-1 whitespace-nowrap overflow-visible flex items-center text-unfold">
                  <span className="inline-block min-w-[200px] sm:min-w-[300px] md:min-w-[360px] lg:min-w-[480px]">
                    <TextType
                      text={["DEV", "HACKER", "CODER", "CREATOR"]}
                      typingSpeed={150}
                      deletingSpeed={60}
                      pauseDuration={3500}
                      cursorBlinkDuration={0.4}
                      cursorCharacter="|"
                      textColors={["var(--pop)", "var(--foreground)", "var(--accent)", "var(--pop)"]}
                      variableSpeed={{ min: 60, max: 100 }}
                      letterByLetter={true}
                      letterRevealDelay={0.15}
                      weightAnimation={true}
                      mouseInteraction={false}
                    />
                  </span>
                </h1>
                <h1 className="text-hero text-[var(--foreground)] m-0 p-0 transform -ml-1 flex items-center gap-4 text-unfold">
                  MODE
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-lg leading-relaxed mb-10 font-mono tracking-tight"
              >
                Building low-level systems, breaking them down, and crafting premium immersive digital experiences.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4"
              >
                <TechTagGroup
                  tags={["C++", "C#", "React", "Security"]}
                  activeTag="C++"
                  className="mb-0"
                />
              </motion.div>
            </div>

            {/* Right: Immersive Portrait & Action */}
            <div className="content-sidebar relative flex flex-col items-center md:items-end justify-center mt-8 md:mt-0 overlap-up">
              <ParallaxScale>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative group w-max"
                  >
                    {/* Glitch/Hover Container for the image */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] overflow-hidden grayscale contrast-[1.2] group-hover:grayscale-0 transition-all duration-700 ease-out">
                      <img
                        src="/profile.png"
                        alt="Anika Mahfuza"
                        className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-out mix-blend-luminosity opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Floating Action Buttons overlapping image */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute -right-6 -bottom-6 flex flex-col gap-3 z-20 pointer-events-auto"
                    >
                      <IconButton href="https://discord.gg/68gVSXp74k" title="Discord" className="bg-[var(--surface)] hover:bg-[var(--pop)] hover:text-white transition-colors border border-[var(--border)] shadow-xl p-4">
                        <DiscordIcon className="w-6 h-6" />
                      </IconButton>
                      <IconButton href="https://guns.lol/mahfuza" title="Links" className="bg-[var(--surface)] hover:bg-[var(--pop)] hover:text-white transition-colors border border-[var(--border)] shadow-xl p-4">
                        <ExternalLinkIcon className="w-6 h-6" />
                      </IconButton>
                    </motion.div>

                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 rotate-180" style={{ writingMode: "vertical-rl" }}>
                      <VisitCounter />
                    </div>
                  </motion.div>

                  {/* Huge Name Display Below Image */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex justify-center mt-12 md:mt-16 z-20 relative pointer-events-none"
                  >
                    <h2 className="text-display-enhanced text-[var(--foreground)] tracking-tight drop-shadow-2xl uppercase">
                      ANIKA MAHFUZA
                    </h2>
                  </motion.div>
                </div>
              </ParallaxScale>
            </div>

          </div>
        </div>
      </motion.section>

      <section id="about" className="relative section-padding border-t border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ opacity: isDark ? 0.3 : 0.35 }}>
          <Threads
            color={isDark ? [0.3, 0.3, 0.3] : [0.45, 0.45, 0.45]}
            amplitude={0.5}
            distance={0.2}
          />
        </div>

        <SectionNumber number="01" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <span className="text-label mb-6 block">About</span>

                  <TextReveal className="text-heading text-4xl lg:text-6xl text-[var(--foreground)]">
                    Building in the shadows
                  </TextReveal>
                </motion.div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <TextReveal className="text-lg lg:text-xl text-[var(--foreground-secondary)] leading-relaxed">
                  I'm a developer with a deep passion for understanding how things work under the hood. My journey spans from writing performance-critical C++ applications to crafting modern web experiences, with a particular fascination for security research and reverse engineering.
                </TextReveal>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <TextReveal className="text-lg lg:text-xl text-[var(--foreground-secondary)] leading-relaxed">
                  Currently focused on building robust, efficient systems that solve real problems. I believe in the power of clean code, thoughtful architecture, and the constant pursuit of knowledge.
                </TextReveal>
              </motion.div>

              <AnimatedQuote
                quote="Vibe coders are next generation copy pasters"
                author="Anika Mahfuza"
              />
            </div>
          </div>
        </div>
      </section>

      <CompilationSkills />

      <section id="contact" className="relative section-padding border-t border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ opacity: isDark ? 0.2 : 0.3 }}>
          <Aurora
            colorStops={isDark ? ['#e63946', '#0a0a0a', '#e63946'] : ['#e63946', '#d8d8d8', '#e63946']}
            amplitude={0.8}
            blend={0.4}
            speed={0.5}
          />
        </div>

        <SectionNumber number="03" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <span className="text-label mb-6 block">Contact</span>
                <TextReveal className="text-heading text-4xl lg:text-6xl text-[var(--foreground)]">
                  Let's build something together
                </TextReveal>
              </motion.div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
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
                transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-wrap items-center gap-4"
              >
                <LinkButton href="https://discord.gg/68gVSXp74k" variant="primary">
                  <DiscordIcon className="w-5 h-5" />
                  <span>Connect on Discord</span>
                </LinkButton>
                <LinkButton href="https://guns.lol/mahfuza" variant="secondary">
                  <ExternalLinkIcon className="w-5 h-5" />
                  <span>View All Links</span>
                </LinkButton>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <ReactBitsShowcase />

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
