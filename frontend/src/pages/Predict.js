/**
 * Composant de prédiction solaire - SolarPredict
 * 
 * Page principale permettant de lancer une prédiction en une étape :
 * - Étape 1 : Upload des données environnementales (name="file")
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FileUploader from '../components/ui/FileUploader';
import AlertMessage from '../components/ui/AlertMessage';
import { uploadSensorData } from '../api/prediction';
import ApexChart from './charts/ApexChart';
import ApexChart2 from './charts/ApexChart2';
import ApexChart3 from './charts/ApexChart3';
import ApexChart4 from './charts/ApexChart4';
import ApexChart5 from './charts/ApexChart5';
import ApexChart6 from './charts/ApexChart6';

const Predict = () => {
  const [file, setFile] = useState(null);
  const [sensorDataId, setSensorDataId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showChart, setShowChart] = useState(false);

  const { isAuthenticated } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/predict' } } });
    }
  }, [isAuthenticated, navigate]);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setUploadSuccess(false);
    setSensorDataId(null);
    setUploadError('');
  };

  const handleFileUpload = async () => {
    if (!file) {
      setUploadError('Veuillez sélectionner un fichier XLSX contenant vos données environnementales');
      return;
    }
    setIsUploading(true);
    setUploadError('');
    try {
      const response = await uploadSensorData(file);
      if (response.success) {
        setUploadSuccess(true);
        setSensorDataId(response.data.id);
      } else {
        setUploadError(response.message || 'Une erreur est survenue lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setUploadError(error.message || 'Une erreur inconnue est survenue');
    } finally {
      setIsUploading(false);
    }
  };

  const handleShowChart = () => {
    setShowChart(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl predict-page">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Prédiction de performance</h1>
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card title="Données Environnementales" className="h-full flex flex-col">
          <p className="mb-4 text-gray-600">
            Téléchargez un fichier XLSX contenant les données environnementales.
          </p>
          <FileUploader
            onFileSelect={handleFileSelect}
            accept=".xlsx"
            label="Sélectionner un fichier XLSX"
          />
          <div className="mt-2 text-sm text-gray-500">
            Format requis : timestamp, température, irradiance
          </div>
          {uploadError && (
            <AlertMessage
              type="error"
              message={uploadError}
              onClose={() => setUploadError('')}
              className="mt-3"
            />
          )}
          <div className="mt-auto pt-4">
            <Button
              onClick={handleFileUpload}
              isLoading={isUploading}
              disabled={!file || isUploading}
              type="primary"
              className="w-full"
            >
              Télécharger le fichier
            </Button>
          </div>
          {uploadSuccess && (
            <AlertMessage
              type="success"
              message="Données téléchargées avec succès !"
              className="mt-3"
            />
          )}
        </Card>
      </div>

      <Card title="Lancer la Prédiction" className="bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 text-center max-w-xl">
            <p className="text-gray-700">
              Après avoir téléchargé vos données environnementales, cliquez sur le bouton pour afficher le graphique de prédiction.
            </p>
          </div>
          <Button
            onClick={handleShowChart}
            disabled={!sensorDataId}
            type="primary"
            size="lg"
            className="min-w-[200px]"
          >
            Lancer la Prédiction
          </Button>
        </div>
      </Card>

      {/* Chart Display Section */}
      {showChart && (
        <Card title="Résultats de la Prédiction" className="mt-6">
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              Visualisation des données de prédiction en temps réel.
            </p>
            <div className="flex space-x-4 mb-4">
              <Button
                onClick={() => setShowChart(false)}
                type="outline"
                size="sm"
              >
                Masquer le graphique
              </Button>
            </div>
          </div>
          
          {/* String Selection Panel - Top */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                Sélection des Chaînes
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {/* String 1 */}
                <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:scale-105 active:scale-95 min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-lg">String 1</span>
                    </div>
                    <div className="text-xs opacity-75">Actif</div>
                  </div>
                  <div className="mt-2 text-xs opacity-90">
                    Chaîne principale
                  </div>
                </button>
                
                {/* String 2 */}
                <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-4 text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:scale-105 active:scale-95 min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-lg">String 2</span>
                    </div>
                    <div className="text-xs opacity-75">Actif</div>
                  </div>
                  <div className="mt-2 text-xs opacity-90">
                    Chaîne secondaire
                  </div>
                </button>
                
                {/* String 3 */}
                <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-xl hover:scale-105 active:scale-95 min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-lg">String 3</span>
                    </div>
                    <div className="text-xs opacity-75">Actif</div>
                  </div>
                  <div className="mt-2 text-xs opacity-90">
                    Chaîne tertiaire
                  </div>
                </button>
              </div>
              

            </div>
          </div>
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 6 - T_K */}
            <div className="bg-white rounded-lg p-4 border md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Predicted temperature (T_K)</h3>
              <ApexChart6 />
            </div>
            {/* Chart 1 - ISC */}
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Predicted short circuit current (ISC)</h3>
              <ApexChart />
            </div>
            {/* Chart 2 - VOC */}
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Predicted open circuit voltage (VOC)</h3>
              <ApexChart2 />
            </div>
            
            {/* Chart 3 - VMPP */}
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Predicted maximum power point voltage (VMPP)</h3>
              <ApexChart3 />
            </div>
            
            {/* Chart 4 - IMPP */}
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Predicted maximum power point current (IMPP)</h3>
              <ApexChart4 />
            </div>
            
            {/* Chart 5 - MPP */}
            <div className="bg-white rounded-lg p-4 border md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Predicted maximum power point (MPP)</h3>
              <ApexChart5 />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Predict;