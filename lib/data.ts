import { createBucketClient } from "@cosmicjs/sdk"
import { createClient } from "pexels"

export const client = createClient(
  "LM0Q3RJVf8hGsD65tfD5p1Dcc9VC1aSzBK0dQkFCVoWuatMxAedlwMW3"
)

export const cosmic = (bucketSlug: string, readKey: string, writeKey: string) =>
  createBucketClient({
    bucketSlug,
    readKey,
    writeKey,
  })
