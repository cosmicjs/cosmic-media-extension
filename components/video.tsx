"use client"

import React from "react"
import { ArrowUpRight, Loader2, Video } from "lucide-react"

import { VideoProps } from "@/lib/types"
import { cn } from "@/lib/utils"

import { buttonVariants } from "./ui/button"

function VideoOutput({ src, videoSrc, url, children }: VideoProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)

  return (
    <>
      <div className="absolute left-2 top-2 z-20 flex h-8 w-12 items-center justify-center rounded-full bg-white/40">
        <Video className="h-6 w-6 text-black" />
      </div>
      {isPlaying ? (
        <video
          src={videoSrc}
          className="relative z-10 h-64 w-full rounded-2xl object-cover"
          onMouseLeave={() => setIsPlaying(false)}
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
      <div className="absolute left-1/2 top-1/2 z-0 w-full text-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
      <div className="absolute bottom-4 z-20 flex w-full items-center justify-center space-x-4 text-center">
        {children}
        <a
          href={`${url}`}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(buttonVariants({ variant: "secondary" }), "group")}
        >
          <span className="mr-2">Pexels</span>
          <ArrowUpRight
            width={20}
            height={20}
            className="text-gray-700 transition-all duration-200 ease-in-out group-hover:translate-x-1 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-400"
          />
        </a>
      </div>
    </>
  )
}

export default VideoOutput
