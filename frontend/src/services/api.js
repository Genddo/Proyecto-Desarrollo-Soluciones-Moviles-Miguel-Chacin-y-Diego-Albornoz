import axios from 'axios';

// Configuración de la URL de la API:
// - En caso de emulador de Android Studio, usar: 'http://10.0.2.2:8080/api'
// - En caso de celular físico con Expo Go, usar la IP de tu PC (ej: 'http://192.168.1.XX:8080/api')
const API_URL = 'http://10.0.2.2:8080/api'; 

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;