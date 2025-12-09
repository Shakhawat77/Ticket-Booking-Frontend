import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import toast from "react-hot-toast";

const MyAddedTickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/tickets?vendorEmail=${user?.email}`)
      .then((res) => res.json())
      .then(setTickets)
      .catch((err) => console.error(err));
  }, [user?.email]);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/tickets/${id}`, { method: "DELETE" });
      setTickets(tickets.filter((t) => t.id !== id));
      toast.success("Ticket deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete ticket!");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Added Tickets</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white p-4 rounded shadow">
            <img src={ticket.image} alt={ticket.title} className="w-full h-32 object-cover rounded mb-2" />
            <h3 className="font-bold">{ticket.title}</h3>
            <p><strong>From:</strong> {ticket.from} → <strong>To:</strong> {ticket.to}</p>
            <p><strong>Transport:</strong> {ticket.transportType}</p>
            <p><strong>Price:</strong> ${ticket.price}</p>
            <p><strong>Quantity:</strong> {ticket.quantity}</p>
            <p><strong>Status:</strong> {ticket.verificationStatus}</p>
            <div className="flex gap-2 mt-2">
              <button
                className="btn btn-sm btn-primary"
                disabled={ticket.verificationStatus === "rejected"}
              >
                Update
              </button>
              <button
                className="btn btn-sm btn-red-500"
                disabled={ticket.verificationStatus === "rejected"}
                onClick={() => handleDelete(ticket.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAddedTickets;
