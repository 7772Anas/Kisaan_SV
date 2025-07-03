import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePath, setProfilePath] = useState('/profile');
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        const userId = session.user.id;
        // Check farmers table
        const { data: farmer } = await supabase
          .from('farmers')
          .select('id')
          .eq('id', userId)
          .single();
        if (farmer) {
          setProfilePath('/FarmerProfile');
          return;
        }
        // Check buyers table
        const { data: buyer } = await supabase
          .from('buyers')
          .select('id')
          .eq('id', userId)
          .single();
        if (buyer) {
          setProfilePath('/BuyerProfile');
          return;
        }
        // TODO: Add service provider check if needed
        setProfilePath('/profile');
      }
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const userId = session.user.id;
        (async () => {
          const { data: farmer } = await supabase
            .from('farmers')
            .select('id')
            .eq('id', userId)
            .single();
          if (farmer) {
            setProfilePath('/FarmerProfile');
            return;
          }
          const { data: buyer } = await supabase
            .from('buyers')
            .select('id')
            .eq('id', userId)
            .single();
          if (buyer) {
            setProfilePath('/BuyerProfile');
            return;
          }
          setProfilePath('/profile');
        })();
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="bg-gradient-green-yellow shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center">
            {/* Hamburger menu button - always visible, right before logo */}
            <button
              className="mr-2 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
            >
              <div className="w-7 h-7 flex flex-col justify-center items-center">
                <span className="block w-7 h-1 bg-white mb-1 rounded"></span>
                <span className="block w-7 h-1 bg-white mb-1 rounded"></span>
                <span className="block w-7 h-1 bg-white rounded"></span>
              </div>
            </button>
            <Link to="/" className="text-2xl font-bold text-white ml-2">
              Kisaan Suvidha
            </Link>
          </div>

          {/* Hamburger dropdown menu */}
          {menuOpen && (
            <div className="absolute top-16 left-0 w-72 bg-white shadow-lg rounded-b-lg z-50 p-4 animate-fade-in">
              {/* Information Hub */}
              <div className="mb-4">
                <h3 className="font-bold text-green-700 mb-2">Information Hub</h3>
                <ul className="ml-2 space-y-1">
                  <li><Link to="/explore/market-hub" className="text-gray-700 hover:text-green-700">Market Prices</Link></li>
                  <li><Link to="/climateconnect" className="text-gray-700 hover:text-green-700">Weather</Link></li>
                  <li><Link to="/finance" className="text-gray-700 hover:text-green-700">Schemes/Links</Link></li>
                  <li><Link to="/agroexpert" className="text-gray-700 hover:text-green-700">Agro Expert</Link></li>
                </ul>
              </div>
              {/* Farmer Tools */}
              <div className="mb-4">
                <h3 className="font-bold text-green-700 mb-2">Farmer Tools</h3>
                <ul className="ml-2 space-y-1">
                  <li><Link to="/finance" className="text-gray-700 hover:text-green-700">Budget Estimation</Link></li>
                  <li><Link to="/soiltesting" className="text-gray-700 hover:text-green-700">Soil Testing</Link></li>
                </ul>
              </div>
              {/* Services */}
              <div className="mb-4">
                <h3 className="font-bold text-green-700 mb-2">Services</h3>
                <ul className="ml-2 space-y-1">
                  <li><Link to="/planning" className="text-gray-700 hover:text-green-700">Infrastructure Planning</Link></li>
                  <li><span className="text-gray-400">Direct Selling D2C</span></li>
                </ul>
              </div>
              {/* Profile */}
              <div>
                <h3 className="font-bold text-green-700 mb-2">Profile</h3>
                <ul className="ml-2 space-y-1">
                  <li><Link to="/AdminLogin" className="text-gray-700 hover:text-green-700">Admin</Link></li>
                  <li><Link to="/FarmerLogin" className="text-gray-700 hover:text-green-700">Farmer Login</Link></li>
                  <li><Link to="/BuyerLogin" className="text-gray-700 hover:text-green-700">Buyer Login</Link></li>
                  <li><Link to="/ServiceProviderLogin" className="text-gray-700 hover:text-green-700">Service Provider Login</Link></li>
                </ul>
              </div>
            </div>
          )}

          {/* Main nav links */}
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
            {user && (
              <button
                onClick={() => navigate(profilePath)}
                className="text-white hover:text-kisaan-yellow-lightest px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                My Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 