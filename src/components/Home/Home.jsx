import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [advertisedTickets, setAdvertisedTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisedTickets = async () => {
      try {
        const res = await fetch("http://localhost:3000/tickets?advertised=true");
        if (!res.ok) throw new Error("Failed to fetch advertised tickets");

        const data = await res.json();
        setAdvertisedTickets(data);
      } catch (err) {
        console.error("Error fetching advertised tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisedTickets();
  }, []);

  const TicketCard = ({ ticket }) => (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col hover:shadow-xl transition-shadow duration-300">
      {ticket.image && (
        <img
          src={ticket.image}
          alt={ticket.title}
          className="h-40 w-full object-cover rounded mb-2"
        />
      )}
      <h2 className="font-bold text-lg mt-2">{ticket.title}</h2>
      <p className="text-gray-700">Price: ${ticket.price}</p>
      <p className="text-gray-700">Quantity: {ticket.quantity}</p>
      <p className="text-gray-700">Transport: {ticket.transportType}</p>
      <p className="text-gray-700">
        Perks:{" "}
        {ticket.perks
          ? Array.isArray(ticket.perks)
            ? ticket.perks.join(", ")
            : Object.values(ticket.perks).join(", ")
          : "None"}
      </p>
      <Link
        to={`/allTickets/${ticket._id}`}
        className="mt-auto btn btn-sm bg-blue-600 text-white hover:bg-blue-700 mt-2"
      >
        See Details
      </Link>
    </div>
  );

  if (loading) {
    return <p className="text-center mt-6">Loading advertised tickets...</p>;
  }

  return (
    <div className="space-y-12 px-4 md:px-8 lg:px-16 py-8">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 rounded overflow-hidden bg-gradient-to-r from-[#49c9a5] to-[#4db4d7] flex items-center justify-center text-white text-4xl md:text-6xl font-bold text-center">
        Book Your Travel Tickets Easily
      </div>

      {/* Advertisement Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Advertisement Tickets</h2>
        {advertisedTickets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {advertisedTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <p>No advertised tickets available at the moment.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
