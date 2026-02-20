import { createClient } from "@vercel/kv"
import { NextResponse } from "next/server"
import { createHash } from "crypto"

let kv: ReturnType<typeof createClient> | null = null

function getKV() {
    if (!kv) {
        kv = createClient({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })
    }
    return kv
}

const BASE_VISIT_COUNT = 195
const IP_HASH_SALT = "portfolio-visits-2024"

function hashIP(ip: string): string {
    return createHash('sha256').update(ip + IP_HASH_SALT).digest('hex').slice(0, 16)
}

async function initializeVisits(): Promise<number> {
    const current = await getKV().get("portfolio_visits")
    if (current === null || current === undefined) {
        await getKV().set("portfolio_visits", BASE_VISIT_COUNT)
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
        const currentCount = await initializeVisits()

        const forwardedFor = req.headers.get("x-forwarded-for")
        const ip = forwardedFor?.split(",")[0].trim() || "unknown"

        // Don't increment for requests with no identifiable IP
        if (ip === "unknown") {
            return NextResponse.json({ visits: currentCount, status: "no_ip" })
        }

        const ipHash = hashIP(ip)
        const uniqueKey = `visit:${ipHash}`

        const exists = await getKV().get(uniqueKey)

        if (!exists) {
            await getKV().set(uniqueKey, "1")
            const newCount = await getKV().incr("portfolio_visits")
            return NextResponse.json({ visits: newCount, status: "incremented" })
        }

        return NextResponse.json({ visits: currentCount, status: "duplicate" })
    } catch (error) {
        console.error("KV Error:", error)
        return NextResponse.json({ visits: BASE_VISIT_COUNT, status: "error" })
    }
}
