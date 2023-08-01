import React from "react";

function EmptyUnsplashState() {
  return (
    <div className="flex h-[95vh] w-full flex-col justify-start">
      <div className="flex flex-col items-center justify-center space-y-4">
        <svg
          className="h-8 w-8 fill-black dark:fill-white"
          width="32"
          height="32"
          aria-labelledby="unsplash-home"
          aria-hidden="false"
          viewBox="0 0 32 32"
        >
          <path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z" />
        </svg>
        <div className="text-center font-sans text-lg text-neutral-800 dark:text-neutral-200">
          Use the search bar above to find photos from{" "}
          <a href="https://unsplash.com" target="_blank" rel="noreferrer">
            <span className="font-semibold text-[#2AAAE2] decoration-[#2AAAE2]">Unsplash</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default EmptyUnsplashState;