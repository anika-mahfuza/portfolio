"use client";

import { useRef, useState, useCallback } from "react";

interface MagneticHoverProps {
  strength?: number;
  distance?: number;
  smoothness?: number;
}

export const useMagneticHover = ({
  strength = 0.3,
  distance = 100,
  smoothness = 0.1,
}: MagneticHoverProps = {}) => {
  const elementRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate distance from center
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Only apply magnetic effect if within distance threshold
    if (distanceFromCenter < distance) {
      const intensity = Math.max(0, 1 - distanceFromCenter / distance);
      const offsetX = deltaX * strength * intensity;
      const offsetY = deltaY * strength * intensity;
      
      setMousePosition({ x: offsetX, y: offsetY });
      setCurrentOffset(prev => ({
        x: prev.x + (offsetX - prev.x) * smoothness,
        y: prev.y + (offsetY - prev.y) * smoothness,
      }));
    } else {
      // Return to center when mouse is far
      setCurrentOffset(prev => ({
        x: prev.x * (1 - smoothness),
        y: prev.y * (1 - smoothness),
      }));
    }
  }, [strength, distance, smoothness]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Smoothly return to center
    setCurrentOffset({ x: 0, y: 0 });
  }, []);

  const magneticStyle = {
    transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
    transition: isHovered 
      ? 'transform 0.1s ease-out' 
      : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform',
  };

  return {
    ref: elementRef,
    magneticStyle,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    isHovered,
    offset: currentOffset,
  };
};