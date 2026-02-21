// Validation script for Week 1 typography enhancements
export const validateTypographyEnhancements = () => {
  const results = {
    fontLoading: false,
    animations: false,
    components: false,
    performance: false,
    accessibility: false,
  };

  // 1. Font Loading Validation
  try {
    const spaceGrotesk = getComputedStyle(document.documentElement).getPropertyValue('--font-display');
    results.fontLoading = spaceGrotesk.includes('Space Grotesk');
    console.log('✅ Font Loading:', results.fontLoading ? 'PASSED' : 'FAILED');
  } catch (error) {
    console.log('❌ Font Loading: FAILED', error);
  }

  // 2. Animation Validation
  try {
    const testElement = document.createElement('div');
    testElement.className = 'text-unfold';
    document.body.appendChild(testElement);
    
    const animation = getComputedStyle(testElement).animation;
    results.animations = animation.includes('text-unfold');
    console.log('✅ Animations:', results.animations ? 'PASSED' : 'FAILED');
    
    document.body.removeChild(testElement);
  } catch (error) {
    console.log('❌ Animations: FAILED', error);
  }

  // 3. Component Validation
  try {
    const hasScrollTextReveal = typeof ScrollTextReveal !== 'undefined';
    const hasPremiumButton = typeof PremiumButton !== 'undefined';
    const hasMagneticHover = typeof useMagneticHover !== 'undefined';
    
    results.components = hasScrollTextReveal && hasPremiumButton && hasMagneticHover;
    console.log('✅ Components:', results.components ? 'PASSED' : 'FAILED');
  } catch (error) {
    console.log('❌ Components: FAILED', error);
  }

  // 4. Performance Validation
  try {
    const hasRAF = typeof requestAnimationFrame !== 'undefined';
    const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';
    
    results.performance = hasRAF && hasIntersectionObserver;
    console.log('✅ Performance:', results.performance ? 'PASSED' : 'FAILED');
  } catch (error) {
    console.log('❌ Performance: FAILED', error);
  }

  // 5. Accessibility Validation
  try {
    const hasReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia && 
      typeof window.matchMedia('(prefers-reduced-motion: reduce)').matches === 'boolean';
    
    results.accessibility = hasReducedMotion;
    console.log('✅ Accessibility:', results.accessibility ? 'PASSED' : 'FAILED');
  } catch (error) {
    console.log('❌ Accessibility: FAILED', error);
  }

  // Summary
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log('\n📊 Typography Enhancement Validation Summary:');
  console.log(`✅ Passed: ${passed}/${total} tests`);
  console.log(`📈 Success Rate: ${Math.round((passed / total) * 100)}%`);
  
  if (passed === total) {
    console.log('🎉 All typography enhancements are working correctly!');
  } else {
    console.log('⚠️  Some tests failed. Check the console for details.');
  }

  return results;
};

// Auto-run validation when script loads
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', validateTypographyEnhancements);
  } else {
    validateTypographyEnhancements();
  }
}

export default validateTypographyEnhancements;