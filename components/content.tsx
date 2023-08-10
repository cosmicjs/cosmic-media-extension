"use client"

import { Brush, Camera, Laugh, PenTool, Video, Wand2 } from "lucide-react"

import { Bucket } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import GetAI from "./get-ai"
import GetGifs from "./get-gifs"
import GetIllustrations from "./get-illustrations"
import GetPexelsVideos from "./get-pexels-videos"
import GetPhotos from "./get-photos"
import GetVectors from "./get-vectors"

export default function Content(bucket: Bucket) {
  return (
    <div className="relative flex w-full items-center justify-center">
      <Tabs defaultValue="photos" className="w-full text-center">
        <TabsList className="relative mx-auto h-[3.2rem] max-w-3xl rounded-xl">
          <TabsTrigger
            title="Search photos"
            value="photos"
            className="h-full rounded-lg px-4"
          >
            <Camera className="mr-3" /> Photos
          </TabsTrigger>
          <TabsTrigger
            title="Gifs"
            value="gifs"
            className="h-full rounded-lg px-4"
          >
            <Laugh className="mr-3" /> Gifs
          </TabsTrigger>
          <TabsTrigger
            title="Create AI-generated images"
            value="ai"
            className="h-full rounded-lg px-4"
          >
            <Wand2 className="mr-3" /> AI images
          </TabsTrigger>
          <TabsTrigger
            title="Search videos"
            value="videos"
            className="h-full rounded-lg px-4"
          >
            <Video className="mr-3" /> Video
          </TabsTrigger>
          <TabsTrigger
            title="Search illustrations"
            value="illustrations"
            className="h-full rounded-lg px-4"
          >
            <Brush className="mr-3" /> Illustrations
          </TabsTrigger>
          <TabsTrigger
            title="Search vectors"
            value="vectors"
            className="h-full rounded-lg px-4"
          >
            <PenTool className="mr-3" />
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
        <TabsContent value="gifs" className="w-full">
          <GetGifs
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
