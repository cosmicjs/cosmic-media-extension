"use client"

import { Bucket } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import GetPexelsPhotos from "./get-pexels-photos"
import GetPexelsVideos from "./get-pexels-videos"

export default function Content(bucket: Bucket) {
  return (
    <Tabs
      defaultValue="photos"
      className="flex w-full flex-col items-center justify-center"
    >
      <TabsList>
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
      </TabsList>
      <TabsContent value="photos" className="w-full">
        <GetPexelsPhotos
          bucket_slug={bucket.bucket_slug}
          read_key={bucket.read_key}
          write_key={bucket.write_key}
        />
      </TabsContent>
      <TabsContent value="videos" className="w-full">
        <GetPexelsVideos
          bucket_slug={bucket.bucket_slug}
          read_key={bucket.read_key}
          write_key={bucket.write_key}
        />
      </TabsContent>
    </Tabs>
  )
}
