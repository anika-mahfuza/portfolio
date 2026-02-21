// Typography Performance Optimization Utilities

export const TypographyOptimizer = {
  // RAF-based animation scheduler
  scheduleAnimation: (callback: () => void) => {
    let rafId: number;
    let isScheduled = false;
    
    const schedule = () => {
      if (isScheduled) return;
      isScheduled = true;
      
      rafId = requestAnimationFrame(() => {
        callback();
        isScheduled = false;
      });
    };
    
    return {
      schedule,
      cancel: () => {
        cancelAnimationFrame(rafId);
        isScheduled = false;
      },
    };
  },

  // Intersection Observer for lazy text animations
  createTextObserver: (
    elements: Element[],
    callback: (element: Element, isIntersecting: boolean) => void,
    options: IntersectionObserverInit = { threshold: 0.1 }
  ) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        callback(entry.target, entry.isIntersecting);
      });
    }, options);

    elements.forEach((element) => observer.observe(element));
    
    return {
      disconnect: () => observer.disconnect(),
      unobserve: (element: Element) => observer.unobserve(element),
    };
  },

  // Font loading optimization
  preloadFonts: (fontFamilies: string[]) => {
    if (typeof document === 'undefined') return;
    
    fontFamilies.forEach((fontFamily) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
      
      document.head.appendChild(link);
    });
  },

  // Reduced motion detection
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Performance monitoring
  measurePerformance: (name: string, callback: () => void) => {
    if (typeof performance === 'undefined') {
      callback();
      return;
    }
    
    const startMark = `${name}-start`;
    const endMark = `${name}-end`;
    const measureName = `${name}-measure`;
    
    performance.mark(startMark);
    callback();
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    
    const measure = performance.getEntriesByName(measureName)[0];
    console.log(`${name} took ${measure.duration}ms`);
    
    // Clean up
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);
  },

  // Memory management for animations
  cleanupAnimations: (element: HTMLElement) => {
    // Cancel all RAF callbacks
    const rafCallbacks = element.getAttribute('data-raf-callbacks');
    if (rafCallbacks) {
      const callbacks = JSON.parse(rafCallbacks);
      callbacks.forEach((id: number) => cancelAnimationFrame(id));
      element.removeAttribute('data-raf-callbacks');
    }
    
    // Remove event listeners
    element.removeEventListener('mouseenter', () => {});
    element.removeEventListener('mouseleave', () => {});
    element.removeEventListener('mousemove', () => {});
  },

  // Throttle function for scroll events
  throttle: (func: (...args: any[]) => void, limit: number) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Debounce function for resize events
  debounce: (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  },
};

// CSS-in-JS optimization for typography
export const TypographyCSS = {
  // Optimized keyframe animations
  keyframes: {
    textUnfold: `
      @keyframes text-unfold {
        from {
          transform: translateY(100%) rotateX(-90deg);
          opacity: 0;
        }
        to {
          transform: translateY(0) rotateX(0);
          opacity: 1;
        }
      }
    `,
    
    letterReveal: `
      @keyframes letter-reveal {
        from {
          transform: translateY(100%) rotateY(90deg);
          opacity: 0;
        }
        to {
          transform: translateY(0) rotateY(0);
          opacity: 1;
        }
      }
    `,
    
    weightShift: `
      @keyframes weight-shift {
        0% { font-variation-settings: 'wght' 300; }
        50% { font-variation-settings: 'wght' 800; }
        100% { font-variation-settings: 'wght' 500; }
      }
    `,
  },

  // Will-change optimizations
  willChange: {
    transform: 'will-change: transform;',
    opacity: 'will-change: opacity;',
    filter: 'will-change: filter;',
    fontWeight: 'will-change: font-variation-settings;',
  },

  // GPU acceleration
  gpuAcceleration: 'transform: translateZ(0); backface-visibility: hidden; perspective: 1000px;',

  // Font display optimization
  fontDisplay: 'font-display: swap;',
};

// Export for use in components
export default TypographyOptimizer;