"use client"

import { useState } from "react"

import {
  PEXELS_CLIENT,
  PIXABAY_KEY,
  PIXABAY_SEARCH_URL,
  UNSPLASH_ACCESS_KEY,
  UNSPLASH_SEARCH_URL,
  cosmic,
} from "@/lib/data"
import {
  Bucket,
  Photo,
  PhotoData,
  PixabayPhoto,
  UnsplashPhoto,
} from "@/lib/types"
import GetButton from "@/components/get-button"
import { Icons } from "@/components/icons"
import Overlay from "@/components/overlay"

import EmptyState from "./empty-state"
import Header from "./header"
import Input from "./input"
import NoResultState from "./no-result-state"
import PhotoOutput from "./photo"

export default function GetPhotos(bucket: Bucket) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [pixabayPhotos, setPixabayPhotos] = useState<PixabayPhoto[]>([])
  const [unsplashPhotos, setUnsplashPhotos] = useState<UnsplashPhoto[]>([])
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
          UNSPLASH_ACCESS_KEY +
          "&query=" +
          q +
          "&per_page=50"
      )
        .then((res) => res.json())
        .then((data) => {
          const photos = data.results
          if (!photos) {
            setUnsplashPhotos([])
          } else {
            setUnsplashPhotos(photos)
          }
        })
    } catch (e: any) {
      console.log(e)
    }
  }

  async function handleAddUnsplashPhotoToMedia(photo: UnsplashPhoto) {
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
      console.log("added_media:", added_media)
      setPhotosData({ ...photoData, adding_media, added_media })
    } catch (err) {
      console.log(err)
    }
  }

  async function searchPexelsPhotos(q: string) {
    const query = q
    if (query === "") {
      setPhotos([])
      return
    }
    try {
      await PEXELS_CLIENT.photos
        .search({ query, per_page: 20 })
        .then((res: any) => {
          const photos = res.photos
          if (!photos) {
            setPhotos([])
          } else {
            setPhotos(photos)
          }
        })
    } catch (e: any) {
      console.log(e)
    }
  }

  async function handleAddPexelsPhotoToMedia(photo: Photo) {
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
      console.log(err)
    }
  }

  async function searchPixabayPhotos(q: string) {
    const query = q
    if (query === "") {
      setPhotos([])
      return
    }
    try {
      await fetch(
        PIXABAY_SEARCH_URL +
          "?key=" +
          PIXABAY_KEY +
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
      console.log(e)
    }
  }

  async function handleAddPixabayPhotoToMedia(photo: PixabayPhoto) {
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
    }
  }

  return (
    <div className="w-full">
      <Header>
        <Input
          placeholder="Search free high-resolution photos"
          onKeyUp={async (event: React.KeyboardEvent<HTMLInputElement>) => {
            const searchTerm = event.currentTarget.value
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
      {!photos && <NoResultState />}
      {photos.length !== 0 && (
        <div className="3xl:grid-cols-6 mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6 lg:grid-cols-4 2xl:grid-cols-5">
          {unsplashPhotos?.map((photo: UnsplashPhoto) => (
            <div key={`unsplash-${photo.id}`} className="group relative w-full">
              <PhotoOutput
                src={photo.urls!.regular}
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
          {photos?.map((photo: Photo) => (
            <div key={`pexels-${photo.id}`} className="group relative w-full">
              <PhotoOutput
                src={photo.src!.medium}
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
            <div key={`pixabay-${photo.id}`} className="group relative w-full">
              <PhotoOutput
                src={photo.fullHDURL}
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
      {photos?.length === 0 && <EmptyState />}
    </div>
  )
}
