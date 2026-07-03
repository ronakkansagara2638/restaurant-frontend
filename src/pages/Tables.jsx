import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import TableCard from "../components/TableCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTable, setNewTable] = useState({ tableNumber: "", capacity: 4 });
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const load = async () => {
    const { data } = await api.get("/tables");
    setTables(data);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleTableClick = (table) => {
    if (table.status === "Available") {
      navigate(`/orders/new/${table._id}`);
    } else if (table.status === "Occupied" && table.currentOrder) {
      navigate(`/orders/new/${table._id}`, { state: { existingOrderId: table.currentOrder._id } });
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    await api.post("/tables", { ...newTable, tableNumber: Number(newTable.tableNumber) });
    setNewTable({ tableNumber: "", capacity: 4 });
    setShowAddForm(false);
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl font-semibold text-ink">The floor</h1>
        {isAdmin && (
          <button
            onClick={() => setShowAddForm((s) => !s)}
            className="text-sm font-medium px-3 py-1.5 rounded-lg bg-forest-800 text-paper hover:bg-forest-700"
          >
            {showAddForm ? "Cancel" : "+ Add table"}
          </button>
        )}
      </div>
      <p className="text-ink/50 mb-6">Tap an available table to start an order, or an occupied one to view it.</p>

      {showAddForm && (
        <form onSubmit={handleAddTable} className="flex gap-3 items-end bg-white rounded-xl border border-ink/10 p-4 mb-6 max-w-md">
          <div>
            <label className="block text-xs text-ink/50 mb-1">Table number</label>
            <input
              required
              type="number"
              value={newTable.tableNumber}
              onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
              className="w-28 px-3 py-2 rounded-lg border border-ink/15"
            />
          </div>
          <div>
            <label className="block text-xs text-ink/50 mb-1">Seats</label>
            <input
              required
              type="number"
              value={newTable.capacity}
              onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
              className="w-20 px-3 py-2 rounded-lg border border-ink/15"
            />
          </div>
          <button className="bg-brass-500 hover:bg-brass-600 text-forest-950 font-semibold px-4 py-2 rounded-lg">
            Add
          </button>
        </form>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {tables.map((table) => (
          <TableCard key={table._id} table={table} onClick={handleTableClick} />
        ))}
      </div>

      {tables.length === 0 && <p className="text-ink/40 mt-6">No tables set up yet.</p>}

      <div className="flex gap-5 mt-8 text-xs font-mono uppercase tracking-wide text-ink/50">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-teal/70 inline-block" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rust/70 inline-block" /> Occupied</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brass-500/70 inline-block" /> Reserved</span>
      </div>
    </div>
  );
};

export default Tables;
