"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import { detectIncognito } from "@/lib/detect-incognito"

export function VisitCounter() {
    const [count, setCount] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const registerVisit = async () => {
            try {
                const isIncognito = await detectIncognito()

                const res = await fetch("/api/visits", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isIncognito }),
                })

                const data = await res.json()
                setCount(data.visits)
            } catch (error) {
                console.error("Failed to register visit:", error)
            } finally {
                setLoading(false)
            }
        }

        registerVisit()
    }, [])

    if (loading) return null

    return (
        <div 
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--foreground-muted)]"
            title="Unique Profile Visits"
        >
            <Eye className="w-3.5 h-3.5" />
            <span>{count?.toLocaleString() ?? 195}</span>
        </div>
    )
}
