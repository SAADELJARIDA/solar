/**
 * Service API pour les prédictions solaires - SolarPredict
 * 
 * Ce module est le cœur de l'application puisqu'il gère toutes les requêtes
 * liées à la prédiction de production des modules photovoltaïques:
 * - Upload des données de capteurs (fichiers CSV)
 * - Exécution des prédictions via les modèles d'IA
 * - Sauvegarde et gestion des résultats de prédiction
 * 
 * J'ai standardisé ce service API en utilisant la même structure que
 * les autres services (auth.js, module.js).
 */

import axios from 'axios';

// Configuration de l'URL de base de l'API
// J'utilise la même convention pour tous les services API
// Utilisation du port 4000 pour le backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

// Création de l'instance Axios avec ma configuration personnalisée
// Pour les prédictions, j'utilise multipart/form-data par défaut pour permettre
// l'upload de fichiers CSV contenant les données des capteurs
const predictionAPI = axios.create({
  baseURL: API_URL + '/api',       // Format standard pour tous les services API
  headers: {
    'Content-Type': 'multipart/form-data',  // Pour l'upload de fichiers
    'Accept': 'application/json'            // Accepter uniquement JSON en réponse
  },
  withCredentials: true           // Permet l'envoi de cookies cross-origin
});

// Intercepteur pour ajouter automatiquement le token JWT à chaque requête
// Les prédictions étant personnelles à l'utilisateur, l'authentification est essentielle
predictionAPI.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Format standard JWT
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * Upload des données de capteur au format CSV
 * 
 * Cette fonction permet d'envoyer un fichier CSV contenant les données
 * des capteurs installés sur les modules photovoltaïques. Ces données
 * comprennent généralement l'irradiation solaire, la température, et d'autres
 * paramètres environnementaux nécessaires aux modèles de prédiction.
 * 
 * @param {File} file - Fichier CSV contenant les données des capteurs
 * @returns {Promise<Object>} - Réponse du serveur avec l'ID des données uploadées
 */
export const uploadSensorData = async (file) => {
  try {
    // Création d'un objet FormData pour l'envoi de fichiers
    // C'est l'approche standard pour l'upload de fichiers via API
    const formData = new FormData();
    formData.append('file', file);  // Ajout du fichier CSV au formulaire

    // Configuration spécifique pour cet appel
    // Assurant que le content-type est bien défini pour les fichiers
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',  // Nécessaire pour l'upload
        'Accept': 'application/json'            // Format de réponse attendu
      }
    };

    // Appel API pour l'upload du fichier
    const response = await predictionAPI.post('/predictions/upload', formData, config);
    
    // Vérification de la réponse pour s'assurer que l'upload a réussi
    if (!response.data.success) {
      // En cas d'échec, lancer une erreur avec le message du serveur
      throw new Error(response.data.message || 'Erreur lors de l\'upload du fichier CSV');
    }
    
    return response.data;  // Retourne les données avec l'ID du fichier uploadé
  } catch (error) {
    // Gestion des erreurs plus propre pour faciliter le débogage
    console.error('Erreur lors de l\'upload des données de capteur:', error.message);
    throw new Error(error.response?.data?.message || error.message || 'Erreur lors de l\'upload du fichier');
  }
};

/**
 * Service pour récupérer toutes les données de capteur
 * @returns {Promise<Object>} - Liste des données de capteur
 */
export const getSensorData = async () => {
  try {
    const response = await predictionAPI.get('/predictions/sensor-data');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Exécution d'une prédiction de production solaire
 * 
 * Cette fonction est au cœur de l'application SolarPredict. Elle envoie les paramètres
 * nécessaires au backend qui les transmet ensuite au service Python contenant
 * les modèles d'IA. J'ai implémenté trois types de modèles qui peuvent être utilisés:
 * - PLM: Physical Learning Model (basé sur les équations physiques + apprentissage)
 * - DM: Data-driven Model (basé uniquement sur les données historiques)
 * - BM: Blended Model (combinaison des deux approches précédentes)
 * 
 * @param {Object} predictionData - Paramètres de la prédiction à exécuter
 * @param {string} predictionData.module_id - Identifiant du module photovoltaïque
 * @param {string} predictionData.sensor_data_id - Identifiant des données de capteur
 * @param {string} predictionData.model_type - Type de modèle à utiliser (PLM, DM ou BM)
 * @returns {Promise<Object>} - Résultats détaillés de la prédiction avec graphiques
 */
export const runPrediction = async (predictionData) => {
  try {
    // Envoi des paramètres au backend qui les transmet au service Python
    const response = await predictionAPI.post('/predictions/predict', predictionData);
    
    // La réponse contient les données de prédiction et les métriques d'évaluation
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la prédiction:', error.message);
    throw error;  // Propager l'erreur pour la gestion dans le composant
  }
};

/**
 * Sauvegarde des résultats de prédiction dans la base de données
 * 
 * Après avoir exécuté une prédiction, cette fonction permet de sauvegarder
 * les résultats obtenus dans la base de données PostgreSQL pour consultation
 * ultérieure. Cela permet à l'utilisateur de garder un historique de ses prédictions.
 * 
 * @param {Object} resultData - Données du résultat à enregistrer
 * @param {string} resultData.module_id - Module concerné par la prédiction
 * @param {string} resultData.model_type - Type de modèle utilisé
 * @param {Object} resultData.metrics - Métriques de performance du modèle
 * @param {Array} resultData.predictions - Valeurs prédites
 * @returns {Promise<Object>} - Résultat sauvegardé avec son ID généré
 */
export const savePredictionResult = async (resultData) => {
  try {
    // Envoi des résultats au backend pour sauvegarde en base de données
    const response = await predictionAPI.post('/predictions/save-result', resultData);
    return response.data;  // Retourne la confirmation avec l'ID généré
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des résultats:', error.message);
    throw error;
  }
};

/**
 * Service pour récupérer tous les résultats de prédiction
 * @returns {Promise<Object>} - Liste des résultats de prédiction
 */
export const getPredictionResults = async () => {
  try {
    const response = await predictionAPI.get('/predictions/results');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service pour récupérer un résultat de prédiction spécifique
 * @param {string} resultId - Identifiant du résultat
 * @returns {Promise<Object>} - Détails du résultat de prédiction
 */
export const getPredictionResult = async (resultId) => {
  try {
    const response = await predictionAPI.get(`/predictions/results/${resultId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service pour supprimer un résultat de prédiction
 * @param {string} resultId - Identifiant du résultat
 * @returns {Promise<Object>} - Confirmation de la suppression
 */
export const deletePredictionResult = async (resultId) => {
  try {
    const response = await predictionAPI.delete(`/predictions/results/${resultId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Service pour récupérer l'historique des prédictions
 * @returns {Promise<Object>} - Historique des prédictions
 */
export const getPredictionHistory = async () => {
  try {
    const response = await predictionAPI.get('/predictions/history');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default predictionAPI;
