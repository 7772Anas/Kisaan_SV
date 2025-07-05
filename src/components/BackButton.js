import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on home page
  if (location.pathname === '/') {
    return null;
  }

  const handleBack = () => {
    // If we can go back in history, do that
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Otherwise go to home
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <div className="fixed top-20 left-4 z-40 flex gap-2">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="group bg-white/90 backdrop-blur-sm border border-kisaan-green/20 hover:border-kisaan-green/40 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5 text-kisaan-green group-hover:text-kisaan-green-dark transition-colors duration-300" />
      </button>

      {/* Home Button */}
      <button
        onClick={handleHome}
        className="group bg-white/90 backdrop-blur-sm border border-kisaan-green/20 hover:border-kisaan-green/40 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        aria-label="Go to home"
      >
        <Home className="w-5 h-5 text-kisaan-green group-hover:text-kisaan-green-dark transition-colors duration-300" />
      </button>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .fixed {
          animation: slideInLeft 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BackButton; 