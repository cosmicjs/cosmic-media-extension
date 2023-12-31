"use client"

import { createContext, useMemo, useState } from "react"
import isMobile from "is-mobile"
import { Brush, Camera, Laugh, PenTool, Video, Wand2 } from "lucide-react"

import { Bucket } from "@/lib/types"
import useDebouncedValue from "@/hooks/useDebouncedValue"
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

type Query = string
type SetQuery = React.Dispatch<React.SetStateAction<Query>>
type DebouncedQuery = string

export const GlobalContext = createContext<{
  query: Query
  setQuery: SetQuery
  debouncedQuery: DebouncedQuery
}>({
  query: "",
  setQuery: () => {},
  debouncedQuery: "",
})

export default function Content(bucket: Bucket) {
  const [selectedView, setSelectedView] = useState("photos")
  const [query, setQuery, debouncedQuery] = useDebouncedValue("")

  const globalContextValue = useMemo(
    () => ({
      query,
      setQuery,
      debouncedQuery,
    }),
    [query, setQuery, debouncedQuery]
  )

  const showMobile = useMemo(() => isMobile(), [])

  function handleTabClick() {
    document.getElementById("search-input")?.focus()
  }

  return (
    <GlobalContext.Provider value={globalContextValue}>
      <div className="relative flex w-full items-center justify-center">
        {showMobile && (
          <div className="w-full sm:hidden">
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
        )}
        <Tabs
          defaultValue="photos"
          className="hidden w-full text-center sm:block"
        >
          <TabsList className="relative mx-auto h-[3.2rem] max-w-3xl rounded-xl">
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
    </GlobalContext.Provider>
  )
}
