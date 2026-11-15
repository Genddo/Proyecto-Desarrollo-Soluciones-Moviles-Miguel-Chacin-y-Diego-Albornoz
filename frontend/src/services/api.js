import axios from 'axios';

// La URL puede configurarse desde frontend/.env.
// Si no existe, utiliza localhost como valor de desarrollo.
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;