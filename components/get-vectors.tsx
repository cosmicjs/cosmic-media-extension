"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"

import { PIXABAY_KEY, PIXABAY_SEARCH_URL, cosmic } from "@/lib/data"
import { Bucket, PhotoData, PixabayPhoto } from "@/lib/types"
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
import Header from "./header"
import VectorOutput from "./illustration"
import Input from "./input"
import NoResultState from "./no-result-state"

export default function GetVectors(bucket: Bucket) {
  const searchParams = useSearchParams()
  const pixabay_key = searchParams.get("pexels_key") || PIXABAY_KEY

  const [pixabayVectors, setPixabayVectors] = useState<PixabayPhoto[]>([])
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

  async function searchPixabayVectors(q: string) {
    const query = q
    if (query === "") {
      setPixabayVectors([])
      return
    }
    try {
      await fetch(
        PIXABAY_SEARCH_URL +
          "?key=" +
          pixabay_key +
          "&q=" +
          q +
          "&image_type=illustration" +
          "&per_page=50"
      )
        .then((res) => res.json())
        .then((data) => {
          const photos = data.hits
          if (!photos) {
            setPixabayVectors([])
          } else {
            setPixabayVectors(photos)
          }
        })
    } catch (e: any) {
      console.log(e)
    }
  }

  async function handleAddPixabayIllustrationToMedia(photo: PixabayPhoto) {
    const adding_media = [...(photoData.adding_media || []), photo.id]
    setPhotosData({ ...photoData, adding_media })

    try {
      const response = await fetch(photo.imageURL ?? "")
      const blob = await response.blob()
      const media: any = new Blob([blob], {
        type: "image/jpeg",
      })
      media.name = photo.id + ".jpg"
      await cosmicBucket.media.insertOne({ media })
      const adding_media = photoData.adding_media?.filter(
        (id: string) => id !== photo.id
      )
      const added_media = [...photoData.added_media, photo.id]
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
          placeholder="Search free high-resolution vectors"
          onKeyUp={async (event: React.KeyboardEvent<HTMLInputElement>) => {
            const searchTerm = event.currentTarget.value
            try {
              await Promise.all([searchPixabayVectors(searchTerm)])
            } catch (error) {
              console.error("Error occurred during search:", error)
            }
          }}
        />
      </Header>
      {!pixabayVectors && <NoResultState />}
      {pixabayVectors?.length !== 0 && (
        <div className="3xl:grid-cols-6 mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6 lg:grid-cols-4 2xl:grid-cols-5">
          {pixabayVectors?.map((photo: PixabayPhoto) => (
            <div key={photo.id} className="group relative w-full">
              <VectorOutput
                src={photo.webformatURL}
                url={photo.pageURL}
                provider="Pixabay"
              >
                <GetButton
                  media={photo}
                  handleAddPhotoToMedia={() =>
                    handleAddPixabayIllustrationToMedia(photo)
                  }
                  data={photoData}
                />
              </VectorOutput>
              <Icons.pixabay className="absolute bottom-4 left-4 z-20 h-5" />
              <Overlay />
            </div>
          ))}
        </div>
      )}
      {pixabayVectors?.length === 0 && <EmptyState />}
    </div>
  )
}
