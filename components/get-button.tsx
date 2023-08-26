"use client"

import { Check, Download, Loader2 } from "lucide-react"

import {
  GiphyImage,
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
  isZoom,
}: {
  data: PhotoData
  media: Photo | UnsplashPhoto | PixabayPhoto | Video | GiphyImage
  handleAddPhotoToMedia?: (
    photo: Photo | UnsplashPhoto | PixabayPhoto | UnsplashPhoto
  ) => void
  handleAddVideoToMedia?: (video: Video) => void
  isZoom?: boolean
}) {
  if (data.adding_media && data.adding_media.indexOf(media.id) !== -1)
    return (
      <div>
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
      <div onClick={(e: React.SyntheticEvent) => e.stopPropagation()}>
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
    <div
      className={isZoom ? "" : "hidden group-hover:block"}
      onClick={(e: React.SyntheticEvent) => e.stopPropagation()}
    >
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
        <Download
          width={16}
          height={16}
          className="text-gray-700 dark:text-gray-400"
        />
      </Button>
    </div>
  )
}
