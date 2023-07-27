import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Beautifully designed template <br className="hidden sm:inline" />
          built with Next.js, Shadcn UI, Tailwind CSS, and Cosmic.
        </h1>
        <p className="max-w-[700px] text-lg text-gray-800 dark:text-dark-gray-800">
          Use it as a starter for your Cosmic websites and apps. Extension
          ready.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.login}
          className={buttonVariants({ variant: "outline" })}
        >
          Login
        </Link>
      </div>
    </section>
  )
}
