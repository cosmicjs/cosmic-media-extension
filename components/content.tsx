"use client"

import { useState } from "react"
import { Brush, Camera, Laugh, PenTool, Video, Wand2 } from "lucide-react"

import { Bucket } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import GetAI from "./get-ai"
import GetGifs from "./get-gifs"
import GetIllustrations from "./get-illustrations"
import GetPexelsVideos from "./get-pexels-videos"
import GetPhotos from "./get-photos"
import GetVectors from "./get-vectors"

function handleTabClick() {
  document.getElementById("search-input")?.focus()
}

export default function Content(bucket: Bucket) {
  const [selectedView, setSelectedView] = useState("photos")

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-scroll sm:flex-row sm:overflow-auto">
      <div className="sm:hidden">
        <Select value={selectedView} onValueChange={setSelectedView}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Photos" defaultValue="photos" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="photos">Photos</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
              <SelectItem value="gifs">Gifs</SelectItem>
              <SelectItem value="ai">AI Images</SelectItem>
              <SelectItem value="illustrations">Illustrations</SelectItem>
              <SelectItem value="vectors">Vectors</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {selectedView === "photos" && (
          <GetPhotos
            bucket_slug={bucket.bucket_slug}
            read_key={bucket.read_key}
            write_key={bucket.write_key}
          />
        )}
        {selectedView === "videos" && (
          <GetPexelsVideos
            bucket_slug={bucket.bucket_slug}
            read_key={bucket.read_key}
            write_key={bucket.write_key}
          />
        )}
        {selectedView === "gifs" && (
          <GetGifs
            bucket_slug={bucket.bucket_slug}
            read_key={bucket.read_key}
            write_key={bucket.write_key}
          />
        )}
        {selectedView === "ai" && (
          <GetAI
            bucket_slug={bucket.bucket_slug}
            read_key={bucket.read_key}
            write_key={bucket.write_key}
          />
        )}
        {selectedView === "illustrations" && (
          <GetIllustrations
            bucket_slug={bucket.bucket_slug}
            read_key={bucket.read_key}
            write_key={bucket.write_key}
          />
        )}
        {selectedView === "vectors" && (
          <GetVectors
            bucket_slug={bucket.bucket_slug}
            read_key={bucket.read_key}
            write_key={bucket.write_key}
          />
        )}
      </div>
      <div className="hidden sm:block">
        <Tabs defaultValue="photos" className="w-full text-center">
          <TabsList className="relative mx-auto h-[3.2rem] w-full rounded-xl sm:max-w-3xl">
            <TabsTrigger
              title="Search photos"
              value="photos"
              className="h-full rounded-lg px-4"
              onClick={handleTabClick}
            >
              <Camera className="mr-3" /> Photos
            </TabsTrigger>
            <TabsTrigger
              title="Search videos"
              value="videos"
              className="h-full rounded-lg px-4"
              onClick={handleTabClick}
            >
              <Video className="mr-3" /> Videos
            </TabsTrigger>
            <TabsTrigger
              title="Gifs"
              value="gifs"
              className="h-full rounded-lg px-4"
              onClick={handleTabClick}
            >
              <Laugh className="mr-3" /> Gifs
            </TabsTrigger>
            <TabsTrigger
              title="Create AI-generated images"
              value="ai"
              className="h-full rounded-lg px-4"
              onClick={handleTabClick}
            >
              <Wand2 className="mr-3" /> AI images
            </TabsTrigger>
            <TabsTrigger
              title="Search illustrations"
              value="illustrations"
              className="h-full rounded-lg px-4"
              onClick={handleTabClick}
            >
              <Brush className="mr-3" /> Illustrations
            </TabsTrigger>
            <TabsTrigger
              title="Search vectors"
              value="vectors"
              className="h-full rounded-lg px-4"
              onClick={handleTabClick}
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
    </div>
  )
}
