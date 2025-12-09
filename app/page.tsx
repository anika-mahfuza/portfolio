"use client"

import { useState, useRef } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { VideoBackground, type VideoBackgroundRef } from "@/components/video-background"
import { AudioControls } from "@/components/audio-controls"
import { GlassPanel } from "@/components/glass-panel"
import { DiscordIcon, ExternalLinkIcon } from "@/components/custom-icons"
import { Magnet } from "@/components/magnet"
import { Spotlight } from "@/components/spotlight"
import { GlitchText } from "@/components/glitch-text"
import { TiltCard } from "@/components/tilt-card"
import { FadeContent } from "@/components/fade-content"
import { DecryptedText } from "@/components/decrypted-text"
import { ClickSpark } from "@/components/click-spark"
import { MusicPlayer } from "@/components/music-player"
import { ShinyText } from "@/components/shiny-text"
import { SkillDisplay } from "@/components/skill-card"
import { AnimatedBorder } from "@/components/animated-border"
import { BorderBeam } from "@/components/border-beam"
import { VisitCounter } from "@/components/visit-counter"

type AppState = "loading" | "entered"

export default function Portfolio() {
  const [appState, setAppState] = useState<AppState>("loading")
  const videoRef = useRef<VideoBackgroundRef>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  const handleEnter = () => {
    setAppState("entered")
  }

  const isEntered = appState === "entered"

  return (
    <ClickSpark sparkColor="rgba(255, 255, 255, 0.6)" sparkCount={8} sparkRadius={25}>
      <main className="relative min-h-screen overflow-x-hidden">
        <LoadingScreen isVisible={appState === "loading"} onComplete={handleEnter} />
        <VideoBackground ref={videoRef} isActive={isEntered} />
        <MusicPlayer isActive={isEntered} onAudioRef={setAudioElement} />
        <AudioControls audioElement={audioElement} isVisible={isEntered} />



        <div
          className={`relative z-20 min-h-screen transition-all duration-1000 ${isEntered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <div className="container mx-auto px-4 py-12 md:py-16">
            {/* Hero Section */}
            <section className="min-h-[80vh] flex items-center justify-center">
              <TiltCard tiltAmount={8} glareEnable={false}>
                <AnimatedBorder
                  borderColor="rgba(255, 255, 255, 0.5)"
                  className="rounded-2xl overflow-hidden max-w-lg mx-auto"
                >
                  <GlassPanel className="text-center p-6 md:p-8" showBorder={false}>
                    <FadeContent delay={100} direction="down" distance={20}>
                      <div className="relative mx-auto mb-4 w-32 h-32">
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <img
                            src="/portfolio/profile.png"
                            alt="Anika Mahfuza"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>
                    </FadeContent>

                    <h1 className="font-sans text-2xl md:text-3xl font-semibold mb-1 text-foreground tracking-tight">
                      <GlitchText text="ANIKA MAHFUZA" speed={40} />
                    </h1>

                    <p className="text-accent text-xs uppercase tracking-widest mb-3">
                      <DecryptedText text="C# · C++ · Python · Web · Malware" speed={25} />
                    </p>

                    <FadeContent delay={400} blur>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 text-pretty">
                        Crafting code in the shadows. Developer, reverse engineer, and depressed.
                      </p>
                    </FadeContent>

                    <FadeContent delay={600}>
                      <div className="flex items-center justify-center gap-3">
                        <Magnet strength={0.4}>
                          <a
                            href="https://discord.gg/68gVSXp74k"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass w-10 h-10 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-all duration-300 group"
                            aria-label="Discord"
                          >
                            <DiscordIcon className="w-4 h-4 text-foreground/70 group-hover:text-foreground transition-colors" />
                          </a>
                        </Magnet>
                        <Magnet strength={0.4}>
                          <a
                            href="https://guns.lol/mahfuza"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass w-10 h-10 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-all duration-300 group"
                            aria-label="Links"
                          >
                            <ExternalLinkIcon className="w-4 h-4 text-foreground/70 group-hover:text-foreground transition-colors" />
                          </a>
                        </Magnet>
                      </div>
                      <div className="mt-6 flex justify-center">
                        <VisitCounter />
                      </div>
                    </FadeContent>
                  </GlassPanel>
                  <BorderBeam size={250} duration={12} delay={9} />
                </AnimatedBorder>
              </TiltCard>
            </section>

            {/* Quote Section */}
            <section className="py-8">
              <FadeContent direction="up" distance={20}>
                <div className="max-w-2xl mx-auto text-center">
                  <blockquote className="relative">
                    <span className="text-accent/30 text-4xl font-serif absolute -top-4 -left-2">"</span>
                    <p className="text-foreground/80 text-lg md:text-xl italic font-light px-8">
                      Vibe coders are next generation copy pasters
                    </p>
                    <span className="text-accent/30 text-4xl font-serif absolute -bottom-8 -right-2">"</span>
                    <footer className="mt-4 text-muted-foreground text-sm">— Anika Mahfuza</footer>
                  </blockquote>
                </div>
              </FadeContent>
            </section>

            {/* About Section */}
            <section className="py-16">
              <FadeContent direction="up" distance={40}>
                <div className="max-w-3xl mx-auto">
                  <TiltCard tiltAmount={5} glareEnable={false}>
                    <AnimatedBorder
                      borderColor="rgba(255, 255, 255, 0.5)"
                      className="rounded-2xl overflow-hidden"
                    >
                      <GlassPanel className="p-6 md:p-8" showBorder={false}>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-6 bg-accent/50 rounded-full" />
                          <h2 className="font-sans text-xl md:text-2xl font-semibold text-foreground">
                            <DecryptedText text="void About()" speed={50} />
                          </h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                            <FadeContent delay={200}>
                              <p>
                                Developer exploring the depths of system-level programming, security research, and web
                                technologies.
                              </p>
                            </FadeContent>
                            <FadeContent delay={400}>
                              <p>
                                My work spans from low-level C++ and C# applications to modern web development and malware
                                analysis.
                              </p>
                            </FadeContent>
                          </div>
                          <div className="space-y-3">
                            <FadeContent delay={300} direction="left">
                              <Magnet strength={0.2} className="block">
                                <AnimatedBorder
                                  borderColor="rgba(255, 255, 255, 0.5)"
                                  className="rounded-lg overflow-hidden"
                                >
                                  <div className="glass p-3 transition-all duration-300 hover:bg-foreground/5 border-none">
                                    <span className="text-xs text-accent font-mono tracking-wider">std::vector&lt;Lang&gt;</span>
                                    <p className="text-foreground text-sm mt-1">C#, C++, Python, JavaScript, TypeScript</p>
                                  </div>
                                </AnimatedBorder>
                              </Magnet>
                            </FadeContent>
                            <FadeContent delay={500} direction="left">
                              <Magnet strength={0.2} className="block">
                                <AnimatedBorder
                                  borderColor="rgba(255, 255, 255, 0.5)"
                                  className="rounded-lg overflow-hidden"
                                >
                                  <div className="glass p-3 transition-all duration-300 hover:bg-foreground/5 border-none">
                                    <span className="text-xs text-accent font-mono tracking-wider">enum class Focus</span>
                                    <p className="text-foreground text-sm mt-1">
                                      Web Development, Security Research, Reverse Engineering
                                    </p>
                                  </div>
                                </AnimatedBorder>
                              </Magnet>
                            </FadeContent>
                          </div>
                        </div>
                      </GlassPanel>
                    </AnimatedBorder>
                  </TiltCard>
                </div>
              </FadeContent>
            </section>

            {/* Skills Showcase Section */}
            <section className="py-16">
              <FadeContent direction="up" distance={20}>
                <div className="max-w-xl mx-auto">
                  <TiltCard tiltAmount={4} glareEnable={false}>
                    <AnimatedBorder
                      borderColor="rgba(255, 255, 255, 0.5)"
                      className="rounded-2xl overflow-hidden"
                    >
                      <GlassPanel className="p-6" showBorder={false}>
                        <SkillDisplay
                          skills={[
                            { name: "C#", level: "Proficient" },
                            { name: "C++", level: "Advanced" },
                            { name: "Python", level: "Advanced" },
                            { name: "Web", level: "Advanced" },
                          ]}
                        />
                      </GlassPanel>
                    </AnimatedBorder>
                  </TiltCard>
                </div>
              </FadeContent>
            </section>

            {/* Contact Section */}
            <section className="py-16">
              <FadeContent direction="up" distance={30}>
                <TiltCard tiltAmount={6} glareEnable={false}>
                  <AnimatedBorder
                    borderColor="rgba(255, 255, 255, 0.5)"
                    className="rounded-2xl overflow-hidden max-w-md mx-auto"
                  >
                    <GlassPanel variant="strong" className="text-center p-6" showBorder={false}>
                      <h2 className="font-sans text-lg md:text-xl font-semibold text-foreground mb-3">
                        <DecryptedText text="std::cin >> contact" speed={40} />
                      </h2>
                      <FadeContent delay={200}>
                        <p className="text-muted-foreground text-sm mb-4 text-pretty">
                          Interested in collaboration or have a project in mind? Let's connect.
                        </p>
                      </FadeContent>
                      <FadeContent delay={400}>
                        <Magnet strength={0.3}>
                          <a
                            href="https://discord.gg/68gVSXp74k"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground/10 hover:bg-foreground/20 rounded-full text-foreground text-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/10"
                          >
                            <ShinyText text="Join Discord" speed={3} className="font-medium" />
                            <DiscordIcon className="w-3.5 h-3.5" />
                          </a>
                        </Magnet>
                      </FadeContent>
                    </GlassPanel>
                  </AnimatedBorder>
                </TiltCard>
              </FadeContent>
            </section>
          </div>

          {/* Footer */}
          <footer className="relative z-20 py-6 text-center text-muted-foreground text-xs border-t border-border/30">
            <div className="container mx-auto px-4 space-y-2">
              <div className="font-mono text-accent/50 text-xs mb-2">return 0;</div>
              <p>&copy; {new Date().getFullYear()} Anika Mahfuza. All rights reserved.</p>
              <p className="text-muted-foreground/60">
                Components inspired by{" "}
                <a
                  href="https://reactbits.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent/70 hover:text-accent transition-colors underline underline-offset-2"
                >
                  ReactBits
                </a>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </ClickSpark>
  )
}
