/**
 * Contexte d'authentification - SolarPredict
 * 
 * Ce fichier implémente un système d'authentification complet à l'aide du Context API de React.
 * Il gère le cycle de vie des utilisateurs (connexion, inscription, déconnexion) et maintient
 * l'état d'authentification dans toute l'application.
 * 
 * Le système utilise des tokens JWT (JSON Web Token) stockés dans le localStorage pour
 * permettre la persistence de la session, même après rechargement de la page.
 * 
 * L'API d'authentification utilise le point d'entrée standardisé sur le port 4000
 * (après migration depuis le port 5000).
 *
 * Développé par: [Votre Nom]
 * Date: Juillet 2025
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../api/auth';

/**
 * Création du contexte d'authentification
 * 
 * Le contexte est initialisé à null et sera rempli par le AuthProvider
 * avec les informations d'utilisateur et les fonctions d'authentification.
 */
const AuthContext = createContext(null);

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * 
 * Ce hook permet à n'importe quel composant d'accéder facilement à l'état d'authentification
 * et aux fonctions associées sans avoir à passer par les props.
 * 
 * Exemple d'utilisation:
 * const { currentUser, login, logout, isAuthenticated } = useAuth();
 * 
 * @returns {Object} Le contexte d'authentification avec toutes ses valeurs et fonctions
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Fournisseur du contexte d'authentification
 * 
 * Ce composant encapsule l'ensemble de la logique d'authentification et la rend
 * disponible à tous les composants enfants via le Context API.
 * 
 * Il gère:
 * - L'état de l'utilisateur connecté
 * - Le chargement des données d'authentification
 * - Les erreurs d'authentification
 * - Les fonctions de connexion, inscription et déconnexion
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Les composants enfants qui auront accès au contexte
 */
