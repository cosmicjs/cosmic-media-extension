"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Download, Loader2 } from "lucide-react"
import { createClient } from "pexels"

import {
  PEXELS_KEY,
  PIXABAY_KEY,
  PIXABAY_SEARCH_URL,
  UNSPLASH_KEY,
  UNSPLASH_SEARCH_URL,
  cosmic,
} from "@/lib/data"
import {
  Bucket,
  MediaModalData,
  Photo,
  PhotoData,
  PixabayPhoto,
  UnsplashPhoto,
} from "@/lib/types"
import { downloadImage, emptyModalData } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog"
import { FetchErrorMessage } from "@/components/fetch-error-message"
import GetButton from "@/components/get-button"
import { Icons } from "@/components/icons"
import Overlay from "@/components/overlay"
import { SaveErrorMessage } from "@/components/save-error-message"

import EmptyState from "./empty-state"
import Header from "./header"
import PhotoOutput from "./media/photo"
import Input from "./ui/input"

export default function GetPhotos(bucket: Bucket) {
  const searchParams = useSearchParams()
  const unsplash_key = searchParams.get("unsplash_key") || UNSPLASH_KEY
  const pexels_key = searchParams.get("pexels_key") || PEXELS_KEY
  const pixabay_key = searchParams.get("pixabay_key") || PIXABAY_KEY
  const [saveError, setSaveError] = useState(false)
  const [serviceFetchError, setServiceFetchError] = useState<string>()
  const [pexelsPhotos, setPexelsPhotos] = useState<Photo[]>([])
  const [pixabayPhotos, setPixabayPhotos] = useState<PixabayPhoto[]>([])
  const [unsplashPhotos, setUnsplashPhotos] = useState<UnsplashPhoto[]>([])
  const [mediaModalData, setMediaModalData] = useState<MediaModalData>()
  const [photoData, setPhotosData] = useState<PhotoData>({
    adding_media: [],
    added_media: [],
  })

  const cosmicBucket = cosmic(
    bucket.bucket_slug,
    bucket.read_key,
    bucket.write_key
  )

  async function searchUnsplashPhotos(q: string) {
    const query = q
    if (query === "") {
      setUnsplashPhotos([])
      return
    }
    try {
      await fetch(
        UNSPLASH_SEARCH_URL +
          "?client_id=" +
          unsplash_key +
          "&query=" +
          q +
          "&per_page=50"
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.errors) return setServiceFetchError("Unsplash")
          const photos = data.results
          if (!photos) {
            setUnsplashPhotos([])
          } else {
            setUnsplashPhotos(photos)
          }
        })
    } catch (e: any) {
      setServiceFetchError("Unsplash")
      console.log(e)
    }
  }

  async function handleAddUnsplashPhotoToMedia(photo: UnsplashPhoto) {
    if (!bucket.bucket_slug) return setSaveError(true)
    const adding_media = [...(photoData.adding_media || []), photo.id]
    setPhotosData({ ...photoData, adding_media })

    try {
      const response = await fetch(photo.urls?.full ?? "")
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

  async function searchPexelsPhotos(q: string) {
    const query = q
    if (query === "") {
      setPexelsPhotos([])
      return
    }
    try {
      const pexelsClient = createClient(pexels_key || "")
      await pexelsClient.photos
        .search({ query, per_page: 20 })
        .then((res: any) => {
          const photos = res.photos
          if (!photos) {
            setPexelsPhotos([])
          } else {
            setPexelsPhotos(photos)
          }
        })
    } catch (e: any) {
      setServiceFetchError("Pexels")
      console.log(e)
    }
  }

  async function handleAddPexelsPhotoToMedia(photo: Photo) {
    if (!bucket.bucket_slug) return setSaveError(true)
    const adding_media = [...(photoData.adding_media || []), photo.id]
    setPhotosData({ ...photoData, adding_media })

    try {
      const response = await fetch(photo.src?.original ?? "")
      const blob = await response.blob()
      const media: any = new Blob([blob], {
        type: photo ? "image/jpeg" : "video/mp4",
      })
      media.name = photo.id + ".jpg"
      await cosmicBucket.media.insertOne({ media })
      const adding_media = photoData.adding_media?.filter(
        (id: string) => id !== photo.id
      )
      const added_media = [...photoData.added_media, photo.id]
      setPhotosData({ ...photoData, adding_media, added_media })
    } catch (err) {
      setSaveError(true)
      console.log(err)
    }
  }

  async function searchPixabayPhotos(q: string) {
    const query = q
    if (query === "") {
      setPixabayPhotos([])
      return
    }
    try {
      await fetch(
        PIXABAY_SEARCH_URL +
          "?key=" +
          pixabay_key +
          "&q=" +
          q +
          "&image_type=photo" +
          "&per_page=50"
      )
        .then((res) => res.json())
        .then((data) => {
          const photos = data.hits
          if (!photos) {
            setPixabayPhotos([])
          } else {
            setPixabayPhotos(photos)
          }
        })
    } catch (e: any) {
      setServiceFetchError("Pixabay")
      console.log(e)
    }
  }

  async function handleAddPixabayPhotoToMedia(photo: PixabayPhoto) {
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
      setSaveError(true)
      console.log(err)
    }
  }
  const allPhotos = [...pexelsPhotos, ...pixabayPhotos, ...unsplashPhotos]
    .length
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
      {mediaModalData && (
        <Dialog open onOpenChange={() => setMediaModalData(emptyModalData)}>
          <DialogContent
            onInteractOutside={() => setMediaModalData(emptyModalData)}
            onEscapeKeyDown={() => setMediaModalData(emptyModalData)}
            className="max-w-[70vw]"
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
                <div className="relative">
                  <div className="pr-20">{mediaModalData.description}</div>
                  <div className="absolute -top-2 right-0 flex">
                    <Button
                      variant="secondary"
                      className="mr-2 inline rounded-full p-3"
                      title="Download"
                      onClick={() =>
                        downloadImage(
                          mediaModalData.download_url,
                          mediaModalData.name
                        )
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <div className="inline">
                      <GetButton
                        media={mediaModalData.photo}
                        handleAddPhotoToMedia={() => {
                          if (mediaModalData.service === "unsplash")
                            handleAddUnsplashPhotoToMedia(mediaModalData.photo)
                          if (mediaModalData.service === "pexels")
                            handleAddPexelsPhotoToMedia(mediaModalData.photo)
                          if (mediaModalData.service === "pixabay")
                            handleAddPixabayPhotoToMedia(mediaModalData.photo)
                        }}
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
          placeholder="Search free high-resolution photos"
          onKeyUp={async (event: React.KeyboardEvent<HTMLInputElement>) => {
            const searchTerm = event.currentTarget.value
            setServiceFetchError("")
            try {
              await Promise.all([
                searchUnsplashPhotos(searchTerm),
                searchPexelsPhotos(searchTerm),
                searchPixabayPhotos(searchTerm),
              ])
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
      {allPhotos !== 0 && (
        <div className="3xl:grid-cols-6 mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6 lg:grid-cols-4 2xl:grid-cols-5">
          {unsplashPhotos?.map((photo: UnsplashPhoto) => (
            <div
              key={`unsplash-${photo.id}`}
              className="group relative w-full cursor-zoom-in"
              onClick={() => {
                setMediaModalData({
                  url: photo?.urls?.regular,
                  description: photo.description
                    ? photo.description
                    : photo.alt_description,
                  photo,
                  download_url: photo?.urls?.full,
                  name: `${photo.id}-cosmic-media.jpg`,
                  service: "unsplash",
                })
              }}
            >
              <PhotoOutput
                src={photo.urls!.small}
                url={photo.links.html}
                provider="Unsplash"
              >
                <GetButton
                  media={photo}
                  handleAddPhotoToMedia={() =>
                    handleAddUnsplashPhotoToMedia(photo)
                  }
                  data={photoData}
                />
              </PhotoOutput>
              <Icons.unsplash className="absolute bottom-4 left-4 z-20 h-5" />
              <Overlay />
            </div>
          ))}
          {pexelsPhotos?.map((photo: Photo) => (
            <div
              key={`pexels-${photo.id}`}
              className="group relative w-full cursor-zoom-in"
              onClick={() => {
                setMediaModalData({
                  url: photo.src!.large2x,
                  description: photo.alt,
                  photo,
                  download_url: photo?.src?.large2x,
                  name: `${photo.id}-cosmic-media.jpg`,
                  service: "pexels",
                })
              }}
            >
              <PhotoOutput
                src={photo.src!.large}
                url={photo.url}
                provider="Pexels"
              >
                <GetButton
                  media={photo}
                  handleAddPhotoToMedia={() =>
                    handleAddPexelsPhotoToMedia(photo)
                  }
                  data={photoData}
                />
              </PhotoOutput>
              <Icons.pexels className="absolute -left-6 bottom-4 z-20 h-5" />
              <Overlay />
            </div>
          ))}
          {pixabayPhotos?.map((photo: PixabayPhoto) => (
            <div
              key={`pixabay-${photo.id}`}
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
              <PhotoOutput
                src={photo.webformatURL}
                url={photo.pageURL}
                provider="Pixabay"
              >
                <GetButton
                  media={photo}
                  handleAddPhotoToMedia={() =>
                    handleAddPixabayPhotoToMedia(photo)
                  }
                  data={photoData}
                />
              </PhotoOutput>
              <Icons.pixabay className="absolute bottom-4 left-4 z-20 h-5" />
              <Overlay />
            </div>
          ))}
        </div>
      )}
      {allPhotos === 0 && <EmptyState />}
    </div>
  )
}
