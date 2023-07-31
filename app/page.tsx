"use client"

import { useState } from "react"
import { createBucketClient } from "@cosmicjs/sdk"
import { CheckIcon, Loader2, PlusIcon } from "lucide-react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"

import { client } from "@/lib/data"
import {
  ParameterByName,
  Photo,
  PhotoData,
  Video,
  VideoData,
} from "@/lib/types"
import { Button } from "@/components/ui/button"
import EmptyState from "@/components/empty-state"
import Header from "@/components/header"
import Input from "@/components/input"
import NoResultState from "@/components/no-result-state"
import PhotoOutput from "@/components/photo"

function getParameterByName({ name, url }: ParameterByName): string {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, "\\$&")
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)")
  const results = regex.exec(url)
  if (!results) return ""
  if (!results[2]) return ""
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}

const bucketSlug = getParameterByName({
  name: "bucket_slug",
  url: window.location.href,
})
const readKey = getParameterByName({
  name: "read_key",
  url: window.location.href,
})
const writeKey = getParameterByName({
  name: "write_key",
  url: window.location.href,
})

const bucket = createBucketClient({
  bucketSlug: bucketSlug,
  readKey: readKey,
  writeKey: writeKey,
})

export default function IndexPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [photoData, setPhotosData] = useState<PhotoData>({
    adding_media: [],
    added_media: [],
  })
  const [videoData, setVideosData] = useState<VideoData>({
    adding_media: [],
    added_media: [],
  })

  const [videos, setVideos] = useState<Video[]>([])
  const [error, setError] = useState<string>("")

  async function getPhotos(q: string): Promise<void> {
    const query = q
    if (query === "") {
      setPhotos([])
      return
    }
    try {
      await client.photos.search({ query, per_page: 20 }).then((res: any) => {
        const photos = res.photos
        if (!photos) {
          setPhotos([])
        } else {
          setPhotos(photos)
        }
      })
    } catch (e: any) {
      console.log(e)
      setError(`${e.message}`)
    }
  }

  async function getVideos(q: string): Promise<void> {
    const query = q
    if (query === "") {
      setVideos([])
      return
    }
    try {
      await client.videos.search({ query, per_page: 20 }).then((res: any) => {
        const videos = res.videos
        if (!videos) {
          setVideos([])
        } else {
          setVideos(videos)
        }
      })
    } catch (e: any) {
      console.log(e)
      setError(`${e.message}`)
    }
  }

  async function handleAddPhotoToMedia(photo: Photo) {
    const adding_media = [...(photoData.adding_media || []), photo.id]
    setPhotosData({ ...photoData, adding_media })

    try {
      const response = await fetch(photo.src?.original ?? "")
      const blob = await response.blob()
      const media: any = new Blob([blob], {
        type: photo ? "image/jpeg" : "video/mp4",
      })
      media.name = photo.id + ".jpg"
      await bucket.media.insertOne({ media })
      const adding_media = photoData.adding_media?.filter(
        (id: string) => id !== photo.id
      )
      const added_media = [...photoData.added_media, photo.id]
      setPhotosData({ ...photoData, adding_media, added_media })
    } catch (err) {
      console.log(err)
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
      await bucket.media.insertOne({ media })
      const adding_media = videoData.adding_media?.filter(
        (id: string) => id !== video.id
      )
      const added_media = [...(videoData.added_media || []), video.id]
      setVideosData({ ...videoData, adding_media, added_media })
    } catch (err) {
      console.log(err)
    }
  }

  function getButton(media: Photo | Video) {
    const photos = photoData
    if (
      photoData.adding_media &&
      photoData.adding_media.indexOf(media.id) !== -1
    )
      return (
        <div>
          <Button variant="secondary">
            <span className="mr-2">Adding...</span>
            <Loader2 className="animate-spin" />
          </Button>
        </div>
      )
    if (photoData.added_media && photoData.added_media.indexOf(media.id) !== -1)
      return (
        <div>
          <Button variant="secondary">
            <span className="mr-2">Added</span>
            <CheckIcon
              width={20}
              height={20}
              className="text-green-500 dark:text-green-400"
            />
          </Button>
        </div>
      )
    return (
      <div>
        <Button
          variant="secondary"
          onClick={
            photos
              ? () => handleAddPhotoToMedia(media)
              : () => handleAddVideoToMedia(media)
          }
        >
          <span className="mr-2 block sm:hidden md:block">Add to Media</span>
          <span className="mr-2 hidden sm:block md:hidden">Add Media</span>
          <PlusIcon
            width={20}
            height={20}
            className="text-gray-700 dark:text-gray-400"
          />
        </Button>
      </div>
    )
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <main className="mx-auto mt-2 h-full w-full max-w-[1000px] p-2">
        <Tabs selectedTabClassName="bg-white text-black">
          <div className="flex w-full flex-col items-center justify-center">
            <TabList className="flex w-max space-x-4 rounded-2xl bg-[#F7FBFC] p-2 text-black dark:bg-[#11171A] dark:text-white">
              <Tab className="cursor-default rounded-lg p-2" id="photos">
                Photos
              </Tab>
              <Tab className="cursor-default rounded-lg p-2" id="videos">
                Videos
              </Tab>
            </TabList>
          </div>
          <TabPanel>
            <Header>
              <Input
                placeholder="Search free high-resolution photos"
                onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
                  getPhotos(event.currentTarget.value)
                }
              />
            </Header>
            <div>
              {photos && (
                <div className="mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6">
                  {photos.map((photo: Photo) => {
                    return (
                      <div key={photo.id} className="relative w-full">
                        <PhotoOutput src={photo.src!.medium} url={photo.url}>
                          {getButton(photo)}
                        </PhotoOutput>
                      </div>
                    )
                  })}
                </div>
              )}
              {photos.length === 0 && <EmptyState />}
              {error && <NoResultState />}
            </div>
          </TabPanel>
          <TabPanel>
            <Header>
              <Input
                placeholder="Search free high-resolution videos"
                onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
                  getVideos(event.currentTarget.value)
                }
              />
            </Header>
            <div>
              {videos && (
                <div className="mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6">
                  {videos.map((video: Video) => {
                    return (
                      <div key={video.id} className="relative w-full">
                        <PhotoOutput src={video.image!} url={video.url}>
                          {getButton(video)}
                        </PhotoOutput>
                      </div>
                    )
                  })}
                </div>
              )}

              {videos.length === 0 && <EmptyState />}
              {error && <NoResultState />}
            </div>
          </TabPanel>
        </Tabs>
      </main>
    </section>
  )
}
