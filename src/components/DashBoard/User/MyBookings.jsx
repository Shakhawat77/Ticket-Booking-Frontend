// src/components/DashBoard/User/MyBookings.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import toast, { Toaster } from "react-hot-toast";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`http://localhost:3000/bookings?userEmail=${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch bookings");
        setLoading(false);
      });
  }, [user?.email]);

  if (loading) return <p className="text-center mt-10">Loading bookings...</p>;

  if (bookings.length === 0)
    return <p className="text-center mt-10">No bookings found.</p>;

  return (
    <div className="p-6">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Ticket</th>
            <th className="border px-2 py-1">From → To</th>
            <th className="border px-2 py-1">Quantity</th>
            <th className="border px-2 py-1">Total Price</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td className="border px-2 py-1">{b.ticketTitle}</td>
              <td className="border px-2 py-1">
                {b.from} → {b.to}
              </td>
              <td className="border px-2 py-1">{b.quantity}</td>
              <td className="border px-2 py-1">${b.totalPrice}</td>
              <td className="border px-2 py-1">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    b.status === "pending"
                      ? "bg-yellow-500"
                      : b.status === "accepted"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyBookings;
