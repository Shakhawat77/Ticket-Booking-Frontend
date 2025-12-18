import React, { useState } from "react";
import toast from "react-hot-toast";

const AdvertiseToggle = ({ ticketId, isAdvertised, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [advertised, setAdvertised] = useState(isAdvertised);

  const handleToggle = async () => {
    setLoading(true);
    try {
      // Replace backendUrl with your API endpoint
      const res = await fetch(`https://ticket-booking-backend.vercel.app/tickets/${ticketId}/advertise`, {
        method: "PATCH", // or POST depending on your API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advertise: !advertised }),
      });
      console.log(res);

      if (!res.ok) throw new Error("Failed to update advertise status");

      setAdvertised(advertised);
      toast.success(`Ticket ${!advertised ? "advertised" : "unadvertised"} successfully!`);

      if (onStatusChange) onStatusChange(ticketId, !advertised);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`px-3 py-1 rounded ${
        advertised ? "bg-green-500 text-white" : "bg-gray-300 text-black"
      }`}
      onClick={handleToggle}
      disabled={loading}
    >
      {loading ? "Updating..." : advertised ? "Advertised" : "Advertise"}
    </button>
  );
};

export default AdvertiseToggle;


