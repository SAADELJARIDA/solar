import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AlertMessage from '../components/ui/AlertMessage';
import { getModule, createModule, updateModule } from '../api/module';

const ModuleForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    module_name: '',
    voc: '',
    isc: '',
    vmp: '',
    imp: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { from: { pathname: isEditMode ? `/modules/edit/${id}` : '/modules/new' } } 
      });
    }
  }, [isAuthenticated, navigate, isEditMode, id]);

  // Charger les données du module en mode édition
  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        const response = await getModule(id);
        
        if (response.success) {
          // Convertir les valeurs numériques en string pour le formulaire
          const moduleData = {
            ...response.data,
            voc: response.data.voc.toString(),
            isc: response.data.isc.toString(),
            vmp: response.data.vmp.toString(),
            imp: response.data.imp.toString(),
            pmax: response.data.pmax.toString(),
            temperature_coefficient: response.data.temperature_coefficient 
              ? response.data.temperature_coefficient.toString() 
              : ''
          };
          
          setFormData(moduleData);
        } else {
          setError('Erreur lors du chargement du module');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du module:', error);
        setError('Impossible de charger les détails du module');
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode && isAuthenticated) {
      fetchModule();
    }
  }, [isEditMode, id, isAuthenticated]);

  // Gérer le changement dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Valider le formulaire
  const validateForm = () => {
    // Vérifier que le nom du module est rempli
    if (!formData.module_name) {
      setError('Le nom du module est obligatoire');
      return false;
    }
    
    // Vérifier que les valeurs électriques sont valides
    const electricalFields = ['voc', 'isc', 'vmp', 'imp'];
    for (const field of electricalFields) {
      const value = parseFloat(formData[field]);
      if (isNaN(value) || value <= 0) {
        setError(`La valeur ${field} doit être un nombre positif`);
        return false;
      }
    }
    
    // Vérifier que Vmp est inférieur à Voc et Imp est inférieur à Isc
    if (parseFloat(formData.vmp) >= parseFloat(formData.voc)) {
      setError('La tension au point de puissance maximale (Vmp) doit être inférieure à la tension en circuit ouvert (Voc)');
      return false;
    }
    
    if (parseFloat(formData.imp) >= parseFloat(formData.isc)) {
      setError('Le courant au point de puissance maximale (Imp) doit être inférieur au courant de court-circuit (Isc)');
      return false;
    }
    
    return true;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      // Convertir les valeurs en nombre
      const voc = parseFloat(formData.voc);
      const isc = parseFloat(formData.isc);
      const vmp = parseFloat(formData.vmp);
      const imp = parseFloat(formData.imp);
      
      // Calculer le facteur de forme (ff) requis par le backend
      // ff = (Vmp * Imp) / (Voc * Isc)
      const ff = (vmp * imp) / (voc * isc);
      
      console.log('Données du module à envoyer:', {
        module_name: formData.module_name,
        voc,
        isc,
        vmp,
        imp,
        ff
      });
      
      const moduleData = {
        module_name: formData.module_name,
        voc,
        isc,
        vmp,
        imp,
        ff // Ajouter le facteur de forme calculé
      };
      
      let response;
      if (isEditMode) {
        response = await updateModule(id, moduleData);
      } else {
        response = await createModule(moduleData);
      }
      
      if (response.success) {
        if (isEditMode) {
          setSuccess('Module mis à jour avec succès');
        } else {
          setSuccess('Module créé avec succès');
          // Vider le formulaire après création
          setFormData({
            module_name: '',
            voc: '',
            isc: '',
            vmp: '',
            imp: ''
          });
        }
        
        // Redirection après un délai pour montrer le message de succès
        setTimeout(() => {
          navigate('/modules');
        }, 1500);
      } else {
        setError(response.message || 'Erreur lors de la sauvegarde du module');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.response?.data?.message || 'Une erreur s\'est produite lors de la sauvegarde');
    } finally {
      setSubmitting(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Modifier le module' : 'Nouveau module photovoltaïque'}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {isEditMode 
            ? 'Mettez à jour les caractéristiques de votre module photovoltaïque' 
            : 'Créez un nouveau module photovoltaïque pour vos prédictions'}
        </p>
      </div>

      {/* Messages */}
      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}
      
      {success && (
        <AlertMessage
          type="success"
          message={success}
          onClose={() => setSuccess('')}
          className="mb-6"
        />
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du module photovoltaïque</h3>
              
              <Input
                label="Nom du module *"
                name="module_name"
                type="text"
                value={formData.module_name}
                onChange={handleChange}
                placeholder="ex: SunPower X22-360"
                required
              />
              
              <Input
                label="Tension en circuit ouvert (Voc) *"
                name="voc"
                type="number"
                value={formData.voc}
                onChange={handleChange}
                placeholder="ex: 45.3"
                required
                step="0.01"
                min="0"
                suffix="V"
              />
              
              <Input
                label="Courant de court-circuit (Isc) *"
                name="isc"
                type="number"
                value={formData.isc}
                onChange={handleChange}
                placeholder="ex: 6.23"
                required
                step="0.01"
                min="0"
                suffix="A"
              />
              
              <Input
                label="Tension au point de puissance maximale (Vmp) *"
                name="vmp"
                type="number"
                value={formData.vmp}
                onChange={handleChange}
                placeholder="ex: 40.0"
                required
                step="0.01"
                min="0"
                suffix="V"
              />
              
              <Input
                label="Courant au point de puissance maximale (Imp) *"
                name="imp"
                type="number"
                value={formData.imp}
                onChange={handleChange}
                placeholder="ex: 5.87"
                required
                step="0.01"
                min="0"
                suffix="A"
              />
            </div>
          </div>

          <div className="flex justify-between pt-6 border-t border-gray-200">
            <Button
              onClick={() => navigate('/modules')}
              type="outline"
            >
              Annuler
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              isLoading={submitting}
              disabled={submitting}
            >
              {isEditMode ? 'Mettre à jour' : 'Créer le module'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ModuleForm;
