"use client"

import { useRef, useEffect, useState } from "react"
import { SONG_CONFIG } from "@/lib/lyrics-service"
import { Music, Play } from "lucide-react"

interface MusicPlayerProps {
  isActive: boolean
  onAudioRef?: (audio: HTMLAudioElement | null) => void
}

export function MusicPlayer({ isActive, onAudioRef }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  // Pass audio ref to parent immediately after mount
  useEffect(() => {
    if (onAudioRef && audioRef.current) {
      onAudioRef(audioRef.current)
    }
  }, [onAudioRef])

  // Attempt autoplay on mount
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const attemptPlay = async () => {
      try {
        await audio.play()
        setIsBlocked(false)
      } catch (error) {
        // Autoplay blocked - show play button
        setIsBlocked(true)
      }
    }

    const timer = setTimeout(attemptPlay, 500)
    return () => clearTimeout(timer)
  }, [])

  // Listen for play/pause events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => {
      setIsPlaying(true)
      setIsBlocked(false)
    }
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    return () => {
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
    }
  }, [])

  const handlePlayClick = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        setIsBlocked(true)
      })
    }
  }

  return (
    <>
      {/* Audio element */}
      <audio ref={audioRef} src={SONG_CONFIG.audioFile} loop preload="auto" />

      {/* Play Button - Only shown when autoplay is blocked */}
      {isActive && isBlocked && (
        <button
          onClick={handlePlayClick}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-6 py-3 backdrop-blur-md bg-[var(--surface)]/80 border border-[var(--border)] hover:border-[var(--pop)] hover:bg-[var(--pop)]/10 text-[var(--foreground)] rounded-full text-sm font-medium transition-all duration-500 hover:scale-105 shadow-xl group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--pop)] flex items-center justify-center transition-shadow duration-500">
            <Play className="w-4 h-4 text-white ml-0.5" />
          </div>
          <span className="tracking-widest uppercase font-mono text-xs text-[var(--foreground)]">Play Song</span>
        </button>
      )}
    </>
  )
}
