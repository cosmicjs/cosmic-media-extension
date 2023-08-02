"use client"

import { Bucket } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import GetPexelsPhotos from "./get-pexels-photos"
import GetPexelsVideos from "./get-pexels-videos"
import GetPixabayPhotos from "./get-pixabay-photos"
import GetUnsplashPhotos from "./get-unsplash-photos"

export default function Content(bucket: Bucket) {
  return (
    <Tabs
      defaultValue="pexels-photos"
      className="flex w-full flex-col items-center justify-center"
    >
      <TabsList>
        <TabsTrigger value="pexels-photos">Pexels Photos</TabsTrigger>
        <TabsTrigger value="pexels-videos">Pexels Videos</TabsTrigger>
        <TabsTrigger value="unsplash-photos">Unsplash Photos</TabsTrigger>
        <TabsTrigger value="pixabay-photos">Pixabay Photos</TabsTrigger>
      </TabsList>
      <TabsContent value="pexels-photos" className="w-full">
        <GetPexelsPhotos
          bucket_slug={bucket.bucket_slug}
          read_key={bucket.read_key}
          write_key={bucket.write_key}
        />
      </TabsContent>
      <TabsContent value="pexels-videos" className="w-full">
        <GetPexelsVideos
          bucket_slug={bucket.bucket_slug}
          read_key={bucket.read_key}
          write_key={bucket.write_key}
        />
      </TabsContent>
      <TabsContent value="unsplash-photos" className="w-full">
        <GetUnsplashPhotos
          bucket_slug={bucket.bucket_slug}
          read_key={bucket.read_key}
          write_key={bucket.write_key}
        />
      </TabsContent>
      <TabsContent value="pixabay-photos" className="w-full">
        <GetPixabayPhotos
          bucket_slug={bucket.bucket_slug}
          read_key={bucket.read_key}
          write_key={bucket.write_key}
        />
      </TabsContent>
    </Tabs>
  )
}
