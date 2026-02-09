"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { BlurText, GlareHover, Particles } from "./react-bits"

export function ReactBitsShowcase() {
  const components = [
    {
      name: "BlurText",
      description: "Text reveal animation",
      demo: <BlurText text="Blur" delay={100} className="text-lg font-bold" animateBy="letters" />,
      url: "https://reactbits.dev/text-animations/blur-text",
    },
    {
      name: "Particles",
      description: "Ambient background",
      demo: (
        <div className="w-full h-16 relative overflow-hidden rounded">
          <Particles 
            particleCount={30}
            particleSpread={5}
            speed={0.1}
            particleColors={['#e63946']}
            particleBaseSize={40}
          />
        </div>
      ),
      url: "https://reactbits.dev/backgrounds/particles",
    },
    {
      name: "GlareHover",
      description: "Shine effect on hover",
      demo: (
        <GlareHover
          width="100%"
          height="40px"
          background="transparent"
          borderColor="#333"
          borderRadius="4px"
          glareColor="#e63946"
          glareOpacity={0.6}
        >
          <span className="text-sm px-2">Hover me</span>
        </GlareHover>
      ),
      url: "https://reactbits.dev/animations/glare-hover",
    },
    {
      name: "Aurora",
      description: "Flowing light waves",
      demo: (
        <div className="w-full h-16 bg-gradient-to-r from-red-900/30 to-black rounded flex items-center justify-center">
          <span className="text-xs text-red-400/60">Aurora effect</span>
        </div>
      ),
      url: "https://reactbits.dev/backgrounds/aurora",
    },
  ]

  return (
    <section className="py-16 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-[var(--foreground-muted)] mb-2">
            Built with
          </p>
          <h3 className="text-3xl font-bold text-[var(--foreground)] mb-4">
            <BlurText
              text="React Bits"
              delay={100}
              className="inline-block"
              animateBy="letters"
            />
          </h3>
          <p className="text-[var(--foreground-secondary)] max-w-md mx-auto">
            This portfolio uses animated components from React Bits - a collection of 
            110+ interactive React components.
          </p>
        </motion.div>

        {/* Component Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {components.map((component, index) => (
            <motion.a
              key={component.name}
              href={component.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="group relative p-4 border border-[var(--border)] bg-[var(--background)] hover:border-[var(--pop)] transition-colors duration-300"
            >
              <div className="mb-3 h-16 flex items-center justify-center overflow-hidden">
                {component.demo}
              </div>
              <div className="text-center">
                <h4 className="font-mono text-sm font-medium text-[var(--foreground)] mb-1">
                  {component.name}
                </h4>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {component.description}
                </p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="w-3 h-3 text-[var(--pop)]" />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
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
              href="https://reactbits.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[var(--foreground)] uppercase tracking-wide"
            >
              <span>Explore React Bits</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </GlareHover>
        </motion.div>
      </div>
    </section>
  )
}
