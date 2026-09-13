import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

export default API;