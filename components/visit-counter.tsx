"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

export function VisitCounter() {
    const [count, setCount] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const registerVisit = async () => {
            try {
                const res = await fetch("/api/visits", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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

    return (
        <div
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--foreground-muted)]"
            title="Unique Profile Visits"
        >
            <Eye className="w-3.5 h-3.5" />
            {loading ? (
                <span className="inline-block w-8 h-3.5 rounded-sm bg-[var(--foreground-muted)]/20 animate-pulse" />
            ) : (
                <span>{count?.toLocaleString() ?? "—"}</span>
            )}
        </div>
    )
}
