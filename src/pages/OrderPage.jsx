import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import MenuItemPicker from "../components/MenuItemPicker.jsx";

const OrderPage = () => {
  const { tableId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const existingOrderId = location.state?.existingOrderId;

  const [menu, setMenu] = useState([]);
  const [table, setTable] = useState(null);
  const [existingOrder, setExistingOrder] = useState(null);
  const [cart, setCart] = useState({}); // menuItemId -> quantity
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [menuRes, tablesRes] = await Promise.all([api.get("/menu"), api.get("/tables")]);
      setMenu(menuRes.data.filter((m) => m.isAvailable));
      const t = tablesRes.data.find((tb) => tb._id === tableId);
      setTable(t);

      if (existingOrderId) {
        const { data } = await api.get(`/orders/${existingOrderId}`);
        setExistingOrder(data);
      }
    };
    load();
  }, [tableId, existingOrderId]);

  const addItem = (item) => setCart((c) => ({ ...c, [item._id]: (c[item._id] || 0) + 1 }));
  const removeItem = (item) =>
    setCart((c) => {
      const next = { ...c };
      if (next[item._id] > 1) next[item._id] -= 1;
      else delete next[item._id];
      return next;
    });

  const cartLines = useMemo(
    () =>
      Object.entries(cart).map(([id, qty]) => {
        const item = menu.find((m) => m._id === id);
        return item ? { item, qty } : null;
      }).filter(Boolean),
    [cart, menu]
  );

  const cartTotal = cartLines.reduce((sum, l) => sum + l.item.price * l.qty, 0);

  const handleSubmit = async () => {
    if (cartLines.length === 0) return;
    setError("");
    setSubmitting(true);
    try {
      const items = cartLines.map((l) => ({ menuItemId: l.item._id, quantity: l.qty }));
      if (existingOrder) {
        await api.put(`/orders/${existingOrder._id}/items`, { items });
      } else {
        await api.post("/orders", { tableId, items });
      }
      navigate("/tables");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the order");
    } finally {
      setSubmitting(false);
    }
  };

  const grouped = menu.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink mb-1">
        Table {table?.tableNumber ?? "..."}
      </h1>
      <p className="text-ink/50 mb-6">
        {existingOrder ? "Add more items to the running order." : "Build a new order for this table."}
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="bg-white rounded-xl border border-ink/10 shadow-sm p-5">
              <h3 className="font-display text-lg font-semibold mb-1">{category}</h3>
              <div>
                {items.map((item) => (
                  <MenuItemPicker
                    key={item._id}
                    item={item}
                    quantity={cart[item._id]}
                    onAdd={addItem}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-ink/10 shadow-sm p-5 h-fit sticky top-6">
          <h3 className="font-display text-lg font-semibold mb-3">
            {existingOrder ? "Adding to order" : "New order"}
          </h3>

          {existingOrder && existingOrder.items.length > 0 && (
            <div className="mb-4 pb-4 border-b border-dashed border-ink/15">
              <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">Already on this table</p>
              {existingOrder.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-sm text-ink/60 mb-1">
                  <span>{i.quantity} × {i.name}</span>
                  <span className="font-mono">₹{(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {cartLines.length === 0 ? (
            <p className="text-ink/40 text-sm">Tap "+" next to a dish to add it here.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {cartLines.map(({ item, qty }) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{qty} × {item.name}</span>
                  <span className="font-mono">₹{(item.price * qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between font-semibold pt-3 border-t border-ink/10">
            <span>New items total</span>
            <span className="font-mono">₹{cartTotal.toFixed(2)}</span>
          </div>

          {error && <p className="text-sm text-danger mt-3">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={cartLines.length === 0 || submitting}
            className="w-full mt-4 bg-brass-500 hover:bg-brass-600 text-forest-950 font-semibold py-2.5 rounded-lg disabled:opacity-50"
          >
            {submitting ? "Sending to kitchen..." : existingOrder ? "Add to order" : "Send order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
