import { redirect , Params, useLoaderData } from "react-router-dom";
import { RawEgresado } from "./admin/egresado_table/EgresadoColumn";  
import { API_URL } from "@/globals";
import { SingleNotFound } from "./SingleNotFound";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export async function loader({params}: {params : Params<"id">}) {
  const userJwt = sessionStorage.getItem("jwt");

  if (!userJwt) {
    return redirect("/");
  }

  try {
    const response = await fetch(`${API_URL}/egresado/${params.id}`, {
      headers : {
        "Authorization" : `Bearer ${userJwt}`,
        "Content-Type" : "application/json",
      }
    })

    const responseJson = await response.json();

    if (responseJson.status === "error") {
      sessionStorage.removeItem("jwt");
      return redirect("/")
    } else if (responseJson.status === "success") {
      return responseJson.data    
    }

  }catch(error) {
    console.error(error)
    return redirect("/")
  }
}


export function EgresadoSingleView() {
  const egresado = useLoaderData() as RawEgresado;

  if(!egresado) {
    return (
      <SingleNotFound objectType="Egresado" redirectTo="/" message="Go back to log-in"/>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}
