/**
 * Page de gestion des modules photovoltaïques - SolarPredict
 * 
 * Cette page permet aux utilisateurs de visualiser, créer, modifier et supprimer
 * leurs modules photovoltaïques. Elle représente une interface CRUD complète
 * pour la gestion des modules, qui sont essentiels pour effectuer des prédictions
 * de production d'énergie solaire.
 * 
 * Chaque module contient des informations techniques comme:
 * - Nom et fabricant
 * - Tension en circuit ouvert (Voc)
 * - Courant de court-circuit (Isc)
 * - Tension au point de puissance maximale (Vmp)
 * - Courant au point de puissance maximale (Imp)
 * - Puissance maximale (Pmax)
 * - Technologie (monocristallin, polycristallin, etc.)
 * 
 * Développé par: [Votre Nom]
 * Date: Juillet 2025
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';           // Composant de carte réutilisable
import Button from '../components/ui/Button';        // Bouton personnalisé avec variantes
import AlertMessage from '../components/ui/AlertMessage'; // Notifications d'erreur/succès
import { getModules, deleteModule } from '../api/module'; // Services API pour les modules

/**
 * Composant principal de la page des modules
 * 
 * Ce composant gère l'affichage et la logique de la liste des modules photovoltaïques
 * d'un utilisateur, avec les opérations CRUD associées.
 * 
 * @returns {JSX.Element} Page des modules photovoltaïques
 */
