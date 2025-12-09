"use client"

import { useRef, useEffect, useState } from "react"

export interface MusicPlayerRef {
  audioElement: HTMLAudioElement | null
}

interface LyricLine {
  time: number
  text: string
}

function parseLRC(lrc: string): LyricLine[] {
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
      if (text) {
        lyrics.push({ time, text })
      }
    }
  }

  return lyrics.sort((a, b) => a.time - b.time)
}

const LYRICS_LRC = `
[00:00.00]
[00:11.28]First things first
[00:13.02]I'ma say all the words inside my head
[00:16.92]I'm fired up and tired of the way that things have been
[00:21.36]Oh-ooh
[00:23.04]The way that things have been
[00:25.26]Oh-ooh
[00:27.00]Second thing second
[00:28.62]Don't you tell me what you think that I could be
[00:32.70]I'm the one at the sail, I'm the master of my sea
[00:37.02]Oh-ooh
[00:38.76]The master of my sea
[00:40.80]Oh-ooh
[00:43.56]I was broken from a young age
[00:46.08]Taking my sulking to the masses
[00:48.78]Writing my poems for the few
[00:51.12]That look at me, took to me, shook to me, feeling me
[00:54.30]Singing from heartache from the pain
[00:56.76]Taking my message from the veins
[00:59.40]Speaking my lesson from the brain
[01:01.86]Seeing the beauty through the
[01:03.42]Pain
[01:05.70]You made me a, you made me a believer, believer
[01:12.66]Pain
[01:14.70]You break me down and build me up, believer, believer
[01:21.30]Pain
[01:23.22]Oh, let the bullets fly, oh, let them rain
[01:27.24]My life, my love, my drive, it came from
[01:30.66]Pain
[01:32.40]You made me a, you made me a believer, believer
[01:40.50]
[01:43.32]Third things third
[01:44.70]Send a prayer to the ones up above
[01:48.66]All the hate that you've heard has turned your spirit to a dove
[01:53.10]Oh-ooh
[01:54.84]Your spirit up above
[01:56.88]Oh-ooh
[01:59.82]I was choking in the crowd
[02:01.86]Building my rain up in the cloud
[02:04.56]Falling like ashes to the ground
[02:06.96]Hoping my feelings, they would drown
[02:09.66]But they never did, ever lived, ebbing and flowing
[02:12.36]Inhibited, limited till it broke open and rained down
[02:17.22]It rained down, like
[02:19.50]Pain
[02:21.54]You made me a, you made me a believer, believer
[02:28.44]Pain
[02:30.54]You break me down and build me up, believer, believer
[02:37.20]Pain
[02:39.06]Oh, let the bullets fly, oh, let them rain
[02:43.02]My life, my love, my drive, it came from
[02:46.44]Pain
[02:48.36]You made me a, you made me a believer, believer
[02:55.50]
[02:56.30]Last things last
[02:57.72]By the grace of the fire and the flames
[03:01.44]You're the face of the future, the blood in my veins
[03:05.88]Oh-ooh
[03:07.50]The blood in my veins
[03:09.60]Oh-ooh
[03:11.40]But they never did, ever lived, ebbing and flowing
[03:14.10]Inhibited, limited till it broke open and rained down
[03:18.90]It rained down, like
[03:21.30]Pain
[03:23.16]You made me a, you made me a believer, believer
[03:30.18]Pain
[03:32.22]You break me down and build me up, believer, believer
[03:38.88]Pain
[03:40.74]Oh, let the bullets fly, oh, let them rain
[03:44.76]My life, my love, my drive, it came from
[03:48.24]Pain
[03:50.00]You made me a, you made me a believer, believer
`

interface MusicPlayerProps {
  isActive: boolean
  onAudioRef?: (audio: HTMLAudioElement | null) => void
}

export function MusicPlayer({ isActive, onAudioRef }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (onAudioRef) {
      onAudioRef(audioRef.current)
    }
  }, [onAudioRef])

  useEffect(() => {
    if (isActive && audioRef.current) {
      audioRef.current.play().catch(() => {})
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

  if (!isActive) return null

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      {/* Now Playing indicator - Bottom right above volume controls */}
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
          <span className="text-xs text-foreground/70 font-medium">Believer - Imagine Dragons</span>
        </div>
      </div>
    </>
  )
}
