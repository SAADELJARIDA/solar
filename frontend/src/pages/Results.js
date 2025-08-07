import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AlertMessage from '../components/ui/AlertMessage';
import { getPredictionResults, deletePredictionResult } from '../api/prediction';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/results' } } });
    }
  }, [isAuthenticated, navigate]);

  // Charger tous les résultats de prédiction
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await getPredictionResults();
        if (response.success) {
          setResults(response.data);
        } else {
          setError('Erreur lors du chargement des résultats');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des résultats:', error);
        setError('Impossible de charger vos résultats de prédiction');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchResults();
    }
  }, [isAuthenticated, deleteSuccess]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour obtenir l'étiquette du type de modèle
  const getModelTypeLabel = (type) => {
    switch (type) {
      case 'PLM':
        return 'Modèle de luminosité physique';
      case 'DM':
        return 'Modèle diode';
      case 'BM':
        return 'Modèle de base';
      default:
        return type;
    }
  };

  // Gérer la suppression d'un résultat
  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      setDeleteId(id);
      
      const response = await deletePredictionResult(id);
      
      if (response.success) {
        setDeleteSuccess(true);
        // Réinitialiser après 3 secondes
        setTimeout(() => {
          setDeleteSuccess(false);
        }, 3000);
      } else {
        setError('Erreur lors de la suppression du résultat');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Impossible de supprimer le résultat');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Gérer le clic sur un résultat pour voir les détails
  const handleViewDetails = (id) => {
    navigate(`/results/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Résultats de Prédiction</h1>
          <p className="mt-2 text-lg text-gray-600">
            Historique de vos prédictions de performance photovoltaïque
          </p>
        </div>
        <Button
          onClick={() => navigate('/predict')}
          type="primary"
        >
          Nouvelle prédiction
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
          message="Résultat supprimé avec succès"
          onClose={() => setDeleteSuccess(false)}
          className="mb-6"
        />
      )}

      {/* Affichage des résultats */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : results.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun résultat</h3>
            <p className="mt-1 text-sm text-gray-500">
              Vous n'avez pas encore effectué de prédictions.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate('/predict')}
                type="primary"
              >
                Faire votre première prédiction
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <Card key={result.id} hoverable className="overflow-visible">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{result.module_name}</h3>
                  <div className="text-sm text-gray-500 space-y-2 mb-4">
                    <p>Date: {formatDate(result.date)}</p>
                    <p>Fichier: {result.file_name}</p>
                    <p>Modèle: {getModelTypeLabel(result.model_type)}</p>
                    <p className="font-semibold text-green-600">
                      Puissance max: {result.pmax.toFixed(2)} W
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200 mt-4">
                  <Button
                    onClick={() => handleViewDetails(result.id)}
                    type="outline"
                    size="sm"
                  >
                    Détails
                  </Button>
                  <Button
                    onClick={() => handleDelete(result.id)}
                    type="danger"
                    size="sm"
                    isLoading={isDeleting && deleteId === result.id}
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

export default Results;
