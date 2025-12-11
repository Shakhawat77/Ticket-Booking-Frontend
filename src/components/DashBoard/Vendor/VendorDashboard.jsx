import React, { useState } from "react";
import VendorProfile from "./VendorProfile";
import AddTicket from "./AddTicket";
import MyAddedTickets from "./MyAddedTickets";
import RequestedBookings from "./RequestedBookings";
import RevenueOverview from "./RevenueOverview";

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Vendor Profile" },
    { id: "addTicket", label: "Add Ticket" },
    { id: "myTickets", label: "My Added Tickets" },
    { id: "requests", label: "Requested Bookings" },
    { id: "revenue", label: "Revenue Overview" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <VendorProfile />;
      case "addTicket":
        return <AddTicket />;
      case "myTickets":
        return <MyAddedTickets />;
      case "requests":
        return <RequestedBookings />;
      case "revenue":
        return <RevenueOverview />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Vendor Dashboard</h2>
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={`w-full text-left px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default VendorDashboard;
