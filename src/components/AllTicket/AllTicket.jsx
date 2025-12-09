import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const AllTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch admin-approved tickets
  useEffect(() => {
    fetch("http://localhost:3000/tickets?verificationStatus=approved")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8 space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-8">
        All Tickets
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
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
                {ticket.perks.map((perk, idx) => (
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

              <Link
                to={`/ticket/${ticket.id}`}
                className="mt-auto btn btn-sm bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
              >
                See Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTicket;
