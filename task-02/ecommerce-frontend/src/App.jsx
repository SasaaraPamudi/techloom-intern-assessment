import React, { useState, useEffect } from 'react';
import { getProducts, addToCart, getCart, checkoutCart, processPayment, getOrderHistory, cancelOrder } from './services/api';
import Navbar from './Navbar';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sessionId] = useState(() => localStorage.getItem('sessionId') || 'session-' + Math.random().toString(36).substring(2, 9));
  const [cart, setCart] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
    loadProducts();
    loadCart();
    loadOrders();
  }, [sessionId]);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCart = async () => {
    try {
      const res = await getCart(sessionId);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await getOrderHistory(sessionId);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(sessionId, productId, 1);
      loadCart();
      loadProducts();
      alert('Success! Item added to your shopping bag.');
    } catch (err) {
      alert('Oops, couldn\'t add this item: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await checkoutCart(sessionId);
      setCurrentOrder(res.data);
      setActiveTab('payment');
      loadCart();
      loadProducts();
    } catch (err) {
      alert('Checkout couldn\'t be completed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePayment = async (outcome) => {
    try {
      const uniquePaymentToken = 'token-' + Math.random().toString(36).substring(2, 10);
      const res = await processPayment(currentOrder.orderId, uniquePaymentToken, outcome);
      alert(`Payment status: ${res.data.status}`);
      setActiveTab('orders');
      loadOrders();
      loadProducts();
    } catch (err) {
      alert('Payment encountered an issue: ' + (err.response?.data?.message || err.message));
      loadProducts();
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      alert('Order successfully cancelled and items restocked.');
      loadOrders();
      loadProducts();
    } catch (err) {
      alert('Could not cancel this order: ' + (err.response?.data?.message || err.message));
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStock = !inStockOnly || p.stock > 0;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const cartItemCount = Array.isArray(cart) ? cart.length : 0;

  return (
    <div className="container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItemCount={cartItemCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="content" style={{ padding: '24px' }}>
        {activeTab === 'products' && (
          <div>
            <h2>Explore Our Products</h2>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label style={{ marginRight: '8px', color: '#94a3b8', fontSize: '0.9rem' }}>Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155' }}
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <label htmlFor="inStockCheck" style={{ color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer' }}>In Stock Only</label>
              </div>
            </div>

            <div className="product-grid">
              {filteredProductListCode(filteredProducts, handleAddToCart)}
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="cart-container">
            <h2>Your Shopping Bag</h2>
            {cartItemCount > 0 ? (
              <>
                <div className="cart-items-list">
                  {cart.map(item => (
                    <div key={item.cartItemId} className="cart-item-card">
                      <div className="cart-item-details">
                        <h4>{item.productName}</h4>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="cart-item-right">
                        <span className="cart-item-price">Rs. {item.subtotal}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <h3>Total: Rs. {cart.reduce((acc, item) => acc + item.subtotal, 0)}</h3>
                  <button className="btn-checkout" onClick={handleCheckout}>Proceed to Secure Checkout</button>
                </div>
              </>
            ) : (
              <div className="empty-bag">
                <p>Your shopping bag is currently empty. Explore our catalog to find something you love!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payment' && currentOrder && (
          <div className="payment-box">
            <h2>Complete Your Payment</h2>
            <p>Order Reference: #{currentOrder.orderId}</p>
            <p>Total to Pay: Rs. {currentOrder.totalAmount}</p>
            <p>Current Status: {currentOrder.status}</p>
            <div className="payment-buttons">
              <button className="btn-success" onClick={() => handlePayment('SUCCESS')}>Pay Successfully</button>
              <button className="btn-danger" onClick={() => handlePayment('FAILURE')}>Simulate Card Decline</button>
              <button className="btn-warning" onClick={() => handlePayment('TIMEOUT')}>Simulate Timeout</button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2>Your Order History</h2>
            {orders.length > 0 ? (
              <div className="order-list">
                {orders.map(order => {
                  const statusClass = order.status ? order.status.toLowerCase() : 'pending';
                  return (
                    <div key={order.orderId} className="order-card">
                      <div className="order-info">
                        <p><strong>Order Reference:</strong> #{order.orderId}</p>
                        <p><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}</p>
                        <p><strong>Total Amount:</strong> Rs. {order.totalAmount}</p>
                      </div>
                      <div className="order-actions">
                        <span className={`status-badge ${statusClass}`}>
                          {order.status}
                        </span>
                        {order.status === 'PAID' && (
                          <button className="btn-cancel" onClick={() => handleCancelOrder(order.orderId)}>
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>You haven't placed any orders yet.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function filteredProductListCode(products, handleAddToCart) {
  return products.map(product => (
    <div key={product.productId} className="product-card">
      <h3>{product.name}</h3>
      <p>Price: Rs. {product.price}</p>
      <p>Availability: {product.stock > 0 ? `${product.stock} items left` : 'Sold Out'}</p>
      <button
        onClick={() => handleAddToCart(product.productId)}
        disabled={product.stock <= 0}
      >
        {product.stock > 0 ? 'Add to Bag' : 'Sold Out'}
      </button>
    </div>
  ));
}

export default App;