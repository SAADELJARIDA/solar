import React, { useState, useRef } from 'react';
import Button from './Button';

/**
 * Composant pour télécharger des fichiers CSV avec aperçu
 * @param {Object} props - Propriétés du composant
 * @param {function} props.onFileSelect - Fonction appelée lorsqu'un fichier est sélectionné
 * @param {boolean} props.isLoading - Indique si un téléchargement est en cours
 * @param {string} props.accept - Types de fichiers acceptés (ex: ".csv")
 * @param {string} props.label - Texte à afficher
 */
const FileUploader = ({
  onFileSelect,
  isLoading = false,
  accept = ".csv",
  label = "Télécharger un fichier CSV",
  error = null,
  ...rest
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const fileInputRef = useRef(null);

  // Gérer la sélection de fichier
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  // Traiter le fichier sélectionné
  const processFile = (file) => {
    if (file) {
      setSelectedFile(file);
      
      // Si c'est un fichier CSV, créer un aperçu
      if (file.name.endsWith('.csv') || file.type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const lines = content.split('\\n').slice(0, 6); // Limiter à 6 lignes pour l'aperçu
          setPreviewData(lines);
        };
        reader.readAsText(file);
      }
      
      // Appeler la fonction callback
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  // Gérer le clic sur le bouton
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Gérer le glisser-déposer
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full mb-4">
      {/* Input de fichier caché */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="absolute w-0 h-0 opacity-0"
        disabled={isLoading}
        {...rest}
      />
      
      {/* Zone de drop */}
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors duration-200 ${
          isDragging
            ? 'border-green-500 bg-green-50'
            : error
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
        }`}
        onClick={handleButtonClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-2">
          <svg
            className={`w-12 h-12 ${isDragging ? 'text-green-500' : error ? 'text-red-500' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          
          <div>
            <p className="text-sm font-medium">
              {selectedFile ? `Fichier: ${selectedFile.name}` : `${label} ou glissez-déposez ici`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {selectedFile
                ? `${(selectedFile.size / 1024).toFixed(2)} KB - ${new Date().toLocaleDateString()}`
                : `Formats acceptés: ${accept}`}
            </p>
          </div>
          
          {!selectedFile && (
            <Button
              type="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick();
              }}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Parcourir...
            </Button>
          )}
        </div>
      </div>
      
      {/* Aperçu du CSV */}
      {selectedFile && previewData && previewData.length > 0 && (
        <div className="mt-4 bg-gray-50 p-4 rounded-md overflow-x-auto">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Aperçu du fichier:</h4>
          <table className="min-w-full text-xs">
            <tbody>
              {previewData.map((line, index) => (
                <tr key={index} className={index === 0 ? 'bg-gray-100' : ''}>
                  {line.split(',').map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="border px-2 py-1"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">Aperçu limité aux premières lignes</p>
        </div>
      )}
      
      {/* Message d'erreur */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUploader;
