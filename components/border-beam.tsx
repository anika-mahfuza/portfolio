"use client"

import { cn } from "@/lib/utils"

interface BorderBeamProps {
    className?: string
    size?: number
    duration?: number
    borderWidth?: number
    anchor?: number
    colorFrom?: string
    colorTo?: string
    delay?: number
}

export function BorderBeam({
    className,
    size = 200,
    duration = 4,
    borderWidth = 2,
    colorFrom = "#ffaa40",
    colorTo = "#9c40ff",
    delay = 0,
}: BorderBeamProps) {
    return (
        <div
            className={cn(
                "pointer-events-none absolute inset-0 rounded-[inherit] z-10",
                className
            )}
            style={{
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
                padding: `${borderWidth}px`,
            }}
        >
            <div
                className="absolute inset-[-100%] animate-spin-slow"
                style={{
                    background: `conic-gradient(from 0deg at 50% 50%, transparent 0%, ${colorFrom} 10%, ${colorTo} 20%, transparent 30%)`,
                    animationDuration: `${duration}s`,
                    animationDelay: `-${delay}s`,
                }}
            />
        </div>
    )
}
