"use client"

import { useEffect, useRef, useState } from "react"

type GreenScreenVideoProps = {
  src: string
  className?: string
  minGreen?: number
  threshold?: number
  softness?: number
}

export function GreenScreenVideo({
  src,
  className = "",
  minGreen = 72,
  threshold = 26,
  softness = 40,
}: GreenScreenVideoProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const [aspectRatio, setAspectRatio] = useState("3 / 4")
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!wrapper || !video || !canvas) {
      return
    }

    const context = canvas.getContext("2d", { willReadFrequently: true })

    if (!context) {
      return
    }

    let isDisposed = false

    const syncCanvasSize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      const nextWidth = Math.max(1, Math.round(wrapper.clientWidth * pixelRatio))
      const nextHeight = Math.max(1, Math.round(wrapper.clientHeight * pixelRatio))

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth
        canvas.height = nextHeight
      }
    }

    const stopRendering = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }

    const drawFrame = () => {
      if (isDisposed) {
        return
      }

      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        frameRef.current = requestAnimationFrame(drawFrame)
        return
      }

      syncCanvasSize()
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const frame = context.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = frame.data

      // Fade out green pixels and soften edge spill so keyed footage blends better.
      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index]
        const green = pixels[index + 1]
        const blue = pixels[index + 2]
        const alpha = pixels[index + 3]
        const strongestNonGreen = Math.max(red, blue)
        const greenAdvantage = green - strongestNonGreen

        if (green > minGreen && greenAdvantage > threshold) {
          const keyStrength = Math.min(1, (greenAdvantage - threshold) / softness + 0.35)

          pixels[index] = Math.min(255, Math.round(red + strongestNonGreen * 0.06 * keyStrength))
          pixels[index + 1] = Math.max(0, Math.round(green * (1 - keyStrength * 0.8)))
          pixels[index + 2] = Math.min(255, Math.round(blue + strongestNonGreen * 0.04 * keyStrength))
          pixels[index + 3] = Math.max(0, Math.round(alpha * (1 - keyStrength)))
          continue
        }

        if (greenAdvantage > threshold / 2) {
          pixels[index + 1] = Math.max(0, Math.round(green - 28))
        }
      }

      context.putImageData(frame, 0, 0)
      frameRef.current = requestAnimationFrame(drawFrame)
    }

    const startRendering = () => {
      stopRendering()
      frameRef.current = requestAnimationFrame(drawFrame)
    }

    const handleLoadedData = () => {
      setHasError(false)

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setAspectRatio(`${video.videoWidth} / ${video.videoHeight}`)
      }

      syncCanvasSize()
      void video.play().catch(() => {
        // Muted autoplay should succeed, but ignore failures so the rest of the page stays stable.
      })
      startRendering()
    }

    const handlePause = () => {
      stopRendering()
    }

    const handleError = () => {
      setHasError(true)
      stopRendering()
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => syncCanvasSize()) : null

    resizeObserver?.observe(wrapper)

    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("play", startRendering)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handlePause)
    video.addEventListener("error", handleError)

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      handleLoadedData()
    }

    return () => {
      isDisposed = true
      stopRendering()
      resizeObserver?.disconnect()
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("play", startRendering)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handlePause)
      video.removeEventListener("error", handleError)
    }
  }, [minGreen, softness, src, threshold])

  const showPlaceholder = hasError && process.env.NODE_ENV !== "production"

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${className}`.trim()}
      style={{ aspectRatio }}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="pointer-events-none absolute h-px w-px opacity-0"
        aria-hidden="true"
      />

      <canvas
        ref={canvasRef}
        className={`h-full w-full transition-opacity duration-300 ${showPlaceholder ? "opacity-0" : "opacity-100"}`}
        aria-hidden="true"
      />

      {showPlaceholder ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-[2rem] border border-dashed border-[var(--border-strong)] bg-[var(--surface)]/80 px-4 text-center font-mono text-xs leading-relaxed text-[var(--foreground-muted)] backdrop-blur-sm">
          Add your greenscreen clip to /public/green-screen-hero.mp4
        </div>
      ) : null}
    </div>
  )
}
