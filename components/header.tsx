import React from "react"

function Header({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative m-auto w-full max-w-3xl py-4 text-center">
      {children}
    </div>
  )
}

export default Header
