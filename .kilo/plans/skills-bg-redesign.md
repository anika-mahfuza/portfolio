# Skills Section Background Redesign Plan

## Problem
The current skills section uses a `Waves` WebGL background (from react-bits) that feels heavy, visually noisy, and doesn't match the subtle, premium aesthetic of the other sections (About uses `Threads`, Contact uses `Aurora` — both at low opacity).

## Solution: Grainy Gradient Mesh (CSS + SVG Filter)

A **pure CSS + SVG filter** background effect — zero JavaScript, zero WebGL, zero canvas. This is the trending viral effect across premium portfolios and Awwwards-winning sites in 2025-2026.

### Why This Approach
- **Ultra-lightweight**: No WebGL/Three.js/canvas/GPU overhead
- **Viral/trending**: Grainy gradients are the #1 background trend in modern web design
- **Premium feel**: Subtle, textured, organic — doesn't compete with the code editor content
- **Theme-aware**: Different gradient colors for dark/light mode
- **Fits the aesthetic**: Complements the code editor skills card without overwhelming it

### Visual Design
- 2-3 soft radial gradients in the brand's red tones (`--pop`, `--pop-warm`, `--pop-cool`)
- SVG `feTurbulence` filter overlay for organic grain texture
- Very slow CSS animation (gradient blobs drift subtly over 20-30s)
- Low opacity (0.3-0.5) so content remains the focus
- The grain texture adds depth and prevents color banding

### Implementation

#### 1. Create `components/skills-grain-bg.tsx` (new file)
A simple React component that renders:
- An SVG filter definition (hidden, `aria-hidden`)
- A div with CSS gradient background + grain filter applied
- CSS keyframe animations for subtle gradient movement
- Theme detection via `useTheme()` from next-themes

#### 2. Update `components/compilation-skills.tsx`
- Replace `<Waves>` import and usage with `<SkillsGrainBackground>`
- Remove `Waves` import from react-bits
- Keep all existing code editor content unchanged

#### 3. No changes needed to `globals.css` or other files
All styles will be inline or in the component (CSS-in-JS via style tag or Tailwind).

### Files to Modify
| File | Action |
|------|--------|
| `components/skills-grain-bg.tsx` | CREATE - new grainy gradient mesh component |
| `components/compilation-skills.tsx` | EDIT - replace Waves with SkillsGrainBackground |

### Technical Details

**SVG Filter** (same technique from Frontend Masters / Ana Tudor's viral grainy gradients article):
```svg
<filter id="grain" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/>
  <feBlend in="SourceGraphic" mode="multiply"/>
</filter>
```

**CSS Gradients** (dark mode):
- Radial gradient 1: `--pop` (#ff2a3d) at 20% opacity, positioned top-left
- Radial gradient 2: `--pop-warm` (#ff4757) at 15% opacity, positioned bottom-right
- Radial gradient 3: `--pop-cool` (#e74c3c) at 10% opacity, positioned center

**CSS Gradients** (light mode):
- Warmer coral/peach tones at lower opacity (0.15-0.25)

**Animation**:
- `@keyframes gradientDrift1`: translate(0,0) → translate(5%, 3%) → translate(-3%, 5%) → back (25s)
- `@keyframes gradientDrift2`: translate(0,0) → translate(-4%, -3%) → translate(3%, -5%) → back (30s)
- `@keyframes gradientDrift3`: translate(0,0) → translate(2%, -4%) → translate(-5%, 2%) → back (22s)

### Comparison: Before vs After

| Aspect | Before (Waves) | After (Grainy Gradient) |
|--------|---------------|------------------------|
| Technology | WebGL + Canvas | Pure CSS + SVG filter |
| JS overhead | High (animation loop) | Zero |
| Visual weight | Heavy, animated lines | Soft, organic texture |
| Performance | GPU-intensive | Near-zero cost |
| Theme support | Manual detection | useTheme() |
| Matches site aesthetic | Too busy | Subtle, premium |

## Verification
- Run `npm run build` to ensure no build errors
- Run `npm run lint` to check for linting issues
- Visual check in both dark and light themes
- Verify the grain texture renders correctly across browsers
