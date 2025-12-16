import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const RevenueOverview = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!user?.email) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tickets for vendor
        const ticketsRes = await axios.get(`${backendUrl}/vendor/tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(ticketsRes.data);

        // Fetch bookings for vendor and filter paid
        const bookingsRes = await axios.get(`${backendUrl}/bookings/vendor`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const paidBookings = bookingsRes.data.filter(b => b.status === "paid");
        setBookings(paidBookings);
      } catch (err) {
        console.error("Error fetching data:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email, backendUrl]);

  if (loading) return <div>Loading revenue data...</div>;

  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
  const totalTicketsSold = bookings.reduce((sum, b) => sum + Number(b.quantity || 0), 0);
  const totalTicketsAdded = tickets.length;

  const chartData = tickets.map(t => {
    const sold = bookings
      .filter(b => b.ticketId === t._id)
      .reduce((sum, b) => sum + Number(b.quantity || 0), 0);
    const revenue = bookings
      .filter(b => b.ticketId === t._id)
      .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);
    return { name: t.title, sold, revenue };
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
            <Tooltip formatter={(value, name) => (name === "revenue" ? `$${value}` : value)} />
            <Bar dataKey="sold" fill="#8884d8" name="Tickets Sold" />
            <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueOverview;
