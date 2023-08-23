import isMobile from "is-mobile"

export default function Overlay() {
  if (isMobile()) return <></>
  return (
    <div className="duration-50 absolute left-0 top-0 z-10 hidden h-full w-full rounded-2xl bg-gradient-to-t from-white opacity-0 transition-opacity hover:opacity-20 dark:from-black md:group-hover:block" />
  )
}
