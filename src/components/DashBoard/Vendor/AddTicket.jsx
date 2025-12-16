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

  // ---------------- handlers ----------------
  const handleChange = (e) => {
    setTicketData({ ...ticketData, [e.target.name]: e.target.value });
  };

  const handlePerkChange = (e) => {
    setPerks({ ...perks, [e.target.name]: e.target.checked });
  };

  // ---------------- image upload ----------------
  const uploadImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=0ef452beda453c082cb0d572cb02e855`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      return data?.data?.url || "";
    } catch {
      toast.error("Image upload failed");
      return "";
    }
  };

  // ---------------- submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    const imageFile = e.target.image.files[0];
    const imageUrl = imageFile ? await uploadImage(imageFile) : "";

    const selectedPerks = Object.keys(perks).filter((key) => perks[key]);

    // combine date & time
    const departureDateTime = new Date(
      `${ticketData.date}T${ticketData.time}`
    ).toISOString();

    const finalTicket = {
      title: ticketData.title,
      from: ticketData.from,
      to: ticketData.to,
      transportType: ticketData.transportType,
      price: Number(ticketData.price),
      quantity: Number(ticketData.quantity),
      perks: selectedPerks,
      image: imageUrl,
      vendorName: user.displayName,
      vendorEmail: user.email,
      status: "pending",
      departureDateTime,
    };

    try {
      const res = await fetch(`${backendUrl}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalTicket),
      });

      if (!res.ok) throw new Error("Failed to add ticket");

      toast.success("Ticket submitted for admin approval!");

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
      toast.error(err.message);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <Toaster />

      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Add New Ticket
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Ticket Title"
          value={ticketData.title}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="from"
            placeholder="From Location"
            value={ticketData.from}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />
          <input
            type="text"
            name="to"
            placeholder="To Location"
            value={ticketData.to}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />
        </div>

        <input
          type="text"
          name="transportType"
          placeholder="Transport Type (Bus / Train / Plane)"
          value={ticketData.transportType}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price Per Unit"
            value={ticketData.price}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Ticket Quantity"
            value={ticketData.quantity}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={ticketData.date}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />
          <input
            type="time"
            name="time"
            value={ticketData.time}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          {Object.keys(perks).map((perk) => (
            <label key={perk} className="flex items-center gap-2">
              <input
                type="checkbox"
                name={perk}
                checked={perks[perk]}
                onChange={handlePerkChange}
              />
              <span className="capitalize">{perk}</span>
            </label>
          ))}
        </div>

        <input
          type="file"
          name="image"
          accept="image/*"
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          value={user?.displayName || ""}
          readOnly
          className="w-full border p-3 rounded bg-gray-100"
        />

        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="w-full border p-3 rounded bg-gray-100"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Add Ticket
        </button>
      </form>
    </div>
  );
};

export default AddTicket;
