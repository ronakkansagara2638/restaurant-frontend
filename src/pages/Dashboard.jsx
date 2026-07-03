import { useEffect, useState } from "react";
import api from "../api/axios.js";
import StatCard from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// ── Confirm modal ──────────────────────────────────────────────────────────────
// Two-step confirmation: the admin must type "CLEAR" to unlock the button.
// This prevents accidental wipes on a shared POS terminal.
const ClearDataModal = ({ onConfirm, onCancel, clearing }) => {
  const [typed, setTyped] = useState("");
  const confirmed = typed.trim().toUpperCase() === "CLEAR";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-7 w-full max-w-md">
        {/* Warning icon */}
        <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h2 className="font-display text-2xl font-semibold text-ink mb-1">Clear all data?</h2>
        <p className="text-sm text-ink/60 mb-5 leading-relaxed">
          This will permanently delete <strong className="text-ink">every order and bill</strong> in the system, and reset all tables to Available.
          <br /><br />
          Your <strong className="text-ink">menu, staff accounts, tables and settings</strong> will not be affected.
          <br /><br />
          This action <strong className="text-danger">cannot be undone.</strong>
        </p>

        <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1.5">
          Type <span className="text-danger font-mono">CLEAR</span> to confirm
        </label>
        <input
          autoFocus
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="CLEAR"
          className="w-full px-3 py-2.5 rounded-lg border border-ink/15 focus:border-danger outline-none font-mono mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={clearing}
            className="flex-1 px-4 py-2.5 rounded-lg border border-ink/15 text-ink/70 font-medium hover:bg-ink/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!confirmed || clearing}
            className="flex-1 px-4 py-2.5 rounded-lg bg-danger text-white font-semibold hover:bg-danger/90 disabled:opacity-40 transition-colors"
          >
            {clearing ? "Clearing…" : "Clear everything"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Result toast ───────────────────────────────────────────────────────────────
const ResultToast = ({ result, onClose }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-forest-900 text-paper rounded-xl shadow-2xl px-5 py-3.5 flex items-center gap-4 min-w-64">
    <svg className="w-5 h-5 text-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    <div className="flex-1">
      <p className="text-sm font-medium">Data cleared successfully</p>
      <p className="text-xs text-paper/50">
        {result.deletedOrders} orders · {result.deletedBills} bills removed · all tables reset
      </p>
    </div>
    <button onClick={onClose} className="text-paper/40 hover:text-paper ml-2 text-lg leading-none">×</button>
  </div>
);

// ── Dashboard ──────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearResult, setClearResult] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get("/dashboard/summary");
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load dashboard data");
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClear = async () => {
    setClearing(true);
    try {
      const { data } = await api.delete("/dashboard/clear-data");
      setShowModal(false);
      setClearResult(data);
      await load(); // Refresh stats to show zeroed counters
      // Auto-dismiss the toast after 6 seconds
      setTimeout(() => setClearResult(null), 6000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not clear data — try again");
      setShowModal(false);
    } finally {
      setClearing(false);
    }
  };

  return (
    <>
      {showModal && (
        <ClearDataModal
          onConfirm={handleClear}
          onCancel={() => setShowModal(false)}
          clearing={clearing}
        />
      )}

      {clearResult && (
        <ResultToast result={clearResult} onClose={() => setClearResult(null)} />
      )}

      <div className="flex items-start justify-between mb-1 gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Today at a glance</h1>
          <p className="text-ink/50">A live snapshot of the floor and the till.</p>
        </div>

        {/* Only admins see the reset button */}
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 mt-1 flex items-center gap-2 px-4 py-2 rounded-lg border border-danger/30 text-danger text-sm font-medium hover:bg-danger/5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear all data
          </button>
        )}
      </div>

      <div className="mb-6" />

      {error && <p className="text-danger mb-4">{error}</p>}

      {summary && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Revenue today" value={`₹${summary.todaysRevenue.toFixed(2)}`} accent="brass" />
            <StatCard label="Bills settled today" value={summary.todaysBillCount} accent="teal" />
            <StatCard label="Active orders" value={summary.activeOrdersCount} accent="rust" />
            <StatCard
              label="Tables occupied"
              value={`${summary.occupiedTables} / ${summary.totalTables}`}
              accent="brass"
            />
          </div>

          <div className="bg-white rounded-xl border border-ink/10 shadow-sm p-5">
            <h2 className="font-display text-xl font-semibold mb-4">Top sellers today</h2>
            {summary.topItems.length === 0 ? (
              <p className="text-ink/40 text-sm">No items sold yet today.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink/40 uppercase text-xs tracking-wide">
                    <th className="py-2">Item</th>
                    <th className="py-2 text-right">Qty sold</th>
                    <th className="py-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.topItems.map((item) => (
                    <tr key={item._id} className="border-t border-ink/5">
                      <td className="py-2.5">{item._id}</td>
                      <td className="py-2.5 text-right font-mono">{item.quantity}</td>
                      <td className="py-2.5 text-right font-mono">₹{item.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
