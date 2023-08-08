import React from "react"

import { Icons } from "@/components/icons"

export default function EmptyState() {
  return (
    <div>
      <div className="mb-8 mt-8 text-center font-sans text-lg text-neutral-800 dark:text-neutral-200">
        Use the search bar above to find royalty-free media from popular stock
        media services.
      </div>
      <div className="flex justify-center gap-x-10">
        <Icons.unsplash className="h-10" />
        <Icons.pexels className="h-10" />
        <Icons.pixabay className="h-10" />
        <Icons.openai className="h-10" />
      </div>
    </div>
  )
}
