import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
});

const getProducts = () => API.get('/api/v1/products');
const createProduct = (data) => API.post('/api/v1/products', data);
const updateProduct = (id, data) => API.put(`/api/v1/products/${id}`, data);
const deleteProduct = (id) => API.delete(`/api/v1/products/${id}`);
const addStock = (id, quantity) => API.patch(`/api/v1/products/${id}/stock?quantity=${quantity}`);
const createReservation = (data) => API.post('/api/v1/reservations', data);
const cancelReservation = (id) => API.post(`/api/v1/reservations/${id}/cancel`);
const simulatePayment = (data) => API.post('/api/v1/payments/simulate', data);
const getOrders = () => API.get('/api/v1/orders');

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border shadow-2xl flex items-center gap-3 text-sm font-medium ${type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-[#1b201b] border-[#f3ff53]/30 text-[#f3ff53]'}`}>
      <span>{message}</span>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="bg-[#111411] border-b border-[#222722] px-8 py-5 flex justify-between items-center text-[#e4ede4] font-sans">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl text-[#f3ff53] tracking-wide">Techloom POS System</span>
      </div>
      <div className="flex gap-8 text-sm font-medium items-center">
        <Link to="/products" className="hover:text-[#f3ff53] transition">Inventory</Link>
        <Link to="/pos" className="hover:text-[#f3ff53] transition">POS Terminal</Link>
        <Link to="/checkout" className="hover:text-[#f3ff53] transition">Checkout</Link>
        <Link to="/orders" className="hover:text-[#f3ff53] transition">Orders</Link>
        <Link to="/pos" className="bg-[#f3ff53] text-[#111411] hover:bg-[#e2ee42] font-semibold px-5 py-2.5 rounded-full transition shadow-lg shadow-[#f3ff53]/10">
          Terminal
        </Link>
      </div>
    </nav>
  );
}

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ product_name: '', price: '', totalStock: '' });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchInventory = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setToast({ message: 'Failed to load inventory', type: 'error' });
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
        setToast({ message: 'Product updated successfully!', type: 'success' });
      } else {
        await createProduct(payload);
        setToast({ message: 'Product added successfully!', type: 'success' });
      }
      setFormData({ product_name: '', price: '', totalStock: '' });
      setEditingId(null);
      fetchInventory();
    } catch (err) {
      setToast({ message: 'Error saving product', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm('Delete product?')) {
      try {
        await deleteProduct(id);
        setToast({ message: 'Product deleted successfully!', type: 'success' });
        fetchInventory();
      } catch (err) {
        setToast({ message: 'Failed to delete product', type: 'error' });
      }
    }
  };

  const handleAddStock = async (id) => {
    if (!id) return;
    const qty = prompt('Enter quantity to add:');
    if (qty && !isNaN(qty)) {
      try {
        await addStock(id, parseInt(qty, 10));
        setToast({ message: 'Stock added successfully!', type: 'success' });
        fetchInventory();
      } catch (err) {
        setToast({ message: 'Failed to add stock', type: 'error' });
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
    <div className="min-h-screen bg-[#141714] text-[#e4ede4] font-sans">
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto space-y-8">

        <div className="space-y-2 pt-4">
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Inventory Management</h2>
          <p className="text-[#9ca3af] text-sm">Manage stock levels, update pricing, and seamlessly handle new products.</p>
        </div>

        <div className="bg-[#1b201b] border border-[#2b332b] rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">
              {editingId ? 'Edit Product Item' : 'Add New Product'}
            </h3>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-[#9ca3af] hover:text-white underline"
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
              className="bg-[#141714] border border-[#2b332b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f3ff53]/50 text-white placeholder-[#6b7280]"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price (Rs)"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className="bg-[#141714] border border-[#2b332b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f3ff53]/50 text-white placeholder-[#6b7280]"
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={formData.totalStock}
              onChange={(e) => setFormData({ ...formData, totalStock: e.target.value })}
              required
              className="bg-[#141714] border border-[#2b332b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f3ff53]/50 text-white placeholder-[#6b7280]"
            />
            <button
              type="submit"
              className="bg-[#f3ff53] hover:bg-[#e2ee42] text-[#141714] font-bold py-3 px-4 rounded-xl transition shadow-md shadow-[#f3ff53]/10 active:scale-95"
            >
              {editingId ? 'Update Product' : '+ Add Product'}
            </button>
          </form>
        </div>

        <div className="bg-[#1b201b] border border-[#2b332b] rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#141714]/80 text-[#9ca3af] border-b border-[#2b332b] uppercase text-xs tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b332b]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#6b7280]">
                    No products found in inventory.
                  </td>
                </tr>
              ) : (
                products.map((p, index) => {
                  const prodId = p.productId ?? p.product_id ?? p.id ?? index;
                  const prodName = p.productName ?? p.product_name ?? p.name ?? 'Unknown';
                  const prodStock = p.totalStock ?? p.stock ?? 0;

                  return (
                    <tr key={prodId} className="hover:bg-[#222722]/40 transition">
                      <td className="px-6 py-4 font-mono text-[#9ca3af]">#{prodId}</td>
                      <td className="px-6 py-4 font-semibold text-white">{prodName}</td>
                      <td className="px-6 py-4 text-[#f3ff53] font-mono">Rs {Number(p.price || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        {prodStock <= 5 ? (
                          <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 text-xs px-3 py-1 rounded-full border border-rose-500/20 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                            {prodStock} left (Low Stock)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-[#f3ff53]/10 text-[#f3ff53] text-xs px-3 py-1 rounded-full border border-[#f3ff53]/20 font-medium">
                            {prodStock} in stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-3 py-1.5 bg-[#141714] hover:bg-[#2b332b] text-white rounded-lg text-xs font-medium transition border border-[#2b332b]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAddStock(prodId)}
                          className="px-3 py-1.5 bg-[#f3ff53]/10 hover:bg-[#f3ff53]/20 text-[#f3ff53] rounded-lg text-xs font-medium border border-[#f3ff53]/20 transition"
                        >
                          + Restock
                        </button>
                        <button
                          onClick={() => handleDelete(prodId)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium border border-rose-500/20 transition"
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

      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function PosTerminalPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);

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
      .catch(err => setToast({ message: 'Failed to load products', type: 'error' }));
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
      setToast({ message: 'Please select an item first.', type: 'error' });
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
      setToast({ message: 'Reservation created successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to create reservation.', type: 'error' });
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#141714] text-[#e4ede4] font-sans">
      <Navbar />
      <div className="p-8 max-w-4xl mx-auto space-y-8">

        <div className="space-y-2 pt-4">
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">POS Terminal</h2>
          <p className="text-[#9ca3af] text-sm">Select inventory items and secure live checkout sessions.</p>
        </div>
        <div className="bg-[#1b201b] border border-[#2b332b] rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end shadow-xl">
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Select Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-[#141714] border border-[#2b332b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f3ff53]/50 text-white"
            >
              <option value=""> Choose Product </option>
              {products.map(p => {
                const id = p.productId ?? p.product_id ?? p.id;
                const name = p.productName ?? p.product_name ?? p.name;
                const stock = p.totalStock ?? p.stock ?? 0;
                return (
                  <option key={id} value={id}>
                    ID: {id} — {name} ({stock} available)
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-[#141714] border border-[#2b332b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f3ff53]/50 text-white"
            />
          </div>

          <button
            onClick={handleReserveAndCheckout}
            className="bg-[#f3ff53] hover:bg-[#e2ee42] text-[#141714] font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-[#f3ff53]/10 active:scale-95"
          >
            Reserve & Checkout
          </button>
        </div>

        {reservation && timeLeft > 0 && (
          <div className="bg-[#1b201b] border border-[#f3ff53]/30 rounded-2xl p-6 flex justify-between items-center shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white">Reservation #{reservation.resId || reservation.reservationId || reservation.id}</span>
                <span className="bg-[#f3ff53]/10 text-[#f3ff53] text-xs px-2.5 py-0.5 rounded-full border border-[#f3ff53]/20 font-medium">ACTIVE</span>
              </div>
              <p className="text-xs text-[#9ca3af]">Complete the payment process before the reservation timer expires.</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-medium text-[#9ca3af] uppercase tracking-wider block">Time Remaining</span>
              <span className="text-3xl font-mono font-bold text-[#f3ff53]">{formatTime(timeLeft)}</span>
            </div>
          </div>
        )}

      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function PaymentPage() {
  const [orderId, setOrderId] = useState('');
  const [paymentToken, setPaymentToken] = useState('TOK-12345');
  const [mode, setMode] = useState('SUCCESS');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

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
        setToast({ message: 'Failed to read saved reservation', type: 'error' });
      }
    }
  }, []);

  const handlePayment = async () => {
    if (!orderId) {
      setToast({ message: 'Please enter a valid Order ID first!', type: 'error' });
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
      setToast({ message: 'Payment completed successfully!', type: 'success' });

      if (mode === 'SUCCESS') {
        localStorage.removeItem('active_reservation');
        localStorage.removeItem('reservation_expiry');
      }
    } catch (err) {
      setToast({ message: 'Payment execution failed or rejected.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141714] text-[#e4ede4] font-sans">
      <Navbar />
      <div className="p-8 max-w-2xl mx-auto space-y-8">

        <div className="space-y-2 pt-4">
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Secure Checkout</h2>
          <p className="text-[#9ca3af] text-sm">Simulate payment gateways and finalize order transactions.</p>
        </div>

        <div className="bg-[#1b201b] border border-[#2b332b] rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Order ID</label>
            <input
              type="number"
              placeholder="e.g., 1, 2, 3..."
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              required
              className="w-full bg-[#141714] border border-[#2b332b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f3ff53]/50 text-white placeholder-[#6b7280]"
            />
            <p className="text-xs text-[#6b7280]">Auto-populated from active terminal reservation.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Payment Token</label>
            <input
              type="text"
              placeholder="TOK-12345"
              value={paymentToken}
              onChange={e => setPaymentToken(e.target.value)}
              required
              className="w-full bg-[#141714] border border-[#2b332b] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f3ff53]/50 text-white placeholder-[#6b7280]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider">Scenario Mode</label>
            <div className="grid grid-cols-3 gap-4">
              {['SUCCESS', 'FAILURE', 'TIMEOUT'].map((m) => (
                <label
                  key={m}
                  className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border cursor-pointer transition text-sm font-semibold ${
                    mode === m
                      ? 'bg-[#f3ff53]/10 border-[#f3ff53] text-[#f3ff53]'
                      : 'bg-[#141714] border-[#2b332b] text-[#9ca3af] hover:bg-[#222722]'
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

          <div className="pt-2">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-[#f3ff53] hover:bg-[#e2ee42] text-[#141714] font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-[#f3ff53]/10 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Payment'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-[#1b201b] border border-[#2b332b] rounded-2xl p-6 space-y-3 shadow-xl">
            <h4 className="text-xs font-semibold text-[#f3ff53] uppercase tracking-wider">Transaction Response:</h4>
            <pre className="bg-[#141714] p-4 rounded-xl text-xs font-mono text-[#e4ede4] overflow-x-auto border border-[#2b332b]">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      setToast({ message: 'Failed to load orders', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (reservationId) => {
    if (window.confirm('Cancel order reservation and restore stock?')) {
      try {
        await cancelReservation(reservationId);
        setToast({ message: 'Order reservation cancelled!', type: 'success' });
        fetchOrders();
      } catch (err) {
        setToast({ message: 'Failed to cancel reservation', type: 'error' });
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
        return 'bg-[#141714] text-[#9ca3af] border-[#2b332b]';
    }
  };

  return (
    <div className="min-h-screen bg-[#141714] text-[#e4ede4] font-sans">
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto space-y-8">

        <div className="bg-[#1b201b] border border-[#2b332b] rounded-2xl p-8 flex justify-between items-center shadow-xl">
          <div className="space-y-1">
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Order History</h2>
            <p className="text-sm text-[#9ca3af]">Track transactions, review payment tokens, and manage active states.</p>
          </div>
          <button
            onClick={fetchOrders}
            className="bg-[#141714] hover:bg-[#2b332b] text-white text-xs font-semibold py-2.5 px-5 rounded-xl transition border border-[#2b332b] active:scale-95"
          >
            Refresh List
          </button>
        </div>

        <div className="bg-[#1b201b] border border-[#2b332b] rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-sm text-[#9ca3af]">Loading order history...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#9ca3af]">No orders found. Process a checkout first!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2b332b] bg-[#141714]/80 text-xs uppercase tracking-wider text-[#9ca3af] font-semibold">
                    <th className="p-4 px-6">Order ID</th>
                    <th className="p-4">Payment Token</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2b332b] text-sm">
                  {orders.map(o => {
                    const id = o.orderId || o.id;
                    const resId = o.reservationId?.resId || o.reservationId;
                    const token = o.paymentToken || 'N/A';
                    const amount = o.totalAmount ? Number(o.totalAmount).toFixed(2) : '0.00';
                    const status = o.status || 'PENDING';

                    return (
                      <tr key={id} className="hover:bg-[#222722]/40 transition">
                        <td className="p-4 px-6 font-mono font-medium text-white">#{id}</td>
                        <td className="p-4 font-mono text-xs text-[#9ca3af]">{token}</td>
                        <td className="p-4 font-semibold text-[#f3ff53]">Rs {amount}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyle(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="p-4 px-6 text-right">
                          {['PENDING', 'RESERVED'].includes(status) && (
                            <button
                              onClick={() => handleCancel(resId)}
                              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold py-1.5 px-3.5 rounded-lg border border-rose-500/30 transition active:scale-95"
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

      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
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