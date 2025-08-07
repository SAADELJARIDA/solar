/**
 * Page d'historique des prédictions - SolarPredict
 * 
 * Cette page permet à l'utilisateur de consulter l'ensemble de ses prédictions passées,
 * de les filtrer selon différents critères (modèle, module, date), de les visualiser
 * en détail ou de les supprimer.
 *
 * Fonctionnalités clés:
 * - Liste paginable des prédictions
 * - Filtrage multi-critères
 * - Visualisation rapide des informations principales
 * - Navigation vers le détail des prédictions
 * - Suppression de prédictions
 *
 * Développé par: [Votre Nom]
 * Date: Juillet 2025
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';           // Navigation vers les détails
import { useAuth } from '../context/AuthContext';   // Gestion de l'authentification
import { FaSearch, FaEye, FaTrash, FaCalendarAlt, FaSolarPanel, 
         FaBrain, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Icônes
import { getPredictionHistory, deletePredictionResult as deletePrediction } from '../api/prediction'; // API

/**
 * Composant principal de la page d'historique des prédictions
 * 
 * Ce composant gestionne l'affichage, le filtrage, la pagination et la suppression des prédictions.
 * J'ai implémenté une interface intuitive permettant aux utilisateurs de retrouver facilement
 * leurs prédictions précédentes selon différents critères.
 */
