export type PhotoProps = {
  src: string
  url: string
  children: React.ReactNode
}

export type InputProps = {
  placeholder: string
  onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

export interface ParameterByName {
  name: string
  url?: string
}

export type Photo = {
  [key: string]: any
  id: string
  name: string
  src?: { medium: string; original: string }
  url: string
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
