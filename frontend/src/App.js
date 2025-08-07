/**
 * Application principale SolarPredict
 * 
 * Cette application React permet de prédire la production d'électricité
 * à partir de panneaux solaires photovoltaïques en utilisant des données environnementales
 * et différents modèles de prédiction.
 * 
 * Caractéristiques principales:
 * - Architecture React avec React Router pour la navigation
 * - Système d'authentification JWT
 * - Interface utilisateur réactive avec Tailwind CSS
 * - Communication avec une API backend Node.js/Express
 * - Visualisation de données de production solaire
 *
 * Développé par: [Votre Nom]
 * Date: Juillet 2025
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Contexte d'authentification global
import { AppStateProvider } from './context/AppStateContext'; // Contexte d'état global de l'application

// Layout et composants communs pour la structure générale de l'application
import Navbar from './components/Navbar';   // Barre de navigation avec logo et menu
import Footer from './components/Footer';   // Pied de page avec informations légales

// Importation des différentes pages de l'application
// J'ai structuré l'application en pages distinctes pour une meilleure organisation
// et une séparation claire des responsabilités
import Home from './pages/Home';           // Page d'accueil avec présentation
import Login from './pages/Login';         // Authentification utilisateur
import Register from './pages/Register';   // Création de compte
import Predict from './pages/Predict';     // Page principale de prédiction solaire
import ResultDetail from './pages/ResultDetail'; // Affichage détaillé des résultats
import Modules from './pages/Modules';     // Gestion des modules photovoltaïques
import ModuleForm from './pages/ModuleForm'; // Création/modification de module
import About from './pages/About';         // Page À propos avec informations sur le projet
import Info from './pages/Info';           // Informations supplémentaires
import History from './pages/History';     // Historique des prédictions
import Help from './pages/Help';           // Page d'aide utilisateur

/**
 * Composant de protection de route
 * 
 * Ce composant est utilisé pour protéger les routes qui nécessitent une authentification.
 * Il vérifie si l'utilisateur est authentifié via le contexte d'authentification.
 * Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de connexion.
 * Si la vérification d'authentification est en cours, affiche un spinner de chargement.
 * 
 * @param {Object} children - Les composants enfants à afficher si l'authentification réussit
 * @returns {JSX.Element} Le composant enfant ou une redirection
 */
const ProtectedRoute = ({ children }) => {
  // Récupération de l'état d'authentification depuis le contexte
  const { isAuthenticated, isLoading } = useAuth();
  
  // Affiche un spinner pendant la vérification du token JWT
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
    </div>;
  }
  
  // Si non authentifié, redirection vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Si authentifié, affiche le contenu protégé
  return children;
};

/**
 * Composant principal de l'application
 * 
 * Ce composant définit la structure globale de l'application avec:
 * - Un système d'authentification via AuthProvider
 * - Un router pour la navigation entre les pages
 * - Une structure de mise en page commune à toutes les pages
 * - Un système de routes publiques et protégées
 * 
 * J'ai organisé les routes pour offrir une expérience utilisateur intuitive
 * tout en protégeant les fonctionnalités qui nécessitent une authentification.
 */
function App() {
  return (
    // Fournit le contexte d'authentification à toute l'application
    <AuthProvider>
      {/* Fournit le contexte d'état global de l'application */}
      <AppStateProvider>
        {/* Configure le routeur pour la navigation */}
        <Router>
          {/* Structure principale avec flex pour que le footer reste en bas */}
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow pt-16"> {/* Espacement pour la navbar fixe */}
              <Routes>
              {/* Routes publiques accessibles sans authentification */}
              {/* Ces pages permettent à tous les utilisateurs de découvrir l'application */}
              <Route path="/" element={<Home />} />                 {/* Page d'accueil */}
              <Route path="/login" element={<Login />} />           {/* Connexion */}
              <Route path="/register" element={<Register />} />     {/* Inscription */}
              <Route path="/about" element={<About />} />           {/* À propos */}
              <Route path="/info" element={<Info />} />             {/* Informations */}
              <Route path="/help" element={<Help />} />             {/* Aide */}
              
              {/* Routes protégées nécessitant une authentification */}
              {/* Le cœur fonctionnel de l'application est protégé */}
              
              {/* Page principale de prédiction */}
              <Route path="/predict" element={
                <ProtectedRoute>
                  <Predict />
                </ProtectedRoute>
              } />
              
              {/* Redirection de l'ancienne URL vers la nouvelle */}
              <Route path="/results" element={<Navigate to="/history" />} />
              
              {/* Détail d'un résultat spécifique */}
              <Route path="/results/:id" element={
                <ProtectedRoute>
                  <ResultDetail />
                </ProtectedRoute>
              } />
              
              {/* Aperçu des résultats avant enregistrement */}
              <Route path="/results/preview" element={
                <ProtectedRoute>
                  <ResultDetail />
                </ProtectedRoute>
              } />
              
              {/* Gestion des modules photovoltaïques */}
              {/* Ces routes permettent aux utilisateurs de gérer leur catalogue de modules */}
              
              {/* Liste des modules de l'utilisateur */}
              <Route path="/modules" element={
                <ProtectedRoute>
                  <Modules />
                </ProtectedRoute>
              } />
              
              {/* Création d'un nouveau module */}
              <Route path="/modules/new" element={
                <ProtectedRoute>
                  <ModuleForm />
                </ProtectedRoute>
              } />
              
              {/* Modification d'un module existant */}
              <Route path="/modules/edit/:id" element={
                <ProtectedRoute>
                  <ModuleForm />
                </ProtectedRoute>
              } />
              
              {/* Gestion de l'historique des prédictions */}
              {/* Ces routes permettent d'accéder aux prédictions passées */}
              
              {/* Liste de toutes les prédictions */}
              <Route path="/history" element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } />
              
              {/* Détail d'une prédiction spécifique */}
              <Route path="/history/:id" element={
                <ProtectedRoute>
                  <ResultDetail />
                </ProtectedRoute>
              } />
              
              {/* Aperçu d'une prédiction avant enregistrement */}
              <Route path="/history/preview" element={
                <ProtectedRoute>
                  <ResultDetail />
                </ProtectedRoute>
              } />
              
              {/* Gestion des routes inconnues */}
              {/* Redirection vers la page d'accueil si l'URL ne correspond à aucune route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      </AppStateProvider>
    </AuthProvider>
  );
}

export default App;
