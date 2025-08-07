/**
 * Hook personnalisé pour gérer l'authentification
 */
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook pour gérer l'authentification
 * @returns {Object} Fonctions et états liés à l'authentification
 */
const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur est authentifié
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Si on a un token mais pas d'utilisateur, on pourrait faire une requête
        // pour vérifier la validité du token et récupérer les infos utilisateur
        // Mais pour l'instant, on considère que le token est valide
        if (!user && token) {
          // Vous pourriez implémenter ici une vérification du token
          // via une requête API
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Erreur d\'authentification');
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [setUser, user]);

  // Se connecter
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // Cette partie serait remplacée par un appel à votre service d'authentification
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Échec de la connexion');
      }
      
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setLoading(false);
      navigate('/dashboard');
      return data;
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
      setLoading(false);
      throw err;
    }
  };

  // Se déconnecter
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
};

export default useAuth;