const Modules = () => {
  // États pour gérer les modules et les interactions utilisateur
  const [modules, setModules] = useState([]);         // Liste des modules de l'utilisateur
  const [loading, setLoading] = useState(true);       // État de chargement initial
  const [error, setError] = useState('');             // Message d'erreur éventuel
  const [deleteId, setDeleteId] = useState(null);     // ID du module en cours de suppression
  const [isDeleting, setIsDeleting] = useState(false); // Indicateur de suppression en cours
  const [deleteSuccess, setDeleteSuccess] = useState(false); // Message de succès de suppression

  // Hooks pour l'authentification et la navigation
  const { isAuthenticated } = useAuth();  // Vérifier si l'utilisateur est connecté
  const navigate = useNavigate();         // Pour les redirections programmatiques

  /**
   * Protection de la route
   * 
   * Ce hook useEffect vérifie si l'utilisateur est authentifié
   * et le redirige vers la page de connexion si ce n'est pas le cas.
   * Il sauvegarde également l'URL actuelle pour revenir après connexion.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirection vers la page de connexion avec l'URL actuelle comme destination post-connexion
      navigate('/login', { state: { from: { pathname: '/modules' } } });
    }
  }, [isAuthenticated, navigate]); // Dépendances: statut d'authentification et fonction navigate

  /**
   * Chargement des modules photovoltaïques de l'utilisateur
   * 
   * Ce hook useEffect est responsable de récupérer tous les modules de l'utilisateur
   * depuis le backend. Il s'exécute au chargement initial et après chaque suppression réussie
   * pour garantir que la liste est toujours à jour.
   */
  useEffect(() => {
    /**
     * Récupération des modules depuis l'API
     * 
     * Cette fonction appelle le service API qui communique avec le backend
     * sur le port 4000 (après migration depuis le port 5000) et gère les états
     * de chargement, d'erreur et de succès.
     */
    const fetchModules = async () => {
      try {
        setLoading(true); // Activer l'indicateur de chargement
        
        // Appel au service API pour récupérer les modules
        // L'authentification est gérée automatiquement via l'intercepteur dans module.js
        const response = await getModules();
        
        if (response.success) {
          // Mise à jour de l'état avec les modules reçus
          setModules(response.data);
        } else {
          // Gestion des erreurs côté serveur avec message explicite
          setError('Erreur lors du chargement des modules');
        }
      } catch (error) {
        // Gestion des erreurs de réseau ou exceptions
        console.error('Erreur lors du chargement des modules:', error);
        setError('Impossible de charger vos modules photovoltaïques');
      } finally {
        // Quoi qu'il arrive, désactiver l'indicateur de chargement
        setLoading(false);
      }
    };

    // N'exécuter la requête que si l'utilisateur est authentifié
    if (isAuthenticated) {
      fetchModules();
    }
  }, [isAuthenticated, deleteSuccess]); // Dépendances: statut d'authentification et succès de suppression

  /**
   * Gestion de la suppression d'un module
   * 
   * Cette fonction est appelée lorsque l'utilisateur confirme la suppression d'un module.
   * Elle communique avec le backend pour effectuer la suppression en base de données
   * et met à jour l'interface utilisateur en conséquence.
   * 
   * IMPORTANT: La suppression d'un module entraîne également la suppression de toutes
   * les prédictions associées à ce module (cascade de suppression gérée par le backend).
   * 
   * @param {string} id - Identifiant unique du module à supprimer
   */
  const handleDelete = async (id) => {
    try {
      // Mise à jour de l'état pour indiquer la suppression en cours
      setIsDeleting(true); // Activer l'indicateur de suppression
      setDeleteId(id);     // Enregistrer l'ID du module en cours de suppression
      
      // Appel au service API pour supprimer le module
      const response = await deleteModule(id);
      
      if (response.success) {
        // Afficher un message de succès temporaire (3 secondes)
        setDeleteSuccess(true);
        // Réinitialiser le message de succès après 3 secondes
        // Cela déclenchera un nouveau fetchModules() via la dépendance dans useEffect
        setTimeout(() => {
          setDeleteSuccess(false);
        }, 3000);
      } else {
        // Gérer les erreurs côté serveur
        setError('Erreur lors de la suppression du module');
      }
    } catch (error) {
      // Gérer les erreurs de réseau ou exceptions
      console.error('Erreur lors de la suppression:', error);
      setError('Impossible de supprimer le module');
    } finally {
      // Quoi qu'il arrive, réinitialiser les états de suppression
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  /**
   * Navigation vers la page d'édition d'un module
   * 
   * Cette fonction redirige l'utilisateur vers le formulaire d'édition
   * pré-rempli avec les données du module sélectionné.
   * 
   * @param {string} id - Identifiant unique du module à éditer
   */
  const handleEdit = (id) => {
    // Redirection vers le formulaire d'édition avec l'ID du module dans l'URL
    navigate(`/modules/edit/${id}`);
  };

  /**
   * Rendu du composant
   * 
   * Structure de la page:
   * 1. En-tête avec titre et bouton d'ajout
   * 2. Messages d'erreur ou de succès éventuels
   * 3. Indicateur de chargement, message vide, ou grille de modules
   * 4. Cartes de modules avec caractéristiques techniques et boutons d'action
   */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modules Photovoltaïques</h1>
          <p className="mt-2 text-lg text-gray-600">
            Gérez vos modules photovoltaïques pour les prédictions
          </p>
        </div>
        <Button
          onClick={() => navigate('/modules/new')}
          type="primary"
        >
          Nouveau module
        </Button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Message de succès */}
      {deleteSuccess && (
        <AlertMessage
          type="success"
          message="Module supprimé avec succès"
          onClose={() => setDeleteSuccess(false)}
          className="mb-6"
        />
      )}

      {/* Affichage des modules */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : modules.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun module</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vous n'avez pas encore créé de module photovoltaïque.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate('/modules/new')}
                type="primary"
              >
                Créer votre premier module
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.id} hoverable className="overflow-visible">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{module.module_name}</h3>
                  <div className="text-sm text-gray-500 space-y-2 mb-4">
                    <p><span className="font-medium">Voc:</span> {module.voc} V</p>
                    <p><span className="font-medium">Isc:</span> {module.isc} A</p>
                    <p><span className="font-medium">Vmp:</span> {module.vmp} V</p>
                    <p><span className="font-medium">Imp:</span> {module.imp} A</p>
                    <p><span className="font-medium">Facteur de forme:</span> {module.ff.toFixed(3)}</p>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200 mt-4">
                  <Button
                    onClick={() => handleEdit(module.id)}
                    type="outline"
                    size="sm"
                  >
                    Modifier
                  </Button>
                  <Button
                    onClick={() => handleDelete(module.id)}
                    type="danger"
                    size="sm"
                    isLoading={isDeleting && deleteId === module.id}
                    disabled={isDeleting}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Modules;
