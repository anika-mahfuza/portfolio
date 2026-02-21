// Test file to verify typography enhancements
import { TextType } from "@/components/text-type";
import { ScrollTextReveal } from "@/components/scroll-text-reveal";
import { PremiumButton } from "@/components/premium-button";

export default function TypographyTest() {
  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Typography Test */}
        <section className="text-center py-16">
          <h1 className="text-hero text-[var(--foreground)] mb-8 text-unfold">
            <TextType
              text={["DEV.", "HACKER.", "CODER.", "CREATOR."]}
              typingSpeed={80}
              deletingSpeed={40}
              pauseDuration={2500}
              textColors={["var(--pop)", "var(--foreground)", "var(--accent)", "var(--pop)"]}
              variableSpeed={{ min: 60, max: 100 }}
              letterByLetter={true}
              letterRevealDelay={0.08}
              weightAnimation={true}
              mouseInteraction={true}
            />
          </h1>
          <h2 className="text-hero text-[var(--foreground)] text-unfold">
            MODE<span className="text-[var(--pop)] inline-block w-8 h-8 rounded-full bg-[var(--pop)] shadow-[var(--pop-glow)] mt-2 weight-shift"></span>
          </h2>
        </section>

        {/* Scroll Text Reveal Test */}
        <section className="py-16">
          <ScrollTextReveal
            animationType="unfold"
            duration={1.5}
            weightAnimation={true}
            textShadow={true}
            className="mb-8"
          >
            <h3 className="text-display text-6xl md:text-8xl text-[var(--foreground)]">
              SCROLL DRIVEN
            </h3>
          </ScrollTextReveal>
          
          <ScrollTextReveal
            animationType="fade-up"
            delay={0.3}
            duration={1}
            className="text-xl md:text-2xl text-[var(--foreground-muted)] font-mono"
          >
            Typography that responds to scroll position
          </ScrollTextReveal>
        </section>

        {/* Premium Buttons Test */}
        <section className="py-16 text-center">
          <h4 className="text-display text-4xl mb-8 text-[var(--foreground)]">Premium Interactions</h4>
          <div className="flex flex-wrap gap-4 justify-center">
            <PremiumButton hoverText="Hovered!" variant="primary">
              Hover Me
            </PremiumButton>
            <PremiumButton hoverText="Magnetic Effect" variant="magnetic">
              Magnetic Button
            </PremiumButton>
            <PremiumButton variant="secondary">
              Secondary Style
            </PremiumButton>
            <PremiumButton variant="ghost">
              Ghost Style
            </PremiumButton>
          </div>
        </section>

        {/* Typography Scale Test */}
        <section className="py-16">
          <h5 className="text-display text-3xl mb-8 text-[var(--foreground)]">Enhanced Typography Scale</h5>
          <div className="space-y-4 font-mono">
            <p className="text-xs">text-xs: The quick brown fox</p>
            <p className="text-sm">text-sm: The quick brown fox</p>
            <p className="text-base">text-base: The quick brown fox</p>
            <p className="text-lg">text-lg: The quick brown fox</p>
            <p className="text-xl">text-xl: The quick brown fox</p>
            <p className="text-2xl">text-2xl: The quick brown fox</p>
            <p className="text-3xl">text-3xl: The quick brown fox</p>
            <p className="text-4xl">text-4xl: The quick brown fox</p>
            <p className="text-5xl">text-5xl: The quick brown fox</p>
            <p className="text-6xl">text-6xl: The quick brown fox</p>
            <p className="text-7xl">text-7xl: The quick brown fox</p>
            <p className="text-8xl">text-8xl: The quick brown fox</p>
            <p className="text-9xl">text-9xl: The quick brown fox</p>
          </div>
        </section>

        {/* Animation Test */}
        <section className="py-16 text-center">
          <h6 className="text-display text-2xl mb-8 text-[var(--foreground)]">Animation Tests</h6>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-unfold text-2xl text-[var(--pop)]">Text Unfold</div>
            <div className="text-3d-flip text-2xl text-[var(--pop)]">3D Flip</div>
            <div className="text-rotate-in text-2xl text-[var(--pop)]">Rotate In</div>
            <div className="text-slide-left text-2xl text-[var(--pop)]">Slide Left</div>
            <div className="text-slide-right text-2xl text-[var(--pop)]">Slide Right</div>
            <div className="text-fade-up text-2xl text-[var(--pop)]">Fade Up</div>
          </div>
        </section>

        {/* Color System Test */}
        <section className="py-16">
          <h6 className="text-display text-2xl mb-8 text-[var(--foreground)]">Enhanced Color System</h6>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[var(--pop)] text-white rounded">Pop Color</div>
            <div className="p-4 bg-[var(--pop-warm)] text-white rounded">Pop Warm</div>
            <div className="p-4 bg-[var(--pop-cool)] text-white rounded">Pop Cool</div>
            <div className="p-4 bg-[var(--pop-accent)] text-white rounded">Pop Accent</div>
          </div>
        </section>

      </div>
    </div>
  );
}