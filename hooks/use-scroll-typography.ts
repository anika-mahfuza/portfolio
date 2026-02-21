"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useTransform, useScroll } from "framer-motion";

interface ScrollTypographyProps {
  targetRef: React.RefObject<HTMLElement>;
  offset?: [string, string];
}

export const useScrollTypography = ({ targetRef, offset = ["start start", "end end"] }: ScrollTypographyProps) => {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: offset,
  });

  // Typography weight animation (300-900)
  const fontWeight = useTransform(scrollYProgress, [0, 1], [300, 900]);
  
  // 3D rotation effect
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [90, 0, -90]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-45, 0, 45]);
  
  // Perspective effect
  const perspective = useTransform(scrollYProgress, [0, 1], [1000, 500]);
  
  // Scale effect for dramatic impact
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2]);
  
  // Opacity for fade effects
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Blur effect for velocity simulation
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, 5]);
  
  // Color intensity based on scroll
  const colorIntensity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  
  // Letter spacing animation
  const letterSpacing = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, -0.05, 0.1]);
  
  // Text shadow depth
  const textShadow = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [
      "0 0 0px rgba(255, 42, 61, 0)",
      "0 0 30px rgba(255, 42, 61, 0.6)",
      "0 0 60px rgba(255, 42, 61, 0.3)"
    ]
  );

  return {
    fontWeight,
    rotateX,
    rotateY,
    perspective,
    scale,
    opacity,
    blur,
    colorIntensity,
    letterSpacing,
    textShadow,
    scrollProgress: scrollYProgress,
  };
};

// Advanced 3D text effects hook
export const use3DTypography = (elementRef: React.RefObject<HTMLElement>) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x: x - 0.5, y: y - 0.5 });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef]);

  // 3D rotation based on mouse position
  const rotateX = mousePosition.y * -30; // Invert for natural feel
  const rotateY = mousePosition.x * 30;
  
  // Perspective and depth
  const perspective = isHovered ? 1000 : 500;
  const translateZ = isHovered ? 50 : 0;
  
  // Dynamic lighting effect
  const lightIntensity = isHovered ? 1 : 0.5;
  const shadowIntensity = isHovered ? 0.8 : 0.4;
  
  return {
    transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
    transition: 'transform 0.1s ease-out',
    filter: `brightness(${lightIntensity}) drop-shadow(0 10px 20px rgba(255, 42, 61, ${shadowIntensity}))`,
  };
};

// Text unfolding animation for sections
export const useTextUnfold = (elementRef: React.RefObject<HTMLElement>, delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, delay]);

  return {
    className: isVisible ? 'text-unfold' : 'opacity-0',
    style: {
      animationDelay: `${delay}s`,
    },
  };
};