import React, { useState } from "react";
import AdminProfile from "./AdminProfile";
import ManageTickets from "./ManageTickets";
import ManageUsers from "./ManageUsers";
import AdvertiseTickets from "./AdvertiseTickets";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Admin Profile" },
    { id: "tickets", label: "Manage Tickets" },
    { id: "users", label: "Manage Users" },
    { id: "advertise", label: "Advertise Tickets" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <AdminProfile />;
      case "tickets":
        return <ManageTickets />;
      case "users":
        return <ManageUsers />;
      case "advertise":
        return <AdvertiseTickets />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={`w-full text-left px-4 py-2 rounded hover:bg-blue-500 hover:text-white ${
                  activeTab === tab.id ? "bg-blue-500 text-white" : "text-gray-700"
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

export default AdminDashboard;