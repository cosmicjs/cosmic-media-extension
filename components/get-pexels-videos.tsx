"use client"

import { useContext, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ExternalLink, Loader2, XCircle } from "lucide-react"
import { createClient } from "pexels"

import { PEXELS_KEY, cosmic } from "@/lib/data"
import { Bucket, MediaModalData, Video, VideoData } from "@/lib/types"
import { cn, emptyModalData } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import GetButton from "@/components/get-button"
import { Icons } from "@/components/icons"
import VideoOutput from "@/components/media/video"
import { FetchErrorMessage } from "@/components/messages/fetch-error-message"
import { SaveErrorMessage } from "@/components/messages/save-error-message"

import { GlobalContext } from "./content"
import EmptyState from "./empty-state"
import Header from "./header"
import Input from "./ui/input"

export default function GetPexelsVideos(bucket: Bucket) {
  const { query, setQuery, debouncedQuery } = useContext(GlobalContext)

  const searchParams = useSearchParams()
  const pexels_key = searchParams.get("pexels_key") || PEXELS_KEY
  const [saveError, setSaveError] = useState(false)
  const [serviceFetchError, setServiceFetchError] = useState<string>()
  const [videos, setVideos] = useState<Video[]>([])
  const [videoData, setVideosData] = useState<VideoData>({
    adding_media: [],
    added_media: [],
  })
  const [mediaModalData, setMediaModalData] =
    useState<MediaModalData>(emptyModalData)

  const cosmicBucket = cosmic(
    bucket.bucket_slug,
    bucket.read_key,
    bucket.write_key
  )

  async function searchVideos(q: string) {
    setServiceFetchError("")
    const query = q
    if (query === "") {
      setVideos([])
      return
    }
    try {
      const pexelsClient = createClient(pexels_key || "")
      await pexelsClient.videos
        .search({ query, per_page: 80 })
        .then((res: any) => {
          const videos = res.videos
          if (!videos) {
            setVideos([])
          } else {
            setVideos(videos)
          }
        })
    } catch (e: any) {
      setVideos([])
      setServiceFetchError("Pexels")
      console.log(e)
    }
  }

  async function handleAddVideoToMedia(video: Video) {
    if (!bucket.bucket_slug) return setSaveError(true)
    const adding_media = [...(videoData.adding_media || []), video.id]
    setVideosData({ ...videoData, adding_media })

    try {
      const response = await fetch(video.video_files[0].link)
      const blob = await response.blob()
      const media: any = new Blob([blob], { type: "video/mp4" })
      media.name = video.id + ".mp4"
      await cosmicBucket.media.insertOne({ media })
      const adding_media = videoData.adding_media?.filter(
        (id: string) => id !== video.id
      )
      const added_media = [...(videoData.added_media || []), video.id]
      setVideosData({ ...videoData, adding_media, added_media })
    } catch (err) {
      console.log(err)
      setSaveError(true)
      setVideosData({
        adding_media: [],
        added_media: [],
      })
    }
  }

  useEffect(() => {
    searchVideos(debouncedQuery)
    //eslint-disable-next-line
  }, [debouncedQuery])

  return (
    <div>
      {saveError && (
        <Dialog open onOpenChange={() => setSaveError(false)}>
          <DialogContent
            onInteractOutside={() => setSaveError(false)}
            onEscapeKeyDown={() => setSaveError(false)}
          >
            <SaveErrorMessage />
          </DialogContent>
        </Dialog>
      )}
      {mediaModalData.url && (
        <Dialog open onOpenChange={() => setMediaModalData(emptyModalData)}>
          <DialogContent
            onInteractOutside={() => setMediaModalData(emptyModalData)}
            onEscapeKeyDown={() => setMediaModalData(emptyModalData)}
            className="md:max-w-[70vw]"
          >
            <DialogHeader>
              <DialogDescription className="mt-6">
                <div className="mb-6 min-h-[100px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <video
                    src={mediaModalData.download_url}
                    className={`relative z-10 h-full max-h-[70vh] w-full rounded-2xl object-cover`}
                    autoPlay
                    loop
                    muted
                    controls
                  />
                  <div className="absolute top-1/2 z-0 grid w-full place-items-center text-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </div>
                <div className="relative min-h-[20px] text-left">
                  <div className="pr-20">{mediaModalData.description}</div>
                  <div className="absolute -top-2 right-0 flex">
                    <a
                      href={`${mediaModalData.external_url}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={cn(
                        buttonVariants({ variant: "secondary" }),
                        "mr-2 inline rounded-full p-3"
                      )}
                      title={`View in ${mediaModalData.service}`}
                    >
                      <ExternalLink
                        width={16}
                        height={16}
                        className="text-gray-700 dark:text-gray-400"
                        onClick={(e: React.SyntheticEvent) =>
                          e.stopPropagation()
                        }
                      />
                    </a>
                    <div className="inline">
                      <GetButton
                        media={mediaModalData.video}
                        handleAddVideoToMedia={() =>
                          handleAddVideoToMedia(mediaModalData.video)
                        }
                        isZoom
                        data={videoData}
                      />
                    </div>
                  </div>
                  {mediaModalData.creator && (
                    <div className="mt-2 underline">
                      <a
                        href={mediaModalData.creator.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        by {mediaModalData.creator.name}
                      </a>
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      <Header>
        <Input
          value={query}
          placeholder="Search free high-resolution videos"
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <XCircle
            title="Clear input"
            onClick={() => {
              setQuery("")
              document.getElementById("search-input")?.focus()
            }}
            className="absolute right-2 top-[37%] h-5 w-5 cursor-pointer text-gray-500 sm:right-[12px] sm:top-[23px]"
          />
        )}
        {/* { // TODO add loader
          <Loader2 className="absolute right-[12px] top-[22px] h-5 w-5 animate-spin text-gray-500" />
        } */}
      </Header>
      {serviceFetchError && (
        <div className="m-auto max-w-3xl text-left">
          <FetchErrorMessage service={serviceFetchError} />
        </div>
      )}
      <div>
        {videos?.length !== 0 && (
          <div className="3xl:grid-cols-6 mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6 lg:grid-cols-4 2xl:grid-cols-5">
            {videos.map((video: Video) => {
              return (
                <div
                  key={video.id}
                  className="group relative w-full cursor-zoom-in"
                  onClick={() => {
                    setMediaModalData({
                      url: video.video_pictures![0].picture,
                      description: video.description,
                      video: video,
                      download_url: video.video_files![0]?.link,
                      name: `${video.id}-cosmic-media.mp4`,
                      service: "pexels",
                      external_url: video.url,
                      creator: {
                        name: video.user.name,
                        url: video.user.url,
                      },
                    })
                  }}
                >
                  <VideoOutput
                    src={video.video_pictures![0].picture}
                    videoSrc={video.video_files![0]?.link}
                    url={video.url}
                    provider="Pexels"
                  >
                    <GetButton
                      media={video}
                      handleAddVideoToMedia={() => handleAddVideoToMedia(video)}
                      data={videoData}
                    />
                  </VideoOutput>
                  <Icons.pexels className="absolute -left-6 bottom-4 z-20 h-5" />
                </div>
              )
            })}
          </div>
        )}
        {!query && videos.length === 0 && <EmptyState />}
        {!serviceFetchError && query && videos.length === 0 && (
          <div className="w-full text-center">
            <Loader2 className="absolute right-1/2 top-[200px] h-6 w-6 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
