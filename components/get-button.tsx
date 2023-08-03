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
      <div className="hidden group-hover:block">
        <Button
          variant="secondary"
          className="rounded-full p-3"
          title="Adding..."
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </div>
    )
  if (data.added_media && data.added_media.indexOf(media.id) !== -1)
    return (
      <div className="hidden group-hover:block">
        <Button
          variant="secondary"
          className="rounded-full p-3"
          title="Added to media"
        >
          <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
        </Button>
      </div>
    )
  return (
    <div className="hidden group-hover:block">
      <Button
        className="rounded-full p-3"
        variant="secondary"
        onClick={
          data && handleAddPhotoToMedia
            ? () => handleAddPhotoToMedia(media)
            : data && handleAddVideoToMedia
            ? () => handleAddVideoToMedia(media)
            : () => {}
        }
        title="Add to media"
      >
        <Plus
          width={16}
          height={16}
          className="text-gray-700 dark:text-gray-400"
        />
      </Button>
    </div>
  )
}
