import React from "react"
import { ArrowUpRight, Loader2, PenTool } from "lucide-react"

import { PhotoProps } from "@/lib/types"
import { cn } from "@/lib/utils"

import { buttonVariants } from "./ui/button"

function VectorOutput({ src, url, provider, children }: PhotoProps) {
  return (
    <>
      <div className="absolute left-2 top-2 z-20 flex h-8 w-12 items-center justify-center rounded-full bg-white/40">
        <PenTool className="h-6 w-6 text-black" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={url}
        className={`relative z-10 h-64 w-full overflow-hidden rounded-2xl object-cover`}
        width={512}
        height={512}
      />
      <div className="absolute z-0 grid h-64 w-full place-items-center text-center">
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
          <span className="mr-2">{provider}</span>
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

export default VectorOutput
