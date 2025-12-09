"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { detectIncognito } from "@/lib/detect-incognito"
import { motion } from "framer-motion"

export function VisitCounter() {
    const [count, setCount] = useState<number | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const registerVisit = async () => {
            try {
                // 1. Load FingerprintJS
                const fp = await FingerprintJS.load()
                const result = await fp.get()
                const visitorId = result.visitorId

                // 2. Check Incognito
                const isIncognito = await detectIncognito()

                // 3. Call API
                const res = await fetch("/api/visits", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fingerprint: visitorId,
                        isIncognito,
                    }),
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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-muted-foreground hover:bg-white/10 transition-colors"
            title="Unique Profile Visits"
        >
            <Eye className="w-3.5 h-3.5" />
            <span>{count?.toLocaleString() ?? 0}</span>
        </motion.div>
    )
}
