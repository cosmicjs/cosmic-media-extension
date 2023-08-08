import { NextResponse } from "next/server"
import { createBucketClient } from "@cosmicjs/sdk"
import { z } from "zod"

import { COSMIC_ENV } from "@/lib/data"

const RequestBodySchema = z.object({
  bucket: z.object({
    bucket_slug: z.string(),
    read_key: z.string(),
    write_key: z.string(),
  }),
  url: z.string(),
  slug: z.string(),
})

export async function POST(request: Request) {
  const requestBody = await request.json()

  const parsedRequestBody = RequestBodySchema.safeParse(requestBody)
  if (parsedRequestBody.success === false) {
    return NextResponse.json(
      {
        message: "Request validation failed",
        error: parsedRequestBody.error,
      },
      { status: 400 }
    )
  }

  const body = parsedRequestBody.data

  const cosmic = createBucketClient({
    bucketSlug: body.bucket.bucket_slug,
    readKey: body.bucket.read_key,
    writeKey: body.bucket.write_key,
    apiEnvironment: COSMIC_ENV,
  })

  try {
    const response = await fetch(body.url)
    if (response.status !== 200) {
      throw new Error()
    }

    const data = await response.arrayBuffer()

    const buffer = Buffer.from(data)

    const media = {
      buffer,
      originalname: body.slug + ".jpg",
    }
    await cosmic.media.insertOne({ media })

    return NextResponse.json({ message: "AI media inserted successfully" })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: "There was an error performing the request" },
      { status: 500 }
    )
  }
}
