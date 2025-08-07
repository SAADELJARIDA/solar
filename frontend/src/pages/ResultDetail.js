import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AlertMessage from '../components/ui/AlertMessage';
import ChartDisplay, { 
  createIVCurveConfig, 
  createPVCurveConfig, 
  createPmaxEvolutionConfig 
} from '../components/ui/ChartDisplay';
import { getPredictionResult, deletePredictionResult } from '../api/prediction';

const ResultDetail = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/history/${id}` } } });
    }
  }, [isAuthenticated, navigate, id]);

  // Charger les détails du résultat
  useEffect(() => {
    const fetchResultDetails = async () => {
      try {
        setLoading(true);
        const response = await getPredictionResult(id);
        if (response.success) {
          setResult(response.data);
        } else {
          setError('Erreur lors du chargement des détails du résultat');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
        setError('Impossible de charger les détails du résultat');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchResultDetails();
    }
  }, [isAuthenticated, id]);

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

  // Gérer la suppression du résultat
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce résultat ?')) {
      try {
        setIsDeleting(true);
        const response = await deletePredictionResult(id);
        
        if (response.success) {
          navigate('/history', { state: { deleteSuccess: true } });
        } else {
          setError('Erreur lors de la suppression du résultat');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Impossible de supprimer le résultat');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Obtenir l'étiquette du type de modèle
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

  // Préparer les configurations pour les graphiques
  const getChartConfigs = () => {
    if (!result || !result.results) return {};
    
    const ivCurveConfig = createIVCurveConfig(
      result.results.curve_iv.voltages,
      result.results.curve_iv.currents
    );
    
    const pvCurveConfig = createPVCurveConfig(
      result.results.curve_pv.voltages,
      result.results.curve_pv.powers
    );
    
    const pmaxEvolutionConfig = createPmaxEvolutionConfig(
      result.results.evolution_pmax.timestamps,
      result.results.evolution_pmax.pmax_values
    );
    
    return {
      ivCurveConfig,
      pvCurveConfig,
      pmaxEvolutionConfig
    };
  };

  // Rendu des tabs
  const renderTabs = () => {
    const tabs = [
      { id: 'summary', label: 'Résumé' },
      { id: 'curves', label: 'Courbes I-V et P-V' },
      { id: 'evolution', label: 'Évolution Pmax' },
      { id: 'data', label: 'Données brutes' }
    ];

    return (
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    );
  };

  // Rendu du contenu selon le tab actif
  const renderTabContent = () => {
    if (!result) return null;
    
    const chartConfigs = getChartConfigs();
    
    switch (activeTab) {
      case 'summary':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card title="Informations générales">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date de prédiction</h4>
                  <p className="mt-1">{formatDate(result.date)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Module</h4>
                  <p className="mt-1">{result.module.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Fichier de données</h4>
                  <p className="mt-1">{result.sensor_data.file_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Type de modèle</h4>
                  <p className="mt-1">{getModelTypeLabel(result.model_type)}</p>
                </div>
              </div>
            </Card>
            
            <Card title="Résultats de prédiction">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Puissance max (Pmax)</h4>
                  <p className="mt-1 text-xl font-semibold text-green-600">
                    {result.results.pmax.toFixed(2)} W
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tension au Pmax (Vmp)</h4>
                  <p className="mt-1">{result.results.vmp.toFixed(2)} V</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Courant au Pmax (Imp)</h4>
                  <p className="mt-1">{result.results.imp.toFixed(2)} A</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Facteur de forme (FF)</h4>
                  <p className="mt-1">{result.results.ff.toFixed(3)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tension circuit ouvert (Voc)</h4>
                  <p className="mt-1">{result.results.voc.toFixed(2)} V</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Courant court-circuit (Isc)</h4>
                  <p className="mt-1">{result.results.isc.toFixed(2)} A</p>
                </div>
              </div>
            </Card>
          </div>
        );
        
      case 'curves':
        return (
          <div className="space-y-6 mt-6">
            <Card title="Courbe I-V">
              <ChartDisplay
                type="line"
                data={chartConfigs.ivCurveConfig.data}
                options={chartConfigs.ivCurveConfig.options}
                height={350}
              />
            </Card>
            
            <Card title="Courbe P-V">
              <ChartDisplay
                type="line"
                data={chartConfigs.pvCurveConfig.data}
                options={chartConfigs.pvCurveConfig.options}
                height={350}
              />
            </Card>
          </div>
        );
        
      case 'evolution':
        return (
          <Card title="Évolution de la puissance maximale" className="mt-6">
            <ChartDisplay
              type="line"
              data={chartConfigs.pmaxEvolutionConfig.data}
              options={chartConfigs.pmaxEvolutionConfig.options}
              height={400}
            />
          </Card>
        );
        
      case 'data':
        return (
          <div className="mt-6">
            <Card title="Données brutes">
              <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-xs h-96">
                {JSON.stringify(result.results, null, 2)}
              </pre>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <div className="flex items-center">
            <Link to="/results" className="text-green-600 hover:text-green-700 mr-2">
              ← Retour aux résultats
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">
            Détail de la prédiction
          </h1>
          {result && (
            <p className="mt-1 text-gray-500">
              {result.module.name} - {formatDate(result.date)}
            </p>
          )}
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button
            onClick={() => navigate('/predict')}
            type="outline"
          >
            Nouvelle prédiction
          </Button>
          <Button
            onClick={handleDelete}
            type="danger"
            isLoading={isDeleting}
            disabled={isDeleting}
          >
            Supprimer
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Tabs navigation */}
      {result && renderTabs()}

      {/* Tab content */}
      {result && renderTabContent()}
    </div>
  );
};

export default ResultDetail;
