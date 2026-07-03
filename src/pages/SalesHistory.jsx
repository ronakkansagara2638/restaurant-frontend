import { useEffect, useState } from "react";
import api from "../api/axios.js";

const SalesHistory = () => {
  const [bills, setBills] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const load = async () => {
    const { data } = await api.get(`/bills${statusFilter ? `?status=${statusFilter}` : ""}`);
    setBills(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const totalRevenue = bills.filter((b) => b.paymentStatus === "Paid").reduce((sum, b) => sum + b.grandTotal, 0);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink mb-1">Sales history</h1>
      <p className="text-ink/50 mb-6">Every bill ever generated, newest first.</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {["", "Paid", "Unpaid"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-sm px-3 py-1.5 rounded-full border ${
                statusFilter === s ? "bg-forest-800 text-paper border-forest-800" : "border-ink/15 text-ink/60"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
        <p className="font-mono text-sm text-ink/60">
          Total (paid): <span className="font-semibold text-ink">₹{totalRevenue.toFixed(2)}</span>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-ink/10 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper-dim">
            <tr className="text-left text-ink/50 uppercase text-xs tracking-wide">
              <th className="py-3 px-4">Bill #</th>
              <th className="py-3 px-4">Table</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill._id} className="border-t border-ink/5">
                <td className="py-2.5 px-4 font-mono">{bill.billNumber}</td>
                <td className="py-2.5 px-4">{bill.tableNumber}</td>
                <td className="py-2.5 px-4">{new Date(bill.createdAt).toLocaleString()}</td>
                <td className="py-2.5 px-4 text-right font-mono">₹{bill.grandTotal.toFixed(2)}</td>
                <td className="py-2.5 px-4">{bill.paymentMethod}</td>
                <td className="py-2.5 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${bill.paymentStatus === "Paid" ? "bg-teal/10 text-teal" : "bg-rust/10 text-rust"}`}>
                    {bill.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bills.length === 0 && <p className="text-ink/40 text-sm p-5">No bills found.</p>}
      </div>
    </div>
  );
};

export default SalesHistory;
