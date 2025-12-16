import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import toast, { Toaster } from "react-hot-toast";

const TransactionHistory = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    fetch(`${backendUrl}/transactions/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load transaction history");
        setLoading(false);
      });
  }, [user, backendUrl]);

  if (loading) {
    return <p className="text-center mt-10">Loading transactions...</p>;
  }

  if (transactions.length === 0) {
    return <p className="text-center mt-10">No transactions found.</p>;
  }

  return (
    <div className="p-6">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>

      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">Transaction ID</th>
            <th className="border px-3 py-2">Ticket Title</th>
            <th className="border px-3 py-2">Amount</th>
            <th className="border px-3 py-2">Payment Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map(tx => (
            <tr key={tx._id}>
              <td className="border px-3 py-2 text-sm">
                {tx.transactionId}
              </td>
              <td className="border px-3 py-2">
                {tx.ticketTitle}
              </td>
              <td className="border px-3 py-2">
                ${tx.amount}
              </td>
              <td className="border px-3 py-2">
                {new Date(tx.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
