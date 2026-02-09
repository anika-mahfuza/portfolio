"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Music, X, ChevronDown } from "lucide-react"
import { fetchLyrics, SONG_CONFIG, type LyricLine } from "@/lib/lyrics-service"

interface LyricsDisplayProps {
    audioElement: HTMLAudioElement | null
    isVisible: boolean
}

export function LyricsDisplay({ audioElement, isVisible }: LyricsDisplayProps) {
    const [lyrics, setLyrics] = useState<LyricLine[]>([])
    const [currentLineIndex, setCurrentLineIndex] = useState(-1)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const lyricsContainerRef = useRef<HTMLDivElement>(null)

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

    useEffect(() => {
        if (!audioElement || lyrics.length === 0) return

        const updateCurrentLine = () => {
            const currentTime = audioElement.currentTime
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

        const interval = setInterval(updateCurrentLine, 100)
        audioElement.addEventListener("timeupdate", updateCurrentLine)
        audioElement.addEventListener("seeked", updateCurrentLine)

        return () => {
            clearInterval(interval)
            audioElement.removeEventListener("timeupdate", updateCurrentLine)
            audioElement.removeEventListener("seeked", updateCurrentLine)
        }
    }, [audioElement, lyrics, currentLineIndex])

    useEffect(() => {
        if (currentLineIndex >= 0 && lyricsContainerRef.current) {
            const container = lyricsContainerRef.current
            const currentLineElement = container.children[currentLineIndex] as HTMLElement
            if (currentLineElement) {
                const containerHeight = container.clientHeight
                const lineTop = currentLineElement.offsetTop
                const lineHeight = currentLineElement.clientHeight
                const scrollTo = lineTop - containerHeight / 2 + lineHeight / 2
                container.scrollTo({ top: scrollTo, behavior: "smooth" })
            }
        }
    }, [currentLineIndex])

    const handleLyricClick = (time: number) => {
        if (audioElement) {
            audioElement.currentTime = time
        }
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-8 left-8 z-[60]">
            <AnimatePresence mode="wait">
                {isMinimized ? (
                    <motion.button
                        key="minimized"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsMinimized(false)}
                        className="w-11 h-11 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--foreground-muted)] flex items-center justify-center transition-all duration-300"
                    >
                        <Music className="w-4 h-4 text-[var(--pop)]" />
                    </motion.button>
                ) : (
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden w-72 font-sans"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--border)]">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 bg-[var(--pop-subtle)] flex items-center justify-center flex-shrink-0">
                                    <Music className="w-3.5 h-3.5 text-[var(--pop)]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-[var(--foreground)] truncate">
                                        {SONG_CONFIG.name}
                                    </p>
                                    <p className="text-[10px] text-[var(--foreground-muted)] truncate">
                                        {SONG_CONFIG.artist}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="p-1.5 hover:bg-[var(--background-secondary)] transition-colors"
                                >
                                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                        <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)]" />
                                    </motion.div>
                                </button>
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    className="p-1.5 hover:bg-[var(--background-secondary)] transition-colors"
                                >
                                    <X className="w-4 h-4 text-[var(--foreground-muted)]" />
                                </button>
                            </div>
                        </div>

                        {/* Current lyric preview */}
                        <AnimatePresence>
                            {!isExpanded && !isLoading && !error && lyrics.length > 0 && currentLineIndex >= 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="px-3 py-2 border-b border-[var(--border)] overflow-hidden"
                                >
                                    <p className="text-xs text-[var(--foreground-secondary)] truncate text-center">
                                        {lyrics[currentLineIndex]?.text || "♪"}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Lyrics content */}
                        <motion.div
                            initial={false}
                            animate={{ height: isExpanded ? 160 : 0, opacity: isExpanded ? 1 : 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center h-40">
                                    <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                                        <div className="w-3 h-3 border-2 border-[var(--border-strong)] border-t-[var(--pop)] rounded-full animate-spin" />
                                        <span className="text-xs">Loading...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center h-40 gap-2">
                                    <div className="flex items-end justify-center gap-0.5 h-6">
                                        {[...Array(6)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-0.5 bg-[var(--pop)] animate-pulse"
                                                style={{ height: `${8 + Math.random() * 10}px`, animationDelay: `${i * 100}ms` }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-[var(--foreground-muted)] text-center">No lyrics available</p>
                                </div>
                            ) : (
                                <div
                                    ref={lyricsContainerRef}
                                    className="h-40 overflow-y-auto px-3 py-2 lyrics-scroll"
                                    style={{
                                        maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                                        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                                    }}
                                >
                                    <div className="h-16" />
                                    {lyrics.filter(l => l.text !== "♪").map((line, index) => {
                                        const actualIndex = lyrics.findIndex(l => l.time === line.time && l.text === line.text)
                                        const isCurrent = actualIndex === currentLineIndex
                                        const isPast = actualIndex < currentLineIndex

                                        return (
                                            <button
                                                key={`${line.time}-${index}`}
                                                onClick={() => handleLyricClick(line.time)}
                                                className={`block w-full text-left py-1.5 px-2 transition-all duration-200 text-sm font-sans ${
                                                    isCurrent
                                                        ? "text-[var(--foreground)] bg-[var(--pop-subtle)] font-medium"
                                                        : isPast
                                                        ? "text-[var(--foreground-subtle)]"
                                                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                                                }`}
                                            >
                                                {line.text}
                                            </button>
                                        )
                                    })}
                                    <div className="h-16" />
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
