# Portfolio Redesign Plan — Modern Creative

## Design Philosophy
**Bold, asymmetric, scroll-driven, professional.** No cheap glows, no generic progress bars, no cookie-cutter layouts. Every section should feel intentional and crafted.

---

## 1. Color System Overhaul

### Light Theme
- **Background:** `#f8f7f4` (warm off-white, paper-like)
- **Surface:** `#ffffff`
- **Foreground:** `#141414` (near-black, high contrast)
- **Secondary text:** `#525252`
- **Muted text:** `#9a9a9a`
- **Accent:** `#141414` (black as accent — sophisticated, not blue)
- **Accent secondary:** `#e63946` (a single pop color for emphasis — warm red)
- **Borders:** `#e8e6e1` (warm gray)

### Dark Theme
- **Background:** `#0a0a0a` (true dark)
- **Surface:** `#141414`
- **Foreground:** `#f0efe9` (warm white)
- **Secondary text:** `#b0b0b0`
- **Muted text:** `#666666`
- **Accent:** `#f0efe9` (white as accent)
- **Accent secondary:** `#e63946` (same pop color)
- **Borders:** `#222222`

**Key change:** Remove blue accent entirely. Use monochrome + one pop color. This is more distinctive and professional.

---

## 2. Typography

- **Headings:** Manrope (already loaded) — use at extreme sizes (8xl-9xl) with tight tracking (-0.04em)
- **Body:** Manrope — clean, readable
- **Mono:** JetBrains Mono (already loaded) — for labels, tags, counters
- **Key technique:** Oversized typography with mix-blend-difference for hero, tight leading for impact

---

## 3. Section-by-Section Redesign

### Navigation
- Fixed top bar, transparent background
- Left: name/logo as monospace terminal prompt
- Right: theme toggle (keep existing)
- Add a subtle scroll progress indicator (thin line at top)
- `mix-blend-difference` for text to work over any background

### Hero Section
- **Layout:** Full viewport height, asymmetric grid
- Left side: Oversized stacked name (ANIKA / MAHFUZA) with extreme font size
- Right side: Profile image with a subtle geometric frame (no rounded corners — sharp, modern)
- Below name: Tagline in smaller text, tech tags as minimal inline labels
- Social links as small icon buttons
- Visit counter positioned subtly near profile image
- **Animation:** Staggered text reveal (keep existing TextRevealLine), parallax on image
- **Remove:** Generic "Developer Portfolio" label — let the design speak

### About Section
- **Layout:** Full-width with asymmetric columns (5/7 grid)
- Left: Large section number "01" as oversized decorative element + section title
- Right: Body text with good line height and spacing
- Quote block: Large pull-quote with a thick left border accent (red pop color)
- **Animation:** Text reveal on scroll, subtle parallax

### Skills Section (MAJOR REDESIGN)
- **Remove:** Progress bars, percentage numbers, terminal/compilation theme, bracket decorations
- **New approach:** "Skill cards" in a masonry-like grid or a clean list layout
- Each skill: Name in bold, category label, and a visual "proficiency indicator" using filled/empty dots or a simple bar chart (no percentages)
- OR: A clean two-column layout where skills are grouped by category with just the skill names at different visual weights (larger = more proficient)
- **Preferred:** Typographic weight approach — skill names displayed at sizes proportional to proficiency. C++ and C# are huge, Python is large, TypeScript is medium, Security/RE are smaller. Clean, no decorations.
- Category headers as small mono labels
- No fake terminal UI, no "skills.exe — Compiled" footer

### Contact Section
- **Layout:** Asymmetric like About
- Large heading "Let's work together" or similar
- Two CTA buttons: Discord (primary, filled) and Links (secondary, outlined)
- Clean, no extra decorations

### Footer
- Minimal single line: copyright left, social icons right
- Thin top border

---

## 4. Animation & Interaction Principles

- **Keep:** Lenis smooth scroll, Framer Motion text reveals, parallax effects
- **Remove:** Shimmer/shine effects on progress bars, bracket animations, dot indicators
- **Add:** Subtle hover states with transform (translateY -2px), smooth color transitions
- **Principle:** Animations should feel natural and purposeful, not decorative

---

## 5. Files to Modify

1. `app/globals.css` — Complete theme overhaul
2. `app/page.tsx` — Restructure all sections
3. `components/compilation-skills.tsx` — Complete rewrite → new skills display
4. `components/theme-toggle.tsx` — Minor style updates
5. `components/visit-counter.tsx` — Minor style updates
6. `components/scroll-progress.tsx` — Add to layout

## 6. Files to Delete (unused)
- `components/orbital-skills.tsx`
- `components/horizontal-scroll-skills.tsx`
- `styles/globals.css` (duplicate, unused — app/globals.css is the real one)

---

## 7. Implementation Order

1. CSS theme system first (globals.css)
2. Skills component rewrite (biggest visual change)
3. Page layout restructure (page.tsx)
4. Minor component updates
5. Cleanup unused files
6. Test both themes
