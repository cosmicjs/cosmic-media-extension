import React from "react"

export default function EmptyState() {
  return (
    <div className="flex h-[95vh] w-full flex-col justify-start">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-center font-sans text-lg text-neutral-800 dark:text-neutral-200">
          Use the search bar above to find media
        </div>
      </div>
    </div>
  )
}
