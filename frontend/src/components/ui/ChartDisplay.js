import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * Composant pour afficher des graphiques avec Chart.js
 * @param {Object} props - Propriétés du composant
 * @param {string} props.type - Type de graphique ('line', 'bar', 'radar', etc.)
 * @param {Object} props.data - Données du graphique
 * @param {Object} props.options - Options du graphique
 * @param {string} props.title - Titre du graphique
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {number} props.height - Hauteur du graphique en pixels
 */
const ChartDisplay = ({
  type = 'line',
  data,
  options = {},
  title,
  className = '',
  height = 300
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Détruire le graphique existant s'il existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Vérifier si les données sont disponibles
    if (!data || !chartRef.current) {
      return;
    }

    // Configurer les options par défaut
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: !!title,
          text: title || '',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 10
          }
        },
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 13
          },
          padding: 10,
          cornerRadius: 4
        }
      }
    };

    // Fusionner les options par défaut avec celles fournies
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      plugins: {
        ...defaultOptions.plugins,
        ...options.plugins
      }
    };

    // Créer le graphique
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type,
      data,
      options: mergedOptions
    });

    // Nettoyer le graphique lors du démontage du composant
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type, options, title]);

  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      <canvas ref={chartRef} />
    </div>
  );
};

// Fonctions d'aide pour créer des configurations de graphique courantes dans l'application

/**
 * Crée la configuration pour un graphique de courbe I-V
 * @param {Array} voltages - Tableau des valeurs de tension (V)
 * @param {Array} currents - Tableau des valeurs de courant (A)
 * @returns {Object} Configuration du graphique
 */
export const createIVCurveConfig = (voltages, currents) => {
  return {
    data: {
      labels: voltages,
      datasets: [
        {
          label: 'Courbe I-V',
          data: currents,
          borderColor: 'rgba(59, 130, 246, 1)', // Blue
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Tension (V)',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Courant (A)',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    }
  };
};

/**
 * Crée la configuration pour un graphique de courbe P-V
 * @param {Array} voltages - Tableau des valeurs de tension (V)
 * @param {Array} powers - Tableau des valeurs de puissance (W)
 * @returns {Object} Configuration du graphique
 */
export const createPVCurveConfig = (voltages, powers) => {
  return {
    data: {
      labels: voltages,
      datasets: [
        {
          label: 'Courbe P-V',
          data: powers,
          borderColor: 'rgba(16, 185, 129, 1)', // Green
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Tension (V)',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Puissance (W)',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    }
  };
};

/**
 * Crée la configuration pour un graphique d'évolution de la puissance maximale
 * @param {Array} timestamps - Tableau des timestamps
 * @param {Array} pmaxValues - Tableau des valeurs de puissance maximale
 * @returns {Object} Configuration du graphique
 */
export const createPmaxEvolutionConfig = (timestamps, pmaxValues) => {
  // Formater les timestamps en heures:minutes si c'est une chaîne de date ISO
  const formattedLabels = timestamps.map(ts => {
    if (typeof ts === 'string' && ts.includes('T')) {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return ts;
  });

  return {
    data: {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Évolution de Pmax',
          data: pmaxValues,
          borderColor: 'rgba(244, 63, 94, 1)', // Rose
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: 'rgba(244, 63, 94, 1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Temps',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Puissance Max (W)',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    }
  };
};

/**
 * Crée la configuration pour un graphique de comparaison de variables environnementales
 * @param {Array} timestamps - Tableau des timestamps
 * @param {Array} temperatures - Tableau des valeurs de température
 * @param {Array} irradiances - Tableau des valeurs d'irradiance
 * @returns {Object} Configuration du graphique
 */
export const createEnvironmentalDataConfig = (timestamps, temperatures, irradiances) => {
  // Formater les timestamps comme ci-dessus
  const formattedLabels = timestamps.map(ts => {
    if (typeof ts === 'string' && ts.includes('T')) {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return ts;
  });

  return {
    data: {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Température (°C)',
          data: temperatures,
          borderColor: 'rgba(244, 63, 94, 1)', // Rose
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          yAxisID: 'y'
        },
        {
          label: 'Irradiance (W/m²)',
          data: irradiances,
          borderColor: 'rgba(234, 179, 8, 1)', // Yellow
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Temps',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Température (°C)',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            color: 'rgba(244, 63, 94, 0.1)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Irradiance (W/m²)',
            font: {
              weight: 'bold'
            }
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  };
};

export default ChartDisplay;
