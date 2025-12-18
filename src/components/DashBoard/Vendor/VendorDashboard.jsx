// import React, { useState } from "react";
// import VendorProfile from "./VendorProfile";
// import AddTicket from "./AddTicket";
// import MyAddedTickets from "./MyAddedTickets";
// import RequestedBookings from "./RequestedBookings";
// import RevenueOverview from "./RevenueOverview";

import { Outlet } from "react-router";


const VendorDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl text-center mb-20 font-bold mb-4 mx-auto">WelCome to Our Ticket Bari</h2>
      <Outlet />
    </div>
  );
};

export default VendorDashboard;