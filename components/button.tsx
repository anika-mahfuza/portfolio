"use client"

import { motion, type HTMLMotionProps } from "framer-motion"
import { forwardRef } from "react"

interface ButtonProps {
  variant?: "primary" | "secondary"
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", children, className = "", onClick }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-3 px-8 py-4 font-medium text-sm uppercase tracking-wide transition-colors duration-300 rounded-lg"
    
    const variants = {
      primary: "bg-[var(--pop)] text-white hover:bg-[var(--foreground)]",
      secondary: "border border-[var(--border-strong)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]"
    }

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = "Button"

interface LinkButtonProps {
  variant?: "primary" | "secondary"
  children: React.ReactNode
  className?: string
  href: string
  target?: string
  rel?: string
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ variant = "primary", children, className = "", href, target, rel }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-3 px-8 py-4 font-medium text-sm uppercase tracking-wide transition-colors duration-300 rounded-lg"
    
    const variants = {
      primary: "bg-[var(--pop)] text-white hover:bg-[var(--foreground)]",
      secondary: "border border-[var(--border-strong)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]"
    }

    const isExternal = href.startsWith("http")

    return (
      <motion.a
        ref={ref}
        href={href}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        target={target || (isExternal ? "_blank" : undefined)}
        rel={rel || (isExternal ? "noopener noreferrer" : undefined)}
      >
        {children}
      </motion.a>
    )
  }
)

LinkButton.displayName = "LinkButton"

interface IconButtonProps {
  children: React.ReactNode
  className?: string
  href?: string
  title?: string
  onClick?: () => void
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, className = "", href, title, onClick }, ref) => {
    const baseStyles = "w-12 h-12 rounded-lg border border-[var(--border-strong)] flex items-center justify-center text-[var(--foreground-secondary)] hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-[var(--foreground)] transition-colors duration-300"

    if (href) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={title}
          className={`${baseStyles} ${className}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.a>
      )
    }

    return (
      <motion.button
        ref={ref}
        title={title}
        className={`${baseStyles} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
      >
        {children}
      </motion.button>
    )
  }
)

IconButton.displayName = "IconButton"
