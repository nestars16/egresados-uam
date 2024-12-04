import {
  Card,
} from "@/components/ui/card"

import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

type SingleNotFoundProps = {
  objectType : string,
  redirectTo: string,
  message : string
}

export function SingleNotFound({objectType, redirectTo, message} : SingleNotFoundProps) { 
  return (
    <section className="flex w-full h-full justify-center items-center">
      <Card className="w-1/4 h-1/3 flex flex-col items-center">
        <CircleAlert size={100} className="m-8"/> 
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {`${objectType} Not Found`}
        </h2>
        <Link to={redirectTo} className="mt-8">
            <Button variant="link" className="text-zinc-950">{message}</Button>
        </Link>
      </Card>
    </section>
  )
}