export const AuthProvider = ({ children }) => {
  // États du contexte d'authentification
  const [currentUser, setCurrentUser] = useState(null);  // Informations sur l'utilisateur connecté
  const [loading, setLoading] = useState(true);         // Indicateur de chargement
  const [error, setError] = useState(null);             // Message d'erreur éventuel

  /**
   * Vérification automatique de l'authentification au chargement de l'application
   * 
   * Ce hook useEffect s'exécute une seule fois au montage du composant.
   * Il vérifie si un token JWT existe dans le localStorage (via l'intercepteur Axios)
   * et tente de récupérer les informations de l'utilisateur depuis le backend.
   * 
   * Si la requête réussit, l'utilisateur est automatiquement reconnecté.
   * En cas d'échec, l'utilisateur reste déconnecté (token invalide ou expiré).
   */
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        setLoading(true); // Activer l'indicateur de chargement
        
        // Appel API pour vérifier si le token JWT est valide
        // L'intercepteur Axios dans auth.js ajoute automatiquement le token depuis localStorage
        const response = await getCurrentUser();
        
        if (response.success) {
          // Si la réponse est positive, mettre à jour l'état avec les données utilisateur
          setCurrentUser(response.user);
        }
        // Si la réponse est négative, l'utilisateur reste déconnecté (currentUser = null)
      } catch (error) {
        // Gestion des erreurs (problème réseau, serveur indisponible, etc.)
        console.error('Failed to fetch current user:', error);
        // L'utilisateur reste déconnecté en cas d'erreur
      } finally {
        // Quoi qu'il arrive, désactiver l'indicateur de chargement
        setLoading(false);
      }
    };

    // Exécuter la vérification d'authentification
    checkUserLoggedIn();
  }, []); // Dépendance vide = exécution uniquement au montage du composant

  /**
   * Fonction de connexion utilisateur
   * 
   * Cette fonction authentifie un utilisateur avec son email et son mot de passe.
   * En cas de succès, elle:
   * 1. Met à jour l'état avec les informations de l'utilisateur
   * 2. Stocke le token JWT dans le localStorage
   * 3. Retourne un objet de réponse avec succès = true
   *
   * @param {string} email - Adresse email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Object} Objet indiquant le succès ou l'échec de la connexion
   */
  const login = async (email, password) => {
    try {
      // Sous-fonction pour gérer la connexion et stocker le token
      const handleLogin = async (email, password) => {
        try {
          // Appel au service API d'authentification
          const response = await loginUser(email, password);
          
          if (response.success) {
            // Stocker les informations utilisateur dans le state
            setCurrentUser(response.user);
            
            // Stocker le token JWT dans localStorage pour les futures requêtes
            // Ce token sera utilisé par l'intercepteur Axios dans auth.js
            localStorage.setItem('token', response.token);
            return response;
          }
          return response;
        } catch (error) {
          console.error('Erreur lors de la connexion:', error);
          return { success: false, message: 'Erreur lors de la connexion.' };
        }
      };
      
      // Mise à jour des états avant la tentative de connexion
      setLoading(true); // Activer l'indicateur de chargement
      setError(null);   // Réinitialiser les erreurs précédentes
      
      // Tentative de connexion
      const response = await handleLogin(email, password);
      
      if (response.success) {
        // Connexion réussie
        return { success: true };
      } else {
        // Échec de connexion avec message d'erreur du serveur
        setError(response.message || 'Échec de connexion');
        return { success: false, message: response.message };
      }
    } catch (error) {
      // Gestion des erreurs inattendues (problèmes réseau, serveur, etc.)
      setError(error.response?.data?.message || 'Erreur serveur');
      return { success: false, message: error.response?.data?.message || 'Erreur serveur' };
    } finally {
      // Quoi qu'il arrive, désactiver l'indicateur de chargement
      setLoading(false);
    }
  };

  /**
   * Fonction d'inscription d'un nouvel utilisateur
   * 
   * Cette fonction crée un nouveau compte utilisateur avec un email et un mot de passe.
   * En cas de succès, elle connecte automatiquement l'utilisateur.
   * 
   * Note: Le token JWT est géré par la fonction loginUser qui est appelée par
   * le backend après une inscription réussie.
   *
   * @param {string} email - Adresse email du nouvel utilisateur
   * @param {string} password - Mot de passe choisi
   * @returns {Object} Objet indiquant le succès ou l'échec de l'inscription
   */
  const register = async (email, password) => {
    try {
      // Mise à jour des états avant la tentative d'inscription
      setLoading(true); // Activer l'indicateur de chargement
      setError(null);   // Réinitialiser les erreurs précédentes
      
      // Appel au service API d'inscription
      const response = await registerUser(email, password);
      
      if (response.success) {
        // Inscription réussie - connecter automatiquement l'utilisateur
        setCurrentUser(response.user);
        // Le token JWT est déjà stocké par le service d'API
        return { success: true };
      } else {
        // Échec d'inscription avec message d'erreur du serveur
        setError(response.message || 'Échec d\'inscription');
        return { success: false, message: response.message };
      }
    } catch (error) {
      // Gestion des erreurs inattendues (problèmes réseau, serveur, etc.)
      setError(error.response?.data?.message || 'Erreur serveur');
      return { success: false, message: error.response?.data?.message || 'Erreur serveur' };
    } finally {
      // Quoi qu'il arrive, désactiver l'indicateur de chargement
      setLoading(false);
    }
  };

  /**
   * Fonction de déconnexion utilisateur
   * 
   * Cette fonction déconnecte l'utilisateur en:
   * 1. Supprimant le token JWT du localStorage (via le service API)
   * 2. Supprimant les informations utilisateur du state
   * 3. Réinitialisant le contexte d'authentification
   * 
   * Après déconnexion, l'utilisateur est redirigé vers la page de connexion
   * par les routes protégées.
   *
   * @returns {Object} Objet indiquant le succès ou l'échec de la déconnexion
   */
  const logout = async () => {
    try {
      // Mise à jour des états avant la tentative de déconnexion
      setLoading(true); // Activer l'indicateur de chargement
      setError(null);   // Réinitialiser les erreurs précédentes
      
      // Appel au service API de déconnexion
      // Cette fonction supprime également le token du localStorage
      await logoutUser();
      
      // Suppression des informations utilisateur du state
      setCurrentUser(null);
      
      return { success: true };
    } catch (error) {
      // Gestion des erreurs inattendues (problèmes réseau, serveur, etc.)
      setError(error.response?.data?.message || 'Erreur de déconnexion');
      return { success: false, message: error.response?.data?.message || 'Erreur de déconnexion' };
    } finally {
      // Quoi qu'il arrive, désactiver l'indicateur de chargement
      setLoading(false);
    }
  };

  /**
   * Valeurs et fonctions exposées par le contexte d'authentification
   * 
   * Ces valeurs seront accessibles depuis n'importe quel composant via le hook useAuth().
   * J'ai inclus un flag pratique isAuthenticated qui permet de vérifier rapidement
   * si un utilisateur est connecté ou non, sans avoir à vérifier currentUser != null.
   */
  const value = {
    currentUser,                   // Objet contenant les informations de l'utilisateur
    loading,                       // Booléen indiquant si une opération est en cours
    error,                         // Message d'erreur éventuel
    login,                         // Fonction de connexion
    register,                      // Fonction d'inscription
    logout,                        // Fonction de déconnexion
    isAuthenticated: !!currentUser, // Booléen indiquant si un utilisateur est connecté
    token: localStorage.getItem('token') // Le token JWT actuel (utile pour les tests)
  };

  /**
   * Rendu du Provider qui encapsule tous les composants de l'application
   * 
   * Ce Provider rend disponible l'ensemble des valeurs et fonctions d'authentification
   * à tous les composants enfants, permettant ainsi une gestion centralisée
   * de l'authentification dans toute l'application.
   */
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
