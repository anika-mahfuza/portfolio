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
      audioElement.play().catch(() => {})
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
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Volume slider */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isExpanded ? "w-24 opacity-100" : "w-0 opacity-0"
        }`}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider w-full"
        />
      </div>

      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="glass w-12 h-12 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors group"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        <VolumeIcon
          muted={isMuted}
          volume={volume}
          className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors"
        />
      </button>
    </div>
  )
}
