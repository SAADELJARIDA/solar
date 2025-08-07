import React from 'react';

/**
 * Composant Button réutilisable
 * @param {Object} props - Propriétés du composant
 * @param {string} props.type - Type de bouton ('primary', 'secondary', 'danger', 'success', 'outline')
 * @param {string} props.size - Taille du bouton ('sm', 'md', 'lg')
 * @param {boolean} props.isLoading - Indique si le bouton est en état de chargement
 * @param {boolean} props.disabled - Indique si le bouton est désactivé
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {function} props.onClick - Fonction de clic
 */
const Button = ({
  children,
  type = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...rest
}) => {
  // Variantes de couleur selon le type
  const typeClasses = {
    primary: 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'bg-transparent border border-green-600 text-green-600 hover:bg-green-50'
  };

  // Variantes de taille
  const sizeClasses = {
    sm: 'py-1 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base'
  };

  // Classes de base pour tous les boutons
  const baseClasses = 'font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200';
  
  // Classes pour l'état désactivé
  const disabledClasses = disabled || isLoading ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${typeClasses[type]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Chargement...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
