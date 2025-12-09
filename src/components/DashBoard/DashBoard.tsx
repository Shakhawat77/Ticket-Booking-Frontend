import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { NavLink } from "react-router";
import toast from "react-hot-toast";
import Countdown from "react-countdown";

// Example: For payments you would integrate Stripe later
// import { loadStripe } from "@stripe/stripe-js";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch bookings for this user
    fetch(`http://localhost:3000/bookings?userEmail=${user?.email}`)
      .then((res) => res.json())
      .then((data) => setBookings(data));

    // Fetch transactions for this user
    fetch(`http://localhost:3000/transactions?userEmail=${user?.email}`)
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, [user?.email]);

  const handlePayNow = async (booking) => {
    // TODO: Integrate Stripe Payment
    toast.success(`Paid for ${booking.ticketTitle}!`);
    // After payment, update status in DB and refresh bookings
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <div className="mb-6 text-center">
          <img
            src={user?.photoURL || "https://via.placeholder.com/80"}
            alt={user.displayName}
            className="w-20 h-20 rounded-full mx-auto"
          />
          <h2 className="mt-2 font-bold text-lg">{user?.displayName}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <p className="text-sm text-blue-500 mt-1 capitalize">{user?.role}</p>
        </div>

        <nav className="flex flex-col gap-3">
          <NavLink
            to="/user/profile"
            className="py-2 px-3 rounded hover:bg-blue-100"
          >
            User Profile
          </NavLink>
          <NavLink
            to="/user/bookings"
            className="py-2 px-3 rounded hover:bg-blue-100"
          >
            My Booked Tickets
          </NavLink>
          <NavLink
            to="/user/transactions"
            className="py-2 px-3 rounded hover:bg-blue-100"
          >
            Transaction History
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">My Booked Tickets</h1>

        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              const departureTime = new Date(booking.dateTime);
              const now = new Date();
              const isPast = now > departureTime;
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col"
                >
                  <img
                    src={booking.image}
                    alt={booking.ticketTitle}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h2 className="font-semibold text-lg">{booking.ticketTitle}</h2>
                  <p className="text-sm text-gray-500">
                    {booking.from} → {booking.to}
                  </p>
                  <p className="text-sm">
                    Quantity: {booking.bookedQuantity}
                  </p>
                  <p className="text-sm">
                    Total: ${booking.price * booking.bookedQuantity}
                  </p>
                  <p className="text-sm">
                    Departure: {new Date(booking.dateTime).toLocaleString()}
                  </p>
                  <p className="mt-1">
                    Status:{" "}
                    <span
                      className={`capitalize font-semibold ${
                        booking.status === "pending"
                          ? "text-yellow-500"
                          : booking.status === "accepted"
                          ? "text-green-500"
                          : booking.status === "rejected"
                          ? "text-red-500"
                          : "text-blue-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>

                  {/* Countdown */}
                  {booking.status === "accepted" && !isPast && (
                    <Countdown date={departureTime} className="text-red-500 mt-1" />
                  )}

                  {/* Pay Now Button */}
                  {booking.status === "accepted" && !isPast && (
                    <button
                      onClick={() => handlePayNow(booking)}
                      className="mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Transaction History */}
        <h2 className="text-2xl font-bold mt-12 mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ticket Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{tx.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{tx.ticketTitle}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${tx.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(tx.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
