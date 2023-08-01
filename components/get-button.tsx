"use client"

import { Check, Loader2, Plus } from "lucide-react"

import { Photo, PhotoData, Video } from "@/lib/types"
import { Button } from "@/components/ui/button"

export default function GetButton({
  photoData,
  media,
  handleAddPhotoToMedia,
  handleAddVideoToMedia,
}: {
  photoData: PhotoData
  media: Photo | Video
  handleAddPhotoToMedia?: (photo: Photo) => void
  handleAddVideoToMedia?: (video: Video) => void
}) {
  if (photoData.adding_media && photoData.adding_media.indexOf(media.id) !== -1)
    return (
      <div>
        <Button variant="secondary">
          <span className="mr-2">Adding...</span>
          <Loader2 className="animate-spin" />
        </Button>
      </div>
    )
  if (photoData.added_media && photoData.added_media.indexOf(media.id) !== -1)
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
          photoData && handleAddPhotoToMedia
            ? () => handleAddPhotoToMedia(media)
            : photoData && handleAddVideoToMedia
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
