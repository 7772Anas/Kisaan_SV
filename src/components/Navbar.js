import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-green-yellow shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-white">
                Kisaan Suvidha
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:text-kisaan-yellow-lightest px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="text-white hover:text-kisaan-yellow-lightest px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
            >
              Explore
            </Link>
            
            <Link
              to="/AccountSetup"
              className="text-white hover:text-kisaan-yellow-lightest px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
            >
              Account Setup
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 