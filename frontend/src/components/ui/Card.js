import React from 'react';

/**
 * Composant Card réutilisable pour afficher des informations dans un cadre stylisé
 * @param {Object} props - Propriétés du composant
 * @param {string} props.title - Titre de la carte
 * @param {boolean} props.hoverable - Si la carte doit avoir un effet au survol
 * @param {string} props.className - Classes CSS supplémentaires
 */
const Card = ({
  children,
  title,
  hoverable = false,
  className = '',
  ...rest
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        hoverable ? 'transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1' : ''
      } ${className}`}
      {...rest}
    >
      {title && (
        <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600">
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
