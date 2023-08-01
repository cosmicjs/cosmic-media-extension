import { Bucket } from "@/lib/types"
import Content from "@/components/content"

export default function IndexPage({ searchParams }: { searchParams: Bucket }) {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
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