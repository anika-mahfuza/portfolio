"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollTextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  staggerChildren?: boolean;
  animationType?: "fade-up" | "fade-down" | "slide-left" | "slide-right" | "rotate-in" | "unfold" | "3d-flip";
  viewportOffset?: ["start end" | "end start" | "start start" | "start center" | "start end" | "center start" | "center center" | "center end" | "end start" | "end center" | "end end", "start end" | "end start" | "start start" | "start center" | "start end" | "center start" | "center center" | "center end" | "end start" | "end center" | "end end"];
  textShadow?: boolean;
  weightAnimation?: boolean;
  perspective?: number;
}

export function ScrollTextReveal({
  children,
  className,
  delay = 0,
  duration = 1.2,
  staggerChildren = false,
  animationType = "fade-up",
  viewportOffset = ["start end", "end start"],
  textShadow = false,
  weightAnimation = false,
  perspective = 1000,
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: viewportOffset,
  });

  // Enhanced animation variants for award-winning typography
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants: any = {
    "fade-up": {
      hidden: { opacity: 0, y: 100, filter: "blur(10px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      },
    },
    "fade-down": {
      hidden: { opacity: 0, y: -100, filter: "blur(10px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      },
    },
    "slide-left": {
      hidden: { opacity: 0, x: 100, rotateY: 45 },
      visible: {
        opacity: 1,
        x: 0,
        rotateY: 0,
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      },
    },
    "slide-right": {
      hidden: { opacity: 0, x: -100, rotateY: -45 },
      visible: {
        opacity: 1,
        x: 0,
        rotateY: 0,
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      },
    },
    "rotate-in": {
      hidden: { opacity: 0, rotateX: 90, y: 50 },
      visible: {
        opacity: 1,
        rotateX: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      },
    },
    "unfold": {
      hidden: { opacity: 0, rotateX: -90, y: 100, transformOrigin: "bottom" },
      visible: {
        opacity: 1,
        rotateX: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      },
    },
    "3d-flip": {
      hidden: {
        opacity: 0,
        rotateY: 180,
        scale: 0.8,
        filter: "blur(5px)",
      },
      visible: {
        opacity: 1,
        rotateY: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
          duration,
          delay,
          ease: "easeOut",
        },
      },
    },
  };

  // Enhanced scroll-driven effects
  const fontWeight = useTransform(scrollYProgress, [0, 1], [300, 900]);
  const letterSpacing = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, -0.05, 0.1]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.1]);
  const dynamicTextShadow = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "0 0 0px rgba(255, 42, 61, 0)",
      "0 0 20px rgba(255, 42, 61, 0.4)",
      "0 0 40px rgba(255, 42, 61, 0.2)",
    ]
  );

  // Handle staggered children animation
  const renderChildren = () => {
    if (!staggerChildren || typeof children !== 'string') {
      return (
        <motion.div
          style={{
            fontWeight: weightAnimation ? fontWeight : undefined,
            letterSpacing: weightAnimation ? letterSpacing : undefined,
            scale: weightAnimation ? scale : undefined,
            textShadow: dynamicTextShadow && weightAnimation ? dynamicTextShadow : undefined,
          }}
        >
          {children}
        </motion.div>
      );
    }

    // Split text into words for staggered animation
    const words = children.split(' ');
    return (
      <span className="inline-block">
        {words.map((word, index) => (
          <motion.span
            key={index}
            className="inline-block mr-2"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  delay: delay + (index * 0.1),
                  ease: "easeOut",
                },
              },
            }}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
          >
            {word}
          </motion.span>
        ))}
      </span>
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        className,
        weightAnimation && "will-change-transform"
      )}
      variants={variants[animationType]}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      style={{
        perspective: perspective,
        ...(weightAnimation && {
          fontWeight: fontWeight,
          letterSpacing: letterSpacing,
          scale: scale,
          textShadow: dynamicTextShadow,
        }),
      }}
    >
      {renderChildren()}
    </motion.div>
  );
}

// Enhanced section header with scroll-driven typography
export function ScrollSectionHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={cn("mb-16", className)}>
      <ScrollTextReveal
        animationType="unfold"
        duration={1.5}
        weightAnimation={true}
        textShadow={true}
        className="mb-4"
      >
        <h2 className="text-display text-6xl md:text-8xl lg:text-9xl text-[var(--foreground)]">
          {title}
        </h2>
      </ScrollTextReveal>

      {subtitle && (
        <ScrollTextReveal
          animationType="fade-up"
          delay={0.3}
          duration={1}
          className="text-xl md:text-2xl text-[var(--foreground-muted)] font-mono"
        >
          {subtitle}
        </ScrollTextReveal>
      )}
    </div>
  );
}