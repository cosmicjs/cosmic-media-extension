"use client"

import { useContext, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import isMobile from "is-mobile"
import { Download, Loader2 } from "lucide-react"

import { PIXABAY_KEY, PIXABAY_SEARCH_URL, cosmic } from "@/lib/data"
import { Bucket, MediaModalData, PhotoData, PixabayPhoto } from "@/lib/types"
import { debounce, downloadImage, emptyModalData } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import GetButton from "@/components/get-button"
import { Icons } from "@/components/icons"
import VectorOutput from "@/components/media/illustration"
import { FetchErrorMessage } from "@/components/messages/fetch-error-message"
import { SaveErrorMessage } from "@/components/messages/save-error-message"
import Overlay from "@/components/overlay"

import { GlobalContext } from "./content"
import EmptyState from "./empty-state"
import Header from "./header"
import Input from "./ui/input"

export default function GetIllustrations(bucket: Bucket) {
  const { query, setQuery, debouncedQuery } = useContext(GlobalContext)
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
  const [mediaModalData, setMediaModalData] =
    useState<MediaModalData>(emptyModalData)
  const showMobile = useMemo(() => isMobile(), [])

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
      setPixabayIllustrations([])
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
  useEffect(() => {
    searchPixabayIllustrations(debouncedQuery)
    //eslint-disable-next-line
  }, [debouncedQuery])
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
                        onClick={() =>
                          downloadImage(
                            mediaModalData.download_url
                              ? mediaModalData.download_url
                              : "",
                            mediaModalData.name
                          )
                        }
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="inline">
                      <GetButton
                        media={mediaModalData.photo}
                        handleAddPhotoToMedia={() =>
                          handleAddPixabayIllustrationToMedia(
                            mediaModalData.photo
                          )
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
          value={query}
          placeholder="Search free high-resolution illustrations"
          onChange={(event) => setQuery(event.target.value)}
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
            <div
              key={photo.id}
              className="group relative w-full cursor-zoom-in"
              onClick={() => {
                setMediaModalData({
                  url: photo.largeImageURL,
                  description: photo.tags,
                  photo,
                  download_url: photo?.fullHDURL,
                  name: `${photo.id}-cosmic-media.jpg`,
                  service: "pixabay",
                })
              }}
            >
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
              {showMobile && <Overlay />}
            </div>
          ))}
        </div>
      )}
      {pixabayIllustrations?.length === 0 && <EmptyState />}
    </div>
  )
}
