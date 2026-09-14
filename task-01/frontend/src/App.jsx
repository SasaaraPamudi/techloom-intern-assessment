import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { simulatePayment } from './api/posApi';
import InventoryPage from './pages/InventoryPage';
import PosTerminalPage from './pages/PosTerminalPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

function InlinePaymentPage() {
  const [orderId, setOrderId] = useState('');
  const [paymentToken, setPaymentToken] = useState('TOK-12345');
  const [mode, setMode] = useState('SUCCESS');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedReservation = localStorage.getItem('active_reservation');
    if (savedReservation) {
      try {
        const parsed = JSON.parse(savedReservation);
        const id = parsed.orderId || parsed.resId || parsed.id || parsed.reservationId || parsed.order_id || parsed.reservation_id;
        if (id) {
          setOrderId(id.toString());
        }
      } catch (e) {
        console.error('Failed to parse active reservation from localStorage', e);
      }
    }
  }, []);

  const handlePayment = async () => {
    if (!orderId) {
      alert('Please enter a valid Order ID first!');
      return;
    }
    setLoading(true);
    try {
      const res = await simulatePayment({
        orderId: parseInt(orderId, 10),
        paymentToken,
        mode
      });
      setResult(res.data);

      if (mode === 'SUCCESS') {
        localStorage.removeItem('active_reservation');
        localStorage.removeItem('reservation_expiry');
      }
    } catch (err) {
      console.error(err);
      alert('Payment execution failed or rejected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <main className="max-w-2xl mx-auto space-y-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur space-y-2">
          <h2 className="text-xl font-semibold text-white">Secure Checkout</h2>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Order ID</label>
            <input
              type="number"
              placeholder="e.g., 1, 2, 3..."
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Payment Token</label>
            <input
              type="text"
              placeholder="TOK-12345"
              value={paymentToken}
              onChange={e => setPaymentToken(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-500"
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Scenario Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {['SUCCESS', 'FAILURE', 'TIMEOUT'].map((m) => (
                <label
                  key={m}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition text-sm font-medium ${
                    mode === m ? 'bg-blue-600/25 border-blue-500 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
                  }`}
                >
                  <input type="radio" name="paymentMode" value={m} checked={mode === m} onChange={e => setMode(e.target.value)} className="hidden" />
                  {m}
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button onClick={handlePayment} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition">
              {loading ? 'Processing...' : 'Pay'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
            <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Response:</h4>
            <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/products" element={<InventoryPage />} />
        <Route path="/pos" element={<PosTerminalPage />} />
        <Route path="/checkout" element={<InlinePaymentPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}