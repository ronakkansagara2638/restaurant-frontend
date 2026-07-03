import { useEffect, useState } from "react";
import api from "../api/axios.js";

const Billing = () => {
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [settings, setSettings] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(5);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [activeBill, setActiveBill] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [ordersRes, billsRes, settingsRes] = await Promise.all([
      api.get("/orders?active=true"),
      api.get("/bills?status=Unpaid"),
      api.get("/settings"),
    ]);
    setOrders(ordersRes.data);
    setBills(billsRes.data);
    setSettings(settingsRes.data);
    setTaxPercent(settingsRes.data.defaultTaxPercent);
  };

  useEffect(() => {
    load();
  }, []);

  const billForOrder = (orderId) => bills.find((b) => b.order === orderId);

  const openGenerate = (order) => {
    setSelectedOrder(order);
    setActiveBill(null);
    setDiscount(0);
    setError("");
  };

  const openExistingBill = (bill) => {
    setActiveBill(bill);
    setSelectedOrder(null);
  };

  const subtotal = selectedOrder?.subtotal || 0;
  const previewTax = Math.round(((subtotal - discount) * taxPercent) / 100 * 100) / 100;
  const previewTotal = Math.round((subtotal - discount + previewTax) * 100) / 100;

  const handleGenerate = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/bills", {
        orderId: selectedOrder._id,
        discountAmount: Number(discount) || 0,
        taxPercent: Number(taxPercent),
        paymentMethod,
      });
      setActiveBill(data);
      setSelectedOrder(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate the bill");
    } finally {
      setBusy(false);
    }
  };

  const handleMarkPaid = async (bill) => {
    setBusy(true);
    try {
      await api.put(`/bills/${bill._id}/pay`, { paymentMethod: bill.paymentMethod });
      setActiveBill(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const billableOrders = orders.filter((o) => !billForOrder(o._id));

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink mb-1">Billing</h1>
      <p className="text-ink/50 mb-6">Generate the bill, take payment, close the table.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-ink/10 shadow-sm p-5">
            <h3 className="font-display text-lg font-semibold mb-3">Tables awaiting a bill</h3>
            {billableOrders.length === 0 ? (
              <p className="text-ink/40 text-sm">Every active order already has a bill.</p>
            ) : (
              <div className="divide-y divide-ink/5">
                {billableOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Table {order.tableNumber}</p>
                      <p className="text-xs text-ink/50">{order.items.length} item line(s) · {order.status}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono">₹{order.subtotal.toFixed(2)}</span>
                      <button
                        onClick={() => openGenerate(order)}
                        className="text-sm font-medium px-3 py-1.5 rounded-lg bg-forest-800 text-paper hover:bg-forest-700"
                      >
                        Generate bill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-ink/10 shadow-sm p-5">
            <h3 className="font-display text-lg font-semibold mb-3">Unpaid bills</h3>
            {bills.length === 0 ? (
              <p className="text-ink/40 text-sm">No outstanding bills.</p>
            ) : (
              <div className="divide-y divide-ink/5">
                {bills.map((bill) => (
                  <div key={bill._id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Table {bill.tableNumber} · {bill.billNumber}</p>
                      <p className="text-xs text-ink/50">{bill.paymentMethod}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold">₹{bill.grandTotal.toFixed(2)}</span>
                      <button
                        onClick={() => openExistingBill(bill)}
                        className="text-sm font-medium px-3 py-1.5 rounded-lg border border-ink/15 text-ink/70 hover:bg-ink/5"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-fit sticky top-6">
          {selectedOrder && (
            <div className="bg-white rounded-xl border border-ink/10 shadow-sm p-5">
              <h3 className="font-display text-lg font-semibold mb-3">Table {selectedOrder.tableNumber} — new bill</h3>
              <div className="space-y-1 mb-4 text-sm">
                {selectedOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-ink/70">
                    <span>{i.quantity} × {i.name}</span>
                    <span className="font-mono">₹{(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-dashed border-ink/15">
                <span>Subtotal</span>
                <span className="font-mono">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-xs text-ink/50 mb-1">Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-ink/15"
                  />
                </div>
                <div>
                  <label className="block text-xs text-ink/50 mb-1">Tax %</label>
                  <input
                    type="number"
                    min="0"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-ink/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-ink/50 mb-1 mt-3">Payment method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-ink/15"
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>UPI</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex justify-between font-semibold pt-3 mt-3 border-t border-ink/10">
                <span>Grand total</span>
                <span className="font-mono">₹{previewTotal.toFixed(2)}</span>
              </div>

              {error && <p className="text-sm text-danger mt-2">{error}</p>}

              <button
                onClick={handleGenerate}
                disabled={busy}
                className="w-full mt-4 bg-brass-500 hover:bg-brass-600 text-forest-950 font-semibold py-2.5 rounded-lg disabled:opacity-50"
              >
                Generate bill
              </button>
            </div>
          )}

          {activeBill && (
            <div className="bg-white rounded-xl border border-ink/10 shadow-sm p-0 overflow-hidden font-mono">
              <div className="p-5 text-center border-b border-dashed border-ink/15">
                <p className="font-display text-lg font-semibold">{settings?.restaurantName}</p>
                <p className="text-xs text-ink/50">{settings?.address}</p>
                <p className="text-xs text-ink/50">{settings?.phone}</p>
                {settings?.gstNumber && <p className="text-xs text-ink/50">GSTIN: {settings.gstNumber}</p>}
              </div>
              <div className="p-5 text-xs text-ink/60 border-b border-dashed border-ink/15 flex justify-between">
                <span>{activeBill.billNumber}</span>
                <span>Table {activeBill.tableNumber}</span>
              </div>
              <div className="p-5 space-y-1 text-sm border-b border-dashed border-ink/15">
                {activeBill.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{i.quantity} × {i.name}</span>
                    <span>₹{(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="p-5 space-y-1 text-sm border-b border-dashed border-ink/15">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{activeBill.subtotal.toFixed(2)}</span></div>
                {activeBill.discountAmount > 0 && (
                  <div className="flex justify-between"><span>Discount</span><span>−₹{activeBill.discountAmount.toFixed(2)}</span></div>
                )}
                <div className="flex justify-between"><span>Tax ({activeBill.taxPercent}%)</span><span>₹{activeBill.taxAmount.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span>₹{activeBill.grandTotal.toFixed(2)}</span></div>
              </div>
              <div className="p-5 no-print">
                <p className="text-xs text-ink/50 mb-3">Payment method: {activeBill.paymentMethod}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 border border-ink/15 text-ink/70 font-medium py-2 rounded-lg"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => handleMarkPaid(activeBill)}
                    disabled={busy}
                    className="flex-1 bg-teal text-white font-semibold py-2 rounded-lg disabled:opacity-50"
                  >
                    Mark as paid
                  </button>
                </div>
              </div>
            </div>
          )}

          {!selectedOrder && !activeBill && (
            <div className="bg-white rounded-xl border border-dashed border-ink/15 p-8 text-center text-ink/40 text-sm">
              Select a table to generate a bill, or open an unpaid bill to collect payment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
