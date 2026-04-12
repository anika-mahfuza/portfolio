"use client"

type PretextVideoBandProps = {
  src: string
  text?: string
}

export function PretextVideoBand({ src }: PretextVideoBandProps) {
  return (
    <section className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8" />
    </section>
  )
}
