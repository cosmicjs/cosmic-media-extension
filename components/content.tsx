"use client"

import { Bucket } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import GetIllustrations from "./get-illustrations"
import GetPexelsVideos from "./get-pexels-videos"
import GetPhotos from "./get-photos"
import GetVectors from "./get-vectors"

export default function Content(bucket: Bucket) {
  return (
    <div className="relative w-full">
      <Tabs
        defaultValue="photos"
        className="flex w-full flex-col items-start justify-center"
      >
        <TabsList className="h-[3.2rem] rounded-xl absolute right-4 top-4">
          <TabsTrigger value="photos" className="h-full rounded-lg">
            Photos
          </TabsTrigger>
          <TabsTrigger value="videos" className="h-full rounded-lg">
            Videos
          </TabsTrigger>
          <TabsTrigger value="illustrations" className="h-full rounded-lg">
            Illustrations
          </TabsTrigger>
          <TabsTrigger value="vectors" className="h-full rounded-lg">
            Vectors
          </TabsTrigger>
        </TabsList>
        <TabsContent value="photos" className="w-full">
          <GetPhotos
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
        <TabsContent value="illustrations" className="w-full">
          <GetIllustrations
            bucket_slug={bucket.bucket_slug}
            read_key={bucket.read_key}
            write_key={bucket.write_key}
          />
        </TabsContent>
        <TabsContent value="vectors" className="w-full">
          <GetVectors
            bucket_slug={bucket.bucket_slug}
            read_key={bucket.read_key}
            write_key={bucket.write_key}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
