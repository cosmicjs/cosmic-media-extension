import { NextResponse } from 'next/server'
import { createBucketClient } from "@cosmicjs/sdk"

export async function POST(request: Request) {
  const res = await request.json()
  const cosmic = createBucketClient({
    bucketSlug: res.bucket.bucket_slug,
    readKey: res.bucket.read_key,
    writeKey: res.bucket.write_key,
  })
  const url = res.url
  const slug = res.slug

  try {
    const response = await fetch(url ?? "")
    const blob = await response.blob()
    const mediaObj = {
      media: blob,
      name: slug
    }
    await cosmic.media.insertOne({ media: mediaObj })
  } catch (err) {
    console.log(err)
  }
  return NextResponse.json(request)
}