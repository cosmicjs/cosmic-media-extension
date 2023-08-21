import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-4">
        <Icons.cosmic className="h-6 w-6" />
        <span className="mt-[3px] inline-block font-bold">Media</span>
      </Link>
    </div>
  )
}
