import { useRouteError } from "react-router-dom"


export function ErrorPage() {

  const error = useRouteError();
  console.error(error);

  return (
    <>
      <div className="flex-col items-center justify-center text-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-5">
          404
        </h1>
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Page Not Found
        </h2>
      </div>
    </>
  )
}
