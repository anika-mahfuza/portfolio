"use client"

import { layoutNextLine, prepareWithSegments, type PreparedTextWithSegments } from "@chenglou/pretext"
import { useEffect, useRef, useState } from "react"

type PretextVideoBandProps = {
  src: string
  text: string
}

type LayoutMetrics = {
  cssWidth: number
  cssHeight: number
  pixelWidth: number
  pixelHeight: number
  analysisWidth: number
  analysisHeight: number
  analysisScaleX: number
  analysisScaleY: number
  scale: number
  font: string
  fontSize: number
  lineHeight: number
  paddingX: number
  paddingY: number
  minSlotWidth: number
  desktopReactive: boolean
}

type DeviceClass = "desktop" | "mobile"

type NavigatorWithUAData = Navigator & {
  userAgentData?: {
    mobile?: boolean
    platform?: string
  }
}

type BandObstacle = {
  left: number
  right: number
} | null

type TextSlot = {
  left: number
  right: number
}

type AlphaRowBounds = {
  left: number
  right: number
} | null

type PreparedToken = {
  text: string
  width: number
}

const MAX_TEXT_FPS = 60
const TEXT_FILL = "rgba(239, 239, 239, 0.78)"
const preparedByKey = new Map<string, PreparedTextWithSegments>()
const measuredTokenByKey = new Map<string, PreparedToken>()

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

function seededSigned(seed: number) {
  return seededUnit(seed) * 2 - 1
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function smoothStep(progress: number) {
  return progress * progress * (3 - 2 * progress)
}

function detectDeviceClass() {
  if (typeof navigator === "undefined") {
    return "desktop" satisfies DeviceClass
  }

  const nav = navigator as NavigatorWithUAData
  const uaData = nav.userAgentData

  if (typeof uaData?.mobile === "boolean") {
    return uaData.mobile ? "mobile" : "desktop"
  }

  const platform = `${uaData?.platform ?? nav.platform ?? ""}`.toLowerCase()
  const userAgent = `${nav.userAgent ?? ""}`.toLowerCase()
  const isiPadOSDesktopMode = platform.includes("mac") && nav.maxTouchPoints > 1
  const isMobilePlatform =
    userAgent.includes("android") ||
    userAgent.includes("iphone") ||
    userAgent.includes("ipad") ||
    userAgent.includes("ipod") ||
    userAgent.includes("windows phone") ||
    userAgent.includes("mobile") ||
    isiPadOSDesktopMode

  return isMobilePlatform ? "mobile" : "desktop"
}

function getPrepared(text: string, font: string) {
  const key = `${font}::${text}`
  const cached = preparedByKey.get(key)

  if (cached) {
    return cached
  }

  const prepared = prepareWithSegments(text, font)
  preparedByKey.set(key, prepared)
  return prepared
}

function getPreparedToken(text: string, font: string) {
  const key = `${font}::token::${text}`
  const cached = measuredTokenByKey.get(key)

  if (cached) {
    return cached
  }

  const prepared = getPrepared(text, font)
  const measured = layoutNextLine(prepared, { segmentIndex: 0, graphemeIndex: 0 }, 100000)
  const token = {
    text,
    width: measured?.width ?? 0,
  } satisfies PreparedToken

  measuredTokenByKey.set(key, token)
  return token
}

function prepareTokens(text: string, font: string) {
  return text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => getPreparedToken(token, font))
}

function createWrappedTextSlots(base: TextSlot, blocked: TextSlot[], minWidth: number) {
  let slots: TextSlot[] = [base]

  for (let blockedIndex = 0; blockedIndex < blocked.length; blockedIndex += 1) {
    const obstacle = blocked[blockedIndex]
    const next: TextSlot[] = []

    for (let slotIndex = 0; slotIndex < slots.length; slotIndex += 1) {
      const slot = slots[slotIndex]

      if (obstacle.right <= slot.left || obstacle.left >= slot.right) {
        next.push(slot)
        continue
      }

      if (obstacle.left > slot.left) {
        next.push({ left: slot.left, right: obstacle.left })
      }

      if (obstacle.right < slot.right) {
        next.push({ left: obstacle.right, right: slot.right })
      }
    }

    slots = next
  }

  return slots.filter((slot) => slot.right - slot.left >= minWidth)
}

