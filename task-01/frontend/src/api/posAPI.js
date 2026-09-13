import API from './axios';

export const getProducts = () => API.get('/products');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addStock = (id, quantity) => API.patch(`/products/${id}/stock?quantity=${quantity}`);

export const createReservation = (data) => API.post('/reservations', data);
export const cancelReservation = (id) => API.post(`/reservations/${id}/cancel`);

export const simulatePayment = (data) => API.post('/payments/simulate', data);

export const getOrders = () => API.get('/orders');
export const processCheckout = (data) => API.post('/orders/checkout', data);