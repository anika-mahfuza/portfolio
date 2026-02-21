"use client";

import { ElementType, useEffect, useRef, useState, createElement, useMemo, useCallback } from "react";

interface TextTypeProps {
    className?: string;
    showCursor?: boolean;
    hideCursorWhileTyping?: boolean;
    cursorCharacter?: string | React.ReactNode;
    cursorBlinkDuration?: number;
    cursorClassName?: string;
    text: string | string[];
    as?: ElementType;
    typingSpeed?: number;
    initialDelay?: number;
    pauseDuration?: number;
    deletingSpeed?: number;
    loop?: boolean;
    textColors?: string[];
    variableSpeed?: { min: number; max: number };
    onSentenceComplete?: (sentence: string, index: number) => void;
    startOnVisible?: boolean;
    reverseMode?: boolean;
    letterByLetter?: boolean;
    letterRevealDelay?: number;
    weightAnimation?: boolean;
    mouseInteraction?: boolean;
}

export const TextType = ({
    text,
    as: Component = "span",
    typingSpeed = 50,
    initialDelay = 0,
    pauseDuration = 2000,
    deletingSpeed = 30,
    loop = true,
    className = "",
    showCursor = true,
    hideCursorWhileTyping = false,
    cursorCharacter = "|",
    cursorClassName = "",
    cursorBlinkDuration = 0.5,
    textColors = [],
    variableSpeed,
    onSentenceComplete,
    startOnVisible = false,
    reverseMode = false,
    letterByLetter = false,
    letterRevealDelay = 0.05,
    weightAnimation = false,
    mouseInteraction = false,
    ...props
}: TextTypeProps & React.HTMLAttributes<HTMLElement>) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(!startOnVisible);
    const cursorRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLElement>(null);

    const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

    const getRandomSpeed = useCallback(() => {
        if (!variableSpeed) return typingSpeed;
        const { min, max } = variableSpeed;
        return Math.random() * (max - min) + min;
    }, [variableSpeed, typingSpeed]);

    const getCurrentTextColor = () => {
        if (textColors.length === 0) return "inherit";
        return textColors[currentTextIndex % textColors.length];
    };

    useEffect(() => {
        if (!startOnVisible || !containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [startOnVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let timeout: ReturnType<typeof setTimeout>;

        const currentText = textArray[currentTextIndex];
        const processedText = reverseMode ? currentText.split("").reverse().join("") : currentText;

        const executeTypingAnimation = () => {
            if (isDeleting) {
                if (displayedText === "") {
                    setIsDeleting(false);
                    if (currentTextIndex === textArray.length - 1 && !loop) {
                        return;
                    }

                    if (onSentenceComplete) {
                        onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
                    }

                    setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
                    setCurrentCharIndex(0);
                    timeout = setTimeout(() => { }, pauseDuration);
                } else {
                    timeout = setTimeout(() => {
                        setDisplayedText((prev) => prev.slice(0, -1));
                    }, deletingSpeed);
                }
            } else {
                if (currentCharIndex < processedText.length) {
                    timeout = setTimeout(() => {
                        setDisplayedText((prev) => prev + processedText[currentCharIndex]);
                        setCurrentCharIndex((prev) => prev + 1);
                    }, variableSpeed ? getRandomSpeed() : typingSpeed);
                } else if (textArray.length >= 1) {
                    if (!loop && currentTextIndex === textArray.length - 1) return;
                    timeout = setTimeout(() => {
                        setIsDeleting(true);
                    }, pauseDuration);
                }
            }
        };

        if (currentCharIndex === 0 && !isDeleting && displayedText === "") {
            timeout = setTimeout(executeTypingAnimation, initialDelay);
        } else {
            executeTypingAnimation();
        }

        return () => clearTimeout(timeout);
    }, [
        currentCharIndex,
        displayedText,
        isDeleting,
        typingSpeed,
        deletingSpeed,
        pauseDuration,
        textArray,
        currentTextIndex,
        loop,
        initialDelay,
        isVisible,
        reverseMode,
        variableSpeed,
        onSentenceComplete,
    ]);

    const shouldHideCursor =
        hideCursorWhileTyping && isDeleting;

    const renderKineticText = () => {
        if (letterByLetter && displayedText) {
            return (
                <span key={`word-${currentTextIndex}`}>
                    {displayedText.split('').map((char, index) => (
                        <span
                            key={`${currentTextIndex}-${index}`}
                            className="inline-block letter-reveal"
                            style={{
                                animationDelay: `0s`,
                                color: getCurrentTextColor() || "inherit",
                                fontVariationSettings: weightAnimation ? `'wght' ${300 + (index * 50)}` : undefined
                            }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </span>
            );
        }

        return (
            <span
                className="inline"
                style={{
                    color: getCurrentTextColor() || "inherit",
                    fontVariationSettings: weightAnimation ? `'wght' ${400 + (currentCharIndex * 10)}` : undefined
                }}
            >
                {displayedText}
            </span>
        );
    };

    // Mouse interaction handler
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!mouseInteraction || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const offsetX = (x - 0.5) * 20;
        const offsetY = (y - 0.5) * 20;

        containerRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        containerRef.current.style.textShadow = `${offsetX * 0.5}px ${offsetY * 0.5}px 20px var(--pop)`;
    };

    const handleMouseLeave = () => {
        if (!mouseInteraction || !containerRef.current) return;

        containerRef.current.style.transform = 'translate(0px, 0px)';
        containerRef.current.style.textShadow = 'none';
    };

    return createElement(
        Component,
        {
            ref: containerRef,
            className: `inline-block whitespace-pre-wrap tracking-tight ${className}`,
            onMouseMove: handleMouseMove,
            onMouseLeave: handleMouseLeave,
            style: {
                transition: mouseInteraction ? 'transform 0.3s ease-out, text-shadow 0.3s ease-out' : undefined,
                ...props.style
            },
            ...props,
        },
        renderKineticText(),
        showCursor && (
            <span
                ref={cursorRef}
                className={shouldHideCursor ? "hidden" : ""}
                style={{ 
                    display: "inline",
                    marginLeft: "0.25rem",
                    color: "var(--foreground)", 
                    textShadow: "none", 
                    verticalAlign: "baseline",
                    animation: "cursor-blink 1s step-end infinite" 
                }}
            >
                {cursorCharacter}
            </span>
        )
    );
};
