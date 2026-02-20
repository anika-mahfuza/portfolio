import { createClient } from "@vercel/kv"
import Redis from "ioredis"
import { NextResponse } from "next/server"
import { createHash } from "crypto"

interface RedisClient {
    get(key: string): Promise<string | number | null>
    set(key: string, value: string | number): Promise<any>
    incr(key: string): Promise<number>
}

let kv: RedisClient

if (process.env.REDIS_URL) {
    const redis = new Redis(process.env.REDIS_URL)
    kv = {
        get: (key) => redis.get(key),
        set: (key, value) => redis.set(key, value),
        incr: (key) => redis.incr(key)
    }
} else {
    const vercelKv = createClient({
        url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
        token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
    kv = vercelKv
}

const BASE_VISIT_COUNT = 195
const IP_HASH_SALT = "portfolio-visits-2024"

function hashIP(ip: string): string {
    return createHash('sha256').update(ip + IP_HASH_SALT).digest('hex').slice(0, 16)
}

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
        const { isIncognito } = body

        const currentCount = await initializeVisits()

        if (isIncognito) {
            return NextResponse.json({ visits: currentCount, status: "incognito_ignored" })
        }

        const forwardedFor = req.headers.get("x-forwarded-for")
        const ip = forwardedFor?.split(",")[0].trim() || "unknown"
        const ipHash = hashIP(ip)
        const uniqueKey = `visit:${ipHash}`

        const exists = await kv.get(uniqueKey)
        
        if (!exists) {
            await kv.set(uniqueKey, "1")
            const newCount = await kv.incr("portfolio_visits")
            return NextResponse.json({ visits: newCount, status: "incremented" })
        }
        
        return NextResponse.json({ visits: currentCount, status: "duplicate" })
    } catch (error) {
        console.error("KV Error:", error)
        return NextResponse.json({ visits: BASE_VISIT_COUNT, status: "error" })
    }
}
