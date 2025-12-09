import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import toast from "react-hot-toast";

const RequestedBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/bookings?vendorEmail=${user?.email}&status=pending`)
      .then((res) => res.json())
      .then(setBookings)
      .catch(console.error);
  }, [user?.email]);

  const handleStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:3000/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      toast.success(`Booking ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Requested Bookings</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">User</th>
            <th className="border px-2 py-1">Ticket</th>
            <th className="border px-2 py-1">Quantity</th>
            <th className="border px-2 py-1">Total Price</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td className="border px-2 py-1">{b.userName} ({b.userEmail})</td>
              <td className="border px-2 py-1">{b.ticketTitle}</td>
              <td className="border px-2 py-1">{b.quantity}</td>
              <td className="border px-2 py-1">${b.totalPrice}</td>
              <td className="border px-2 py-1 flex gap-2">
                <button className="btn btn-sm btn-primary" onClick={() => handleStatus(b.id, "accepted")}>Accept</button>
                <button className="btn btn-sm btn-red-500" onClick={() => handleStatus(b.id, "rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestedBookings;
