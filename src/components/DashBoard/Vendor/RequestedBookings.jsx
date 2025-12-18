import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import toast from "react-hot-toast";

const RequestedBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("accessToken");

  const fetchBookings = async () => {
    if (!user || !token) return;

    try {
      const res = await fetch(`${backendUrl}/bookings/vendor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user, token]);

  const handleAcceptBooking = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/bookings/accepted/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to accept booking");

      toast.success(data.message);
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleRejectBooking = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/bookings/rejected/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to reject booking");

      toast.success("Booking rejected");
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update booking");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading bookings...</p>;
  }

  if (!bookings.length) {
    return <p className="text-center mt-10">No booking requests found.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Requested Bookings</h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-2">User</th>
              <th className="border px-3 py-2">Ticket</th>
              <th className="border px-3 py-2">Quantity</th>
              <th className="border px-3 py-2">Total Price</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="border px-3 py-2">
                  {b.userName}
                  <br />
                  <span className="text-xs text-gray-500">{b.userEmail}</span>
                </td>
                <td className="border px-3 py-2 flex items-center gap-2">
                  {b.ticketImage ? (
                    <img
                      src={b.ticketImage}
                      alt={b.ticketTitle}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/64?text=No+Image";
                      }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                  <span>{b.ticketTitle}</span>
                </td>
                <td className="border px-3 py-2">{b.quantity}</td>
                <td className="border px-3 py-2">${b.totalPrice}</td>
                <td className="border px-3 py-2 capitalize">{b.status}</td>
                <td className="border px-3 py-2 flex gap-2">
                  <button
                    disabled={b.status !== "pending"}
                    onClick={() => handleAcceptBooking(b._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-40"
                  >
                    Accept
                  </button>
                  <button
                    disabled={b.status !== "pending"}
                    onClick={() => handleRejectBooking(b._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-40"
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
};

export default RequestedBookings;
