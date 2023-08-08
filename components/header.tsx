import React from "react"

function Header({ children }: React.PropsWithChildren<{}>) {
  return <div className="w-full space-x-4 py-4 text-center">{children}</div>
}

export default Header
