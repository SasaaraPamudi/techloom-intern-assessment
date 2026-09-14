import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
});

export const getProducts = () => API.get('/products');
export const getProductById = (id) => API.get(`/products/${id}`);

export const getCart = (sessionId) => API.get(`/cart/${sessionId}`);
export const addToCart = (sessionId, productId, quantity) =>
  API.post('/cart/add', { sessionId, productId, quantity });

export const checkoutCart = (sessionId) =>
  API.post('/orders/checkout', { sessionId });

export const processPayment = (orderId, paymentToken, paymentStatusSimulation) =>
  API.post('/orders/payment', { orderId, paymentToken, paymentStatusSimulation });

export const getOrderHistory = (sessionId) => API.get(`/orders/history/${sessionId}`);

export const cancelOrder = (orderId, reason = "User requested cancellation") =>
  API.post(`/orders/cancel/${orderId}`, { reason });