import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import toast, { Toaster } from "react-hot-toast";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  /* ---------------- Fetch Bookings ---------------- */
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    fetch(`${backendUrl}/bookings/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load bookings");
        setLoading(false);
      });
  }, [user, backendUrl]);

  /* ---------------- Countdown Helper ---------------- */
  const getCountdown = (date) => {
    const diff = new Date(date) - new Date();
    if (diff <= 0) return "Departed";

    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (bookings.length === 0)
    return <p className="text-center mt-10">No bookings found</p>;

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6">My Booked Tickets</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((b) => {
          const departed = new Date(b.departureDateTime) < new Date();
          const showPay =
            b.status === "accepted" && !departed;

          return (
            <div key={b._id} className="border rounded shadow p-4 bg-white">
              {b.ticketImage && (
                <img
                  src={b.ticketImage}
                  alt={b.ticketTitle}
                  className="h-40 w-full object-cover rounded mb-3"
                />
              )}

              <h3 className="font-semibold text-lg">{b.ticketTitle}</h3>
              <p className="text-sm">{b.from} → {b.to}</p>

              <p className="mt-1">
                <b>Departure:</b>{" "}
                {new Date(b.departureDateTime).toLocaleString()}
              </p>

              {b.status !== "rejected" && (
                <p className="mt-1">
                  <b>Countdown:</b> {getCountdown(b.departureDateTime)}
                </p>
              )}

              <p className="mt-1"><b>Quantity:</b> {b.quantity}</p>
              <p><b>Total:</b> ${b.totalPrice}</p>

              <span
                className={`inline-block mt-2 px-3 py-1 text-white rounded text-sm ${
                  b.status === "pending"
                    ? "bg-yellow-500"
                    : b.status === "accepted"
                    ? "bg-green-600"
                    : b.status === "paid"
                    ? "bg-blue-600"
                    : "bg-red-600"
                }`}
              >
                {b.status.toUpperCase()}
              </span>

              {showPay && (
                <button
                  className="mt-3 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                  onClick={() => toast("Stripe payment coming next")}
                >
                  Pay Now
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;
