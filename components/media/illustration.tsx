import React from "react"
import { ExternalLink, Loader2, PenTool } from "lucide-react"

import { PhotoProps } from "@/lib/types"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function VectorOutput({ src, url, provider, children }: PhotoProps) {
  return (
    <>
      <div className="absolute left-2 top-2 z-20 rounded-full bg-white/40 p-3">
        <PenTool className="h-4 w-4 text-gray-600 dark:text-gray-900" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={url}
        className={`relative z-10 h-64 w-full overflow-hidden rounded-2xl object-cover`}
        width={512}
        height={512}
      />
      <div className="absolute top-0 z-0 grid h-64 w-full place-items-center text-center">
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
        title={`View in ${provider}`}
      >
        <ExternalLink
          width={16}
          height={16}
          className="text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-400"
        />
      </a>
      <div className="absolute bottom-2 right-2 z-20">{children}</div>
    </>
  )
}

export default VectorOutput
