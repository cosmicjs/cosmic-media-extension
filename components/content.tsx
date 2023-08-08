"use client"

import { Brush, Camera, PenTool, Video, Wand2 } from "lucide-react"

import { Bucket } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import GetAI from "./get-ai"
import GetIllustrations from "./get-illustrations"
import GetPexelsVideos from "./get-pexels-videos"
import GetPhotos from "./get-photos"
import GetVectors from "./get-vectors"

export default function Content(bucket: Bucket) {
  return (
    <div className="relative flex w-full items-center justify-center max-w-3xl mx-auto">
      <Tabs defaultValue="photos" className="w-full text-center">
        <TabsList className="relative h-[3.2rem] rounded-xl">
          <TabsTrigger
            title="Search photos"
            value="photos"
            className="h-full rounded-lg px-6"
          >
            <Camera className="mr-3" /> Photos
          </TabsTrigger>
          <TabsTrigger
            title="Search videos"
            value="videos"
            className="h-full rounded-lg px-6"
          >
            <Video className="mr-3" /> Video
          </TabsTrigger>
          <TabsTrigger
            title="Search illustrations"
            value="illustrations"
            className="h-full rounded-lg px-6"
          >
            <Brush className="mr-3" /> Illustrations
          </TabsTrigger>
          <TabsTrigger
            title="Search vectors"
            value="vectors"
            className="h-full rounded-lg px-6"
          >
            <PenTool className="mr-3" />
            Vectors
          </TabsTrigger>
          <TabsTrigger
            title="Create AI-generated images"
            value="ai"
            className="h-full rounded-lg px-6"
          >
            <Wand2 className="mr-3" /> AI images
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
        <TabsContent value="ai" className="w-full">
          <GetAI
            bucket_slug={bucket.bucket_slug}
            read_key={bucket.read_key}
            write_key={bucket.write_key}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
