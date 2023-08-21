"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { PIXABAY_KEY, PIXABAY_SEARCH_URL, cosmic } from "@/lib/data"
import { Bucket, PhotoData, PixabayPhoto } from "@/lib/types"
import { debounce } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import GetButton from "@/components/get-button"
import { Icons } from "@/components/icons"
import VectorOutput from "@/components/media/illustration"
import { FetchErrorMessage } from "@/components/messages/fetch-error-message"
import { SaveErrorMessage } from "@/components/messages/save-error-message"
import Overlay from "@/components/overlay"

import EmptyState from "./empty-state"
import Header from "./header"
import Input from "./ui/input"

export default function GetIllustrations(bucket: Bucket) {
  const searchParams = useSearchParams()
  const pixabay_key = searchParams.get("pexels_key") || PIXABAY_KEY

  const [pixabayIllustrations, setPixabayIllustrations] = useState<
    PixabayPhoto[]
  >([])
  const [photoData, setPhotosData] = useState<PhotoData>({
    adding_media: [],
    added_media: [],
  })
  const [saveError, setSaveError] = useState(false)
  const [serviceFetchError, setServiceFetchError] = useState<string>()

  const cosmicBucket = cosmic(
    bucket.bucket_slug,
    bucket.read_key,
    bucket.write_key
  )

  async function searchPixabayIllustrations(q: string) {
    debounce(() => setServiceFetchError(""))
    const query = q
    if (query === "") {
      setPixabayIllustrations([])
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
          "&per_page=80"
      )
        .then((res) => res.json())
        .then((data) => {
          const photos = data.hits
          if (!photos) {
            setPixabayIllustrations([])
          } else {
            setPixabayIllustrations(photos)
          }
        })
    } catch (e: any) {
      setServiceFetchError("Pixabay")
      console.log(e)
    }
  }

  async function handleAddPixabayIllustrationToMedia(photo: PixabayPhoto) {
    if (!bucket.bucket_slug) return setSaveError(true)
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
      setPhotosData({ adding_media: [], added_media: [] })
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
          placeholder="Search free high-resolution illustrations"
          onKeyUp={async (event: React.KeyboardEvent<HTMLInputElement>) => {
            const searchTerm = event.currentTarget.value
            try {
              await searchPixabayIllustrations(searchTerm)
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
      {pixabayIllustrations?.length !== 0 && (
        <div className="3xl:grid-cols-6 mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6 lg:grid-cols-4 2xl:grid-cols-5">
          {pixabayIllustrations?.map((photo: PixabayPhoto) => (
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
      {pixabayIllustrations?.length === 0 && <EmptyState />}
    </div>
  )
}
