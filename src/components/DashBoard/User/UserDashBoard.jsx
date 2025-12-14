// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../../context/AuthProvider";
// import toast, { Toaster } from "react-hot-toast";

// const UserDashboard = () => {
//   const { user } = useContext(AuthContext);
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const [myBookings, setMyBookings] = useState([]);
//   const [allTickets, setAllTickets] = useState([]);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [loadingBookings, setLoadingBookings] = useState(true);
//   const [loadingTickets, setLoadingTickets] = useState(true);

//   // Fetch user's bookings
//   useEffect(() => {
//     if (!user?.email) return;

//     fetch(`${backendUrl}/bookings?userEmail=${user.email}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setMyBookings(data);
//         setLoadingBookings(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Failed to fetch bookings");
//         setLoadingBookings(false);
//       });
//   }, [user?.email]);

//   // Fetch all approved tickets
//   useEffect(() => {
//     fetch(`${backendUrl}/tickets?verificationStatus=approved`)
//       .then((res) => res.json())
//       .then((data) => {
//         setAllTickets(data);
//         setLoadingTickets(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Failed to fetch tickets");
//         setLoadingTickets(false);
//       });
//   }, []);

//   const handleBooking = async () => {
//     if (!selectedTicket) return toast.error("Select a ticket first!");
//     if (quantity < 1 || quantity > selectedTicket.quantity)
//       return toast.error("Invalid quantity!");

//     const bookingData = {
//       ticketId: selectedTicket._id,
//       ticketTitle: selectedTicket.title,
//       userName: user.displayName,
//       userEmail: user.email,
//       vendorEmail: selectedTicket.vendorEmail,
//       quantity,
//       totalPrice: quantity * selectedTicket.price,
//       status: "pending",
//     };

//     try {
//       const res = await fetch(`${backendUrl}/bookings`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bookingData),
//       });

//       if (!res.ok) throw new Error("Booking failed");

//       toast.success("Booking request sent!");
//       setMyBookings([...myBookings, { ...bookingData, id: Date.now() }]);
//       setSelectedTicket(null);
//       setQuantity(1);
//     } catch (err) {
//       console.error(err);
//       toast.error(err.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Toaster />
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md p-4">
//         <h2 className="text-xl font-bold mb-6">User Dashboard</h2>
//         <ul className="space-y-2">
//           <li>
//             <button className="w-full text-left px-4 py-2 rounded bg-blue-500 text-white">
//               My Bookings
//             </button>
//           </li>
//           <li>
//             <button className="w-full text-left px-4 py-2 rounded hover:bg-blue-500 hover:text-white">
//               Book Tickets
//             </button>
//           </li>
//         </ul>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 space-y-8">
//         {/* My Bookings */}
//         <section>
//           <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
//           {loadingBookings ? (
//             <p>Loading bookings...</p>
//           ) : myBookings.length === 0 ? (
//             <p>No bookings found.</p>
//           ) : (
//             <table className="table-auto w-full border">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="border px-2 py-1">Ticket</th>
//                   <th className="border px-2 py-1">Quantity</th>
//                   <th className="border px-2 py-1">Total Price</th>
//                   <th className="border px-2 py-1">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {myBookings.map((b) => (
//                   <tr key={b.id || b._id}>
//                     <td className="border px-2 py-1">{b.ticketTitle}</td>
//                     <td className="border px-2 py-1">{b.quantity}</td>
//                     <td className="border px-2 py-1">${b.totalPrice}</td>
//                     <td className="border px-2 py-1">
//                       <span
//                         className={`px-2 py-1 rounded text-white ${
//                           b.status === "pending"
//                             ? "bg-yellow-500"
//                             : b.status === "accepted"
//                             ? "bg-green-500"
//                             : "bg-red-500"
//                         }`}
//                       >
//                         {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </section>

//         {/* Book Tickets */}
//         <section>
//           <h2 className="text-2xl font-bold mb-4">Book Tickets</h2>
//           {loadingTickets ? (
//             <p>Loading tickets...</p>
//           ) : allTickets.length === 0 ? (
//             <p>No tickets available.</p>
//           ) : (
//             <div className="grid md:grid-cols-3 gap-6">
//               {allTickets.map((ticket) => (
//                 <div
//                   key={ticket._id}
//                   className={`bg-white p-4 rounded shadow cursor-pointer ${
//                     selectedTicket?._id === ticket._id
//                       ? "border-2 border-blue-500"
//                       : ""
//                   }`}
//                   onClick={() => setSelectedTicket(ticket)}
//                 >
//                   <h3 className="font-bold">{ticket.title}</h3>
//                   <p>
//                     {ticket.from} → {ticket.to}
//                   </p>
//                   <p>Price: ${ticket.price}</p>
//                   <p>Available: {ticket.quantity}</p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {selectedTicket && (
//             <div className="mt-4 bg-white p-4 rounded shadow">
//               <h3 className="font-bold mb-2">Book {selectedTicket.title}</h3>
//               <label>
//                 Quantity:
//                 <input
//                   type="number"
//                   min={1}
//                   max={selectedTicket.quantity}
//                   value={quantity}
//                   onChange={(e) => setQuantity(Number(e.target.value))}
//                   className="ml-2 border p-1 rounded w-20"
//                 />
//               </label>
//               <button
//                 className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                 onClick={handleBooking}
//               >
//                 Book Now
//               </button>
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default UserDashboard;

import { Outlet } from "react-router";
import Navbar from "../../Navbar/Navbar";
import Footer from "../../Footer/Footer";

const UserDashboard = () => {
  return (
    <div>
      
      <h2 className="text-2xl text-center font-bold mb-4">User Dashboard</h2>
      <Outlet />
    
    </div>
  );
};

export default UserDashboard;
