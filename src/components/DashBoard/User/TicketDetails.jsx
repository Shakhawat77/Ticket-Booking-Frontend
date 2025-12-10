import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../../context/AuthProvider";

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState("");

  // Fetch ticket details
  useEffect(() => {
    fetch(`http://localhost:3000/tickets/${id}`)
      .then((res) => res.json())
      .then((data) => setTicket(data));
  }, [id]);

  // Countdown timer
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
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ticket]);

  // Booking handler
  const handleBooking = async () => {
    if (!ticket) return;

    const selectedQuantity = Number(quantity);

    if (selectedQuantity > ticket.quantity) {
      toast.error("Booking quantity cannot exceed available tickets");
      return;
    }

    const totalPrice = selectedQuantity * ticket.price;

    const bookingData = {
      from: ticket.from,
      to: ticket.to,
      departureDateTime: ticket.departureDateTime,
      ticketId: ticket._id,
      ticketTitle: ticket.title,
      ticketImage: ticket.image,
      userEmail: user.email,
      userName: user.displayName,
      quantity: selectedQuantity,
      totalPrice: totalPrice,
      status: "pending",
    };

    try {
      const res = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      toast.success("Booking successful!");
    } catch (err) {
      console.error(err);
      toast.error("Booking failed");
    }
  };

  if (!ticket) return <div className="text-center mt-20">Loading...</div>;

  // Disable book now if departure passed or quantity 0
  const departurePassed = new Date(ticket.departureDateTime) < new Date();
  const isDisabled = departurePassed || ticket.quantity <= 0;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-lg overflow-hidden">
      <Toaster />
      {/* Ticket Image */}
      {ticket.image && (
        <img
          src={ticket.image}
          alt={ticket.title}
          className="w-full h-64 object-cover"
        />
      )}

      {/* Ticket Info */}
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">
          {ticket.title}
        </h2>
        <p className="mb-2">
          <span className="font-semibold">From:</span> {ticket.from} →{" "}
          <span className="font-semibold">To:</span> {ticket.to}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Transport:</span>{" "}
          {ticket.transportType}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Price:</span> ${ticket.price}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Available Tickets:</span>{" "}
          {ticket.quantity}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Departure:</span>{" "}
          {new Date(ticket.departureDateTime).toLocaleString()}
        </p>
        <p className="mb-4">
          <span className="font-semibold">Countdown:</span> {timeLeft}
        </p>

        {/* Booking Section */}
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="number"
            min="1"
            max={ticket.quantity}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border p-2 w-24 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleBooking}
            disabled={isDisabled}
            className={`px-6 py-2 font-semibold text-white rounded transition ${
              isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
