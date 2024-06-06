import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from './components/ui/toaster.tsx'
import { ErrorPage } from "./components/pages/ErrorPage.tsx";
import { Login } from './components/pages/Login'
import { AdminDashboard } from "./components/pages/admin/AdminDashboard.tsx";
import './App.css'
import './index.css'
import { EgresadoListView , loader as egresadoListLoader} from "./components/custom/admin/egresado_table/EgresadoListView.tsx";
import { FormListView , loader as formListLoader} from "./components/custom/admin/form_table/FormListView.tsx";
import { FormSingleView , loader as formSingleLoader } from "./components/custom/admin/FormSingleView.tsx";
import { EgresadoSingleView , loader as egresadoSingleLoader} from "./components/custom/EgresadoSingleView.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
    errorElement : <ErrorPage/>,
  }, 
  {
    path: "/admin/dashboard",
    element : <AdminDashboard/>,
    children: [
      {
        path : "egresados",
        element : <EgresadoListView/>,
        loader : egresadoListLoader
      },
      {
        path : "forms",
        element :  <FormListView/>,
        loader : formListLoader
      },
      {
        path : "forms/:id",
        element : <FormSingleView/>,
        loader : formSingleLoader
      },
      {
        path : "egresados/:id",
        element : <EgresadoSingleView/>,
        loader : egresadoSingleLoader
      }
    ]
  },
  {
    path : "/egresado/:id",
    element : <EgresadoSingleView/>,
    loader : egresadoSingleLoader
  }
]);
function App() {
  return (
    <>
    <RouterProvider router={router}/>
    <Toaster/>
    </>
  )
}

export default App
