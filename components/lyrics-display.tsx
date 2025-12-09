"use client"

import { useEffect, useRef, useState } from "react"
import { Music, X, ChevronDown, ChevronUp } from "lucide-react"
import { fetchLyrics, SONG_CONFIG, type LyricLine } from "@/lib/lyrics-service"

interface LyricsDisplayProps {
    audioElement: HTMLAudioElement | null
    isVisible: boolean
}

export function LyricsDisplay({ audioElement, isVisible }: LyricsDisplayProps) {
    const [lyrics, setLyrics] = useState<LyricLine[]>([])
    const [currentLineIndex, setCurrentLineIndex] = useState(-1)
    const [isExpanded, setIsExpanded] = useState(true)
    const [isMinimized, setIsMinimized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const lyricsContainerRef = useRef<HTMLDivElement>(null)

    // Fetch lyrics on mount
    useEffect(() => {
        async function loadLyrics() {
            setIsLoading(true)
            setError(null)
            try {
                const fetchedLyrics = await fetchLyrics()
                if (fetchedLyrics.length === 0) {
                    setError("No synced lyrics found")
                } else {
                    setLyrics(fetchedLyrics)
                }
            } catch (e) {
                setError("Failed to load lyrics")
            } finally {
                setIsLoading(false)
            }
        }
        loadLyrics()
    }, [])

    // Sync lyrics with audio playback
    useEffect(() => {
        if (!audioElement || lyrics.length === 0) return

        const updateCurrentLine = () => {
            const currentTime = audioElement.currentTime

            // Find the current line based on time
            let newIndex = -1
            for (let i = lyrics.length - 1; i >= 0; i--) {
                if (currentTime >= lyrics[i].time) {
                    newIndex = i
                    break
                }
            }
            if (newIndex !== currentLineIndex) {
                setCurrentLineIndex(newIndex)
            }
        }

        // Update more frequently for smoother tracking
        const interval = setInterval(updateCurrentLine, 100)
        audioElement.addEventListener("timeupdate", updateCurrentLine)
        audioElement.addEventListener("seeked", updateCurrentLine)

        return () => {
            clearInterval(interval)
            audioElement.removeEventListener("timeupdate", updateCurrentLine)
            audioElement.removeEventListener("seeked", updateCurrentLine)
        }
    }, [audioElement, lyrics, currentLineIndex])

    // Auto-scroll to current line
    useEffect(() => {
        if (currentLineIndex >= 0 && lyricsContainerRef.current) {
            const container = lyricsContainerRef.current
            const currentLineElement = container.children[currentLineIndex] as HTMLElement

            if (currentLineElement) {
                const containerHeight = container.clientHeight
                const lineTop = currentLineElement.offsetTop
                const lineHeight = currentLineElement.clientHeight

                // Center the current line
                const scrollTo = lineTop - containerHeight / 2 + lineHeight / 2

                container.scrollTo({
                    top: scrollTo,
                    behavior: "smooth"
                })
            }
        }
    }, [currentLineIndex])

    // Click on lyric to seek
    const handleLyricClick = (time: number) => {
        if (audioElement) {
            audioElement.currentTime = time
        }
    }

    if (!isVisible) return null

    return (
        <div
            ref={containerRef}
            className={`fixed left-4 bottom-24 z-30 transition-all duration-500 ease-out ${isMinimized ? "w-auto" : "w-80"
                }`}
        >
            {/* Minimized state - just a button */}
            {isMinimized ? (
                <button
                    onClick={() => setIsMinimized(false)}
                    className="flex items-center gap-2 bg-background/40 backdrop-blur-xl rounded-full px-4 py-3 border border-foreground/10 hover:bg-background/60 transition-all duration-300 group"
                >
                    <Music className="w-4 h-4 text-accent" />
                    <span className="text-xs text-foreground/70 group-hover:text-foreground transition-colors">
                        Show Lyrics
                    </span>
                </button>
            ) : (
                /* Expanded lyrics panel */
                <div className="bg-background/40 backdrop-blur-xl rounded-2xl border border-foreground/10 overflow-hidden shadow-2xl shadow-black/20">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/5">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                                <Music className="w-4 h-4 text-accent" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {SONG_CONFIG.name}
                                </p>
                                <p className="text-xs text-foreground/50 truncate">
                                    {SONG_CONFIG.artist}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-1.5 hover:bg-foreground/10 rounded-lg transition-colors"
                                aria-label={isExpanded ? "Collapse" : "Expand"}
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 text-foreground/50" />
                                ) : (
                                    <ChevronUp className="w-4 h-4 text-foreground/50" />
                                )}
                            </button>
                            <button
                                onClick={() => setIsMinimized(true)}
                                className="p-1.5 hover:bg-foreground/10 rounded-lg transition-colors"
                                aria-label="Minimize"
                            >
                                <X className="w-4 h-4 text-foreground/50" />
                            </button>
                        </div>
                    </div>

                    {/* Current lyric preview when collapsed */}
                    {!isExpanded && lyrics.length > 0 && currentLineIndex >= 0 && (
                        <div className="px-4 py-2 border-b border-foreground/5">
                            <p className="text-sm text-foreground/80 truncate text-center">
                                {lyrics[currentLineIndex]?.text || "♪"}
                            </p>
                        </div>
                    )}

                    {/* Lyrics content */}
                    <div
                        className={`transition-all duration-500 ease-out overflow-hidden ${isExpanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="flex items-center gap-2 text-foreground/50">
                                    <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                    <span className="text-sm">Loading lyrics...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-4">
                                {/* Animated equalizer bars */}
                                <div className="flex items-end justify-center gap-1 h-16">
                                    {[...Array(12)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-gradient-to-t from-accent/50 to-accent rounded-full animate-pulse"
                                            style={{
                                                height: `${20 + Math.random() * 40}px`,
                                                animationDelay: `${i * 100}ms`,
                                                animationDuration: `${600 + Math.random() * 400}ms`,
                                            }}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-foreground/40 text-center">
                                    ♪ No lyrics available ♪<br />
                                    <span className="text-xs text-foreground/30">Just vibe to the music</span>
                                </p>
                            </div>
                        ) : (
                            <div
                                ref={lyricsContainerRef}
                                className="h-64 overflow-y-auto px-4 py-4 lyrics-scroll"
                                style={{
                                    maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                                }}
                            >
                                {/* Spacer for centering first line */}
                                <div className="h-24" />

                                {lyrics.filter(l => l.text !== "♪").map((line, index, filteredArr) => {
                                    // Find actual index for this line in original array
                                    const actualIndex = lyrics.findIndex(l => l.time === line.time && l.text === line.text)
                                    const isCurrent = actualIndex === currentLineIndex
                                    const isPast = actualIndex < currentLineIndex

                                    return (
                                        <button
                                            key={`${line.time}-${index}`}
                                            onClick={() => handleLyricClick(line.time)}
                                            className={`block w-full text-left py-2 px-2 rounded-lg transition-all duration-300 ease-out ${isCurrent
                                                ? "text-foreground scale-105 bg-foreground/5"
                                                : isPast
                                                    ? "text-foreground/30"
                                                    : "text-foreground/50 hover:text-foreground/70"
                                                }`}
                                            style={{
                                                transform: isCurrent ? "scale(1.02)" : "scale(1)",
                                                textShadow: isCurrent ? "0 0 30px rgba(255,255,255,0.3)" : "none",
                                            }}
                                        >
                                            <span
                                                className={`text-sm font-medium transition-all duration-300 ${isCurrent ? "text-base" : ""}`}
                                            >
                                                {line.text}
                                            </span>
                                        </button>
                                    )
                                })}

                                {/* Spacer for centering last line */}
                                <div className="h-24" />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