function smoothBandObstacles(current: BandObstacle[], previous: BandObstacle[]) {
  const spatiallySmoothed = current.map((band, index) => {
    if (band === null) {
      return null
    }

    let left = band.left
    let right = band.right

    for (let offset = -1; offset <= 1; offset += 1) {
      const neighbor = current[index + offset]

      if (neighbor === null || neighbor === undefined) {
        continue
      }

      if (neighbor.left < left) {
        left = neighbor.left
      }

      if (neighbor.right > right) {
        right = neighbor.right
      }
    }

    return { left, right }
  })

  return spatiallySmoothed.map((band, index) => {
    if (band === null) {
      return null
    }

    const prior = previous[index]

    if (prior === null || prior === undefined) {
      return band
    }

    return {
      left: prior.left * 0.45 + band.left * 0.55,
      right: prior.right * 0.45 + band.right * 0.55,
    }
  })
}

function buildDynamicBandObstacles(rowBounds: AlphaRowBounds[], metrics: LayoutMetrics) {
  const lineCount = Math.max(0, Math.floor((metrics.cssHeight - metrics.paddingY * 2) / metrics.lineHeight))
  const horizontalPad = Math.max(18, metrics.fontSize * 1.4)
  const verticalPad = Math.max(2, Math.round(metrics.lineHeight * 0.16))
  const obstacles: BandObstacle[] = []

  for (let index = 0; index < lineCount; index += 1) {
    const bandTop = metrics.paddingY + index * metrics.lineHeight
    const bandBottom = bandTop + metrics.lineHeight
    const startRow = Math.max(0, Math.floor((bandTop - verticalPad) * metrics.analysisScaleY))
    const endRow = Math.min(metrics.analysisHeight - 1, Math.ceil((bandBottom + verticalPad) * metrics.analysisScaleY))

    let left = Number.POSITIVE_INFINITY
    let right = Number.NEGATIVE_INFINITY

    for (let row = startRow; row <= endRow; row += 1) {
      const bounds = rowBounds[row]

      if (bounds === null || bounds === undefined) {
        continue
      }

      if (bounds.left < left) {
        left = bounds.left
      }

      if (bounds.right > right) {
        right = bounds.right
      }
    }

    if (!Number.isFinite(left) || !Number.isFinite(right)) {
      obstacles.push(null)
      continue
    }

    const obstacleWidth = (right - left) / metrics.analysisScaleX

    if (obstacleWidth < metrics.minSlotWidth * 0.9) {
      obstacles.push(null)
      continue
    }

    obstacles.push({
      left: Math.max(metrics.paddingX, left / metrics.analysisScaleX - horizontalPad),
      right: Math.min(metrics.cssWidth - metrics.paddingX, right / metrics.analysisScaleX + horizontalPad),
    })
  }

  return obstacles
}

