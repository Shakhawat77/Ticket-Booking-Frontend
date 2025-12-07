
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthProvider";

const AddTicket = () => {
  const { user } = useContext(AuthContext)

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
    setTicketData({
      ...ticketData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePerkChange = (e) => {
    setPerks({
      ...perks,
      [e.target.name]: e.target.checked,
    });
  };

  // Upload image to imgbb
  const uploadImage = async (imageFile) => {
    const formData = new FormData()
    formData.append("image", imageFile);
    

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=0ef452beda453c082cb0d572cb02e855`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
     return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageFile = e.target.image.files[0];
    let imageUrl = "";

    try {
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const finalTicket = {
        ...ticketData,
        perks,
        image: imageUrl,
        vendorName: user?.displayName,
        vendorEmail: user?.email,
        verificationStatus: "pending",
        dateTime: ticketData.date + " " + ticketData.time,
      };
      console.log(finalTicket);

      const response = await fetch("http://localhost:3000/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalTicket),
      });

    //   if (!response.ok) throw new Error("Failed to add ticket");

      toast.success("Ticket added successfully!");
      e.target.reset();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-5 shadow-lg rounded border">
      <h2 className="text-2xl font-bold mb-5">Add Ticket</h2>

      <form onSubmit={handleSubmit}>
        {/* Ticket Title */}
        <input
          type="text"
          name="title"
          placeholder="Ticket Title"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mb-3"
        />

        {/* From - To */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="from"
            placeholder="From Location"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="to"
            placeholder="To Location"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>

        {/* Transport Type */}
        <input
          type="text"
          name="transportType"
          placeholder="Transport Type"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded my-3"
        />

        {/* Price and Quantity */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="price"
            placeholder="Price Per Unit"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Ticket Quantity"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3 my-3">
          <input
            type="date"
            name="date"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="time"
            name="time"
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>

        {/* Perks checkboxes */}
        <div className="my-3">
          <p className="font-semibold">Perks:</p>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="ac" onChange={handlePerkChange} /> AC
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="wifi" onChange={handlePerkChange} />{" "}
            WiFi
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="breakfast"
              onChange={handlePerkChange}
            />
            Breakfast
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="tv" onChange={handlePerkChange} /> TV
          </label>
        </div>

        {/* Image Upload */}
        <input
          type="file"
          name="image"
          accept="image/*"
          required
          className="w-full border p-2 rounded my-3"
        />

        {/* Vendor (auto filled) */}
        <input
          type="text"
          value={user?.displayName}
          readOnly
          className="w-full border p-2 rounded my-3 bg-gray-200"
        />
        <input
          type="email"
          value={user?.email}
          readOnly
          className="w-full border p-2 rounded my-3 bg-gray-200"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded mt-3"
        >
          Add Ticket
        </button>
      </form>
    </div>
  );
};

export default AddTicket;
