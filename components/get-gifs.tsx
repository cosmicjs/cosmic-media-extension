"use client"

import { useContext, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import isMobile from "is-mobile"
import { ExternalLink, Loader2, XCircle } from "lucide-react"

import { GIPHY_KEY, GIPHY_SEARCH_URL, cosmic } from "@/lib/data"
import { Bucket, GiphyImage, MediaModalData, PhotoData } from "@/lib/types"
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
import GifOutput from "@/components/media/gif"
import { FetchErrorMessage } from "@/components/messages/fetch-error-message"
import { SaveErrorMessage } from "@/components/messages/save-error-message"
import Overlay from "@/components/overlay"

import { GlobalContext } from "./content"
import EmptyState from "./empty-state"
import Header from "./header"
import Input from "./ui/input"

export default function GetGifs(bucket: Bucket) {
  const { query, setQuery, debouncedQuery } = useContext(GlobalContext)
  const searchParams = useSearchParams()
  const giphy_key = searchParams.get("giphy_key") || GIPHY_KEY

  const [giphyImages, setGiphyImages] = useState<GiphyImage[]>([])
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

  async function searchGifs(q: string) {
    setServiceFetchError("")
    const query = q
    if (query === "") {
      setGiphyImages([])
      return
    }
    try {
      await fetch(
        GIPHY_SEARCH_URL + "?api_key=" + giphy_key + "&q=" + q + "&limit=80"
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.meta.status !== 200) setServiceFetchError("Giphy")
          const gifs = res.data
          if (!gifs) {
            setGiphyImages([])
          } else {
            setGiphyImages(gifs)
          }
        })
    } catch (e: any) {
      setGiphyImages([])
      setServiceFetchError("Giphy")
      console.log(e)
    }
  }

  async function handleAddGifToMedia(image: GiphyImage) {
    if (!bucket.bucket_slug) return setSaveError(true)
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
  useEffect(() => {
    searchGifs(debouncedQuery)
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
                <div className="relative min-h-[20px] text-left">
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
                        handleAddPhotoToMedia={() =>
                          handleAddGifToMedia(mediaModalData.photo)
                        }
                        isZoom
                        data={photoData}
                      />
                    </div>
                  </div>
                  {mediaModalData?.creator?.name && (
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
          value={query}
          placeholder="Search free gifs"
          onChange={(event) => setQuery(event.target.value)}
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
      {giphyImages?.length !== 0 && (
        <div className="3xl:grid-cols-6 mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6 lg:grid-cols-4 2xl:grid-cols-5">
          {giphyImages?.map((image: GiphyImage) => (
            <div
              key={image.id}
              className="group relative w-full cursor-zoom-in"
              onClick={() => {
                setMediaModalData({
                  url: image?.images?.downsized_medium?.url,
                  description: image?.title,
                  photo: image,
                  download_url: image?.images?.downsized_medium?.url,
                  name: `${image.id}-cosmic-media.gif`,
                  service: "giphy",
                  external_url: image.url,
                  creator: {
                    name: image?.user?.display_name,
                    url: image?.user?.profile_url,
                  },
                })
              }}
            >
              <GifOutput
                src={image?.images?.preview_webp?.url}
                url={image?.url}
                provider="Giphy"
              >
                <GetButton
                  media={image}
                  handleAddPhotoToMedia={() => handleAddGifToMedia(image)}
                  data={photoData}
                />
              </GifOutput>
              <Icons.giphy className="absolute bottom-4 left-4 z-20 h-5" />
              {showMobile && <Overlay />}
            </div>
          ))}
        </div>
      )}
      {!query && giphyImages?.length === 0 && <EmptyState />}
      {!serviceFetchError && query && giphyImages?.length === 0 && (
        <div className="w-full text-center">
          <Loader2 className="absolute right-1/2 top-[200px] h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  )
}
