import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./layout/RootLayout.jsx";
import Home from "./components/Home/Home.jsx";
import Register from "./components/Register/Register.jsx";
import Login from "./components/Login/Login.jsx";
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import AllTicket from "./components/AllTicket/AllTicket.jsx";
import PrivateRoute from "./Routs/PrivateRoute.jsx";
import DashboardLayout from "./components/DashBoard/DashboardLayout.jsx";

// Admin Dashboard
import AdminDashboard from "./components/DashBoard/Admin/AdminDashboard.jsx";
import ManageTickets from "./components/DashBoard/Admin/ManageTickets.jsx";
import ManageUsers from "./components/DashBoard/Admin/ManageUsers.jsx";
import AdvertiseTickets from "./components/DashBoard/Admin/AdvertiseTickets.jsx";
import AdminProfile from "./components/DashBoard/Admin/AdminProfile.jsx";

// Vendor Dashboard
import VendorDashboard from "./components/DashBoard/Vendor/VendorDashboard.jsx";
import AddTicket from "./components/DashBoard/Vendor/AddTicket.jsx";
import MyAddedTickets from "./components/DashBoard/Vendor/MyAddedTickets.jsx";
import RequestedBookings from "./components/DashBoard/Vendor/RequestedBookings.jsx";
import RevenueOverview from "./components/DashBoard/Vendor/RevenueOverview.jsx";
import VendorProfile from "./components/DashBoard/Vendor/VendorProfile.jsx";

// User Dashboard
import UserDashboard from "./components/DashBoard/User/UserDashboard.jsx";
import MyBookings from "./components/DashBoard/User/MyBookings.jsx";
import TicketDetails from "./components/DashBoard/User/TicketDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },

      // Dashboard base route
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          // Admin routes
          {
            path: "admin",
            element: (
              <PrivateRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </PrivateRoute>
            ),
            children: [
              { path: "profile", element: <AdminProfile /> },
              { path: "tickets", element: <ManageTickets /> },
              { path: "users", element: <ManageUsers /> },
              { path: "advertise", element: <AdvertiseTickets /> },
            ],
          },

          // Vendor routes
          {
            path: "vendor",
            element: (
              <PrivateRoute allowedRoles={["VENDOR"]}>
                <VendorDashboard />
              </PrivateRoute>
            ),
            children: [
              { path: "profile", element: <VendorProfile /> },
              { path: "addTicket", element: <AddTicket /> },
              { path: "myTickets", element: <MyAddedTickets /> },
              { path: "requests", element: <RequestedBookings /> },
              { path: "revenue", element: <RevenueOverview /> },
            ],
          },

          // User routes
          {
            path: "user",
            element: (
              <PrivateRoute allowedRoles={["USER"]}>
                <UserDashboard />
              </PrivateRoute>
            ),
            children: [
              { path: "myBookings", element: <MyBookings /> },
            ],
          },
        ],
      },

      // Tickets list & details
      {
        path: "allTickets",
        element: (
          <PrivateRoute>
            <AllTicket />
          </PrivateRoute>
        ),
      },
      {
        path: "allTickets/:id",
        element: (
          <PrivateRoute>
            <TicketDetails />
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
