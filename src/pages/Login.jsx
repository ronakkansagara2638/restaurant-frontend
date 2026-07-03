import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not sign in. Check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-4xl font-semibold text-brass-400">Tablewise</p>
          <p className="text-paper/60 text-sm mt-1 tracking-wide">Floor &amp; Billing Console</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-paper rounded-2xl p-7 shadow-xl space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-ink/15 bg-white focus:border-brass-500 outline-none"
              placeholder="you@restaurant.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/60 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-ink/15 bg-white focus:border-brass-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brass-500 hover:bg-brass-600 text-forest-950 font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-paper/40 text-xs mt-5">
          Ask your admin for staff login details if you don't have one.
        </p>
      </div>
    </div>
  );
};

export default Login;
