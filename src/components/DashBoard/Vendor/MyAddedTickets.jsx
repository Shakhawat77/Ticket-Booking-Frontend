import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import toast, { Toaster } from "react-hot-toast";

const MyAddedTickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("accessToken");

  /* ---------------- FETCH VENDOR TICKETS ---------------- */
  useEffect(() => {
    if (!user || !token) return;

    const fetchTickets = async () => {
      try {
        const res = await fetch(`${backendUrl}/vendor/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [user, backendUrl, token]);

  /* ---------------- DELETE TICKET ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      const res = await fetch(`${backendUrl}/tickets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");

      setTickets((prev) => prev.filter((t) => t._id !== id));
      toast.success("Ticket deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  /* ---------------- UPDATE TICKET ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backendUrl}/tickets/${selectedTicket._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedTicket),
      });

      if (!res.ok) throw new Error("Update failed");

      setTickets((prev) =>
        prev.map((t) => (t._id === selectedTicket._id ? selectedTicket : t))
      );

      toast.success("Ticket updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading tickets...</p>;

  return (
    <div className="p-6">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6">My Added Tickets</h2>

      {tickets.length === 0 ? (
        <p>No tickets added yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {tickets.map((ticket) => {
            const isRejected = ticket.verificationStatus === "rejected";
            return (
              <div key={ticket._id} className="bg-white shadow p-4 rounded">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-full h-40 object-cover rounded"
                />
                <h3 className="font-semibold mt-2">{ticket.title}</h3>
                <p>{ticket.from} → {ticket.to}</p>
                <p>Price: ${ticket.price}</p>
                <p>Qty: {ticket.quantity}</p>
                <p className="mt-1">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      ticket.verificationStatus === "approved"
                        ? "text-green-600"
                        : ticket.verificationStatus === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {ticket.verificationStatus}
                  </span>
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    disabled={isRejected}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setIsModalOpen(true);
                    }}
                    className={`px-3 py-1 text-white rounded ${
                      isRejected ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Update
                  </button>

                  <button
                    disabled={isRejected}
                    onClick={() => handleDelete(ticket._id)}
                    className={`px-3 py-1 text-white rounded ${
                      isRejected ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------- UPDATE MODAL ---------------- */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Update Ticket</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                value={selectedTicket.title}
                onChange={(e) =>
                  setSelectedTicket({ ...selectedTicket, title: e.target.value })
                }
                className="w-full border p-2"
                placeholder="Title"
                required
              />
              <input
                type="number"
                value={selectedTicket.price}
                onChange={(e) =>
                  setSelectedTicket({ ...selectedTicket, price: e.target.value })
                }
                className="w-full border p-2"
                placeholder="Price"
                required
              />
              <input
                type="number"
                value={selectedTicket.quantity}
                onChange={(e) =>
                  setSelectedTicket({ ...selectedTicket, quantity: e.target.value })
                }
                className="w-full border p-2"
                placeholder="Quantity"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddedTickets;