function buildStaticBandObstacles(metrics: LayoutMetrics) {
  const lineCount = Math.max(0, Math.floor((metrics.cssHeight - metrics.paddingY * 2) / metrics.lineHeight))
  const top = metrics.cssHeight * 0.08
  const bottom = metrics.cssHeight * 0.92
  const centerWidth = metrics.cssWidth * (metrics.desktopReactive ? 0.32 : 0.38)
  const centerLeft = (metrics.cssWidth - centerWidth) / 2
  const centerRight = centerLeft + centerWidth
  const obstacles: BandObstacle[] = []

  for (let index = 0; index < lineCount; index += 1) {
    const bandTop = metrics.paddingY + index * metrics.lineHeight
    const bandBottom = bandTop + metrics.lineHeight

    if (bandBottom < top || bandTop > bottom) {
      obstacles.push(null)
      continue
    }

    obstacles.push({
      left: Math.max(metrics.paddingX, centerLeft - metrics.fontSize * 1.4),
      right: Math.min(metrics.cssWidth - metrics.paddingX, centerRight + metrics.fontSize * 1.4),
    })
  }

  return obstacles
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  tokens: PreparedToken[],
  metrics: LayoutMetrics,
  obstacles: BandObstacle[],
  now: number,
) {
  context.setTransform(metrics.scale, 0, 0, metrics.scale, 0, 0)
  context.clearRect(0, 0, metrics.cssWidth, metrics.cssHeight)
  context.fillStyle = TEXT_FILL
  context.font = metrics.font
  context.textBaseline = "top"

  const seconds = now * 0.001
  const reshuffleDuration = metrics.desktopReactive ? 2.8 : 4.5
  const reshuffleProgress = seconds / reshuffleDuration
  const reshuffleIndex = Math.floor(reshuffleProgress)
  const reshuffleMix = smoothStep(reshuffleProgress - reshuffleIndex)
  let tokenIndex = tokens.length > 0 ? Math.floor(seededUnit(reshuffleIndex * 61 + 17) * tokens.length) : 0
  let slotCounter = 0
  const lineCount = Math.max(0, Math.floor((metrics.cssHeight - metrics.paddingY * 2) / metrics.lineHeight))

  for (let index = 0; index < lineCount; index += 1) {
    const lineTop = metrics.paddingY + index * metrics.lineHeight
    const base = {
      left: metrics.paddingX,
      right: metrics.cssWidth - metrics.paddingX,
    }
    const obstacle = obstacles[index]
    const blocked: TextSlot[] = obstacle ? [obstacle] : []
    const slots = createWrappedTextSlots(base, blocked, metrics.minSlotWidth)

    for (let slotIndex = 0; slotIndex < slots.length; slotIndex += 1) {
      const slot = slots[slotIndex]
      const slotWidth = slot.right - slot.left
      const placementSeed = (index + 1) * 97 + (slotIndex + 1) * 37 + (slotCounter + 1) * 17
      const currentCycleSeed = placementSeed + reshuffleIndex * 1013
      const nextCycleSeed = placementSeed + (reshuffleIndex + 1) * 1013
      const tokenWidthFactor = lerp(
        0.28 + seededUnit(currentCycleSeed + 5) * 0.34,
        0.28 + seededUnit(nextCycleSeed + 5) * 0.34,
        reshuffleMix,
      )
      const targetWidth = Math.max(metrics.minSlotWidth * 0.66, Math.min(slotWidth, slotWidth * tokenWidthFactor))

      if (tokens.length === 0) {
        continue
      }

      // Token for current cycle
      let attemptsA = 0
      let candidateIndexA = (tokenIndex + Math.floor(seededUnit(currentCycleSeed + 91) * 5)) % tokens.length
      let tokenA = tokens[candidateIndexA]
      while (attemptsA < tokens.length && tokenA.width > targetWidth) {
        candidateIndexA = (candidateIndexA + 1) % tokens.length
        attemptsA += 1
        tokenA = tokens[candidateIndexA]
      }

      // Token for next cycle — pre-fetched so the word shown at mix=1 matches mix=0 of the next cycle
      let attemptsB = 0
      let candidateIndexB = (tokenIndex + Math.floor(seededUnit(nextCycleSeed + 91) * 5)) % tokens.length
      let tokenB = tokens[candidateIndexB]
      while (attemptsB < tokens.length && tokenB.width > targetWidth) {
        candidateIndexB = (candidateIndexB + 1) % tokens.length
        attemptsB += 1
        tokenB = tokens[candidateIndexB]
      }

      tokenIndex = (candidateIndexA + 1 + Math.floor(seededUnit(currentCycleSeed + 103) * 3)) % tokens.length
      slotCounter += 1

      // Lerp width so position doesn't snap when the incoming word has a different width
      const tokenWidthLerped = lerp(tokenA.width, tokenB.width, reshuffleMix)
      const slotCenter = (slot.left + slot.right) / 2
      const driftPhase = seededUnit(placementSeed + 157) * Math.PI * 2
      const driftSpeed = 1.1 + seededUnit(placementSeed + 163) * 1.3
      const driftAmp = Math.min(40, slotWidth * 0.22)
      const horizontalDrift = Math.sin(seconds * driftSpeed + driftPhase) * driftAmp
      const drawX = Math.max(slot.left, Math.min(slot.right - tokenWidthLerped, slotCenter - tokenWidthLerped / 2 + horizontalDrift))
      const drawY = lineTop

      // Hard switch at cycle midpoint — no crossfade ghost
      const token = reshuffleMix < 0.5 ? tokenA : tokenB
      const tokenWidth = reshuffleMix < 0.5 ? tokenA.width : tokenB.width

      context.save()
      context.translate(drawX + tokenWidthLerped / 2, drawY + metrics.lineHeight * 0.52)
      context.fillText(token.text, -tokenWidth / 2, -metrics.lineHeight * 0.48)
      context.restore()
    }
  }
}

