import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
});

const getProducts = () => API.get('/products');
const createProduct = (data) => API.post('/products', data);
const updateProduct = (id, data) => API.put(`/products/${id}`, data);
const deleteProduct = (id) => API.delete(`/products/${id}`);
const addStock = (id, quantity) => API.patch(`/products/${id}/stock?quantity=${quantity}`);
const createReservation = (data) => API.post('/reservations', data);
const cancelReservation = (id) => API.post(`/reservations/${id}/cancel`);
const simulatePayment = (data) => API.post('/payments/simulate', data);
const getOrders = () => API.get('/orders');

function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center text-slate-100 font-sans">
      <h1 className="font-bold text-lg text-blue-400">Techloom POS</h1>
      <div className="flex gap-6 text-sm font-medium">
        <Link to="/products" className="hover:text-blue-400 transition">Inventory</Link>
        <Link to="/pos" className="hover:text-blue-400 transition">POS Terminal</Link>
        <Link to="/checkout" className="hover:text-blue-400 transition">Checkout</Link>
        <Link to="/orders" className="hover:text-blue-400 transition">Orders</Link>
      </div>
    </nav>
  );
}

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ product_name: '', price: '', totalStock: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchInventory = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      alert('Failed to load inventory');
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        product_name: formData.product_name,
        price: parseFloat(formData.price),
        totalStock: parseInt(formData.totalStock, 10),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setFormData({ product_name: '', price: '', totalStock: '' });
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm('Delete product?')) {
      try {
        await deleteProduct(id);
        fetchInventory();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleAddStock = async (id) => {
    if (!id) return;
    const qty = prompt('Enter quantity to add:');
    if (qty && !isNaN(qty)) {
      try {
        await addStock(id, parseInt(qty, 10));
        fetchInventory();
      } catch (err) {
        alert('Failed to add stock');
      }
    }
  };

  const handleEdit = (product) => {
    const prodId = product.productId ?? product.product_id ?? product.id;
    setEditingId(prodId);
    setFormData({
      product_name: product.productName || product.product_name || product.name || '',
      price: product.price ?? '',
      totalStock: product.totalStock ?? product.stock ?? '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ product_name: '', price: '', totalStock: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="p-6 font-sans">
        <main className="max-w-6xl mx-auto space-y-6">

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-200">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                required
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-400"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price ($)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-400"
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={formData.totalStock}
                onChange={(e) => setFormData({ ...formData, totalStock: e.target.value })}
                required
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg transition shadow-md shadow-blue-600/20 active:scale-95"
              >
                {editingId ? 'Update Product' : '+ Add Product'}
              </button>
            </form>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No products found in inventory.
                    </td>
                  </tr>
                ) : (
                  products.map((p, index) => {
                    const prodId = p.productId ?? p.product_id ?? p.id ?? index;
                    const prodName = p.productName ?? p.product_name ?? p.name ?? 'Unknown';
                    const prodStock = p.totalStock ?? p.stock ?? 0;

                    return (
                      <tr key={prodId} className="hover:bg-slate-800/30 transition">
                        <td className="px-6 py-4 font-mono text-slate-400">#{prodId}</td>
                        <td className="px-6 py-4 font-medium text-white">{prodName}</td>
                        <td className="px-6 py-4">${Number(p.price || 0).toFixed(2)}</td>
                        <td className="px-6 py-4">
                          {prodStock <= 5 ? (
                            <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 text-xs px-2.5 py-1 rounded-full border border-red-500/20 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                              {prodStock} in stock (Low Stock)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
                              {prodStock} in stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium transition border border-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleAddStock(prodId)}
                            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-md text-xs font-medium border border-blue-500/20 transition"
                          >
                            + Restock
                          </button>
                          <button
                            onClick={() => handleDelete(prodId)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md text-xs font-medium border border-red-500/20 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

function PosTerminalPage() {
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="p-6 font-sans">
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
    </div>
  );
}

function PaymentPage() {
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="p-6 font-sans">
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
              <p className="text-xs text-slate-500">Auto-filled from your active POS reservation or type manually.</p>
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
                      mode === m
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMode"
                      value={m}
                      checked={mode === m}
                      onChange={e => setMode(e.target.value)}
                      className="hidden"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition shadow-md shadow-blue-600/20 active:scale-95 disabled:opacity-50"
              >
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
    </div>
  );
}

function OrderHistoryPage() {
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="p-6 font-sans">
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
        <Route path="/checkout" element={<PaymentPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}