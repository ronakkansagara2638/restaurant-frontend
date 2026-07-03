import { useEffect, useState } from "react";
import api from "../api/axios.js";

const statusFlow = ["Pending", "Preparing", "Served"];
const statusStyles = {
  Pending: "bg-rust/10 text-rust border-rust",
  Preparing: "bg-brass-500/10 text-brass-600 border-brass-600",
  Served: "bg-teal/10 text-teal border-teal",
};

const ActiveOrders = () => {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const { data } = await api.get("/orders?active=true");
    setOrders(data);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const advance = async (order) => {
    const idx = statusFlow.indexOf(order.status);
    const next = statusFlow[idx + 1];
    if (!next) return;
    await api.put(`/orders/${order._id}/status`, { status: next });
    await load();
  };

  const cancel = async (order) => {
    if (!window.confirm(`Cancel the order for table ${order.tableNumber}?`)) return;
    await api.put(`/orders/${order._id}/status`, { status: "Cancelled" });
    await load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink mb-1">Active orders</h1>
      <p className="text-ink/50 mb-6">Move tickets through the kitchen, table by table.</p>

      {orders.length === 0 && <p className="text-ink/40">No active orders right now — the kitchen is quiet.</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl border border-ink/10 shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-xl font-semibold">Table {order.tableNumber}</span>
              <span className={`text-xs font-mono uppercase px-2 py-1 rounded-full border ${statusStyles[order.status] || ""}`}>
                {order.status}
              </span>
            </div>

            <div className="flex-1 space-y-1 mb-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-ink/70">
                  <span>{item.quantity} × {item.name}</span>
                  <span className="font-mono">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm font-semibold border-t border-ink/10 pt-3 mb-3">
              <span>Subtotal</span>
              <span className="font-mono">₹{order.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
              {statusFlow.indexOf(order.status) < statusFlow.length - 1 && (
                <button
                  onClick={() => advance(order)}
                  className="flex-1 bg-forest-800 hover:bg-forest-700 text-paper text-sm font-medium py-2 rounded-lg"
                >
                  Mark {statusFlow[statusFlow.indexOf(order.status) + 1]}
                </button>
              )}
              <button
                onClick={() => cancel(order)}
                className="px-3 py-2 rounded-lg border border-danger/30 text-danger text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveOrders;
