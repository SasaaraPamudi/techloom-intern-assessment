import React, { useState, useEffect } from 'react';
import { getProducts, createReservation } from '../api/posApi';

export default function PosTerminalPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [reservation, setReservation] = useState(() => {
    const saved = localStorage.getItem('active_reservation');
    return saved ? JSON.parse(saved) : null;
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedExpiry = localStorage.getItem('reservation_expiry');
    if (savedExpiry) {
      const remaining = Math.floor((parseInt(savedExpiry, 10) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  });

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to load products', err));
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      localStorage.removeItem('active_reservation');
      localStorage.removeItem('reservation_expiry');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setReservation(null);
          localStorage.removeItem('active_reservation');
          localStorage.removeItem('reservation_expiry');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleReserveAndCheckout = async () => {
    if (!selectedProductId) {
      alert('Please select an item first.');
      return;
    }

    try {
      const payload = {
        productId: parseInt(selectedProductId, 10),
        quantity: parseInt(quantity, 10)
      };

      const res = await createReservation(payload);
      const activeRes = res.data;

      const normalizedOrder = {
        ...activeRes,
        orderId: activeRes.orderId || activeRes.id || activeRes.resId
      };

      setReservation(normalizedOrder);

      const expiryTime = Date.now() + 300 * 1000;
      setTimeLeft(300);

      localStorage.setItem('active_reservation', JSON.stringify(normalizedOrder));
      localStorage.setItem('reservation_expiry', expiryTime.toString());

    } catch (err) {
      console.error(err);
      alert('Failed to create reservation. Check console for details.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <main className="max-w-4xl mx-auto space-y-6">

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur space-y-1">
          <h2 className="text-xl font-semibold text-white">POS Terminal & Reservation</h2>

        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5 md:col-span-1">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Select Item</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
            >
              <option value=""> Choose Product </option>
              {products.map(p => {
                const id = p.productId ?? p.product_id ?? p.id;
                const name = p.productName ?? p.product_name ?? p.name;
                const stock = p.totalStock ?? p.stock ?? 0;
                return (
                  <option key={id} value={id}>
                    ID: {id} — {name} ({stock} in stock)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wider">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
            />
          </div>

          <button
            onClick={handleReserveAndCheckout}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg transition shadow-md shadow-blue-600/20 active:scale-95"
          >
            Reserve & Checkout
          </button>
        </div>

        {reservation && timeLeft > 0 && (
          <div className="bg-blue-950/30 border border-blue-500/30 rounded-2xl p-6 flex justify-between items-center backdrop-blur">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-blue-400">Reservation #{reservation.resId || reservation.reservationId || reservation.id}</span>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">ACTIVE</span>
              </div>
              <p className="text-xs text-slate-400">Complete customer transaction under <strong className="text-slate-200">Mock Payment</strong> before timer expires.</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Time Remaining</span>
              <span className="text-2xl font-mono font-bold text-blue-400">{formatTime(timeLeft)}</span>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}