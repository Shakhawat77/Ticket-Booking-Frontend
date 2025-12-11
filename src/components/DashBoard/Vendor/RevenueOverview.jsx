import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const RevenueOverview = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!user?.email) return;

    fetch(`${backendUrl}/tickets?vendorEmail=${user.email}`)
      .then(res => res.json())
      .then(setTickets)
      .catch(console.error);

    fetch(`${backendUrl}/bookings?vendorEmail=${user.email}&status=paid`)
      .then(res => res.json())
      .then(setBookings)
      .catch(console.error);
  }, [user?.email, backendUrl]);

  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
  const totalTicketsSold = bookings.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
  const totalTicketsAdded = tickets.length;

  const chartData = tickets.map(t => {
    const sold = bookings
      .filter(b => b.ticketId === t._id)
      .reduce((sum, b) => sum + Number(b.quantity || 0), 0);
    return { name: t.title, sold };
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Revenue Overview</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">Total Revenue: ${totalRevenue}</div>
        <div className="bg-white p-4 rounded shadow">Total Tickets Sold: {totalTicketsSold}</div>
        <div className="bg-white p-4 rounded shadow">Total Tickets Added: {totalTicketsAdded}</div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Tickets Sold Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sold" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueOverview;
