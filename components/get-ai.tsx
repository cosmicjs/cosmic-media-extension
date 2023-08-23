"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import isMobile from "is-mobile"
import { Download, Loader2 } from "lucide-react"
import slugify from "slugify"

import { OPEN_AI_KEY } from "@/lib/data"
import { Bucket, MediaModalData, Photo, PhotoData } from "@/lib/types"
import { emptyModalData } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import GetButton from "@/components/get-button"
import { Icons } from "@/components/icons"
import { FetchErrorMessage } from "@/components/messages/fetch-error-message"
import { SaveErrorMessage } from "@/components/messages/save-error-message"
import Overlay from "@/components/overlay"

import EmptyState from "./empty-state"
import Header from "./header"
import PhotoOutput from "./media/photo"
import Input from "./ui/input"

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
  const [serviceFetchError, setServiceFetchError] = useState<string>()
  const [mediaModalData, setMediaModalData] =
    useState<MediaModalData>(emptyModalData)
  const showMobile = useMemo(() => isMobile(), [])

  async function handleAddAIPhotoToMedia(photo: Photo) {
    if (!bucket.bucket_slug) return setSaveError(true)
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
    setServiceFetchError("")
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
      setGenerating(false)
      setServiceFetchError("OpenAI")
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
                  <img
                    src={mediaModalData.url}
                    alt={mediaModalData.description}
                    loading="lazy"
                    className={`relative z-10 h-full max-h-[70vh] w-full rounded-2xl object-cover`}
                  />
                  <div className="absolute top-1/2 z-0 grid w-full place-items-center text-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </div>
                <div className="relative min-h-[20px]">
                  <div className="pr-20">{mediaModalData.description}</div>
                  <div className="absolute -top-2 right-0 flex">
                    {mediaModalData.download_url && (
                      <Button
                        variant="secondary"
                        className="mr-2 inline rounded-full p-3"
                        title="Download"
                        onClick={() => window.open(mediaModalData.download_url)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="inline">
                      <GetButton
                        media={mediaModalData.photo}
                        handleAddPhotoToMedia={() =>
                          handleAddAIPhotoToMedia(mediaModalData.photo)
                        }
                        isZoom
                        data={photoData}
                      />
                    </div>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
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
      {serviceFetchError && (
        <div className="m-auto max-w-3xl text-left">
          <FetchErrorMessage service={serviceFetchError} />
        </div>
      )}
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
            <div
              key={`ai-${photo.id}`}
              className="group relative w-full cursor-zoom-in"
              onClick={() => {
                setMediaModalData({
                  url: photo.url,
                  description: query,
                  photo: photo,
                  download_url: photo.url,
                  name: `${photo.id}-cosmic-media.jpg`,
                  service: "OpenAI",
                })
              }}
            >
              <PhotoOutput src={photo.url} url={photo.url} provider="Unsplash">
                <GetButton
                  media={photo}
                  handleAddPhotoToMedia={handleAddAIPhotoToMedia}
                  data={photoData}
                />
              </PhotoOutput>
              <Icons.openai className="absolute bottom-4 left-4 z-20 h-5" />
              {showMobile && <Overlay />}
            </div>
          ))}
        </div>
      )}
      {!generating && photos?.length === 0 && <EmptyState />}
    </div>
  )
}
