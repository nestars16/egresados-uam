//TODO add form answer screen
//TODO add registration
//TODO add egresado editing for users and admins

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/toaster.tsx";
import { ErrorPage } from "./components/pages/ErrorPage.tsx";
import { Login } from "./components/pages/Login";
import { AdminDashboard } from "./components/pages/admin/AdminDashboard.tsx";
import "./App.css";
import "./index.css";
import {
  EgresadoListView,
  approveIds as egresadoListApproveAction,
  loader as egresadoListLoader,
} from "./components/custom/admin/egresado_table/EgresadoListView.tsx";
import {
  FormListView,
  submitFormsAction as formListAction,
  loader as formListLoader,
} from "./components/custom/admin/form_table/FormListView.tsx";
import {
  FormSingleView,
  loader as formSingleLoader,
} from "./components/custom/admin/FormSingleView.tsx";
import {
  EgresadoSingleView,
  loader as egresadoSingleLoader,
} from "./components/custom/EgresadoSingleView.tsx";
import { FormCreate } from "./components/custom/admin/FormCreate.tsx";
import { DefaultNavbar } from "./components/custom/DefaultNavbar.tsx";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";
import AdvertisementManager from "@/components/custom/admin/AdvertisementSingleView.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultNavbar />,
    children: [
      {
        path: "admin/dashboard",
        element: <AdminDashboard />,
        children: [
          {
            path: "egresados",
            element: <EgresadoListView />,
            loader: egresadoListLoader,
            children: [
              {
                action: egresadoListApproveAction,
                path: "all/approve",
              },
            ],
          },
          {
            path: "forms",
            element: <FormListView />,
            loader: formListLoader,
            children: [
              {
                action: formListAction,
                path: "all/approve",
              },
            ],
          },
          {
            path: "forms/:id",
            element: <FormSingleView />,
            loader: formSingleLoader,
          },
          {
            path: "egresados/:id",
            element: <EgresadoSingleView />,
            loader: egresadoSingleLoader,
          },
          {
            path: "forms/create",
            element: <FormCreate />,
          },
          {
            path: "advertisements",
            element: <AdvertisementManager />, // Componente de AdvertisementManager
          },
        ],
      },
      {
        path: "/egresado/:id",
        element: <EgresadoSingleView />,
        loader: egresadoSingleLoader,
      },
      {
        index: true,
        element: <Login />,
        errorElement: <ErrorPage />,
      },
    ],

    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
