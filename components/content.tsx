import { Bucket } from "@/lib/types"

import GetPhotosAndVideos from "./get-photos-and-videos"

export default function Content(bucket: Bucket) {
  return (
    <div className="w-full">
      <GetPhotosAndVideos
        bucket_slug={bucket.bucket_slug}
        read_key={bucket.read_key}
        write_key={bucket.write_key}
      />
    </div>
  )
}
