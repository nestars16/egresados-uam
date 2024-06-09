import { Outlet } from "react-router-dom"
import { ModeToggle } from "../ui/mode-toggle"

export function DefaultNavbar() {
  return (
    <>
      <header className="bg-uam justify-between text-white p-2.5 flex">
        <div className="flex gap-2">
          <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight">
            Egresados
          </h3>
          <img src="https://i.postimg.cc/bw1wt4zL/universidad-americana-2020.webp" className="w-30 h-8"/>
        </div>
        <ModeToggle/>
      </header>
      <Outlet/>
    </>
  )
}
