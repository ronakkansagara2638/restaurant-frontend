import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tables from "./pages/Tables.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import ActiveOrders from "./pages/ActiveOrders.jsx";
import Billing from "./pages/Billing.jsx";
import SalesHistory from "./pages/SalesHistory.jsx";
import MenuManagement from "./pages/MenuManagement.jsx";
import Staff from "./pages/Staff.jsx";
import Settings from "./pages/Settings.jsx";

const AppLayout = ({ children }) => (
  <div className="flex min-h-screen bg-paper">
    <Navbar />
    <main className="flex-1 p-6 lg:p-8">{children}</main>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tables"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Tables />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/new/:tableId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <OrderPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ActiveOrders />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Billing />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SalesHistory />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/menu"
        element={
          <ProtectedRoute adminOnly>
            <AppLayout>
              <MenuManagement />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute adminOnly>
            <AppLayout>
              <Staff />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute adminOnly>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
