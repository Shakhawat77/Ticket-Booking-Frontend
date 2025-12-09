import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const Home = () => {
  const [advertisedTickets, setAdvertisedTickets] = useState([]);
  const [latestTickets, setLatestTickets] = useState([]);

  // Fetch tickets from your backend
  useEffect(() => {
    // Advertisement tickets (admin selected, max 6)
    fetch("http://localhost:3000/tickets/advertised")
      .then((res) => res.json())
      .then((data) => setAdvertisedTickets(data));

    // Latest tickets (6-8 recently added)
    fetch("http://localhost:3000/tickets/latest")
      .then((res) => res.json())
      .then((data) => setLatestTickets(data));
  }, []);

  const TicketCard = ({ ticket }) => (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col hover:shadow-xl transition-shadow duration-300">
      <img
        src={ticket.image}
        alt={ticket.title}
        className="h-40 w-full object-cover rounded mb-2"
      />
      <h2 className="font-bold text-lg mt-2">{ticket.title}</h2>
      <p className="text-gray-700">Price: ${ticket.price}</p>
      <p className="text-gray-700">Quantity: {ticket.quantity}</p>
      <p className="text-gray-700">Transport: {ticket.transportType}</p>
      <p className="text-gray-700">
        Perks: {ticket.perks?.length ? ticket.perks.join(", ") : "None"}
      </p>
      <Link
        to={`/ticket/${ticket._id}`}
        className="mt-auto btn btn-sm bg-blue-600 text-white hover:bg-blue-700 mt-2"
      >
        See Details
      </Link>
    </div>
  );

  return (
    <div className="space-y-12 px-4 md:px-8 lg:px-16 py-8">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 rounded overflow-hidden bg-gradient-to-r from-[#49c9a5] to-[#4db4d7] flex items-center justify-center text-white text-4xl md:text-6xl font-bold text-center">
        Book Your Travel Tickets Easily
      </div>

      {/* Advertisement Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Advertisement Tickets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {advertisedTickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      </section>

      {/* Latest Tickets Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Tickets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestTickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      </section>

      {/* Extra Section 1 */}
      <section className="bg-gray-100 p-8 rounded">
        <h2 className="text-2xl font-bold mb-4">Popular Routes</h2>
        <p>Check out the most popular travel routes chosen by our customers!</p>
      </section>

      {/* Extra Section 2 */}
      <section className="bg-gray-200 p-8 rounded">
        <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Easy and fast booking process</li>
          <li>Trusted and verified vendors</li>
          <li>Secure payment with Stripe</li>
          <li>Best prices guaranteed</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
