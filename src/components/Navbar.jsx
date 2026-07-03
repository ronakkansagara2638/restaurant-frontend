import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const linkBase =
  "block px-4 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-colors";
const linkInactive = "text-paper/70 hover:bg-forest-700 hover:text-paper";
const linkActive = "bg-brass-500 text-forest-950";

const NavItem = ({ to, label, end }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
  >
    {label}
  </NavLink>
);

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="no-print w-64 min-h-screen bg-forest-900 text-paper flex flex-col shrink-0">
      <div className="px-5 pt-7 pb-5 border-b border-forest-700/60">
        <p className="font-display text-2xl font-semibold text-brass-400 leading-none">
          Tablewise
        </p>
        <p className="text-xs text-paper/50 mt-1 tracking-wide">Floor &amp; Billing Console</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavItem to="/" label="Dashboard" end />
        <NavItem to="/tables" label="Tables" />
        <NavItem to="/orders" label="Active Orders" />
        <NavItem to="/billing" label="Billing" />
        <NavItem to="/sales" label="Sales History" />
        {isAdmin && <NavItem to="/menu" label="Menu Management" />}
        {isAdmin && <NavItem to="/staff" label="Staff" />}
        {isAdmin && <NavItem to="/settings" label="Settings" />}
      </nav>

      <div className="px-4 py-4 border-t border-forest-700/60">
        <p className="text-sm font-semibold truncate">{user?.name}</p>
        <p className="text-xs text-paper/50 truncate mb-3">{user?.role}</p>
        <button
          onClick={handleLogout}
          className="w-full text-sm font-medium px-3 py-2 rounded-lg bg-forest-700 hover:bg-rust transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
