"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import slugify from "slugify"

import { OPEN_AI_KEY } from "@/lib/data"
import { Bucket, Photo, PhotoData } from "@/lib/types"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import GetButton from "@/components/get-button"
import { Icons } from "@/components/icons"
import Overlay from "@/components/overlay"
import { SaveErrorMessage } from "@/components/save-error-message"

import EmptyState from "./empty-state"
import Header from "./header"
import Input from "./input"
import PhotoOutput from "./photo"

const { Configuration, OpenAIApi } = require("openai")

export default function GetPhotos(bucket: Bucket) {
  const searchParams = useSearchParams()
  const openai_key = searchParams.get("openai_key") || OPEN_AI_KEY
  const configuration = new Configuration({
    apiKey: openai_key,
  })
  const openai = new OpenAIApi(configuration)

  const [photos, setPhotos] = useState<Photo[]>([])
  const [generating, setGenerating] = useState(false)
  const [query, setQuery] = useState("")
  const [photoData, setPhotosData] = useState<PhotoData>({
    adding_media: [],
    added_media: [],
  })
  const [saveError, setSaveError] = useState(false)

  async function handleAddAIPhotoToMedia(photo: Photo) {
    const adding_media = [...(photoData.adding_media || []), photo.id]
    setPhotosData({ ...photoData, adding_media })
    const slug = slugify(query)
    const url = photo.url
    try {
      const res = await fetch("/api/upload/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, slug, bucket }),
      })
      const adding_media = photoData.adding_media?.filter(
        (id: string) => id !== photo.id
      )
      if (!res?.ok) {
        setPhotosData({
          adding_media: [],
          added_media: [],
        })
        setSaveError(true)
        return
      }
      const added_media = [...photoData.added_media, photo.id]
      setPhotosData({ ...photoData, adding_media, added_media })
    } catch (e) {
      console.log(e)
    }
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
        n: 8,
        size: "1024x1024",
      })
      const photos = response.data.data
      for (const photo of photos) {
        photo.id = photo.url
      }
      setPhotos(photos)
      setGenerating(false)
    } catch (e: any) {
      console.log(e)
    }
  }
  return (
    <div className="w-full">
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
      <Header>
        <Input
          placeholder="Type a pompt like: A cup of coffee, then press enter."
          onKeyUp={async (event: React.KeyboardEvent<HTMLInputElement>) => {
            const searchTerm = event.currentTarget.value
            try {
              if (event.which === 13) await searchAIPhotos(searchTerm)
            } catch (error) {
              console.error("Error occurred during search:", error)
            }
          }}
        />
      </Header>
      {generating && (
        <div className="flex h-10 justify-center p-6">
          <div className="mr-2">🤖&nbsp;&nbsp;Generating images</div>
          <div className="mt-1">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        </div>
      )}
      {!generating && photos?.length !== 0 && (
        <div className="3xl:grid-cols-6 mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6 lg:grid-cols-4 2xl:grid-cols-5">
          {photos?.map((photo: Photo) => (
            <div key={`ai-${photo.id}`} className="group relative w-full">
              <PhotoOutput src={photo.url} url={photo.url} provider="Unsplash">
                <GetButton
                  media={photo}
                  handleAddPhotoToMedia={handleAddAIPhotoToMedia}
                  data={photoData}
                />
              </PhotoOutput>
              <Icons.openai className="absolute bottom-4 left-4 z-20 h-5" />
              <Overlay />
            </div>
          ))}
        </div>
      )}
      {!generating && photos?.length === 0 && <EmptyState />}
    </div>
  )
}
