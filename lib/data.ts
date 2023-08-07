import { createBucketClient } from "@cosmicjs/sdk"
import { createClient } from "pexels"

export const UNSPLASH_SEARCH_URL = "https://api.unsplash.com/search/photos"
export const UNSPLASH_ACCESS_KEY =
  process.env.NEXT_PUBLIC_UNSPLASH_KEY
  
export const PEXELS_CLIENT = createClient(process.env.NEXT_PUBLIC_PEXELS_KEY || '')

export const PIXABAY_SEARCH_URL = "https://pixabay.com/api/"
export const PIXABAY_KEY = process.env.NEXT_PUBLIC_PIXABAY_KEY

export const cosmic = (bucketSlug: string, readKey: string, writeKey: string) =>
  createBucketClient({
    bucketSlug,
    readKey,
    writeKey,
    apiEnvironment: "staging"
  })
