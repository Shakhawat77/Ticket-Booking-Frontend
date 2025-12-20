import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const AdvertiseTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!token) return;

    const fetchTickets = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/admin/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();
        const approved = data.filter(t => t.verificationStatus === "approved");
        setTickets(approved);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Error loading tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [backendUrl, token]);
  const toggleAdvertise = async (ticketId, currentStatus) => {

    const advertisedCount = tickets.filter(t => t.isAdvertised).length;
    if (!currentStatus && advertisedCount >= 6) {
      toast.error("Cannot advertise more than 6 tickets at a time");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/admin/tickets/advertise/${ticketId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update advertisement");
      setTickets(prev =>
        prev.map(t => (t._id === ticketId ? { ...t, isAdvertised: data.isAdvertised } : t))
      );

      toast.success(data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update advertisement");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Advertise Tickets</h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Image</th>
              <th className="border px-3 py-2">Title</th>
              <th className="border px-3 py-2">Price</th>
              <th className="border px-3 py-2">Date</th>
              <th className="border px-3 py-2">Advertise</th>
            </tr>
          </thead>

          <tbody>
            {tickets.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No approved tickets found
                </td>
              </tr>
            )}

            {tickets.map((ticket, index) => (
              <tr key={ticket._id} className="hover:bg-gray-100">
                <td className="border px-3 py-2">{index + 1}</td>
                <td className="border px-3 py-2">
                  <img
                    src={ticket.image}
                    alt={ticket.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                </td>
                <td className="border px-3 py-2">{ticket.title}</td>
                <td className="border px-3 py-2">${ticket.price}</td>
                <td className="border px-3 py-2">
                  {new Date(ticket.date).toLocaleDateString()}
                </td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => toggleAdvertise(ticket._id, ticket.isAdvertised)}
                    className={`px-3 py-1 rounded text-white ${
                      ticket.isAdvertised ? "bg-red-600" : "bg-green-600"
                    }`}
                  >
                    {ticket.isAdvertised ? "Unadvertise" : "Advertise"}
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

export default AdvertiseTickets;
