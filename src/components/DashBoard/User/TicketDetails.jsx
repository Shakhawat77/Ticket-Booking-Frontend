import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../../context/AuthProvider";

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [ticket, setTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState("");
  const [showModal, setShowModal] = useState(false);

  /* ---------------- Fetch Ticket ---------------- */
  useEffect(() => {
    fetch(`${backendUrl}/tickets/${id}`)
      .then(res => res.json())
      .then(data => setTicket(data))
      .catch(console.error);
  }, [id, backendUrl]);

  /* ---------------- Countdown ---------------- */
  useEffect(() => {
    if (!ticket) return;

    const interval = setInterval(() => {
      const now = new Date();
      const departure = new Date(ticket.departureDateTime);
      const diff = departure - now;

      if (diff <= 0) {
        setTimeLeft("Departed");
        clearInterval(interval);
      } else {
        const totalSeconds = Math.floor(diff / 1000);
        const d = Math.floor(totalSeconds / 86400);
        const h = Math.floor((totalSeconds % 86400) / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ticket]);

  /* ---------------- Booking ---------------- */
  const handleBooking = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.error("Login required");

    if (quantity < 1 || quantity > ticket.quantity) {
      return toast.error("Invalid ticket quantity");
    }

    const bookingData = {
      ticketId: ticket._id,
      ticketTitle: ticket.title,
      ticketImage: ticket.image,
      from: ticket.from,
      to: ticket.to,
      departureDateTime: ticket.departureDateTime,
      quantity,
      totalPrice: quantity * ticket.price,
      status: "pending",
    };

    try {
      const res = await fetch(`${backendUrl}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) throw new Error("Booking failed");

      toast.success("Booking request sent!");
      setShowModal(false);
      setQuantity(1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!ticket) return <div className="text-center mt-20">Loading...</div>;

  const departurePassed = new Date(ticket.departureDateTime) < new Date();
  const isDisabled = departurePassed || ticket.quantity === 0;

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow rounded">
      <Toaster />

      {ticket.image && (
        <img src={ticket.image} alt={ticket.title} className="w-full h-64 object-cover" />
      )}

      <div className="p-6">
        <h2 className="text-3xl font-bold mb-4">{ticket.title}</h2>

        <p><b>From:</b> {ticket.from} → <b>To:</b> {ticket.to}</p>
        <p><b>Transport:</b> {ticket.transportType}</p>
        <p><b>Price:</b> ${ticket.price}</p>
        <p><b>Available:</b> {ticket.quantity}</p>
        <p><b>Departure:</b> {new Date(ticket.departureDateTime).toLocaleString()}</p>
        <p><b>Countdown:</b> {timeLeft}</p>

        <button
          disabled={isDisabled}
          onClick={() => setShowModal(true)}
          className={`mt-4 px-6 py-2 rounded text-white ${
            isDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Book Now
        </button>
      </div>

      {/* ---------------- Modal ---------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80">
            <h3 className="text-xl font-semibold mb-4">Book Ticket</h3>

            <input
              type="number"
              min="1"
              max={ticket.quantity}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="border p-2 w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
