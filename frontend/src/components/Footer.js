import React from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center text-center">
          {/* Left Column */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-bold mb-2">SolarPredict</h3>
            <p className="text-gray-300 mb-2">"Your Energy, Our Vision."</p>
            <p className="text-gray-300 max-w-md text-sm">
              Prédiction de performance des panneaux photovoltaïques
            </p>
          </div>

          {/* Right Column */}
          <div className="mt-4 md:mt-0 md:ml-16">
            <h4 className="text-lg font-bold mb-2 text-center">Sitemap</h4>
            <ul className="space-y-2 flex flex-col items-center">
              <li>
                <Link to="/" className="text-gray-200 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-200 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/info" className="text-gray-200 hover:text-white text-sm">
                  Centre d'info
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-200 hover:text-white text-sm">
                  Aide
                </Link>
              </li>
              <li className="flex items-center">
                <a 
                  href="http://www.greenenergypark.ma" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-200 hover:text-white flex items-center text-sm"
                >
                  Green Energy Park
                  <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-green-700">
          <p className="text-center text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} SolarPredict. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
