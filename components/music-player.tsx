"use client"

import { useRef, useEffect, useState } from "react"
import { SONG_CONFIG } from "@/lib/lyrics-service"

export interface MusicPlayerRef {
  audioElement: HTMLAudioElement | null
}

interface MusicPlayerProps {
  isActive: boolean
  onAudioRef?: (audio: HTMLAudioElement | null) => void
}

export function MusicPlayer({ isActive, onAudioRef }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Pass audio ref to parent immediately after mount, not dependent on isActive
  useEffect(() => {
    if (onAudioRef && audioRef.current) {
      onAudioRef(audioRef.current)
    }
  }, [onAudioRef])

  useEffect(() => {
    const audio = audioRef.current
    if (isActive && audio) {
      // Play immediately when active without delay
      audio.play().catch(() => { })
    }
  }, [isActive])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    return () => {
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
    }
  }, [])

  return (
    <>
      {/* Audio element - uses config for audio source */}
      <audio ref={audioRef} src={SONG_CONFIG.audioFile} loop preload="auto" />

      {/* Now Playing indicator - Only show when active */}
      {isActive && (
        <div className="fixed right-4 bottom-24 z-30">
          <div className="flex items-center gap-3 bg-background/30 backdrop-blur-md rounded-full px-4 py-2 border border-foreground/10">
            {isPlaying && (
              <div className="flex items-center gap-0.5">
                <span className="w-0.5 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                <span className="w-0.5 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="w-0.5 h-4 bg-accent rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                <span className="w-0.5 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "450ms" }} />
              </div>
            )}
            <span className="text-xs text-foreground/70 font-medium">
              {SONG_CONFIG.name} - {SONG_CONFIG.artist}
            </span>
          </div>
        </div>
      )}
    </>
  )
}
