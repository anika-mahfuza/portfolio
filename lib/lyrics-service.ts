// Song configuration - HARDCODE YOUR SONG HERE!
// Just change these values and the lyrics will auto-fetch
export const SONG_CONFIG = {
    name: "Cure for Me",
    artist: "AURORA",
    album: "The Gods We Can Touch",
    duration: 199, // 3:19 = 199 seconds
    audioFile: "/music.mp3",
}

export interface LyricLine {
    time: number
    text: string
}

export interface LyricsData {
    id: number
    name: string
    trackName: string
    artistName: string
    albumName: string
    duration: number
    instrumental: boolean
    plainLyrics: string | null
    syncedLyrics: string | null
}

/**
 * Parse LRC format lyrics into structured data
 */
export function parseLRC(lrc: string): LyricLine[] {
    const lines = lrc.split("\n")
    const lyrics: LyricLine[] = []

    for (const line of lines) {
        const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/)
        if (match) {
            const minutes = Number.parseInt(match[1])
            const seconds = Number.parseInt(match[2])
            const ms = Number.parseInt(match[3].padEnd(3, "0"))
            const time = minutes * 60 + seconds + ms / 1000
            const text = match[4].trim()
            // Only add lines with actual text
            if (text) {
                lyrics.push({ time, text })
            }
        }
    }

    return lyrics.sort((a, b) => a.time - b.time)
}

/**
 * Fetch synced lyrics from LRCLIB.net (free, no API key required)
 */
export async function fetchLyrics(): Promise<LyricLine[]> {
    try {
        // Use exact match API with duration for best sync
        const params = new URLSearchParams({
            track_name: SONG_CONFIG.name,
            artist_name: SONG_CONFIG.artist,
            duration: SONG_CONFIG.duration.toString(),
        })

        const response = await fetch(`https://lrclib.net/api/get?${params}`, {
            headers: {
                "User-Agent": "AnikaMahfuzaPortfolio/1.0",
            },
        })

        if (response.ok) {
            const data: LyricsData = await response.json()
            if (data.syncedLyrics) {
                console.log("LRCLIB.net: Found synced lyrics for", data.duration, "seconds")
                return parseLRC(data.syncedLyrics)
            }
        }

        console.warn("LRCLIB.net: No synced lyrics found")
        return []
    } catch (error) {
        console.error("Failed to fetch lyrics:", error)
        return []
    }
}

/**
 * Search for lyrics by query (useful for finding songs)
 */
export async function searchLyrics(query: string): Promise<LyricsData[]> {
    try {
        const response = await fetch(
            `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`,
            {
                headers: {
                    "User-Agent": "AnikaMahfuzaPortfolio/1.0",
                },
            }
        )

        if (!response.ok) {
            return []
        }

        return await response.json()
    } catch (error) {
        console.error("Failed to search lyrics:", error)
        return []
    }
}
