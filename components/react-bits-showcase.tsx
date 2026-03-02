"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"

export function ReactBitsShowcase() {
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
            React Bits
          </h3>
          <p className="text-[var(--foreground-secondary)] max-w-md mx-auto">
            This portfolio uses animated components from React Bits - a collection of 
            110+ interactive React components.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <a
            href="https://reactbits.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[var(--foreground)] uppercase tracking-wide border border-[var(--border-strong)] hover:border-[var(--pop)] hover:text-[var(--pop)] transition-colors duration-300"
          >
            <span>Explore React Bits</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
