import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-4">
        <Icons.cosmic className="h-6 w-6" />
        <span className="mt-[3px] inline-block font-bold">
          {siteConfig.name}
        </span>
      </Link>
    </div>
  )
}
