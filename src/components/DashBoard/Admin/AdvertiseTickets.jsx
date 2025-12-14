
import  { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdvertiseToggle from "../../Components/AdvertiseToggle";

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(tickets);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      

      const res = await fetch(`http://localhost:3000/allTickets`, {
        headers: {
          "Content-Type": "application/json",
       
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch tickets");
      }

      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error fetching tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Serial No</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Ticket Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Advertise</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket,index) => (
            <tr key={ticket._id} className="hover:bg-gray-100">
              <td>{index+1}</td>
              <td className="w-5 h-5 rounded-full"><img src={ticket.image} alt="" /></td>
              <td className="border px-4 py-2">{ticket.title}</td>
              <td className="border px-4 py-2">${ticket.price}</td>
              <td className="border px-4 py-2">{new Date(ticket.date).toLocaleDateString()}</td>
              
              <td className="border px-4 py-2">
                {/* Optional Advertise toggle */}
                <AdvertiseToggle
                  ticketId={ticket._id}
                  isAdvertised={ticket.isAdvertised}
                  onStatusChange={(id, newStatus) => {
                    // Update local state
                    setTickets((prev) =>
                      prev.map((t) => (t._id === id ? { ...t, isAdvertised: newStatus } : t))
                    );
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllTickets;
