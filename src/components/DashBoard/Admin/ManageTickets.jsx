import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:3000/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus: status }),
      });
      setTickets(tickets.map(t => t.id === id ? { ...t, verificationStatus: status } : t));
      toast.success(`Ticket ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ticket");
    }
  };

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div>
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
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td className="border px-2 py-1">{ticket.title}</td>
              <td className="border px-2 py-1">{ticket.vendorName}</td>
              <td className="border px-2 py-1">${ticket.price}</td>
              <td className="border px-2 py-1">{ticket.verificationStatus}</td>
              <td className="border px-2 py-1 flex gap-2">
                <button className="btn btn-sm btn-primary" onClick={() => updateStatus(ticket.id, "approved")}>Approve</button>
                <button className="btn btn-sm btn-red-500" onClick={() => updateStatus(ticket.id, "rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTickets;