export function PretextVideoBand({ src, text }: PretextVideoBandProps) {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const textCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const analysisCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameHandleRef = useRef<number | null>(null)
  const fallbackFrameHandleRef = useRef<number | null>(null)
  const metricsRef = useRef<LayoutMetrics | null>(null)
  const fontReadyRef = useRef(false)
  const textFailedRef = useRef(false)
  const previousObstaclesRef = useRef<BandObstacle[]>([])
  const preparedTokensRef = useRef<PreparedToken[]>([])
  const lastTextDrawRef = useRef(0)
  const needsTextRedrawRef = useRef(true)
  const reducedMotionRef = useRef(false)
  const deviceClassRef = useRef<DeviceClass>("desktop")
  const [aspectRatio, setAspectRatio] = useState("16 / 9")

  useEffect(() => {
    const stage = stageRef.current
    const video = videoRef.current
    const videoCanvas = videoCanvasRef.current
    const textCanvas = textCanvasRef.current

    if (!stage || !video || !videoCanvas || !textCanvas) {
      return
    }

    const videoContext = videoCanvas.getContext("2d", { willReadFrequently: true })
    const textContext = textCanvas.getContext("2d")
    const analysisCanvas = analysisCanvasRef.current ?? document.createElement("canvas")
    analysisCanvasRef.current = analysisCanvas
    const analysisContext = analysisCanvas.getContext("2d", { willReadFrequently: true })

    if (!videoContext || !textContext || !analysisContext) {
      return
    }

    let isDisposed = false

    const cancelScheduledFrame = () => {
      if (frameHandleRef.current !== null) {
        if ("cancelVideoFrameCallback" in video) {
          video.cancelVideoFrameCallback(frameHandleRef.current)
        }

        frameHandleRef.current = null
      }

      if (fallbackFrameHandleRef.current !== null) {
        cancelAnimationFrame(fallbackFrameHandleRef.current)
        fallbackFrameHandleRef.current = null
      }
    }

    const getLayoutMetrics = () => {
      const rect = stage.getBoundingClientRect()
      const cssWidth = Math.max(1, Math.round(rect.width))
      const cssHeight = Math.max(1, Math.round(rect.height))
      const desktopReactive =
        deviceClassRef.current === "desktop" &&
        !reducedMotionRef.current
      const scale = Math.min(window.devicePixelRatio || 1, desktopReactive ? 1.15 : 1)
      const pixelWidth = Math.max(1, Math.round(cssWidth * scale))
      const pixelHeight = Math.max(1, Math.round(cssHeight * scale))
      const analysisWidth = desktopReactive
        ? Math.max(220, Math.min(360, Math.round(cssWidth * 0.32)))
        : Math.max(160, Math.min(240, Math.round(cssWidth * 0.34)))
      const analysisScaleX = analysisWidth / cssWidth
      const analysisHeight = Math.max(1, Math.round(cssHeight * analysisScaleX))
      const analysisScaleY = analysisHeight / cssHeight
      const computed = window.getComputedStyle(stage)
      const fontFamily = computed.fontFamily || '"JetBrains Mono", monospace'
      const fontSize = desktopReactive
        ? Math.max(16, Math.min(19, cssWidth * 0.0155))
        : Math.max(12, Math.min(14, cssWidth * 0.028))
      const lineHeight = desktopReactive ? Math.round(fontSize * 1.45) : Math.round(fontSize * 1.5)
      const paddingX = desktopReactive ? Math.max(28, cssWidth * 0.045) : Math.max(16, cssWidth * 0.055)
      const paddingY = desktopReactive ? Math.max(24, cssHeight * 0.065) : Math.max(14, cssHeight * 0.05)

      return {
        cssWidth,
        cssHeight,
        pixelWidth,
        pixelHeight,
        analysisWidth,
        analysisHeight,
        analysisScaleX,
        analysisScaleY,
        scale,
        font: `500 ${fontSize}px ${fontFamily}`,
        fontSize,
        lineHeight,
        paddingX,
        paddingY,
        minSlotWidth: Math.max(fontSize * 4.8, 72),
        desktopReactive,
      } satisfies LayoutMetrics
    }

    const syncCanvasDimensions = () => {
      const nextMetrics = getLayoutMetrics()
      metricsRef.current = nextMetrics

      if (videoCanvas.width !== nextMetrics.pixelWidth || videoCanvas.height !== nextMetrics.pixelHeight) {
        videoCanvas.width = nextMetrics.pixelWidth
        videoCanvas.height = nextMetrics.pixelHeight
      }

      if (textCanvas.width !== nextMetrics.pixelWidth || textCanvas.height !== nextMetrics.pixelHeight) {
        textCanvas.width = nextMetrics.pixelWidth
        textCanvas.height = nextMetrics.pixelHeight
      }

      if (analysisCanvas.width !== nextMetrics.analysisWidth || analysisCanvas.height !== nextMetrics.analysisHeight) {
        analysisCanvas.width = nextMetrics.analysisWidth
        analysisCanvas.height = nextMetrics.analysisHeight
      }

      preparedTokensRef.current = fontReadyRef.current ? prepareTokens(text, nextMetrics.font) : []
      previousObstaclesRef.current = []
      needsTextRedrawRef.current = true
      lastTextDrawRef.current = 0
    }

    const clearText = () => {
      const metrics = metricsRef.current

      if (!metrics) {
        return
      }

      textContext.setTransform(metrics.scale, 0, 0, metrics.scale, 0, 0)
      textContext.clearRect(0, 0, metrics.cssWidth, metrics.cssHeight)
    }

    const drawKeyedVideo = () => {
      const metrics = metricsRef.current

      if (!metrics || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        return
      }

      videoContext.clearRect(0, 0, metrics.pixelWidth, metrics.pixelHeight)
      videoContext.drawImage(video, 0, 0, metrics.pixelWidth, metrics.pixelHeight)

      const frame = videoContext.getImageData(0, 0, metrics.pixelWidth, metrics.pixelHeight)
      const pixels = frame.data

      for (let y = 0; y < metrics.pixelHeight; y += 1) {
        const rowOffset = y * metrics.pixelWidth * 4

        for (let x = 0; x < metrics.pixelWidth; x += 1) {
          const index = rowOffset + x * 4
          const red = pixels[index]
          const green = pixels[index + 1]
          const blue = pixels[index + 2]
          const alpha = pixels[index + 3]
          const strongestNonGreen = Math.max(red, blue)
          const greenAdvantage = green - strongestNonGreen

          if (green > 72 && greenAdvantage > 26) {
            const keyStrength = Math.min(1, (greenAdvantage - 26) / 40 + 0.35)

            pixels[index] = Math.min(255, Math.round(red + strongestNonGreen * 0.06 * keyStrength))
            pixels[index + 1] = Math.max(0, Math.round(green * (1 - keyStrength * 0.8)))
            pixels[index + 2] = Math.min(255, Math.round(blue + strongestNonGreen * 0.04 * keyStrength))
            pixels[index + 3] = Math.max(0, Math.round(alpha * (1 - keyStrength)))
          } else if (greenAdvantage > 13) {
            pixels[index + 1] = Math.max(0, Math.round(green - 28))
          }

        }
      }

      videoContext.putImageData(frame, 0, 0)
    }

    const sampleRowBounds = () => {
      const metrics = metricsRef.current

      if (!metrics || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        return null
      }

      analysisContext.clearRect(0, 0, metrics.analysisWidth, metrics.analysisHeight)
      analysisContext.drawImage(video, 0, 0, metrics.analysisWidth, metrics.analysisHeight)

      const frame = analysisContext.getImageData(0, 0, metrics.analysisWidth, metrics.analysisHeight)
      const pixels = frame.data
      const rowBounds: AlphaRowBounds[] = new Array(metrics.analysisHeight).fill(null)

      for (let y = 0; y < metrics.analysisHeight; y += 1) {
        let rowLeft = Number.POSITIVE_INFINITY
        let rowRight = Number.NEGATIVE_INFINITY
        const rowOffset = y * metrics.analysisWidth * 4

        for (let x = 0; x < metrics.analysisWidth; x += 1) {
          const index = rowOffset + x * 4
          const red = pixels[index]
          const green = pixels[index + 1]
          const blue = pixels[index + 2]
          const alpha = pixels[index + 3]
          const strongestNonGreen = Math.max(red, blue)
          const greenAdvantage = green - strongestNonGreen

          let effectiveAlpha = alpha

          if (green > 72 && greenAdvantage > 26) {
            const keyStrength = Math.min(1, (greenAdvantage - 26) / 40 + 0.35)
            effectiveAlpha = Math.max(0, Math.round(alpha * (1 - keyStrength)))
          }

          if (effectiveAlpha > 30) {
            if (x < rowLeft) {
              rowLeft = x
            }

            if (x + 1 > rowRight) {
              rowRight = x + 1
            }
          }
        }

        rowBounds[y] = Number.isFinite(rowLeft) && Number.isFinite(rowRight)
          ? { left: rowLeft, right: rowRight }
          : null
      }

      return rowBounds
    }

    const drawTextLayer = (now: number, rowBounds: AlphaRowBounds[] | null) => {
      const metrics = metricsRef.current

      if (!metrics || textFailedRef.current) {
        clearText()
        return
      }

      const preparedTokens = preparedTokensRef.current

      if (preparedTokens.length === 0) {
        clearText()
        return
      }

      const isDesktopReactive = metrics.desktopReactive && rowBounds !== null
      const shouldDrawText = isDesktopReactive ? true : needsTextRedrawRef.current

      if (!shouldDrawText) {
        return
      }

      try {
        const rawObstacles = isDesktopReactive
          ? buildDynamicBandObstacles(rowBounds, metrics)
          : buildStaticBandObstacles(metrics)
        const staticObstacles = isDesktopReactive ? buildStaticBandObstacles(metrics) : rawObstacles
        // For rows where dynamic detection returns null, fall back to static obstacle
        // so words never land on the subject's head/body even if keying misses that row
        const mergedObstacles = rawObstacles.map((obs, i) =>
          obs !== null ? obs : (staticObstacles[i] ?? null)
        )
        const obstacles = isDesktopReactive
          ? smoothBandObstacles(mergedObstacles, previousObstaclesRef.current)
          : mergedObstacles

        previousObstaclesRef.current = obstacles
        drawWrappedText(textContext, preparedTokens, metrics, obstacles, now)
        lastTextDrawRef.current = now
        needsTextRedrawRef.current = false
      } catch {
        textFailedRef.current = true
        clearText()
      }
    }

    const renderFrame = (now: number) => {
      if (isDisposed) {
        return
      }

      const metrics = metricsRef.current
      drawKeyedVideo()

      const shouldSampleRowBounds =
        metrics &&
        metrics.desktopReactive &&
        (needsTextRedrawRef.current || now - lastTextDrawRef.current >= 1000 / MAX_TEXT_FPS)
      const rowBounds = shouldSampleRowBounds ? sampleRowBounds() : null
      drawTextLayer(now, rowBounds)
    }

    const scheduleVideoFrame = () => {
      if (isDisposed) {
        return
      }

      if ("requestVideoFrameCallback" in video) {
        frameHandleRef.current = video.requestVideoFrameCallback((_timestamp) => {
          frameHandleRef.current = null
          renderFrame(performance.now())

          if (!video.paused && !video.ended) {
            scheduleVideoFrame()
          }
        })

        return
      }

      fallbackFrameHandleRef.current = requestAnimationFrame((timestamp) => {
        fallbackFrameHandleRef.current = null
        renderFrame(timestamp)

        const currentVideo = videoRef.current

        if (currentVideo && !currentVideo.paused && !currentVideo.ended) {
          scheduleVideoFrame()
        }
      })
    }

    const startLoop = () => {
      cancelScheduledFrame()
      renderFrame(performance.now())

      if (!video.paused && !video.ended) {
        scheduleVideoFrame()
      }
    }

    const handleLoadedMetadata = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setAspectRatio(`${video.videoWidth} / ${video.videoHeight}`)
      }

      syncCanvasDimensions()
      startLoop()
    }

    const handleLoadedData = () => {
      void video.play().catch(() => {
        startLoop()
      })
    }

    const handlePause = () => {
      cancelScheduledFrame()
    }

    const handleError = () => {
      cancelScheduledFrame()
      clearText()
      const metrics = metricsRef.current

      if (metrics) {
        videoContext.clearRect(0, 0, metrics.pixelWidth, metrics.pixelHeight)
      }
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    deviceClassRef.current = detectDeviceClass()
    reducedMotionRef.current = mediaQuery.matches

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches
      syncCanvasDimensions()
      renderFrame(performance.now())
    }

    mediaQuery.addEventListener("change", handleReducedMotionChange)

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            syncCanvasDimensions()
            renderFrame(performance.now())
          })
        : null

    resizeObserver?.observe(stage)

    document.fonts.ready
      .then(() => {
        if (isDisposed) {
          return
        }

        fontReadyRef.current = true
        if (metricsRef.current) {
          preparedTokensRef.current = prepareTokens(text, metricsRef.current.font)
          needsTextRedrawRef.current = true
          renderFrame(performance.now())
        }
      })
      .catch(() => {
        textFailedRef.current = true
      })

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("play", startLoop)
    video.addEventListener("pause", handlePause)
    video.addEventListener("ended", handlePause)
    video.addEventListener("error", handleError)

    syncCanvasDimensions()

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      handleLoadedMetadata()
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      handleLoadedData()
    }

    return () => {
      isDisposed = true
      cancelScheduledFrame()
      resizeObserver?.disconnect()
      mediaQuery.removeEventListener("change", handleReducedMotionChange)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("play", startLoop)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("ended", handlePause)
      video.removeEventListener("error", handleError)
    }
  }, [src, text])

  return (
    <section className="bg-black py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          ref={stageRef}
          className="relative mx-auto w-full max-w-[1200px] overflow-hidden bg-black font-mono"
          style={{ aspectRatio }}
        >
          <canvas
            ref={textCanvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          />
          <canvas
            ref={videoCanvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          />
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
        </div>
      </div>
    </section>
  )
}
