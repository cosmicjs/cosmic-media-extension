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
        Use the search bar above to find royalty-free media from popular online
        media services.
      </div>
      <div className="m-auto mb-16 grid w-full grid-cols-2 place-items-center justify-center gap-6 sm:max-w-3xl sm:grid-cols-5 sm:gap-8">
        <Icons.unsplash className="h-6" />
        <Icons.giphy className="h-6" />
        <Icons.openai className="h-6" />
        <Icons.pexels className="h-6" />
        <Icons.pixabay className="h-6" />
      </div>
      {location !== "media-modal" && (
        <div className="flex flex-col items-center justify-center gap-8 text-center text-sm sm:flex-row">
          <div>
            <a
              className="flex flex-col sm:flex-row"
              href="https://www.cosmicjs.com?ref=cosmic-media"
              target="_blank"
              rel="noreferrer"
            >
              <div className="mr-2">Made by</div>
              <div className="mt-2 flex justify-center sm:-mt-1">
                <Icons.cosmic className="h-6 w-6" />
              </div>
            </a>
          </div>
          <div>
            <a
              href="https://www.cosmicjs.com/marketplace/extensions/cosmic-media?ref=cosmic-media"
              target="_blank"
              rel="noreferrer"
            >
              Get Cosmic Extension{" "}
              <ArrowUpRight className="relative -top-1 inline h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
