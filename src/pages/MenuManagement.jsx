import { useEffect, useState } from "react";
import api from "../api/axios.js";

const emptyForm = { name: "", description: "", price: "", category: "Main Course", foodType: "Veg", isAvailable: true };

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await api.get("/menu");
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await api.put(`/menu/${editingId}`, payload);
      } else {
        await api.post("/menu", payload);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this item");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      foodType: item.foodType,
      isAvailable: item.isAvailable,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this item from the menu? This cannot be undone.")) return;
    await api.delete(`/menu/${id}`);
    await load();
  };

  const toggleAvailability = async (item) => {
    await api.put(`/menu/${item._id}`, { isAvailable: !item.isAvailable });
    await load();
  };

  const grouped = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink mb-1">Menu management</h1>
      <p className="text-ink/50 mb-6">Add, edit and retire dishes. Changes apply instantly across all devices.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-ink/10 shadow-sm p-5 h-fit space-y-3">
          <h2 className="font-display text-lg font-semibold mb-1">{editingId ? "Edit item" : "Add a new item"}</h2>

          <input
            required
            placeholder="Item name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-ink/15 focus:border-brass-500 outline-none"
          />
          <textarea
            placeholder="Short description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-ink/15 focus:border-brass-500 outline-none"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="number"
              min="0"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-ink/15 focus:border-brass-500 outline-none"
            />
            <select
              value={form.foodType}
              onChange={(e) => setForm({ ...form, foodType: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-ink/15 focus:border-brass-500 outline-none"
            >
              <option>Veg</option>
              <option>Non-Veg</option>
              <option>Vegan</option>
              <option>Egg</option>
            </select>
          </div>
          <input
            required
            placeholder="Category (e.g. Starters, Main Course, Desserts)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-ink/15 focus:border-brass-500 outline-none"
          />
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
            />
            Available to order
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brass-500 hover:bg-brass-600 text-forest-950 font-semibold py-2 rounded-lg disabled:opacity-60"
            >
              {editingId ? "Save changes" : "Add item"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border border-ink/15 text-ink/70">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-2 space-y-6">
          {Object.keys(grouped).length === 0 && (
            <p className="text-ink/40">No menu items yet — add your first dish using the form.</p>
          )}
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div key={category} className="bg-white rounded-xl border border-ink/10 shadow-sm p-5">
              <h3 className="font-display text-lg font-semibold mb-3">{category}</h3>
              <div className="divide-y divide-ink/5">
                {categoryItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between py-3 gap-3">
                    <div className="min-w-0">
                      <p className={`font-medium ${!item.isAvailable ? "text-ink/40 line-through" : "text-ink"}`}>
                        {item.name}{" "}
                        <span className="text-xs font-mono text-ink/40">({item.foodType})</span>
                      </p>
                      <p className="text-xs text-ink/50 truncate max-w-md">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-forest-700">₹{item.price.toFixed(2)}</span>
                      <button
                        onClick={() => toggleAvailability(item)}
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                          item.isAvailable ? "border-teal text-teal" : "border-ink/20 text-ink/40"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Hidden"}
                      </button>
                      <button onClick={() => handleEdit(item)} className="text-xs px-2.5 py-1 rounded-full border border-ink/15 text-ink/60">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="text-xs px-2.5 py-1 rounded-full border border-danger/40 text-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
