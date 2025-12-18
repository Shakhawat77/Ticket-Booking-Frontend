import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import toast, { Toaster } from "react-hot-toast";

const TransactionHistory = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!user || !token) return;

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${backendUrl}/transactions/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch transactions");

        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Could not load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, token]);

  if (loading) return <p className="text-center mt-6">Loading transactions...</p>;
  if (!transactions.length) return <p className="text-center mt-6">No transactions found.</p>;

  return (
    <div className="p-6">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-2">#</th>
              <th className="border px-3 py-2">Ticket</th>
              <th className="border px-3 py-2">Quantity</th>
              <th className="border px-3 py-2">Total Price</th>
              <th className="border px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={t._id}>
                <td className="border px-3 py-2">{idx + 1}</td>
                <td className="border px-3 py-2">{t.ticketTitle}</td>
                <td className="border px-3 py-2">{t.quantity}</td>
                <td className="border px-3 py-2">${t.totalPrice}</td>
                <td className="border px-3 py-2">
                  {new Date(t.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
