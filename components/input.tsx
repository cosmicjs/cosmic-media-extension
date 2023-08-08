import React from "react"

import { InputProps } from "@/lib/types"

function Input({ placeholder, onKeyUp }: InputProps) {
  return (
    <input
      className="h-12 w-full rounded-lg border-2 border-gray-100 bg-gray-50 p-2 text-neutral-700 selection:bg-gray-200 selection:text-neutral-700 placeholder:text-neutral-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cosmic-blue dark:border-dark-gray-100 dark:bg-dark-gray-50 dark:text-neutral-200 dark:selection:bg-dark-gray-300 selection:dark:text-neutral-300 md:mt-[-7px]"
      id="search-input"
      placeholder={placeholder}
      onKeyUp={onKeyUp}
      autoFocus
    />
  )
}

export default Input
