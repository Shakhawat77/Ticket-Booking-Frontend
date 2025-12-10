import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";

import RootLayout from "./layout/RootLayout.jsx";
import Home from "./components/Home/Home.jsx";
import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import AllTicket from "./components/AllTicket/AllTicket.jsx";
import PrivateRoute from "./Routs/PrivateRoute.jsx";
import AddTicket from "./components/DashBoard/Vendor/AddTicket.jsx";
import TicketDetails from "./components/DashBoard/User/TicketDetails.jsx";
import DashboardLayout from "./components/DashBoard/DashboardLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
     {
  path: "/dashboard",
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
},
      {
        path: "/allTickets",
        element: (
          <PrivateRoute>
            <AllTicket />
          </PrivateRoute>
        ),
      },
      {
        path: "/allTickets/:id",
        element: <TicketDetails />,
      },
      // {
      //   path: "/dashboard",
      //   element: (
      //     <PrivateRoute>
      //       <DashBoard />
      //     </PrivateRoute>
      //   ),
      // },
      {
        path: "/addTicket",
        element: (
          <PrivateRoute>
            <AddTicket />
          </PrivateRoute>
        ),
      },
      { path: "*", element: <ErrorPage /> },
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
