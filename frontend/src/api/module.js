/**
 * Service API pour la gestion des modules photovoltaïques
 * 
 * Ce fichier gère toutes les requêtes CRUD (Create, Read, Update, Delete)
 * liées aux modules photovoltaïques du projet SolarPredict.
 * 
 * J'ai standardisé ce fichier pour qu'il utilise la même structure que les autres
 * services API (auth.js, prediction.js) avec le port 4000 au lieu de 5000.
 */

import axios from 'axios';

// Configuration de l'URL de l'API 
// J'utilise la même convention pour tous les services API du projet
// Utilisation du port 4000 pour le backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Création de l'instance Axios avec ma configuration personnalisée
// J'ai standardisé cette configuration pour tous les services du projet
const moduleAPI = axios.create({
  baseURL: API_URL + '/api',       // Format standard pour tous les services API
  withCredentials: true,          // Permet l'envoi de cookies avec les requêtes
  headers: {
    'Content-Type': 'application/json'  // Format JSON pour toutes les requêtes
  }
});

/**
 * Intercepteur pour ajouter automatiquement le token JWT à chaque requête
 * Cette fonctionnalité est essentielle pour l'authentification des requêtes API
 * J'ai standardisé cette approche dans tous les services API du projet
 */
moduleAPI.interceptors.request.use(config => {
  // Récupération du token depuis le localStorage
  const token = localStorage.getItem('token');
  // Ajout du token dans l'en-tête Authorization si disponible
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Format standard pour JWT
  }
  return config;
}, error => {
  // En cas d'erreur dans l'intercepteur, propager l'erreur
  return Promise.reject(error);
});

/**
 * Récupération de tous les modules photovoltaïques de l'utilisateur
 * 
 * Cette fonction fait appel à l'API pour obtenir tous les modules
 * appartenant à l'utilisateur actuellement authentifié.
 * Le backend filtre automatiquement selon l'utilisateur grâce au token JWT.
 * 
 * @returns {Promise<Object>} - Liste des modules de l'utilisateur avec leurs caractéristiques
 */
export const getModules = async () => {
  try {
    // Appel à l'API avec authentification automatique via l'intercepteur
    const response = await moduleAPI.get('/modules');
    return response.data; // Contient la liste des modules avec leurs détails
  } catch (error) {
    // Propager l'erreur pour la gérer au niveau du composant React
    throw error;
  }
};

/**
 * Récupération d'un module photovoltaïque spécifique
 * 
 * Obtient les détails complets d'un module selon son identifiant
 * en vérifiant que l'utilisateur a bien accès à ce module.
 * 
 * @param {string} moduleId - Identifiant unique du module à récupérer
 * @returns {Promise<Object>} - Objet contenant tous les détails du module
 */
export const getModule = async (moduleId) => {
  try {
    // Utilisation d'un template string pour construire l'URL avec l'ID du module
    const response = await moduleAPI.get(`/modules/${moduleId}`);
    return response.data; // Données détaillées du module spécifique
  } catch (error) {
    // Gestion des erreurs (404 si module non trouvé ou 403 si non autorisé)
    throw error;
  }
};

/**
 * Création d'un nouveau module photovoltaïque
 * 
 * Enregistre un nouveau module dans la base de données avec ses caractéristiques.
 * Le module est automatiquement associé à l'utilisateur actuel par le backend.
 * 
 * @param {Object} moduleData - Données du module à créer (puissance, marque, modèle, etc.)
 * @returns {Promise<Object>} - Objet du module créé avec son ID généré
 */
export const createModule = async (moduleData) => {
  try {
    // Envoi des données du nouveau module au backend
    const response = await moduleAPI.post('/modules', moduleData);
    
    // Le backend renvoie le module créé avec son ID généré
    return response.data;
  } catch (error) {
    // Propager l'erreur (validation, conflit, etc.)
    throw error;
  }
};

/**
 * Mise à jour d'un module photovoltaïque existant
 * 
 * Cette fonction permet de modifier les caractéristiques d'un module existant
 * dans la base de données. Le backend vérifie que l'utilisateur actuel est bien
 * le propriétaire du module avant d'autoriser la modification.
 * 
 * Les modifications possibles incluent:
 * - Marque et modèle du panneau solaire
 * - Puissance nominale (Watt-crête)
 * - Surface du module (m²)
 * - Technologie (monocristallin, polycristallin, couche mince)
 * - Année d'installation
 * - Orientation et inclinaison
 * - Localisation géographique
 * 
 * @param {string} moduleId - Identifiant unique du module à modifier
 * @param {Object} moduleData - Nouvelles données du module (seules les propriétés modifiées sont nécessaires)
 * @returns {Promise<Object>} - Objet du module avec les données mises à jour
 */
export const updateModule = async (moduleId, moduleData) => {
  try {
    // Envoi des modifications au backend avec l'ID du module dans l'URL
    // La méthode PUT est utilisée conformément aux standards REST pour les mises à jour
    const response = await moduleAPI.put(`/modules/${moduleId}`, moduleData);
    
    // Le backend renvoie le module complètement mis à jour
    return response.data;
  } catch (error) {
    // Propager l'erreur (validation, non autorisé, non trouvé, etc.)
    throw error;
  }
};

/**
 * Suppression d'un module photovoltaïque
 * 
 * Cette fonction permet de supprimer définitivement un module de la base de données.
 * Le backend vérifie que l'utilisateur authentifié est bien le propriétaire du module
 * avant d'autoriser la suppression.
 * 
 * IMPORTANT: La suppression d'un module entraîne également la suppression de toutes
 * les prédictions associées à ce module pour maintenir l'intégrité référentielle
 * dans la base de données. Le backend utilise une suppression en cascade pour assurer
 * cette cohérence.
 * 
 * @param {string} moduleId - Identifiant unique du module à supprimer
 * @returns {Promise<Object>} - Objet contenant la confirmation de suppression avec un message
 */
export const deleteModule = async (moduleId) => {
  try {
    // Appel API pour demander la suppression du module avec son ID
    // La méthode DELETE est utilisée conformément aux standards REST
    const response = await moduleAPI.delete(`/modules/${moduleId}`);
    
    // Retourner la confirmation de suppression envoyée par le backend
    return response.data;
  } catch (error) {
    // Propager l'erreur (non autorisé, non trouvé, erreur de serveur, etc.)
    // Cela permet au composant React de gérer l'erreur de manière appropriée
    throw error;
  }
};

export default moduleAPI;
