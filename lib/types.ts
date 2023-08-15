export interface Bucket {
  bucket_slug: string
  read_key: string
  write_key: string
}

export type PhotoProps = {
  src: string
  url: string
  provider: string
  children: React.ReactNode
}

export type VideoProps = {
  src: string
  videoSrc: string
  url: string
  provider: string
  children: React.ReactNode
}

export type InputProps = {
  placeholder: string
  onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void
  
}

export type Photo = {
  [key: string]: any
  id: string
  name: string
  src?: { medium: string; original: string }
  url: string
}

export type UnsplashPhoto = {
  [key: string]: any
  id: string
  name: string
  urls?: { full: string; regular: string }
  url: string
}

export type PixabayPhoto = {
  [key: string]: any
  id: string
  fullHDURL: string
  imageURL: string
  largeImageURL: string
  pageURL: string
  name: string
  url: string
}

export type GiphyImage = {
  id: string
  images: {
    preview_webp: {
      url: string
    }
    downsized_medium: {
      url: string
    }
  }
  url: string
  slug: string
  name: string
}

export type Video = {
  [key: string]: any
  id: string
  name: string
  image?: string
  url: string
}

export type PhotoData = {
  adding_media?: string[]
  added_media: string[]
}

export type VideoData = {
  adding_media?: string[]
  added_media: string[]
}
