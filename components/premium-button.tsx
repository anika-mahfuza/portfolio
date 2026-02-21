"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/magnetic-button";

interface PremiumButtonProps {
  children: React.ReactNode;
  hoverText?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "magnetic";
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  disabled?: boolean;
  rippleEffect?: boolean;
  textSwap?: boolean;
  iconMorph?: boolean;
  href?: string;
}

export function PremiumButton({
  children,
  hoverText,
  className,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  rippleEffect = true,
  textSwap = true,
  iconMorph = true,
  href,
}: PremiumButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled) return;

    // Create ripple effect
    if (rippleEffect) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 1000);
    }

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    onClick?.();
  }, [disabled, onClick, rippleEffect]);

  const baseClasses = cn(
    "relative overflow-hidden font-mono font-medium transition-all duration-300 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-[var(--pop)] focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    {
      "transform active:scale-95": !disabled,
      "bg-[var(--pop)] text-white hover:bg-[var(--pop-warm)] active:bg-[var(--pop-cool)]": variant === "primary",
      "bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] border border-[var(--border)]": variant === "secondary",
      "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface)] border border-[var(--border)]": variant === "ghost",
      "px-4 py-2 text-sm": size === "sm",
      "px-6 py-3 text-base": size === "md",
      "px-8 py-4 text-lg": size === "lg",
      "px-10 py-5 text-xl": size === "xl",
    },
    className
  );

  const buttonStyle = {
    transform: isPressed ? 'scale(0.95)' : undefined,
  };

  const ButtonComponent = href ? 'a' : 'button';
  const buttonProps = href ? { href } : { type: 'button' as const };

  // Common content for both variants
  const renderContent = () => (
    <>
      {/* Ripple Effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 2,
              height: 2,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 50, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Text Swap Animation */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          {textSwap && isHovered && hoverText ? (
            <motion.span
              key="hover-text"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {hoverText}
            </motion.span>
          ) : (
            <motion.span
              key="default-text"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  // Handle magnetic variant separately
  if (variant === "magnetic") {
    return (
      <MagneticButton
        className={baseClasses}
        strength={0.2}
        distance={80}
        onClick={handleClick}
        {...buttonProps}
      >
        {renderContent()}
      </MagneticButton>
    );
  }

  return (
    <ButtonComponent
      className={baseClasses}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={disabled}
      {...buttonProps}
    >
      {renderContent()}
    </ButtonComponent>
  );
}

// Specialized icon button with morphing effects
export function IconMorphButton({
  icon,
  hoverIcon,
  className,
  onClick,
  ...props
}: {
  icon: React.ReactNode;
  hoverIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <PremiumButton
      variant="secondary"
      size="sm"
      className={cn("p-3 rounded-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      textSwap={false}
      {...props}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isHovered ? "hover" : "default"}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {isHovered && hoverIcon ? hoverIcon : icon}
        </motion.span>
      </AnimatePresence>
    </PremiumButton>
  );
}