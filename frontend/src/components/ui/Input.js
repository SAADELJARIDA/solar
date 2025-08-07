import React from 'react';

/**
 * Composant Input réutilisable
 * @param {Object} props - Propriétés du composant
 * @param {string} props.label - Libellé du champ
 * @param {string} props.name - Nom du champ
 * @param {string} props.type - Type de champ (text, password, email, etc.)
 * @param {string} props.value - Valeur du champ
 * @param {function} props.onChange - Fonction pour gérer les changements
 * @param {string} props.error - Message d'erreur
 * @param {string} props.placeholder - Texte d'aide
 * @param {boolean} props.required - Indique si le champ est obligatoire
 */
const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className = '',
  ...rest
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200
          ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...rest}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
