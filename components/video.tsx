"use client"

import React, { useState } from "react"
import { ExternalLink, Loader2, Video } from "lucide-react"

import { VideoProps } from "@/lib/types"
import { cn } from "@/lib/utils"

import { buttonVariants } from "./ui/button"

function VideoOutput({ src, videoSrc, url, children }: VideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div
      className="relative"
      onMouseLeave={() => {
        setIsPlaying(false)
      }}
    >
      <div className="absolute left-2 top-2 z-20 flex h-8 w-12 items-center justify-center rounded-full bg-white/40">
        <Video className="h-6 w-6 text-black" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {isPlaying ? (
        <video
          src={videoSrc}
          className="relative h-64 w-full rounded-2xl object-cover"
          autoPlay
          loop
          muted
        />
      ) : (
        <div
          className="relative z-10 h-64"
          onMouseEnter={() => setIsPlaying(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={url}
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>
      )}
      <div className="absolute z-0 grid h-64 w-full place-items-center text-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <a
        href={`${url}`}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "group absolute right-2 top-2 z-20 hidden rounded-full bg-white/40 p-3 hover:bg-white/40 group-hover:block"
        )}
        title={`View in Pexels`}
      >
        <ExternalLink
          width={16}
          height={16}
          className="text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-400"
        />
      </a>
      <div className="absolute bottom-2 right-2 z-20">{children}</div>
    </div>
  )
}

export default VideoOutput
