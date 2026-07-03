import { useEffect, useState } from "react";
import api from "../api/axios.js";

const emptyForm = { name: "", email: "", password: "", role: "staff" };

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const { data } = await api.get("/auth/staff");
    setStaff(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      await api.post("/auth/staff", form);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create this account");
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (user) => {
    await api.put(`/auth/staff/${user._id}`, { isActive: !user.isActive });
    await load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink mb-1">Staff accounts</h1>
      <p className="text-ink/50 mb-6">Create logins for waiters and cashiers. Only admins can manage the menu and settings.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-ink/10 shadow-sm p-5 h-fit space-y-3">
          <h2 className="font-display text-lg font-semibold mb-1">Add a staff member</h2>
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-ink/15"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-ink/15"
          />
          <input
            required
            type="password"
            placeholder="Temporary password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-ink/15"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-ink/15"
          >
            <option value="staff">Staff (waiter / cashier)</option>
            <option value="admin">Admin (full access)</option>
          </select>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={creating}
            className="w-full bg-brass-500 hover:bg-brass-600 text-forest-950 font-semibold py-2 rounded-lg disabled:opacity-60"
          >
            Create account
          </button>
        </form>

        <div className="lg:col-span-2 bg-white rounded-xl border border-ink/10 shadow-sm p-5">
          <h3 className="font-display text-lg font-semibold mb-3">All accounts</h3>
          <div className="divide-y divide-ink/5">
            {staff.map((user) => (
              <div key={user._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{user.name} <span className="text-xs font-mono text-ink/40">({user.role})</span></p>
                  <p className="text-xs text-ink/50">{user.email}</p>
                </div>
                <button
                  onClick={() => toggleActive(user)}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    user.isActive ? "border-teal text-teal" : "border-ink/20 text-ink/40"
                  }`}
                >
                  {user.isActive ? "Active" : "Disabled"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
