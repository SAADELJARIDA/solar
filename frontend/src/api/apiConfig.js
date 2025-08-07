/**
 * Configuration centralisée pour les appels API
 */
import axios from 'axios';

// Utilisation de la variable d'environnement REACT_APP_API_URL ou fallback sur localhost:5000
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Instance axios avec configuration de base
const api = axios.create({
  baseURL: API_URL + '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs de réponse (401, 403, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};
    
    // Rediriger vers la page de login si le token est expiré/invalide
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
