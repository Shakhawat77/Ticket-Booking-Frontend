import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import RootLayout from "./layout/RootLayout.jsx";
import Home from "./components/Home/Home.jsx";
// import AuthProvider from './context/AuthProvider.jsx';
import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import AllTicket from "./components/AllTicket/AllTicket.jsx";
import DashBoard from "./components/DashBoard/DashBoard.js";
import PrivateRoute from "./Routs/PrivateRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/Register",
        Component: Register,
      },
      {
        path: "/Login",
        Component: Login,
      },
      {
        path: "/all-ticket",
        element:<PrivateRoute><AllTicket></AllTicket></PrivateRoute>
      },
      {
        path: "/dashboard",
       element:<PrivateRoute><DashBoard></DashBoard></PrivateRoute>
      },

      {
        path: "/*",
        Component: ErrorPage,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