const History = () => {
  // États pour les données et le chargement
  const [predictions, setPredictions] = useState([]); // Liste des prédictions
  const [loading, setLoading] = useState(true);       // Indicateur de chargement
  const [error, setError] = useState('');             // Message d'erreur éventuel
  
  // Configuration des filtres
  // Ces filtres permettent à l'utilisateur d'affiner sa recherche
  const [filters, setFilters] = useState({
    model: '',    // Filtre par type de modèle (PLM, DM, BM)
    module: '',   // Filtre par nom de module photovoltaïque
    date: '',     // Filtre par date de prédiction
    search: ''    // Recherche globale (tous champs)
  });
  
  // Configuration de la pagination
  // J'ai implémenté une pagination côté client pour améliorer l'expérience utilisateur
  const [pagination, setPagination] = useState({
    currentPage: 1,      // Page actuelle
    totalPages: 1,       // Nombre total de pages
    itemsPerPage: 10     // Nombre d'éléments par page
  });
  
  // Récupération du token d'authentification depuis le contexte
  const { token } = useAuth();

  /**
   * Récupération de l'historique des prédictions depuis le serveur
   * 
   * Ce hook useEffect est exécuté au montage du composant et à chaque changement
   * du token d'authentification. Il utilise l'API pour récupérer l'historique
   * complet des prédictions de l'utilisateur connecté.
   * 
   * La pagination est calculée côté client pour une expérience plus fluide.
   */
  useEffect(() => {
    // Fonction asynchrone pour récupérer les prédictions
    const fetchPredictions = async () => {
      setLoading(true); // Activer l'indicateur de chargement
      
      try {
        // Appel à l'API backend via le service prediction.js
        const response = await getPredictionHistory();
        
        // Traitement de la réponse
        if (response.success) {
          // Mise à jour de la liste des prédictions
          setPredictions(response.data);
          
          // Calcul du nombre total de pages pour la pagination
          setPagination(prev => ({
            ...prev,
            totalPages: Math.ceil(response.data.length / prev.itemsPerPage)
          }));
        } else {
          // Gestion des erreurs renvoyées par l'API
          setError('Erreur lors du chargement de l\'historique');
        }
      } catch (err) {
        // Gestion des erreurs réseau ou serveur
        console.error('Erreur:', err);
        setError('Impossible de charger votre historique de prédictions');
      } finally {
        // Désactiver l'indicateur de chargement, même en cas d'erreur
        setLoading(false);
      }
    };

    // Exécuter la récupération des données
    fetchPredictions();
  }, [token]); // Dépendance au token d'authentification

  /**
   * Gestion de la suppression d'une prédiction
   * 
   * Cette fonction permet à l'utilisateur de supprimer définitivement une prédiction
   * de son historique après confirmation. La suppression est effectuée via l'API backend
   * et la liste est mise à jour en temps réel sans rechargement de la page.
   * 
   * @param {string} id - Identifiant unique de la prédiction à supprimer
   */
  const handleDelete = async (id) => {
    // Demande de confirmation avant suppression
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prédiction ?')) {
      try {
        // Appel à l'API pour supprimer la prédiction
        const response = await deletePrediction(id);
        
        if (response.success) {
          // Mise à jour optimiste de l'interface: suppression immédiate de l'élément
          // sans attendre un nouveau chargement depuis le serveur
          setPredictions(predictions.filter(pred => pred.id !== id));
        } else {
          // Gestion des erreurs renvoyées par l'API
          setError('Erreur lors de la suppression');
        }
      } catch (err) {
        // Gestion des erreurs réseau ou serveur
        console.error('Erreur:', err);
        setError('Impossible de supprimer cette prédiction');
      }
    }
  };

  /**
   * Gestion des changements de filtres
   * 
   * Cette fonction met à jour les filtres lorsque l'utilisateur modifie
   * un critère de recherche. Elle réinitialise également la pagination
   * pour revenir à la première page des résultats filtrés.
   * 
   * @param {Event} e - Événement de changement de valeur du filtre
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Mise à jour du filtre spécifique tout en préservant les autres
    setFilters(prev => ({ ...prev, [name]: value }));
    // Retour à la première page pour les résultats filtrés
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  /**
   * Application des filtres à la liste des prédictions
   * 
   * Cette constante filtre la liste complète des prédictions en fonction
   * des critères sélectionnés par l'utilisateur. Le filtrage est effectué
   * de façon insensible à la casse et sur une base d'inclusion partielle
   * pour plus de flexibilité.
   * 
   * Le champ de recherche global cherche dans tous les champs importants.
   */
  const filteredPredictions = predictions.filter(pred => {
    return (
      // Filtre par type de modèle (PLM, DM, BM)
      (filters.model === '' || pred.model_type.toLowerCase().includes(filters.model.toLowerCase())) &&
      // Filtre par nom de module
      (filters.module === '' || pred.module_name.toLowerCase().includes(filters.module.toLowerCase())) &&
      // Filtre par date (format localisé)
      (filters.date === '' || new Date(pred.created_at).toLocaleDateString().includes(filters.date)) &&
      // Recherche globale dans tous les champs importants
      (filters.search === '' || 
        pred.model_type.toLowerCase().includes(filters.search.toLowerCase()) ||
        pred.module_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        new Date(pred.created_at).toLocaleDateString().includes(filters.search)
      )
    );
  });

  /**
   * Application de la pagination aux résultats filtrés
   * 
   * La pagination est gérée côté client pour une expérience plus fluide.
   * Cette constante extrait uniquement les éléments à afficher sur la page courante
   * en utilisant la méthode slice() sur le tableau filtré.
   */
  const paginatedPredictions = filteredPredictions.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage, // Index de début
    pagination.currentPage * pagination.itemsPerPage        // Index de fin (exclusif)
  );

  /**
   * Gestion du changement de page
   * 
   * Cette fonction met à jour la page courante lorsque l'utilisateur
   * clique sur un bouton de pagination.
   * 
   * @param {number} newPage - Le numéro de la nouvelle page à afficher
   */
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  /**
   * Extraction des valeurs uniques pour les filtres déroulants
   * 
   * Ces constantes extraient les valeurs uniques pour chaque type de filtre
   * afin de construire des listes déroulantes pertinentes pour l'utilisateur.
   * J'utilise Set pour éliminer les doublons avant de reconvertir en tableau.
   */
  const uniqueModels = [...new Set(predictions.map(p => p.model_type))];
  const uniqueModules = [...new Set(predictions.map(p => p.module_name))];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Historique des prédictions</h1>

      {/* Filters section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <FaFilter className="mr-2" /> Filtres
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Rechercher..."
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
            <select
              name="model"
              value={filters.model}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Tous les modèles</option>
              {uniqueModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
            <select
              name="module"
              value={filters.module}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Tous les modules</option>
              {uniqueModules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Table section */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      ) : filteredPredictions.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">Aucune prédiction trouvée. Créez votre première prédiction !</p>
          <Link 
            to="/predict" 
            className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
          >
            Nouvelle prédiction
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module utilisé
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modèle prédictif
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Données environnementales
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPredictions.map(prediction => (
                    <tr key={prediction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(prediction.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FaSolarPanel className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{prediction.module_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FaBrain className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{prediction.model_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {prediction.sensor_data_file || "Données téléchargées"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            to={`/results/${prediction.id}`} 
                            className="text-green-600 hover:text-green-800 flex items-center"
                          >
                            <FaEye className="mr-1" /> Voir
                          </Link>
                          <button
                            onClick={() => handleDelete(prediction.id)}
                            className="text-red-600 hover:text-red-800 flex items-center"
                          >
                            <FaTrash className="mr-1" /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {filteredPredictions.length > pagination.itemsPerPage && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow-md">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                  disabled={pagination.currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${pagination.currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Précédent
                </button>
                <button
                  onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${pagination.currentPage === pagination.totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de{' '}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                    </span>
                    {' '}à{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, filteredPredictions.length)}
                    </span>
                    {' '}sur{' '}
                    <span className="font-medium">{filteredPredictions.length}</span>
                    {' '}résultats
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                      disabled={pagination.currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${pagination.currentPage === 1 ? 'text-gray-300' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                      <span className="sr-only">Précédent</span>
                      <FaChevronLeft className="h-5 w-5" />
                    </button>
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            pageNumber === pagination.currentPage
                              ? 'bg-green-600 text-white focus:z-20'
                              : 'text-gray-900 hover:bg-gray-50 focus:z-20'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${pagination.currentPage === pagination.totalPages ? 'text-gray-300' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                      <span className="sr-only">Suivant</span>
                      <FaChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
