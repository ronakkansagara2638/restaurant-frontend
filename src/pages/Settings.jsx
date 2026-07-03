import { useEffect, useState } from "react";
import api from "../api/axios.js";

const Settings = () => {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/settings").then(({ data }) => setForm(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await api.put("/settings", form);
    setForm(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!form) return null;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink mb-1">Restaurant settings</h1>
      <p className="text-ink/50 mb-6">These details appear on every printed bill.</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-ink/10 shadow-sm p-6 max-w-lg space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">Restaurant name</label>
          <input
            value={form.restaurantName}
            onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-ink/15"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">Address</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-ink/15"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-ink/15"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">GSTIN (optional)</label>
            <input
              value={form.gstNumber}
              onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-ink/15"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">Default tax %</label>
            <input
              type="number"
              value={form.defaultTaxPercent}
              onChange={(e) => setForm({ ...form, defaultTaxPercent: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-ink/15"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">Currency symbol</label>
            <input
              value={form.currencySymbol}
              onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-ink/15"
            />
          </div>
        </div>

        <button type="submit" className="bg-brass-500 hover:bg-brass-600 text-forest-950 font-semibold px-5 py-2.5 rounded-lg">
          Save settings
        </button>
        {saved && <span className="text-teal text-sm ml-3">Saved ✓</span>}
      </form>
    </div>
  );
};

export default Settings;
