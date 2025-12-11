import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const AdvertiseTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch approved tickets
  useEffect(() => {
    fetch(`${backendUrl}/tickets?verificationStatus=approved`)
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load tickets");
        setLoading(false);
      });
  }, [backendUrl]);

  // Toggle advertise status
  const toggleAdvertise = async (_id) => {
    const ticket = tickets.find((t) => t._id === _id);
    if (!ticket) return;

    const countAdvertised = tickets.filter((t) => t.advertise).length;
    const newValue = !ticket.advertise;

    if (newValue && countAdvertised >= 6) {
      toast.error("Cannot advertise more than 6 tickets");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/tickets/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advertise: newValue }),
      });
      if (!res.ok) throw new Error("Failed to update advertise status");

      setTickets(
        tickets.map((t) =>
          t._id === _id ? { ...t, advertise: newValue } : t
        )
      );
      toast.success(`Ticket ${newValue ? "advertised" : "unadvertised"}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update advertise status");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="p-4">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Advertise Tickets</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Vendor</th>
            <th className="border px-2 py-1">Price</th>
            <th className="border px-2 py-1">Advertise</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td className="border px-2 py-1">{ticket.title}</td>
              <td className="border px-2 py-1">{ticket.vendorName}</td>
              <td className="border px-2 py-1">${ticket.price}</td>
              <td className="border px-2 py-1 text-center">
                <input
                  type="checkbox"
                  checked={ticket.advertise || false}
                  onChange={() => toggleAdvertise(ticket._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdvertiseTickets;
