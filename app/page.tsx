import Content from "@/components/content"
import { SiteHeader } from "@/components/site-header"

export default function IndexPage({
  searchParams,
}: {
  searchParams: {
    bucket_slug: string
    read_key: string
    write_key: string
    location: string
  }
}) {
  return (
    <section className="grid items-center gap-6 pb-8 md:pb-10">
      {searchParams?.location !== "media-modal" && <SiteHeader />}
      <main className="mx-auto mt-2 h-full w-full p-2">
        <Content
          bucket_slug={searchParams.bucket_slug}
          read_key={searchParams.read_key}
          write_key={searchParams.write_key}
        />
      </main>
    </section>
  )
}
