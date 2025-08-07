import React from 'react';
import { Link } from 'react-router-dom';
import { FaQuestion, FaFileAlt, FaUser, FaChartLine, FaUpload, FaSolarPanel, FaTools } from 'react-icons/fa';

const Help = () => {
  const helpSections = [
    {
      id: 'getting-started',
      title: 'Premiers pas',
      icon: <FaQuestion className="h-6 w-6 text-green-600" />,
      questions: [
        {
          q: 'Qu\'est-ce que SolarPredict?',
          a: 'SolarPredict est une plateforme qui vous permet de prédire les performances de vos modules photovoltaïques en utilisant des données environnementales réelles et différents modèles prédictifs.'
        },
        {
          q: 'Comment commencer à utiliser SolarPredict?',
          a: 'Pour commencer, créez un compte et connectez-vous. Ensuite, vous pouvez enregistrer vos modules photovoltaïques et commencer à faire des prédictions en utilisant vos données environnementales.'
        },
        {
          q: 'Les prédictions sont-elles gratuites?',
          a: 'Oui, toutes les fonctionnalités de base de SolarPredict sont gratuites pour tous les utilisateurs enregistrés.'
        }
      ]
    },
    {
      id: 'data',
      title: 'Données environnementales',
      icon: <FaFileAlt className="h-6 w-6 text-green-600" />,
      questions: [
        {
          q: 'Quel format de données est accepté?',
          a: 'SolarPredict accepte les fichiers CSV contenant des données environnementales. Le fichier doit contenir des colonnes pour l\'horodatage (timestamp), la température et l\'irradiance solaire.'
        },
        {
          q: 'Comment structurer mon fichier CSV?',
          a: 'Votre fichier CSV doit contenir au minimum les colonnes suivantes: timestamp (format YYYY-MM-DD HH:MM:SS), temperature (°C), irradiance (W/m²).'
        },
        {
          q: 'Puis-je utiliser des données historiques?',
          a: 'Oui, vous pouvez utiliser des données historiques pour évaluer les performances passées ou pour comparer différents scénarios.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Compte et profil',
      icon: <FaUser className="h-6 w-6 text-green-600" />,
      questions: [
        {
          q: 'Comment modifier mon profil?',
          a: 'Vous pouvez modifier votre profil en cliquant sur votre avatar dans la barre de navigation, puis en sélectionnant "Profil".'
        },
        {
          q: 'Comment changer mon mot de passe?',
          a: 'Pour changer votre mot de passe, accédez à votre profil, puis à l\'onglet "Sécurité" où vous pourrez entrer votre nouveau mot de passe.'
        },
        {
          q: 'Comment supprimer mon compte?',
          a: 'Pour supprimer votre compte, contactez notre support technique. Notez que toutes vos données seront définitivement supprimées.'
        }
      ]
    },
    {
      id: 'predictions',
      title: 'Prédictions et résultats',
      icon: <FaChartLine className="h-6 w-6 text-green-600" />,
      questions: [
        {
          q: 'Comment interpréter les résultats de prédiction?',
          a: 'Les résultats montrent les courbes I-V et P-V prédites pour votre module dans les conditions environnementales données. Vous verrez également les valeurs clés comme Imp, Vmp et la puissance maximale.'
        },
        {
          q: 'Quelle est la différence entre les différents modèles de prédiction?',
          a: 'Le modèle de base (BM) est rapide mais moins précis. Le modèle de luminosité physique (PLM) prend en compte plus de paramètres optiques. Le modèle diode (DM) est le plus complexe et simule le comportement électrique détaillé des cellules.'
        },
        {
          q: 'Puis-je télécharger mes résultats?',
          a: 'Oui, vous pouvez télécharger vos résultats en format CSV ou PDF depuis la page des résultats détaillés.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Aspects techniques',
      icon: <FaTools className="h-6 w-6 text-green-600" />,
      questions: [
        {
          q: 'Quels navigateurs sont supportés?',
          a: 'SolarPredict fonctionne sur tous les navigateurs modernes comme Chrome, Firefox, Safari et Edge dans leurs versions récentes.'
        },
        {
          q: 'L\'application est-elle responsive?',
          a: 'Oui, SolarPredict est conçu pour fonctionner sur les ordinateurs de bureau, les tablettes et les smartphones.'
        },
        {
          q: 'Comment signaler un bug?',
          a: 'Si vous rencontrez un problème, cliquez sur le lien "Contact" dans le pied de page et décrivez le problème en détail.'
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Centre d'aide</h1>
      <p className="text-lg text-gray-600 mb-8">
        Trouvez des réponses aux questions fréquemment posées sur SolarPredict
      </p>

      {/* Quick navigation */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Navigation rapide</h2>
        <div className="flex flex-wrap gap-3">
          {helpSections.map(section => (
            <a 
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
            >
              {React.cloneElement(section.icon, { className: "h-4 w-4 mr-2" })}
              {section.title}
            </a>
          ))}
        </div>
      </div>

      {/* Help sections */}
      <div className="space-y-10">
        {helpSections.map(section => (
          <div key={section.id} id={section.id} className="scroll-mt-20">
            <div className="flex items-center mb-4">
              {section.icon}
              <h2 className="text-2xl font-bold text-gray-800 ml-3">{section.title}</h2>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <dl>
                {section.questions.map((item, index) => (
                  <div 
                    key={index}
                    className={`${index !== 0 ? 'border-t border-gray-200' : ''} px-6 py-4`}
                  >
                    <dt className="text-lg font-medium text-gray-800">{item.q}</dt>
                    <dd className="mt-2 text-gray-600">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}
      </div>

      {/* Contact section */}
      <div className="mt-12 bg-green-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Vous n'avez pas trouvé votre réponse?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Notre équipe est là pour vous aider. N'hésitez pas à nous contacter si vous avez des questions
          ou si vous rencontrez des difficultés avec SolarPredict.
        </p>
        <Link 
          to="/contact" 
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors"
        >
          Contacter le support
        </Link>
      </div>
    </div>
  );
};

export default Help;
