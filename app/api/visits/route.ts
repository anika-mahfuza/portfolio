import { kv } from "@vercel/kv"
import { NextResponse } from "next/server"

// If no KV, we fallback to a mocks
export async function GET() {
    try {
        const visits = await kv.get("portfolio_visits")
        return NextResponse.json({ visits: visits || 0 })
    } catch (error) {
        console.error("KV Error:", error)
        return NextResponse.json({ visits: 0 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { fingerprint, isIncognito } = body

        // If incognito, just return current count without incrementing
        if (isIncognito) {
            const current = await kv.get("portfolio_visits")
            return NextResponse.json({ visits: current || 0, status: "incognito_ignored" })
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
            return NextResponse.json({ visits: current || 0, status: "duplicate" })
        }
    } catch (error) {
        console.error("KV Error:", error)
        return NextResponse.json({ visits: 0, status: "error" })
    }
}
