"use client"

import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
// import { mediaFetch } from "@/utils/media-fetch.utils"
import isMobile from "is-mobile"
import { ExternalLink, Loader2, XCircle } from "lucide-react"
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
import { cn, emptyModalData } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
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

import { GlobalContext } from "./content"
import EmptyState from "./empty-state"
import Header from "./header"
import PhotoOutput from "./media/photo"
import Input from "./ui/input"

export default function GetPhotos(bucket: Bucket) {
  const { query, setQuery, debouncedQuery } = useContext(GlobalContext)

  const searchParams = useSearchParams()
  const unsplash_key = searchParams.get("unsplash_key") || UNSPLASH_KEY
  const pexels_key = searchParams.get("pexels_key") || PEXELS_KEY
  const pixabay_key = searchParams.get("pixabay_key") || PIXABAY_KEY
  const [saveError, setSaveError] = useState(false)
  const [serviceFetchError, setServiceFetchError] = useState<string>()
  const [pexelsPhotos, setPexelsPhotos] = useState<Photo[]>([])
  const [pixabayPhotos, setPixabayPhotos] = useState<PixabayPhoto[]>([])
  const [unsplashPhotos, setUnsplashPhotos] = useState<UnsplashPhoto[]>([])
  const [mediaModalData, setMediaModalData] =
    useState<MediaModalData>(emptyModalData)
  const showMobile = useMemo(() => isMobile(), [])

  const cosmicBucket = cosmic(
    bucket.bucket_slug,
    bucket.read_key,
    bucket.write_key
  )

  const [photoData, setPhotosData] = useState<PhotoData>({
    adding_media: [],
    added_media: [],
  })

  const searchUnsplashPhotos = useCallback(
    async (q: string) => {
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
            if (data.errors) {
              setUnsplashPhotos([])
              return setServiceFetchError("Unsplash")
            }
            const photos = data.results
            if (!photos) {
              setUnsplashPhotos([])
            } else {
              setUnsplashPhotos(photos)
            }
          })
      } catch (e: any) {
        setUnsplashPhotos([])
        setServiceFetchError("Unsplash")
        console.log(e)
      }
    },
    [unsplash_key]
  )

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

  const searchPexelsPhotos = useCallback(
    async (q: string) => {
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
        setPexelsPhotos([])
        setServiceFetchError("Pexels")
        console.log(e)
      }
    },
    [pexels_key]
  )

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

  const searchPixabayPhotos = useCallback(
    async (q: string) => {
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
        setPixabayPhotos([])
        setServiceFetchError("Pixabay")
        console.log(e)
      }
    },
    [pixabay_key]
  )

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

  const searchPhotos = useCallback(
    async (searchTerm: string) => {
      try {
        await Promise.allSettled([
          searchUnsplashPhotos(searchTerm),
          searchPexelsPhotos(searchTerm),
          searchPixabayPhotos(searchTerm),
        ])
      } catch (error) {
        console.error("Error occurred during search:", error)
      }
    },
    [searchUnsplashPhotos, searchPexelsPhotos, searchPixabayPhotos]
  )

  useEffect(() => {
    searchPhotos(debouncedQuery)
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
                <div className="relative min-h-[20px] text-left text-left">
                  <div className="pr-20">{mediaModalData.description}</div>
                  <div className="absolute -top-2 right-0 flex">
                    <a
                      href={`${mediaModalData.external_url}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={cn(
                        buttonVariants({ variant: "secondary" }),
                        "mr-2 inline rounded-full p-3"
                      )}
                      title={`View in ${mediaModalData.service}`}
                    >
                      <ExternalLink
                        width={16}
                        height={16}
                        className="text-gray-700 dark:text-gray-400"
                        onClick={(e: React.SyntheticEvent) =>
                          e.stopPropagation()
                        }
                      />
                    </a>
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
                  {mediaModalData.creator && (
                    <div className="mt-2 underline">
                      <a
                        href={mediaModalData.creator.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        by {mediaModalData.creator.name}
                      </a>
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      <Header>
        <Input
          placeholder="Search free high-resolution photos"
          onChange={(event) => {
            const searchTerm = event.target.value
            setServiceFetchError("")
            setQuery(searchTerm)
          }}
          value={query}
        />
        {query && (
          <XCircle
            title="Clear input"
            onClick={() => {
              setQuery("")
              document.getElementById("search-input")?.focus()
            }}
            className="absolute right-2 top-[37%] h-5 w-5 cursor-pointer text-gray-500 sm:right-[12px] sm:top-[23px]"
          />
        )}
        {/* { // TODO add loader
          <Loader2 className="absolute right-[12px] top-[22px] h-5 w-5 animate-spin text-gray-500" />
        } */}
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
                  external_url: photo?.links?.html,
                  name: `${photo.id}-cosmic-media.jpg`,
                  service: "unsplash",
                  creator: {
                    name: `${photo.user.first_name} ${
                      photo.user.last_name ? photo.user.last_name : ""
                    }`,
                    url: photo.user.links.html,
                  },
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
              {showMobile && <Overlay />}
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
                  creator: {
                    name: `${photo.photographer}`,
                    url: photo.photographer_url,
                  },
                  external_url: photo.url,
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
              {showMobile && <Overlay />}
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
                  creator: {
                    name: photo.user,
                    url: `https://pixabay.com/users/${photo.user_id}`,
                  },
                  external_url: photo.pageURL,
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
              {showMobile && <Overlay />}
            </div>
          ))}
        </div>
      )}
      {!query && allPhotos === 0 && <EmptyState />}
      {query && allPhotos === 0 && (
        <div className="w-full text-center">
          <Loader2 className="h-6 w-6 animate-spin absolute top-[200px] right-1/2" />
        </div>
      )}
    </div>
  )
}
