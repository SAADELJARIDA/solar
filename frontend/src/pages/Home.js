import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1>
                <span className="block text-sm font-semibold text-green-600 tracking-wide uppercase">
                  Énergie Solaire Intelligente
                </span>
                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                  <span className="block text-gray-900">Optimisez vos</span>
                  <span className="block text-green-600">modules photovoltaïques</span>
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                SolarPredict utilise des modèles prédictifs avancés pour vous aider à optimiser la performance de vos installations photovoltaïques. Téléchargez vos données environnementales et obtenez des prédictions précises instantanément.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Link to="/predict">
                      <Button type="primary" size="lg">
                        Faire une prédiction
                      </Button>
                    </Link>
                    <Link to="/results">
                      <Button type="outline" size="lg">
                        Voir mes résultats
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Link to="/login">
                      <Button type="primary" size="lg">
                        Commencer
                      </Button>
                    </Link>
                    <Link to="/info">
                      <Button type="outline" size="lg">
                        En savoir plus
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <img
                  className="w-full rounded-lg"
                  src="/images/Panneaux solaires.png"
                  alt="Panneaux solaires"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
              Fonctionnalités
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Une solution complète pour l'analyse photovoltaïque
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Découvrez comment SolarPredict peut vous aider à optimiser vos installations solaires.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-blue-600 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Modèles prédictifs avancés</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Plusieurs modèles sophistiqués pour prédire les performances des modules photovoltaïques dans diverses conditions environnementales.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-blue-600 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Visualisations interactives</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Graphiques interactifs pour visualiser les courbes I-V, P-V et suivre l'évolution des performances dans le temps.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-blue-600 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Gestion des modules</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Gérez facilement votre bibliothèque de modules photovoltaïques avec leurs caractéristiques techniques spécifiques.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-green-600 to-blue-600 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Historique complet</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Conservez un historique de toutes vos prédictions pour comparer les résultats et suivre les performances au fil du temps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maîtrisez le solaire Section */}
      <section id="maitrisez" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1B1B1B] font-inter">
              Maîtrisez le solaire
            </h2>
            <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto">
              Explorez les clés du solaire pour mieux produire, mieux décider, et mieux investir.
            </p>
          </div>

          {/* Carousel Container */}
          <div className="mt-12 overflow-x-auto pb-8">
            <div className="flex space-x-6 w-max snap-x snap-mandatory scroll-smooth">
              {/* Card 1 */}
              <div className="w-80 shrink-0 snap-start">
                <div className="bg-[#A7F3D0] rounded-lg p-6 h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-center mb-4 h-40 overflow-hidden">
                    <img src="/images/recycling.jpg" alt="Impact environnemental et recyclage" className="object-cover rounded-md w-full" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Impact environnemental et recyclage</h3>
                  <p className="text-gray-700 mb-4 flex-grow">Découvrez les implications écologiques du recyclage des panneaux.</p>
                  <Link to="/info#recycling" className="mt-auto">
                    <button className="w-full py-2 px-4 bg-[#004d33] hover:bg-[#66bb6a] text-white rounded-md transition-colors duration-300 font-medium">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>

              {/* Card 2 */}
              <div className="w-80 shrink-0 snap-start">
                <div className="bg-[#A7F3D0] rounded-lg p-6 h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-center mb-4 h-40 overflow-hidden">
                    <img src="/images/prediction.jpg" alt="Prévision dans la transition énergétique" className="object-cover rounded-md w-full" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Quel rôle joue la prévision dans la transition énergétique ?</h3>
                  <p className="text-gray-700 mb-4 flex-grow">Optimisez votre production avec des prévisions fiables.</p>
                  <Link to="/info#prediction" className="mt-auto">
                    <button className="w-full py-2 px-4 bg-[#004d33] hover:bg-[#66bb6a] text-white rounded-md transition-colors duration-300 font-medium">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>

              {/* Card 3 */}
              <div className="w-80 shrink-0 snap-start">
                <div className="bg-[#A7F3D0] rounded-lg p-6 h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-center mb-4 h-40 overflow-hidden">
                    <img src="/images/technology.jpg" alt="Technologies photovoltaïques" className="object-cover rounded-md w-full" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Technologies photovoltaïques</h3>
                  <p className="text-gray-700 mb-4 flex-grow">Explorez les différents types de cellules solaires.</p>
                  <Link to="/info#tech" className="mt-auto">
                    <button className="w-full py-2 px-4 bg-[#004d33] hover:bg-[#66bb6a] text-white rounded-md transition-colors duration-300 font-medium">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>

              {/* Card 4 */}
              <div className="w-80 shrink-0 snap-start">
                <div className="bg-[#A7F3D0] rounded-lg p-6 h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-center mb-4 h-40 overflow-hidden">
                    <img src="/images/maintenance.jpg" alt="Méthodes de maintenance préventive" className="object-cover rounded-md w-full" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">Méthodes de maintenance préventive</h3>
                  <p className="text-gray-700 mb-4 flex-grow">Assurez la durabilité de vos installations.</p>
                  <Link to="/info#maintenance" className="mt-auto">
                    <button className="w-full py-2 px-4 bg-[#004d33] hover:bg-[#66bb6a] text-white rounded-md transition-colors duration-300 font-medium">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Prêt à optimiser vos installations solaires?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Inscrivez-vous gratuitement et commencez à utiliser nos modèles prédictifs dès aujourd'hui.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link to={isAuthenticated ? "/predict" : "/register"}>
                  <Button type="primary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                    {isAuthenticated ? "Commencer une prédiction" : "Créer un compte"}
                  </Button>
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <Link to="/about">
                  <Button type="outline" size="lg" className="border-white text-white hover:bg-white hover:bg-opacity-10">
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
