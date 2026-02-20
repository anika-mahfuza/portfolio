import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

const BASE_VISIT_COUNT = 195

// Initialize visits with base count if not set
async function initializeVisits(): Promise<number> {
    const current = await kv.get("portfolio_visits")
    if (current === null || current === undefined) {
        await kv.set("portfolio_visits", BASE_VISIT_COUNT)
        return BASE_VISIT_COUNT
    }
    return Number(current)
}

export async function GET() {
    try {
        const visits = await initializeVisits()
        return NextResponse.json({ visits })
    } catch (error) {
        console.error("KV Error:", error)
        return NextResponse.json({ visits: BASE_VISIT_COUNT })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { fingerprint, isIncognito } = body

        // Initialize if needed
        const currentCount = await initializeVisits()

        // If incognito, just return current count without incrementing
        if (isIncognito) {
            return NextResponse.json({ visits: currentCount, status: "incognito_ignored" })
        }

        const ip = req.headers.get("x-forwarded-for") || "unknown"
        const uniqueKey = `visit:${ip}:${fingerprint}`

        // Check if this specific visitor has been seen recently (e.g., 24h)
        // We use SET with NX (not exists) and EX (expire)
        const isNew = await kv.set(uniqueKey, "1", { nx: true, ex: 86400 })

        if (isNew) {
            // It's a valid new unique visit
            const newCount = await kv.incr("portfolio_visits")
            return NextResponse.json({ visits: newCount, status: "incremented" })
        } else {
            // Already visited
            const current = await kv.get("portfolio_visits")
            return NextResponse.json({ visits: Number(current) || BASE_VISIT_COUNT, status: "duplicate" })
        }
    } catch (error) {
        console.error("KV Error:", error)
        return NextResponse.json({ visits: BASE_VISIT_COUNT, status: "error" })
    }
}
