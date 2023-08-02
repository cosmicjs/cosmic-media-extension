"use client"

import { Check, Loader2, Plus } from "lucide-react"

import {
  Photo,
  PhotoData,
  PixabayPhoto,
  UnsplashPhoto,
  Video,
} from "@/lib/types"
import { Button } from "@/components/ui/button"

export default function GetButton({
  data,
  media,
  handleAddPhotoToMedia,
  handleAddVideoToMedia,
}: {
  data: PhotoData
  media: Photo | UnsplashPhoto | PixabayPhoto | Video
  handleAddPhotoToMedia?: (
    photo: Photo | UnsplashPhoto | PixabayPhoto | UnsplashPhoto
  ) => void
  handleAddVideoToMedia?: (video: Video) => void
}) {
  if (data.adding_media && data.adding_media.indexOf(media.id) !== -1)
    return (
      <div>
        <Button variant="secondary">
          <span className="mr-2">Adding...</span>
          <Loader2 className="animate-spin" />
        </Button>
      </div>
    )
  if (data.added_media && data.added_media.indexOf(media.id) !== -1)
    return (
      <div>
        <Button variant="secondary">
          <span className="mr-2">Added</span>
          <Check
            width={20}
            height={20}
            className="text-green-500 dark:text-green-400"
          />
        </Button>
      </div>
    )
  return (
    <div>
      <Button
        variant="secondary"
        onClick={
          data && handleAddPhotoToMedia
            ? () => handleAddPhotoToMedia(media)
            : data && handleAddVideoToMedia
            ? () => handleAddVideoToMedia(media)
            : () => {}
        }
      >
        <span className="mr-2 block sm:hidden md:block">Add to Media</span>
        <span className="mr-2 hidden sm:block md:hidden">Add Media</span>
        <Plus
          width={20}
          height={20}
          className="text-gray-700 dark:text-gray-400"
        />
      </Button>
    </div>
  )
}
