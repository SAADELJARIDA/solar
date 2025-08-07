import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { 
  FaBars as MenuIcon, 
  FaTimes as XIcon,
  FaUser as UserIcon, 
  FaSignOutAlt as LogoutIcon,
  FaChartBar as ChartBarIcon,
  FaHome as HomeIcon,
  FaInfoCircle as InformationCircleIcon,
  FaFileAlt as DocumentTextIcon,
  FaLightbulb as LightBulbIcon,
  FaHistory as HistoryIcon,
  FaExternalLinkAlt as ExternalLinkIcon
} from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Accueil', path: '/', icon: <HomeIcon className="w-5 h-5 mr-2" /> },
    { name: 'À propos', path: '/about', icon: <InformationCircleIcon className="w-5 h-5 mr-2" /> },
    { name: 'Centre Info', path: '/info', icon: <DocumentTextIcon className="w-5 h-5 mr-2" /> }
  ];

  const authLinks = [
    { name: 'Prédiction', path: '/predict', icon: <LightBulbIcon className="w-5 h-5 mr-2" /> },
    { name: 'Historique', path: '/history', icon: <ChartBarIcon className="w-5 h-5 mr-2" /> }
  ];

  return (
    <nav className="fixed w-full bg-gradient-to-r from-[#004d33] via-[#066a45] to-[#0a4b85] bg-opacity-95 text-white shadow-lg z-50 backdrop-filter backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-8 mr-2"
                src="/images/Logo.png"
                alt="SolarPredict Logo"
              />
              <span className="text-xl font-bold">SolarPredict</span>
            </Link>
          </div>
          
          {/* Navigation pour les écrans moyens et grands */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'bg-white bg-opacity-20'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated && 
              authLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'bg-white bg-opacity-20'
                      : 'hover:bg-opacity-10 hover:text-green-300 hover:border-b-2 hover:border-green-300'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))
            }
          </div>

          {/* Menu utilisateur et authentification */}
          <div className="hidden md:flex md:items-center">
            {isAuthenticated ? (
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-white bg-opacity-10 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-600 focus:ring-white">
                    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogoutIcon className="h-5 w-5 mr-2 text-gray-500" />
                          Déconnexion
                        </button>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-white bg-opacity-10 hover:bg-opacity-20"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-white text-green-700 hover:bg-opacity-90"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
          
          {/* Bouton menu mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-md text-white hover:bg-white hover:bg-opacity-10 focus:outline-none"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isOpen ? (
                <XIcon className="block h-6 w-6" />
              ) : (
                <MenuIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.path
                  ? 'bg-white bg-opacity-20'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          
          {isAuthenticated &&
            authLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-white bg-opacity-20'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))
          }
        </div>
        <div className="pt-4 pb-3 border-t border-white border-opacity-20">
          {isAuthenticated ? (
            <div className="px-2 space-y-1">
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:bg-opacity-10"
              >
                <LogoutIcon className="h-5 w-5 mr-2" />
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:bg-opacity-10"
                onClick={() => setIsOpen(false)}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white hover:bg-opacity-10"
                onClick={() => setIsOpen(false)}
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
