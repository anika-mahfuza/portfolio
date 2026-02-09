# Fix ScrollCards Folding Effect

## Problem
The current ScrollCards implementation using `useInView` doesn't create a real folding effect as cards scroll through the viewport center. The effect only triggers once when cards enter the viewport, not continuously during scrolling.

## Root Cause
`useInView` is a boolean - it only tells us if something is in view or not. It doesn't provide continuous scroll position information needed for a proper stacking/folding animation.

## Solution
Use `useScroll` + `useTransform` + `useSpring` to create continuous scroll-based animations:

1. Track scroll progress for each card relative to viewport
2. Apply smooth spring-based animations
3. Cards fold as they pass through center of screen

## Implementation
Replace `ScrollCards.tsx` with proper scroll-based animations using Framer Motion's `useScroll`, `useTransform`, and `useSpring` hooks.

## Key Changes
- Remove `useInView` (boolean-based)
- Add `useScroll` with `target` offset tracking
- Add `useSpring` for smooth physics-based animations
- Apply transforms: scale, opacity, y position based on scroll progress
- Cards fold to 82% scale at center, return to normal

## Files Modified
- `components/react-bits/ScrollCards.tsx`

## Success Criteria
- Cards fold as they pass through center of viewport
- Smooth continuous animation during scroll
- No stuck scrolling behavior
- Proficiency bars animate on entry
