"use client";

import { useMagneticHover } from "@/hooks/use-magnetic-hover";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  distance?: number;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  distance = 100,
  onClick,
  ...props
}: MagneticButtonProps) {
  const {
    ref: magneticRef,
    magneticStyle,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  } = useMagneticHover({ strength, distance });

  return (
    <button
      ref={magneticRef}
      className={className}
      style={magneticStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}