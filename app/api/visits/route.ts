import { createClient } from "@vercel/kv"
import Redis from "ioredis"
import { NextResponse } from "next/server"

// Helper to unify Redis clients
interface RedisClient {
    get(key: string): Promise<string | number | null>
    set(key: string, value: string | number, options?: any): Promise<any>
    incr(key: string): Promise<number>
}

let kv: RedisClient

if (process.env.REDIS_URL) {
    // Use standard Redis (ioredis) if REDIS_URL is present
    const redis = new Redis(process.env.REDIS_URL)
    kv = {
        get: (key) => redis.get(key),
        set: (key, value, options) => {
            if (options?.nx && options?.ex) {
                return redis.set(key, value, 'NX', 'EX', options.ex)
            }
            return redis.set(key, value)
        },
        incr: (key) => redis.incr(key)
    }
} else {
    // Fallback to Vercel KV (HTTP)
    const vercelKv = createClient({
        url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
        token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
    kv = vercelKv
}

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
