import { createBucketClient } from "@cosmicjs/sdk"
import { createClient } from "pexels"

export const PEXELS_CLIENT = createClient(
  "LM0Q3RJVf8hGsD65tfD5p1Dcc9VC1aSzBK0dQkFCVoWuatMxAedlwMW3"
)

export const UNSPLASH_SEARCH_URL = "https://api.unsplash.com/search/photos"
export const UNSPLASH_ACCESS_KEY =
  "fd2c5776f4acd4cd209ea51fec419d09591404ef9e357ef6a5eed195023bcd53"

export const PIXABAY_SEARCH_URL = "https://pixabay.com/api/"
export const PIXABAY_KEY = "38593288-af492e5b395b816abb4992bcf"

export const cosmic = (bucketSlug: string, readKey: string, writeKey: string) =>
  createBucketClient({
    bucketSlug,
    readKey,
    writeKey,
    apiEnvironment: "staging"
  })
