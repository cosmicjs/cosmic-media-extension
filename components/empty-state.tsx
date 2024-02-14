"use client"

import { useContext } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowUpRight } from "lucide-react"

import { Icons } from "@/components/icons"

import { GlobalContext } from "./content"

export default function EmptyState() {
  const { query, setQuery, debouncedQuery } = useContext(GlobalContext)
  const searchParams = useSearchParams()
  const location = searchParams.get("location")
  return (
    <div>
      <div className="my-8 text-center font-sans text-lg text-neutral-800 dark:text-neutral-200">
        Use the search bar above to find royalty-free media from popular online
        media services.
      </div>
     
      {location !== "media-modal" && (
        <div className="flex flex-col items-center justify-center gap-8 text-center text-sm sm:flex-row">
          <div>
            
              <div className="mr-2">Made by LUL</div>
          
        </div>
      )}
    </div>
  )
}
