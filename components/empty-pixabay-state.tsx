import React from "react"

function EmptyPixabayState() {
  return (
    <div className="flex h-[95vh] w-full flex-col justify-start">
      <div className="flex flex-col items-center justify-center space-y-4">
        <svg
          className="h-12 w-12 rounded border border-zinc-200"
          xmlns="http://www.w3.org/2000/svg"
          id="Layer_1"
          data-name="Layer 1"
          viewBox="0 0 657 657"
        >
          <g id="rect3919">
            <path
              fill="white"
              d="M703.5,81.08A34.58,34.58,0,0,0,668.92,46.5H81.08A34.58,34.58,0,0,0,46.5,81.08V668.92A34.58,34.58,0,0,0,81.08,703.5H668.92a34.58,34.58,0,0,0,34.58-34.58Z"
              transform="translate(-46.5 -46.5)"
            />
          </g>
          <path
            id="path3051"
            fill="black"
            d="M258.37,194.23q-53.24,1.38-88.46,37.77t-36.55,91.33V556.77H183V453h75.34q53.25-1.44,88.72-38.06t36.82-91.65q-1.35-55-36.82-91.33T258.37,194.23ZM183,401.72V323.33q.79-33.21,22-55.09t53.37-22.71q32.56.83,53.84,22.71t22.05,55.09Q333.5,357,312.21,379t-53.84,22.74Z"
            transform="translate(-46.5 -46.5)"
          />
          <path
            id="path3053"
            fill="black"
            d="M484.21,356.34H486l69.8,96.11h60.84L521.79,319.36l84.1-125.68H545.05L486,282.39h-1.78l-59-88.71H364.31l84.1,125.68L353.56,452.45h60.86Z"
            transform="translate(-46.5 -46.5)"
          />
        </svg>
        <div className="text-center font-sans text-lg text-neutral-800 dark:text-neutral-200">
          Use the search bar above to find photos from{" "}
          <a href="https://pixabay.com" target="_blank" rel="noreferrer">
            <span className="font-semibold text-[#2AAAE2] decoration-[#2AAAE2]">
              Pixabay
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default EmptyPixabayState
