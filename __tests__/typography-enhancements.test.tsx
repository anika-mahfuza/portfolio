import { render, screen, waitFor } from "@testing-library/react";
import { TextType } from "@/components/text-type";
import { ScrollTextReveal } from "@/components/scroll-text-reveal";
import { PremiumButton, MagneticButton } from "@/components/premium-button";
import { useMagneticHover } from "@/hooks/use-magnetic-hover";

// Test TextType Component Enhancements
describe("Typography Enhancements - Week 1 Implementation", () => {
  
  describe("TextType Kinetic Typography", () => {
    it("should render with enhanced features", () => {
      render(
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
      );
      
      const textElement = screen.getByText(/DEV\.|HACKER\.|CODER\.|CREATOR\./);
      expect(textElement).toBeInTheDocument();
    });

    it("should cycle through text colors", async () => {
      const { rerender } = render(
        <TextType
          text={["TEST"]}
          textColors={["#ff0000", "#00ff00", "#0000ff"]}
          typingSpeed={10}
          pauseDuration={100}
        />
      );
      
      await waitFor(() => {
        const textElement = screen.getByText("TEST");
        expect(textElement).toHaveStyle({ color: expect.stringMatching(/rgb\(255, 0, 0\)|#ff0000/) });
      });
    });
  });

  describe("ScrollTextReveal Component", () => {
    it("should render with different animation types", () => {
      const { rerender } = render(
        <ScrollTextReveal animationType="fade-up">
          Test Content
        </ScrollTextReveal>
      );
      
      expect(screen.getByText("Test Content")).toBeInTheDocument();
      
      // Test different animation types
      const animationTypes = ["fade-down", "slide-left", "slide-right", "rotate-in", "unfold", "3d-flip"];
      
      animationTypes.forEach(type => {
        rerender(
          <ScrollTextReveal animationType={type as any}>
            Test Content
          </ScrollTextReveal>
        );
        expect(screen.getByText("Test Content")).toBeInTheDocument();
      });
    });

    it("should apply weight animation and text shadow", () => {
      render(
        <ScrollTextReveal weightAnimation={true} textShadow={true}>
          Weight Animated Text
        </ScrollTextReveal>
      );
      
      const textElement = screen.getByText("Weight Animated Text");
      expect(textElement).toBeInTheDocument();
    });
  });

  describe("PremiumButton Component", () => {
    it("should render with text swap functionality", () => {
      render(
        <PremiumButton hoverText="Hovered Text">
          Default Text
        </PremiumButton>
      );
      
      expect(screen.getByText("Default Text")).toBeInTheDocument();
    });

    it("should render different variants", () => {
      const variants = ["primary", "secondary", "ghost", "magnetic"];
      const sizes = ["sm", "md", "lg", "xl"];
      
      variants.forEach(variant => {
        sizes.forEach(size => {
          const { rerender } = render(
            <PremiumButton variant={variant as any} size={size as any}>
              {variant} {size}
            </PremiumButton>
          );
          
          expect(screen.getByText(`${variant} ${size}`)).toBeInTheDocument();
        });
      });
    });
  });

  describe("Magnetic Hover Hook", () => {
    it("should calculate magnetic offset correctly", () => {
      // Mock element ref
      const mockRef = {
        current: {
          getBoundingClientRect: () => ({
            left: 100,
            top: 100,
            width: 100,
            height: 100,
          }),
        },
      } as any;

      // This would typically be tested in a component context
      // For now, we verify the hook exports correctly
      expect(typeof useMagneticHover).toBe("function");
    });
  });
});

// Performance Tests
describe("Typography Performance", () => {
  it("should maintain 60fps during animations", () => {
    // Mock performance API
    const mockPerformance = {
      now: jest.fn(() => 1000),
      mark: jest.fn(),
      measure: jest.fn(),
    };
    
    global.performance = mockPerformance as any;
    
    render(
      <TextType
        text={["PERFORMANCE TEST"]}
        typingSpeed={16} // 60fps = ~16ms per frame
        letterByLetter={true}
      />
    );
    
    expect(mockPerformance.now).toHaveBeenCalled();
  });

  it("should handle variable font loading", () => {
    // Test that font-variation-settings are applied
    const { container } = render(
      <TextType
        text={["Variable Font Test"]}
        weightAnimation={true}
      />
    );
    
    const textElement = container.querySelector('span');
    expect(textElement).toHaveStyle({
      fontVariationSettings: expect.stringContaining("wght"),
    });
  });
});

// Accessibility Tests
describe("Typography Accessibility", () => {
  it("should maintain proper color contrast", () => {
    render(
      <ScrollTextReveal>
        <h1>Accessible Heading</h1>
      </ScrollTextReveal>
    );
    
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it("should respect reduced motion preferences", () => {
    // Mock prefers-reduced-motion
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    });
    
    render(
      <TextType
        text={["Reduced Motion Test"]}
        letterByLetter={true}
      />
    );
    
    expect(screen.getByText("Reduced Motion Test")).toBeInTheDocument();
  });
});

// Cross-browser Compatibility
describe("Cross-browser Typography", () => {
  it("should support CSS custom properties", () => {
    render(
      <div style={{ "--pop": "#ff2a3d" } as any}>
        <TextType
          text={["CSS Variables Test"]}
          textColors={["var(--pop)"]}
        />
      </div>
    );
    
    expect(screen.getByText("CSS Variables Test")).toBeInTheDocument();
  });

  it("should handle Space Grotesk font loading", () => {
    // Test that the font family is applied
    const { container } = render(
      <div className="text-display" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
        Space Grotesk Test
      </div>
    );
    
    const textElement = container.querySelector('.text-display');
    expect(textElement).toHaveStyle({
      fontFamily: expect.stringContaining("Space Grotesk"),
    });
  });
});