import API from './axios';

export const getProducts = () => API.get('/api/v1/products');
export const createProduct = (data) => API.post('/api/v1/products', data);
export const updateProduct = (id, data) => API.put(`/api/v1/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/api/v1/products/${id}`);
export const addStock = (id, quantity) => API.patch(`/api/v1/products/${id}/stock?quantity=${quantity}`);

export const createReservation = (data) => API.post('/api/v1/reservations', data);
export const cancelReservation = (id) => API.post(`/api/v1/reservations/${id}/cancel`);

export const simulatePayment = (data) => API.post('/api/v1/payments/simulate', data);

export const getOrders = () => API.get('/api/v1/orders');
export const processCheckout = (data) => API.post('/api/v1/orders/checkout', data);