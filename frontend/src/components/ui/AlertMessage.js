import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

/**
 * Composant pour afficher des messages d'alerte (succès, erreur, info)
 * @param {Object} props - Propriétés du composant
 * @param {string} props.type - Type d'alerte ('success', 'error', 'info')
 * @param {string} props.message - Message à afficher
 * @param {boolean} props.show - Si l'alerte doit être visible
 * @param {function} props.onClose - Fonction appelée à la fermeture de l'alerte
 * @param {boolean} props.autoClose - Si l'alerte doit se fermer automatiquement
 * @param {number} props.autoCloseTime - Temps avant fermeture automatique (ms)
 */
const AlertMessage = ({
  type = 'info',
  message,
  show = true,
  onClose,
  autoClose = true,
  autoCloseTime = 5000, // 5 secondes par défaut
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show, message]);

  // Fermeture automatique
  useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [autoClose, isVisible, message, autoCloseTime]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  // Configuration selon le type d'alerte
  const alertStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-800',
      icon: <FaCheckCircle className="h-5 w-5 text-green-600" />,
      title: 'Succès'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: <FaExclamationCircle className="h-5 w-5 text-red-600" />,
      title: 'Erreur'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-800',
      icon: <FaInfoCircle className="h-5 w-5 text-blue-600" />,
      title: 'Information'
    }
  };

  const currentStyle = alertStyles[type] || alertStyles.info;

  return (
    <div className={`rounded-md border p-4 mb-4 ${currentStyle.bg} ${currentStyle.border} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {currentStyle.icon}
        </div>
        <div className="ml-3 flex-grow">
          <h3 className={`text-sm font-medium ${currentStyle.text}`}>
            {currentStyle.title}
          </h3>
          <div className={`mt-2 text-sm ${currentStyle.text}`}>
            {message}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 ${currentStyle.bg} text-gray-500 hover:bg-gray-100 focus:outline-none`}
            >
              <span className="sr-only">Fermer</span>
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertMessage;
