import React from "react"
import Image from "next/image"
import { ArrowUpRight, Loader2 } from "lucide-react"

import { PhotoProps } from "@/lib/types"
import { cn } from "@/lib/utils"

import { buttonVariants } from "./ui/button"

function PhotoOutput({ src, url, children }: PhotoProps) {
  return (
    <>
      <Image
        src={`${src}`}
        alt="Photo"
        className={`relative z-10 h-64 w-full overflow-hidden rounded-2xl object-cover`}
        width={512}
        height={512}
      />
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

export default PhotoOutput
