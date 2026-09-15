import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
});

export const getProducts = () => API.get('/api/v1/products');
export const getProductById = (id) => API.get(`/api/v1/products/${id}`);

export const getCart = (sessionId) => API.get(`/api/v1/cart/${sessionId}`);
export const addToCart = (sessionId, productId, quantity) =>
  API.post('/api/v1/cart/add', { sessionId, productId, quantity });

export const checkoutCart = (sessionId) =>
  API.post('/api/v1/orders/checkout', { sessionId });

export const processPayment = (orderId, paymentToken, paymentStatusSimulation) =>
  API.post('/api/v1/orders/payment', { orderId, paymentToken, paymentStatusSimulation });

export const getOrderHistory = (sessionId) => API.get(`/api/v1/orders/history/${sessionId}`);

export const cancelOrder = (orderId, reason = "User requested cancellation") =>
  API.post(`/api/v1/orders/cancel/${orderId}`, { reason });