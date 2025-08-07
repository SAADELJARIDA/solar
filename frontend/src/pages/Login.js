/**
 * Page de connexion - SolarPredict
 * 
 * Cette page permet aux utilisateurs de se connecter à l'application SolarPredict
 * en utilisant leur email et mot de passe. Elle utilise le contexte d'authentification
 * pour gérer la connexion et la redirection après connexion réussie.
 * 
 * Fonctionnalités principales :
 * - Formulaire de connexion avec validation des entrées
 * - Gestion des erreurs d'authentification
 * - Redirection intelligente vers la page demandée avant connexion
 * - Option "se souvenir de moi" (interface uniquement)
 * - Lien vers la création de compte et la réinitialisation de mot de passe
 * 
 * Développé par: [Votre Nom]
 * Date: Juillet 2025
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AlertMessage from '../components/ui/AlertMessage';

/**
 * Composant de la page de connexion
 * 
 * Ce composant gère le processus d'authentification des utilisateurs.
 * Il utilise le hook useAuth pour accéder aux fonctions d'authentification
 * et les hooks de React Router pour gérer les redirections.
 * 
 * @returns {JSX.Element} Formulaire de connexion avec gestion d'état et d'erreurs
 */
const Login = () => {
  // États locaux pour gérer le formulaire et l'interface utilisateur
  const [email, setEmail] = useState('');       // Email saisi par l'utilisateur
  const [password, setPassword] = useState(''); // Mot de passe saisi par l'utilisateur
  const [error, setError] = useState('');       // Message d'erreur éventuel
  const [isLoading, setIsLoading] = useState(false); // État de chargement pendant l'authentification
  
  // Récupération des fonctions et hooks nécessaires
  const { login } = useAuth();       // Fonction de connexion depuis le contexte d'authentification
  const navigate = useNavigate();     // Hook pour la navigation programmatique
  const location = useLocation();     // Hook pour accéder aux informations de localisation
  
  /**
   * Déterminer la redirection après connexion réussie
   * 
   * Si l'utilisateur a été redirigé vers la page de connexion depuis une route protégée,
   * nous le renvoyons vers cette route après connexion. Sinon, nous le redirigeons
   * vers la page d'accueil.
   */
  const from = location.state?.from?.pathname || '/';  // Destination après connexion

  /**
   * Gestion de la soumission du formulaire de connexion
   * 
   * Cette fonction est déclenchée lorsque l'utilisateur soumet le formulaire.
   * Elle effectue les étapes suivantes:
   * 1. Validation des champs du formulaire
   * 2. Appel du service d'authentification via le contexte
   * 3. Gestion des réponses et erreurs
   * 4. Redirection en cas de succès
   * 
   * @param {Event} e - Événement de soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();  // Empêcher le comportement par défaut du formulaire
    
    // Validation basique des champs requis
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      // Réinitialiser les erreurs précédentes et activer l'indicateur de chargement
      setError('');
      setIsLoading(true);
      
      // Appel de la fonction de connexion du contexte d'authentification
      // Cette fonction appelle l'API backend et gère le stockage du token JWT
      const response = await login(email, password);
      
      if (response.success) {
        // En cas de succès, rediriger l'utilisateur vers la page demandée initialement
        // Le paramètre { replace: true } remplace l'entrée actuelle dans l'historique
        // pour empêcher l'utilisateur de revenir à la page de connexion avec le bouton retour
        navigate(from, { replace: true });
      } else {
        // En cas d'échec avec message explicite du backend
        setError(response.message || 'Erreur de connexion');
      }
    } catch (err) {
      // Gestion des erreurs inattendues (problèmes réseau, serveur, etc.)
      // Extraction du message d'erreur de la réponse Axios si disponible
      setError(err?.response?.data?.message || 'Une erreur s\'est produite lors de la connexion');
    } finally {
      // Quoi qu'il arrive, désactiver l'indicateur de chargement
      setIsLoading(false);
    }
  };

  /**
   * Rendu du composant
   * 
   * Structure du formulaire de connexion:
   * - En-tête avec logo et titre
   * - Formulaire avec champs email et mot de passe
   * - Boutons et options de connexion alternative
   * 
   * Design inspiré des meilleures pratiques UI/UX et utilisant Tailwind CSS
   * pour un style cohérent et responsive.
   */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="h-12 w-auto"
            src="/logo.png"
            alt="SolarPredict Logo"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connectez-vous à votre compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link
            to="/register"
            className="font-medium text-green-600 hover:text-green-500"
          >
            créez un nouveau compte
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <AlertMessage
              type="error"
              message={error}
              onClose={() => setError('')}
            />
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Adresse e-mail"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              autoComplete="email"
            />

            <Input
              label="Mot de passe"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/reset-password"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Mot de passe oublié?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="primary"
                size="lg"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full"
              >
                Se connecter
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Ou continuer avec
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Se connecter avec Google</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.42 20 10c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Se connecter avec LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
