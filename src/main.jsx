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
import DashBoard from "./components/DashBoard/DashBoard.jsx";
import RoleRoute from "./components/RoleRoute/RoleRoute.jsx";
import TransactionHistory from "./components/DashBoard/User/TransactionHistory.jsx";
import UserProfile from "./components/DashBoard/User/UserProfile.jsx";
import TicketDetails from "./components/DashBoard/User/TicketDetails.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      {path: "AllTickets", element: <AllTicket></AllTicket>},
    {path: "AllTickets/:id", element: <TicketDetails></TicketDetails>}, 
    ],
  },


  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashBoard />,
      },

     {
  path: "user",
  element: (
    <RoleRoute allowedRoles={["USER"]}>
      <UserDashboard />
    </RoleRoute>
  ),
  children: [

    { path: "profile", element: <UserProfile /> },
    { path: "bookings", element: <MyBookings /> },
    { path: "transactions", element: <TransactionHistory /> },
  ],
},

      {
        path: "vendor",
        element: (
          <RoleRoute allowedRoles={["VENDOR"]}>
            <VendorDashboard />
          </RoleRoute>
        ),
        children: [
          { path: "profile", element: <VendorProfile /> },
          { path: "add-ticket", element: <AddTicket /> },
          { path: "my-tickets", element: <MyAddedTickets /> },
          { path: "bookings", element: <RequestedBookings /> },
          { path: "revenue", element: <RevenueOverview /> },
        ],
      },


      {
        path: "admin",
        element: (
          <RoleRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </RoleRoute>
        ),
         children: [
    { path: "profile", element: <AdminProfile /> },
    { path: "manage-tickets", element: <ManageTickets /> },
    { path: "manage-users", element: <ManageUsers /> },
    { path: "advertise", element: <AdvertiseTickets /> },
  ],
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
