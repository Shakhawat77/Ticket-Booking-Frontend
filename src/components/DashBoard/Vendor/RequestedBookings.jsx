import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import toast from "react-hot-toast";

const RequestedBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL; // e.g. http://localhost:5000

  // Fetch bookings for this vendor
  const fetchBookings = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/bookings/vendor?email=${user.email}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`, // JWT/Firebase token
        },
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading bookings...</p>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="text-center py-10">
        <p>No booking requests found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Requested Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">User Name</th>
              <th className="border px-4 py-2">User Email</th>
              <th className="border px-4 py-2">Ticket Title</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="border px-4 py-2">{booking.userName}</td>
                <td className="border px-4 py-2">{booking.userEmail}</td>
                <td className="border px-4 py-2">{booking.ticketTitle}</td>
                <td className="border px-4 py-2">{booking.quantity}</td>
                <td className="border px-4 py-2">${booking.totalPrice}</td>
                <td className="border px-4 py-2 capitalize">{booking.status}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded disabled:opacity-50"
                    disabled={booking.status !== "pending"}
                    onClick={() => handleAcceptReject(booking._id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
                    disabled={booking.status !== "pending"}
                    onClick={() => handleAcceptReject(booking._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Handle Accept/Reject button click
  async function handleAcceptReject(bookingId, action) {
    try {
      const res = await fetch(`${backendUrl}/bookings/${action}/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      toast.success(`Booking ${action} successfully`);
      // Refresh list
      fetchBookings();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${action} booking`);
    }
  }
};

export default RequestedBookings;
