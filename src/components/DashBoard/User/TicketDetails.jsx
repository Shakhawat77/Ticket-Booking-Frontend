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

  useEffect(() => {
    fetch(`${backendUrl}/tickets/${id}`)
      .then((res) => res.json())
      .then((data) => setTicket(data))
      .catch(() => toast.error("Failed to load ticket"));
  }, [id, backendUrl]);

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

  const handleBooking = async () => {
    if (!user) return toast.error("Please login first");

    if (quantity < 1 || quantity > ticket.quantity) {
      return toast.error("Invalid ticket quantity");
    }

    const token = localStorage.getItem("accessToken");

    const bookingData = {
      ticketId: ticket._id,
      ticketTitle: ticket.title,
      ticketImage: ticket.image,
      vendorEmail: ticket.vendorEmail,
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

      toast.success("Booking successful!");
      setShowModal(false);
      setQuantity(1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!ticket) return <p className="text-center mt-20 h-full">Loading ticket...</p>;

  const departurePassed = new Date(ticket.departureDateTime) < new Date();
  const isDisabled = departurePassed || ticket.quantity === 0;

  return (
    <div className="max-w-5xl mx-auto mt-10 ">
      <Toaster />

    
      {ticket.image && (
        <div className="relative ">
          <img
            src={ticket.image}
            alt={ticket.title}
            className="w-full h-80 object-cover rounded-xl shadow"
          />
          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
            <h1 className="text-white text-4xl font-bold">{ticket.title}</h1>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-yellow-300 via-orange-400 to-green-500 shadow-lg rounded-xl p-6 mt-6 space-y-3">
        <p><b>From:</b> {ticket.from} → <b>To:</b> {ticket.to}</p>
        <p><b>Transport:</b> {ticket.transportType}</p>
        <p><b>Price:</b> ${ticket.price} / ticket</p>
        <p><b>Available Tickets:</b> {ticket.quantity}</p>
        <p>
          <b>Departure:</b>{" "}
          {new Date(ticket.departureDateTime).toLocaleString()}
        </p>
        <p>
          <b>Countdown:</b>{" "}
          <span className="text-blue-600 font-semibold">{timeLeft}</span>
        </p>

        <button
          disabled={isDisabled}
          onClick={() => setShowModal(true)}
          className={`mt-4 px-6 py-3 rounded-lg text-white font-semibold transition ${
            isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Book Now
        </button>

        {isDisabled && (
          <p className="text-sm text-red-500 mt-2">
            Booking unavailable for this ticket
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-yellow-300 via-orange-400 to-green-500 rounded-xl p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Book Ticket</h3>

            <label className="block mb-2 font-medium">
              Ticket Quantity
            </label>
            <input
              type="number"
              min="1"
              max={ticket.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2 w-full rounded mb-4"
            />

            <p className="mb-4">
              <b>Total Price:</b> ${quantity * ticket.price}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
