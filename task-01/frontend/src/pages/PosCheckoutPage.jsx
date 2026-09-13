import React, { useEffect, useState } from 'react';
import { getProducts, createReservation } from '../api/posApi';

export default function PosCheckoutPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reservation, setReservation] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    getProducts()
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  useEffect(() => {
    let timer;
    if (reservation && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && reservation) {
      alert('Reservation expired! Stock released back to inventory.');
      setReservation(null);
    }
    return () => clearInterval(timer);
  }, [reservation, timeLeft]);

  const handleReserve = async () => {
    if (!selectedProductId) {
      alert("Please select a product first!");
      return;
    }

    console.log("Selected Product ID for payload:", Number(selectedProductId));
    console.log("Quantity:", Number(quantity));

    try {
      const res = await createReservation({
        productId: Number(selectedProductId),
        quantity: Number(quantity)
      });
      setReservation(res.data);
      setTimeLeft(300);
    } catch (err) {
      alert('Failed to reserve stock.');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ maxWidth: '800px', margin: '32px auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>POS Terminal & Reservation</h2>
        <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>
          Select products to lock stock and create an active checkout session.
        </p>
      </div>

      <div style={{
        background: '#ffffff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        border: '1px solid #e5e7eb',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Select Item
            </label>
            <select
              value={selectedProductId}
              onChange={e => setSelectedProductId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                backgroundColor: '#fff',
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Choose a product</option>
              {products.map((p, index) => {
                const prodId = p.product_id ?? p.productId ?? p.id ?? index;
                const prodName = p.product_name ?? p.name ?? "Unknown Product";
                const prodStock = p.totalStock ?? p.stock ?? 0;

                return (
                  <option key={prodId} value={String(prodId)}>
                    ID: {prodId} — {prodName} ({prodStock} in stock)
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={handleReserve}
            disabled={!selectedProductId}
            style={{
              padding: '11px 20px',
              backgroundColor: selectedProductId ? '#2563eb' : '#9ca3af',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: selectedProductId ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s ease'
            }}
          >
            Reserve & Checkout
          </button>
        </div>
      </div>

      {reservation && (
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#0369a1' }}>
                Reservation #{reservation.id}
              </span>
              <span style={{
                background: '#e0f2fe',
                color: '#0369a1',
                fontSize: '12px',
                fontWeight: '600',
                padding: '2px 8px',
                borderRadius: '9999px',
                textTransform: 'uppercase'
              }}>
                {reservation.status || 'Active'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#334155' }}>
              Complete customer transaction under <strong>Mock Payment</strong> before timer expires.
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #e0f2fe',
            borderRadius: '8px',
            padding: '10px 16px',
            textAlign: 'center'
          }}>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
              Time Remaining
            </span>
            <span style={{ fontSize: '22px', fontWeight: '800', color: timeLeft < 60 ? '#dc2626' : '#2563eb' }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}