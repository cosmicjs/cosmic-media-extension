"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import slugify from "slugify"

import { Bucket, Photo, PhotoData } from "@/lib/types"
import GetButton from "@/components/get-button"

import EmptyState from "./empty-state"
import Header from "./header"
import Input from "./input"
import NoResultState from "./no-result-state"
import PhotoOutput from "./photo"

const { Configuration, OpenAIApi } = require("openai")
const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default function GetPhotos(bucket: Bucket) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [generating, setGenerating] = useState(false)
  const [query, setQuery] = useState("")
  const [photoData, setPhotosData] = useState<PhotoData>({
    adding_media: [],
    added_media: [],
  })

  async function handleAddAIPhotoToMedia(photo: Photo) {
    const adding_media = [...(photoData.adding_media || []), photo.id]
    setPhotosData({ ...photoData, adding_media })
    const slug = slugify(query)
    const url = photo.url
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, slug, bucket }),
      })
      const adding_media = photoData.adding_media?.filter(
        (url: string) => url !== photo.url
      )
      const added_media = [...photoData.added_media, photo.id]
      setPhotosData({ ...photoData, adding_media, added_media })
      console.log(res)
    } catch (e) {
      console.log(e)
    }
    // try {
    //   const response = await fetch(photo.url ?? "")
    //   const blob = await response.blob()
    //   const media: any = new Blob([blob], {
    //     type: "image/jpeg",
    //   })
    //   media.name = slugify(query) + ".jpg"
    //   await cosmicBucket.media.insertOne({ media })
    //   const adding_media = photoData.adding_media?.filter(
    //     (id: string) => id !== photo.id
    //   )
    //   const added_media = [...photoData.added_media, photo.id]
    //   setPhotosData({ ...photoData, adding_media, added_media })
    // } catch (err) {
    //   console.log(err)
    // }
  }

  async function searchAIPhotos(q: string) {
    const query = q
    setQuery(query)
    if (query === "") {
      setPhotos([])
      return
    }
    try {
      setGenerating(true)
      const response = await openai.createImage({
        prompt: q,
        n: 6,
        size: "1024x1024",
      })
      const data = response.data.data
      setPhotos(data)
      setGenerating(false)
    } catch (e: any) {
      console.log(e)
    }
  }

  return (
    <div className="w-full">
      <Header>
        {!generating && (
          <Input
            placeholder="Type a pompt like: An astronaut riding a rocket into a volcano, then press enter."
            onKeyUp={async (event: React.KeyboardEvent<HTMLInputElement>) => {
              const searchTerm = event.currentTarget.value
              try {
                if (event.which === 13) await searchAIPhotos(searchTerm)
              } catch (error) {
                console.error("Error occurred during search:", error)
              }
            }}
          />
        )}
        {generating && (
          <div className="flex">
            <div className="mr-2">Generating image</div>
            <div className="mt-1">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </Header>
      {!photos && <NoResultState />}
      <div className="mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6">
        {photos?.map((photo: Photo) => (
          <div key={`ai-${photo.url}`} className="group relative w-full">
            <PhotoOutput src={photo.url} url={photo.url} provider="Unsplash">
              <GetButton
                media={photo}
                handleAddPhotoToMedia={() => handleAddAIPhotoToMedia(photo)}
                data={photoData}
              />
            </PhotoOutput>
          </div>
        ))}
      </div>
      {photos?.length === 0 && <EmptyState />}
    </div>
  )
}
