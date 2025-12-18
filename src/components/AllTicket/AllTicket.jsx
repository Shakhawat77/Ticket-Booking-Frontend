import  { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";

const AllTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Backend URL from .env
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/tickets?verificationStatus=approved`, {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        });

        if (!res.ok) throw new Error("Failed to fetch tickets");

        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Error loading tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [backendUrl, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600">
        Loading tickets...
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600">
        No tickets available.
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8 space-y-8">
      <Toaster />
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
        All Tickets
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="bg-white shadow-lg rounded-xl overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 flex flex-col"
          >
            <img
              src={ticket.image}
              alt={ticket.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {ticket.title}
              </h2>
              <p className="text-gray-600 mb-1 font-medium">
                <span className="font-semibold">Route:</span>{" "}
                {ticket.fromLocation} → {ticket.toLocation}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Transport:</span>{" "}
                {ticket.transportType}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Price:</span> ${ticket.price}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-semibold">Quantity:</span> {ticket.quantity}
              </p>

              <div className="flex flex-wrap gap-2 my-2">
                {ticket.perks?.map((perk, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full"
                  >
                    {perk}
                  </span>
                ))}
              </div>

              <p className="text-gray-500 mb-3 text-sm">
                Departure: {new Date(ticket.departureDate).toLocaleString()}
              </p>

              <button
                onClick={() => navigate(`/allTickets/${ticket._id}`)}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTicket;
