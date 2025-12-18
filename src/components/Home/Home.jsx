import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [advertisedTickets, setAdvertisedTickets] = useState([]);
  const [latestTickets, setLatestTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Advertised tickets (MAX 6 – admin controlled)
        const adRes = await fetch(
          "http://localhost:3000/tickets?advertised=true"
        );
        const adData = await adRes.json();
        setAdvertisedTickets(adData.slice(0, 6));

        // Latest tickets (6–8)
        const latestRes = await fetch("http://localhost:3000/tickets");
        const latestData = await latestRes.json();

        const sorted = latestData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 8);

        setLatestTickets(sorted);
      } catch (err) {
        console.error("Home page fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- TICKET CARD ---------------- */
  const TicketCard = ({ ticket }) => (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col hover:shadow-xl transition">
      <img
        src={ticket.image}
        alt={ticket.title}
        className="h-40 w-full object-cover rounded"
      />

      <h3 className="font-bold text-lg mt-3">{ticket.title}</h3>

      <p className="text-gray-600">Price: ${ticket.price}</p>
      <p className="text-gray-600">Quantity: {ticket.quantity}</p>
      <p className="text-gray-600">Transport: {ticket.transportType}</p>

      <p className="text-gray-600 text-sm">
        Perks:{" "}
        {ticket.perks
          ? Array.isArray(ticket.perks)
            ? ticket.perks.join(", ")
            : Object.values(ticket.perks).join(", ")
          : "None"}
      </p>

      <Link
        to={`/allTickets/${ticket._id}`}
        className="mt-auto mt-4 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        See Details
      </Link>
    </div>
  );

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-16 px-4 md:px-10 py-8">

      {/* ---------------- HERO / SLIDER ---------------- */}
      <section className="relative h-[350px] rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            Book Your Tickets Easily
          </h1>
          <p className="text-lg md:text-xl">
            Trusted vendors • Secure booking • Best prices
          </p>
          <Link
            to="/allTickets"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100"
          >
            Browse Tickets
          </Link>
        </div>
      </section>

      {/* ---------------- ADVERTISEMENT SECTION ---------------- */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          Advertisement Tickets
        </h2>

        {advertisedTickets.length === 0 ? (
          <p>No advertised tickets available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {advertisedTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------- LATEST TICKETS ---------------- */}
      <section>
        <h2 className="text-2xl font-bold mb-6">
          Latest Tickets
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestTickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      </section>

      {/* ---------------- EXTRA SECTION 1 ---------------- */}
      <section className="bg-gray-100 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-3">Popular Routes</h2>
        <p className="text-gray-700">
          Dhaka → Chittagong • Dhaka → Cox’s Bazar • Dhaka → Sylhet
        </p>
      </section>

      {/* ---------------- EXTRA SECTION 2 ---------------- */}
      <section className="bg-gray-200 p-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-3">Why Choose Us?</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Verified vendors only</li>
          <li>Admin-approved tickets</li>
          <li>Secure online payments</li>
          <li>Fast and easy booking</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
