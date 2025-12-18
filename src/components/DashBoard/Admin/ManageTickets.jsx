import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!token) return;

    const fetchTickets = async () => {
      try {
        const res = await fetch(`${backendUrl}/admin/tickets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch tickets");

        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [backendUrl, token]);
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${backendUrl}/admin/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setTickets((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, verificationStatus: status } : t
        )
      );

      toast.success(data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update ticket");
    }
  };

  if (loading) {
    return <p className="text-center mt-6">Loading tickets...</p>;
  }

  if (!tickets.length) {
    return <p className="text-center mt-6">No tickets found.</p>;
  }

  return (
    <div className="p-6">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Manage Tickets</h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-2">Title</th>
              <th className="border px-3 py-2">Vendor Email</th>
              <th className="border px-3 py-2">Price</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td className="border px-3 py-2">{ticket.title}</td>
                <td className="border px-3 py-2">{ticket.vendorEmail}</td>
                <td className="border px-3 py-2">${ticket.price}</td>
                <td className="border px-3 py-2 capitalize">
                  {ticket.verificationStatus}
                </td>
                <td className="border px-3 py-2 flex gap-2">
                  <button
                    disabled={ticket.verificationStatus === "approved"}
                    onClick={() => updateStatus(ticket._id, "approved")}
                    className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-40"
                  >
                    Approve
                  </button>

                  <button
                    disabled={ticket.verificationStatus === "rejected"}
                    onClick={() => updateStatus(ticket._id, "rejected")}
                    className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-40"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTickets;
