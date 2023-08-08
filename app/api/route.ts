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
    const buffer = await response.arrayBuffer()
    const media = {
      buffer,
      originalname: slug + '.jpg'
    }
    const res = await cosmic.media.insertOne({ media })
    console.log(1,res)
  } catch (err) {
    console.log(2,err)
  }
  return NextResponse.json(request)
}