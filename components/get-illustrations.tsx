"use client"

import { useState } from "react"

import { PIXABAY_KEY, PIXABAY_SEARCH_URL, cosmic } from "@/lib/data"
import { Bucket, PhotoData, PixabayPhoto } from "@/lib/types"
import GetButton from "@/components/get-button"

import EmptyState from "./empty-state"
import Header from "./header"
import VectorOutput from "./illustration"
import Input from "./input"
import NoResultState from "./no-result-state"

export default function GetIllustrations(bucket: Bucket) {
  const [pixabayIllustrations, setPixabayIllustrations] = useState<
    PixabayPhoto[]
  >([])
  const [photoData, setPhotosData] = useState<PhotoData>({
    adding_media: [],
    added_media: [],
  })

  const cosmicBucket = cosmic(
    bucket.bucket_slug,
    bucket.read_key,
    bucket.write_key
  )

  async function searchPixabayIllustrations(q: string) {
    const query = q
    if (query === "") {
      setPixabayIllustrations([])
      return
    }
    try {
      await fetch(
        PIXABAY_SEARCH_URL +
          "?key=" +
          PIXABAY_KEY +
          "&q=" +
          q +
          "&image_type=illustration" +
          "&per_page=50"
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
    }
  }

  return (
    <div className="w-full">
      <Header>
        <Input
          placeholder="Search free high-resolution illustrations"
          onKeyUp={async (event: React.KeyboardEvent<HTMLInputElement>) => {
            const searchTerm = event.currentTarget.value
            try {
              await Promise.all([searchPixabayIllustrations(searchTerm)])
            } catch (error) {
              console.error("Error occurred during search:", error)
            }
          }}
        />
      </Header>
      {!pixabayIllustrations && <NoResultState />}
      <div className="mt-4 grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:mt-6">
        {pixabayIllustrations?.map((photo: PixabayPhoto) => (
          <div key={photo.id} className="relative w-full">
            <VectorOutput
              src={photo.fullHDURL}
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
          </div>
        ))}
      </div>
      {pixabayIllustrations?.length === 0 && <EmptyState />}
    </div>
  )
}
