import React, { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../../context/AuthProvider";

const AddTicket = () => {
  const { user } = useContext(AuthContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [perks, setPerks] = useState({
    ac: false,
    wifi: false,
    breakfast: false,
    tv: false,
  });

  const [ticketData, setTicketData] = useState({
    title: "",
    from: "",
    to: "",
    transportType: "",
    price: "",
    quantity: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setTicketData({ ...ticketData, [e.target.name]: e.target.value });
  };

  const handlePerkChange = (e) => {
    setPerks({ ...perks, [e.target.name]: e.target.checked });
  };

  const uploadImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=0ef452beda453c082cb0d572cb02e855`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      return data.data.url;
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageFile = e.target.image.files[0];
    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    // Convert perks object to array
    const selectedPerks = Object.keys(perks).filter((key) => perks[key]);

    const finalTicket = {
      ...ticketData,
      perks: selectedPerks,
      image: imageUrl || "",
      vendorName: user?.displayName || "",
      vendorEmail: user?.email || "",
      verificationStatus: "pending",
      departureDate: ticketData.date,
      departureTime: ticketData.time,
    };

    try {
      const res = await fetch(`${backendUrl}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalTicket),
      });

      if (!res.ok) throw new Error("Failed to add ticket");

      toast.success("Ticket added successfully!");
      e.target.reset();
      setPerks({ ac: false, wifi: false, breakfast: false, tv: false });
      setTicketData({
        title: "",
        from: "",
        to: "",
        transportType: "",
        price: "",
        quantity: "",
        date: "",
        time: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <Toaster />
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Add New Ticket
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ticket Title */}
        <input
          type="text"
          name="title"
          placeholder="Ticket Title"
          value={ticketData.title}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* From & To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="from"
            placeholder="From Location"
            value={ticketData.from}
            onChange={handleChange}
            required
            className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="to"
            placeholder="To Location"
            value={ticketData.to}
            onChange={handleChange}
            required
            className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Transport Type */}
        <input
          type="text"
          name="transportType"
          placeholder="Transport Type (Bus, Train, Launch, Plane)"
          value={ticketData.transportType}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Price & Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price Per Unit"
            value={ticketData.price}
            onChange={handleChange}
            required
            className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Ticket Quantity"
            value={ticketData.quantity}
            onChange={handleChange}
            required
            className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={ticketData.date}
            onChange={handleChange}
            required
            className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="time"
            name="time"
            value={ticketData.time}
            onChange={handleChange}
            required
            className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Perks */}
        <div className="flex flex-wrap gap-4">
          {Object.keys(perks).map((perk) => (
            <label key={perk} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={perk}
                checked={perks[perk]}
                onChange={handlePerkChange}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span className="capitalize">{perk}</span>
            </label>
          ))}
        </div>

        {/* Image Upload */}
        <input
          type="file"
          name="image"
          accept="image/*"
          required
          className="w-full border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Vendor Info (readonly) */}
        <input
          type="text"
          value={user?.displayName || ""}
          readOnly
          className="w-full border p-3 rounded bg-gray-100 text-gray-700"
        />
        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="w-full border p-3 rounded bg-gray-100 text-gray-700"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold p-3 rounded hover:bg-blue-700 transition"
        >
          Add Ticket
        </button>
      </form>
    </div>
  );
};

export default AddTicket;
