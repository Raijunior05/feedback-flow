// web/src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Este interceptor vai pegar o token MAIS RECENTE toda vez que você fizer um pedido
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@FeedbackFlow:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});