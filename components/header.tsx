import React from "react"

function Header({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex w-full items-center justify-between space-x-4 p-4">
      {children}
    </div>
  )
}

export default Header
