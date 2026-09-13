import React, { useEffect, useState } from 'react';
import { getOrders, cancelReservation } from '../api/posApi';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (reservationId) => {
    if (window.confirm('Cancel order reservation and restore stock?')) {
      try {
        await cancelReservation(reservationId);
        fetchOrders();
      } catch (err) {
        console.error(err);
        alert('Failed to cancel reservation');
      }
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'PAID':
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING':
      case 'RESERVED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'FAILED':
      case 'CANCELLED':
      case 'EXPIRED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <main className="max-w-5xl mx-auto space-y-6">

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">Order History & Lifecycle</h2>
            <p className="text-sm text-slate-400">Track all transaction lifecycles, payment tokens, and manage active order states.</p>
          </div>
          <button
            onClick={fetchOrders}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2 px-4 rounded-lg transition border border-slate-700 active:scale-95"
          >
            Refresh List
          </button>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-400">Loading order history...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-400">No orders found. Process a checkout first!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40 text-xs uppercase tracking-wider text-slate-400 font-medium">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Payment Token</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {orders.map(o => {
                    const id = o.orderId || o.id;
                    const resId = o.reservationId?.resId || o.reservationId;
                    const token = o.paymentToken || 'N/A';
                    const amount = o.totalAmount ? Number(o.totalAmount).toFixed(2) : '0.00';
                    const status = o.status || 'PENDING';

                    return (
                      <tr key={id} className="hover:bg-slate-800/30 transition">
                        <td className="p-4 font-mono font-medium text-slate-300">#{id}</td>
                        <td className="p-4 font-mono text-xs text-slate-400">{token}</td>
                        <td className="p-4 font-semibold text-white">${amount}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeStyle(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {['PENDING', 'RESERVED'].includes(status) && (
                            <button
                              onClick={() => handleCancel(resId)}
                              className="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-medium py-1.5 px-3 rounded-lg border border-rose-500/30 transition active:scale-95"
                            >
                              Cancel Order
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}