"use client"

import { useSearchParams } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import { Icons } from "@/components/icons"

export default function EmptyState() {
  const searchParams = useSearchParams()
  const location = searchParams.get("location")
  return (
    <div>
      <div className="my-8 text-center font-sans text-lg text-neutral-800 dark:text-neutral-200">
        Use the search bar above to find royalty-free media from popular stock
        media services.
      </div>
      <div className="m-auto mb-16 flex max-w-3xl justify-center gap-x-10">
        <Icons.unsplash className="h-10" />
        <Icons.giphy className="h-10" />
        <Icons.openai className="h-10" />
        <Icons.pexels className="h-10" />
        <Icons.pixabay className="h-10" />
      </div>
      {location !== "media-modal" && (
        <div className="text-center">
          <a
            href="https://www.cosmicjs.com/marketplace/extensions/cosmic-media"
            target="_blank"
            rel="noreferrer"
          >
            Get Cosmic Extension{" "}
            <ArrowUpRight className="relative -top-1 inline h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  )
}
