import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AdvertiseTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/tickets?verificationStatus=approved")
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const toggleAdvertise = async (id) => {
    const countAdvertised = tickets.filter(t => t.advertise).length;
    const ticket = tickets.find(t => t.id === id);
    const newValue = !ticket.advertise;

    if (newValue && countAdvertised >= 6) {
      toast.error("Cannot advertise more than 6 tickets");
      return;
    }

    try {
      await fetch(`http://localhost:3000/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advertise: newValue }),
      });
      setTickets(tickets.map(t => t.id === id ? { ...t, advertise: newValue } : t));
      toast.success(`Ticket ${newValue ? "advertised" : "unadvertised"}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update advertise status");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
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
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td className="border px-2 py-1">{ticket.title}</td>
              <td className="border px-2 py-1">{ticket.vendorName}</td>
              <td className="border px-2 py-1">${ticket.price}</td>
              <td className="border px-2 py-1">
                <input type="checkbox" checked={ticket.advertise || false} onChange={() => toggleAdvertise(ticket.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdvertiseTickets;
