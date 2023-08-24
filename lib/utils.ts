import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce(fn: Function, ms = 500) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

export async function downloadImage(imageSrc: string, name: string) {
  const image = await fetch(imageSrc)
  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)

  const link = document.createElement("a")
  link.href = imageURL
  link.download = name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const emptyModalData = {
  url: "",
  description: "",
  download_url: "",
  name: "",
  service: "",
  photo: "",
}
