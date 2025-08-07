
/**
 * Service API d'authentification pour SolarPredict
 * 
 * Ce fichier gère toutes les requêtes liées à l'authentification
 * et à la gestion des utilisateurs (connexion, inscription, déconnexion)
 * 
 * J'ai initialement configuré ce service sur le port 5000, mais j'ai dû le migrer
 * vers le port 4000 à cause de conflits avec d'autres applications sur ma machine.
 */

import axios from 'axios';

// Configuration de l'URL de l'API
// D'abord chercher dans les variables d'environnement, sinon utiliser l'URL par défaut
// Utilisation du port 4000 pour le backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Instance Axios avec ma configuration personnalisée
// J'ai standardisé la manière dont j'ajoute '/api' à l'URL de base pour éviter
// les incohérences entre les différents services (auth, module, prediction)
const authAPI = axios.create({
  baseURL: API_URL + '/api',  // Construction de l'URL complète (par ex: http://localhost:4000/api)
  headers: {
    'Content-Type': 'application/json',  // Format JSON pour toutes les requêtes
    'Accept': 'application/json'         // Accepter uniquement les réponses JSON
  }
});

/**
 * Intercepteur pour ajouter automatiquement le token JWT à chaque requête
 * 
 * J'ai implémenté cette approche pour éviter d'avoir à ajouter manuellement
 * le token à chaque appel API. Cela centralise la logique d'authentification.
 */
authAPI.interceptors.request.use(config => {
  // Récupérer le token JWT du localStorage
  const token = localStorage.getItem('token');
  // Si un token existe, l'ajouter aux en-têtes de la requête
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Format standard JWT
  }
  return config;
});

// Configuration pour permettre l'envoi de cookies cross-origin
// Utile pour maintenir la session utilisateur entre le frontend et le backend
authAPI.defaults.withCredentials = true;

/**
 * Service de connexion utilisateur
 * 
 * Cette fonction envoie les identifiants au backend qui vérifie leur validité
 * et renvoie un token JWT si les informations sont correctes.
 * 
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @returns {Promise<Object>} - Réponse contenant le token et les infos utilisateur
 */
export const loginUser = async (email, password) => {
  try {
    // Envoi des identifiants au backend
    const response = await authAPI.post('/auth/login', { email, password });
    
    // Si la connexion réussit, le backend renvoie un token JWT
    // Je stocke ce token dans le localStorage pour les futures requêtes
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    // Propager l'erreur pour la gérer dans le composant
    throw error;
  }
};

/**
 * Service d'inscription d'un nouvel utilisateur
 * 
 * Cette fonction envoie les informations d'inscription au backend
 * qui crée un nouvel utilisateur dans la base de données PostgreSQL.
 * 
 * @param {string} email - Email de l'utilisateur à créer
 * @param {string} password - Mot de passe (sera hashé côté backend)
 * @returns {Promise<Object>} - Réponse avec le token et les infos utilisateur
 */
export const registerUser = async (email, password) => {
  try {
    // Envoi des informations d'inscription au backend
    const response = await authAPI.post('/auth/register', { email, password });
    
    // Si l'inscription réussit, le backend renvoie directement un token JWT
    // Je le stocke dans localStorage pour que l'utilisateur soit déjà connecté
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service de déconnexion
 * @returns {Promise<Object>} - Réponse du serveur
 */
export const logoutUser = async () => {
  try {
    const response = await authAPI.post('/auth/logout');
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    // Supprimer le token des en-têtes
    delete authAPI.defaults.headers.common['Authorization'];
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service pour récupérer l'utilisateur actuel
 * @returns {Promise<Object>} - Réponse du serveur avec les informations de l'utilisateur
 */
export const getCurrentUser = async () => {
  try {
    // Pas besoin de vérifier le localStorage puisque nous utilisons les cookies
    
    const response = await authAPI.get('/auth/me');
    return response.data;
  } catch (error) {
    // Si erreur 401 (non autorisé), supprimer le token du localStorage
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      delete authAPI.defaults.headers.common['Authorization'];
    }
    throw error;
  }
};

export default authAPI;
