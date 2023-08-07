"use client"

import { useState } from "react"

import { PEXELS_CLIENT, cosmic } from "@/lib/data"
import { Bucket, Video, VideoData } from "@/lib/types"
import GetButton from "@/components/get-button"
import { Icons } from "@/components/icons"

import EmptyState from "./empty-state"
import Header from "./header"
import Input from "./input"
import NoResultState from "./no-result-state"
import VideoOutput from "./video"

export default function GetPexelsVideos(bucket: Bucket) {
  const [videos, setVideos] = useState<Video[]>([])
  const [videoData, setVideosData] = useState<VideoData>({
    adding_media: [],
    added_media: [],
  })

  const cosmicBucket = cosmic(
    bucket.bucket_slug,
    bucket.read_key,
    bucket.write_key
  )

  async function searchVideos(q: string) {
    const query = q
    if (query === "") {
      setVideos([])
      return
    }
    try {
      await PEXELS_CLIENT.videos
        .search({ query, per_page: 20 })
        .then((res: any) => {
          const videos = res.videos
          if (!videos) {
            setVideos([])
          } else {
            setVideos(videos)
          }
        })
    } catch (e: any) {
      console.log(e)
    }
  }

  async function handleAddVideoToMedia(video: Video) {
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
    }
  }

  return (
    <div>
      <Header>
        <Input
          placeholder="Search free high-resolution videos"
          onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
            searchVideos(event.currentTarget.value)
          }
        />
      </Header>
      <div>
        {videos?.length !== 0 && (
          <div className="3xl:grid-cols-6 mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6 lg:grid-cols-4 2xl:grid-cols-5">
            {videos.map((video: Video) => {
              return (
                <div key={video.id} className="group relative w-full">
                  <VideoOutput
                    src={video.image!}
                    videoSrc={video.video_files[1].link}
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
                  <div className="absolute left-0 top-0 z-10 hidden h-full w-full rounded-2xl bg-gradient-to-t from-white opacity-25 group-hover:block dark:from-black" />
                </div>
              )
            })}
          </div>
        )}

        {videos.length === 0 && <EmptyState />}
        {!videos && <NoResultState />}
      </div>
    </div>
  )
}
