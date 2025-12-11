import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch tickets
  useEffect(() => {
    fetch(`${backendUrl}/tickets`)
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        toast.error("Failed to load tickets");
      });
  }, [backendUrl]);

  // Update ticket status
  const updateStatus = async (_id, status) => {
    try {
      const res = await fetch(`${backendUrl}/tickets/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: status }),
      });
      if (!res.ok) throw new Error("Failed to update ticket");
      setTickets(
        tickets.map((t) =>
          t._id === _id ? { ...t, verificationStatus: status } : t
        )
      );
      toast.success(`Ticket ${status}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update ticket");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading tickets...</p>;

  return (
    <div className="p-4">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Manage Tickets</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Vendor</th>
            <th className="border px-2 py-1">Price</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td className="border px-2 py-1">{ticket.title}</td>
              <td className="border px-2 py-1">{ticket.vendorName}</td>
              <td className="border px-2 py-1">${ticket.price}</td>
              <td className="border px-2 py-1">{ticket.verificationStatus}</td>
              <td className="border px-2 py-1 flex gap-2 flex-wrap">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => updateStatus(ticket._id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="btn btn-sm btn-red-500"
                  onClick={() => updateStatus(ticket._id, "rejected")}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTickets;
