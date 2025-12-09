"use client"

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react"

interface VideoBackgroundProps {
  isActive: boolean
}

export interface VideoBackgroundRef {
  videoElement: HTMLVideoElement | null
}

export const VideoBackground = forwardRef<VideoBackgroundRef, VideoBackgroundProps>(function VideoBackground(
  { isActive },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useImperativeHandle(ref, () => ({
    videoElement: videoRef.current,
  }))

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked - will play on user interaction
      })
    }
  }, [isActive])

  return (
    <div className="fixed inset-0 z-0">
      {/* Video element */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="https://github.com/anika-mahfuza/portfolio/raw/main/public/background.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-1000 ${isActive ? "opacity-100" : "opacity-0"
          }`}
      />

      {/* Vignette effect */}
      <div
        className={`absolute inset-0 vignette transition-opacity duration-1000 ${isActive ? "opacity-100" : "opacity-0"
          }`}
      />

      {/* Subtle gradient overlay for depth */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30 transition-opacity duration-1000 ${isActive ? "opacity-100" : "opacity-0"
          }`}
      />
    </div>
  )
})
