import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About SolarPredict</h1>
        
        {/* Introduction section */}
        <div className="flex flex-col md:flex-row items-center mb-16 gap-8">
          <div className="w-full md:w-1/2">
            <p className="text-lg text-gray-600 mb-4">
              SolarPredict est une plateforme innovante dédiée à la prédiction de performance 
              des panneaux photovoltaïques, conçue pour optimiser le rendement énergétique 
              et faciliter la planification des installations solaires.
            </p>
            <p className="text-lg text-gray-600">
              Notre technologie utilise des modèles prédictifs avancés combinés à des données 
              environnementales réelles pour fournir des estimations précises et fiables.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <img 
              src="/images/solar-panel-tech.jpg" 
              alt="Technologies solaires avancées" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
              style={{ minHeight: '300px' }}
              onError={(e) => {e.target.onerror = null; e.target.src = '/images/technology.jpg'}}
            />
          </div>
        </div>
      </div>

      {/* Qui sommes-nous section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Qui sommes-nous ?</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">
            SolarPredict est né d'un projet de recherche collaboratif entre des experts en 
            énergies renouvelables, des data scientists et des ingénieurs en photovoltaïque. 
            Notre équipe multidisciplinaire combine des années d'expérience dans le domaine 
            de l'énergie solaire et des technologies prédictives.
          </p>
          <p className="text-gray-700">
            En collaboration avec le Green Energy Park, nous développons des solutions 
            innovantes pour maximiser l'efficacité des installations photovoltaïques 
            et contribuer à la transition énergétique.
          </p>
        </div>
      </div>

      {/* Notre mission section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Notre mission</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">
            Notre mission est de démocratiser l'accès à des outils de prédiction précis 
            pour les installations photovoltaïques, permettant ainsi d'optimiser le rendement, 
            de réduire les coûts opérationnels et de maximiser le retour sur investissement.
          </p>
          <p className="text-gray-700">
            Nous visons à faciliter la transition vers une énergie plus propre et renouvelable 
            en fournissant des données précises et des insights exploitables aux particuliers, 
            aux entreprises et aux chercheurs.
          </p>
        </div>
      </div>

      {/* Projet de recherche section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Un projet de recherche appliquée</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">
            SolarPredict est le fruit de plusieurs années de recherche et développement dans 
            le domaine de la modélisation prédictive appliquée aux systèmes photovoltaïques. 
          </p>
          <p className="text-gray-700 mb-4">
            Notre plateforme intègre les dernières avancées en matière d'intelligence artificielle 
            et d'analyse de données environnementales pour offrir des prédictions toujours plus précises.
          </p>
          <p className="text-gray-700">
            Nous collaborons activement avec des instituts de recherche et des universités 
            pour améliorer constamment nos modèles et intégrer les découvertes les plus récentes.
          </p>
        </div>
      </div>

      {/* Notre technologie section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Notre technologie</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">
            SolarPredict utilise plusieurs modèles prédictifs sophistiqués :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li className="text-gray-700">
              <span className="font-medium">Modèle de Base (BM)</span> : Utilise les caractéristiques 
              fondamentales des modules PV avec des données environnementales pour des prédictions rapides.
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Modèle de Luminosité Physique (PLM)</span> : Intègre les effets 
              de l'irradiance solaire et les propriétés optiques des matériaux pour une analyse plus précise.
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Modèle Diode (DM)</span> : Simule le comportement électrique des 
              cellules solaires en utilisant des équations de circuit équivalent pour une modélisation détaillée.
            </li>
          </ul>
          <p className="text-gray-700">
            Tous nos modèles sont calibrés et validés en utilisant des données réelles collectées 
            à partir d'installations photovoltaïques opérationnelles dans diverses conditions environnementales.
          </p>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 p-8 rounded-lg shadow-lg text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Prêt à optimiser votre installation solaire ?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Utilisez notre outil de prédiction pour obtenir des estimations précises 
          de performance basées sur vos modules PV et vos données environnementales.
        </p>
        <Link 
          to="/predict" 
          className="inline-flex items-center px-6 py-3 bg-white text-green-700 font-bold rounded-md hover:bg-green-50 transition-colors"
        >
          Commencer une prédiction
          <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default About;
