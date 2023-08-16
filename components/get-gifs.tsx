"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"

import { GIPHY_KEY, GIPHY_SEARCH_URL, cosmic } from "@/lib/data"
import { Bucket, GiphyImage, PhotoData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import GetButton from "@/components/get-button"
import { Icons } from "@/components/icons"
import Overlay from "@/components/overlay"

import EmptyState from "./empty-state"
import GifOutput from "./gif"
import Header from "./header"
import Input from "./input"

export default function GetVectors(bucket: Bucket) {
  const searchParams = useSearchParams()
  const giphy_key = searchParams.get("giphy_key") || GIPHY_KEY

  const [giphyImages, setGiphyImages] = useState<GiphyImage[]>([])
  const [photoData, setPhotosData] = useState<PhotoData>({
    adding_media: [],
    added_media: [],
  })
  const [saveError, setSaveError] = useState(false)

  const cosmicBucket = cosmic(
    bucket.bucket_slug,
    bucket.read_key,
    bucket.write_key
  )

  async function searchGifs(q: string) {
    const query = q
    if (query === "") {
      setGiphyImages([])
      return
    }
    try {
      await fetch(
        GIPHY_SEARCH_URL + "?api_key=" + giphy_key + "&q=" + q + "&limit=50"
      )
        .then((res) => res.json())
        .then((res) => {
          const gifs = res.data
          if (!gifs) {
            setGiphyImages([])
          } else {
            setGiphyImages(gifs)
          }
        })
    } catch (e: any) {
      console.log(e)
    }
  }

  async function handleAddGifToMedia(image: GiphyImage) {
    const adding_media = [...(photoData.adding_media || []), image.id]
    setPhotosData({ ...photoData, adding_media })

    try {
      const response = await fetch(image?.images?.downsized_medium?.url ?? "")
      const blob = await response.blob()
      const media: any = new Blob([blob], {
        type: "image/gif",
      })
      media.name = image.id + ".gif"
      await cosmicBucket.media.insertOne({ media })
      const adding_media = photoData.adding_media?.filter(
        (id: string) => id !== image.id
      )
      const added_media = [...photoData.added_media, image.id]
      setPhotosData({ ...photoData, adding_media, added_media })
    } catch (err) {
      console.log(err)
      setSaveError(true)
      setPhotosData({
        adding_media: [],
        added_media: [],
      })
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
            <DialogHeader>
              <DialogTitle className="mb-4">
                <AlertCircle className="mr-2 inline-block" />
                Your media did not save
              </DialogTitle>
              <DialogDescription>
                <div className="mb-6">
                  You will need to open this extension from your Cosmic
                  dashboard to save media. Go to your Project / Bucket /
                  Extensions.
                </div>
                <div className="text-right">
                  <a
                    href="https://app.cosmicjs.com/login"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Button>Log in to Cosmic</Button>
                  </a>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      <Header>
        <Input
          placeholder="Search free gifs"
          onKeyUp={async (event: React.KeyboardEvent<HTMLInputElement>) => {
            const searchTerm = event.currentTarget.value
            try {
              await searchGifs(searchTerm)
            } catch (error) {
              console.error("Error occurred during search:", error)
            }
          }}
        />
      </Header>
      {giphyImages?.length !== 0 && (
        <div className="3xl:grid-cols-6 mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6 lg:grid-cols-4 2xl:grid-cols-5">
          {giphyImages?.map((image: GiphyImage) => (
            <div key={image.id} className="group relative w-full">
              <GifOutput
                src={image?.images?.preview_webp?.url}
                url={image?.url}
                provider="Pixabay"
              >
                <GetButton
                  media={image}
                  handleAddPhotoToMedia={() => handleAddGifToMedia(image)}
                  data={photoData}
                />
              </GifOutput>
              <Icons.giphy className="absolute bottom-4 left-4 z-20 h-5" />
              <Overlay />
            </div>
          ))}
        </div>
      )}
      {giphyImages?.length === 0 && <EmptyState />}
    </div>
  )
}
