"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { VolumeIcon } from "./custom-icons"

interface AudioControlsProps {
  audioElement: HTMLAudioElement | HTMLVideoElement | null
  isVisible: boolean
}

export function AudioControls({ audioElement, isVisible }: AudioControlsProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (audioElement) {
      audioElement.muted = isMuted
      audioElement.volume = volume
    }
  }, [audioElement, isMuted, volume])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (isMuted && audioElement) {
      audioElement.play().catch(() => { })
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed bottom-8 right-8 z-[60] flex items-center gap-3 backdrop-blur-md bg-[var(--surface)]/80 border border-[var(--border)] rounded-full py-2 px-3 shadow-xl transition-all duration-500 hover:bg-[var(--surface-hover)]/90 hover:border-[var(--border-strong)] text-[var(--foreground)]"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Volume slider */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center ${isExpanded ? "w-24 opacity-100 pl-2" : "w-0 opacity-0 pl-0"
          }`}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-[var(--border-strong)] rounded-full appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--pop)] [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 [&::-webkit-slider-thumb]:transition-transform cursor-pointer"
        />
      </div>

      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--background)]/50 border border-transparent hover:border-[var(--pop)]/30 hover:bg-[var(--pop)]/10 hover:text-[var(--pop)] transition-all duration-300 group"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        <VolumeIcon
          muted={isMuted}
          volume={volume}
          className="w-4 h-4 text-[var(--foreground)] group-hover:text-[var(--pop)] transition-colors duration-300"
        />
      </button>
    </div>
  )
}
