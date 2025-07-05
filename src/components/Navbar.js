import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { 
  Menu, 
  X, 
  Home, 
  Compass, 
  TrendingUp, 
  Cloud, 
  DollarSign, 
  UserCheck, 
  TestTube, 
  Wrench, 
  Users, 
  User, 
  Shield, 
  LogIn,
  Building2,
  Leaf,
  Calculator,
  MapPin,
  ShoppingCart,
  Settings
} from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePath, setProfilePath] = useState('/profile');
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.sidebar-container')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  const menuItems = [
    {
      title: "Information Hub",
      icon: <Building2 className="w-5 h-5" />,
      items: [
        { label: "Market Prices", path: "/explore/market-hub", icon: <TrendingUp className="w-4 h-4" /> },
        { label: "Weather", path: "/climateconnect", icon: <Cloud className="w-4 h-4" /> },
        { label: "Schemes/Links", path: "/finance", icon: <DollarSign className="w-4 h-4" /> },
        { label: "Agro Expert", path: "/agroexpert", icon: <UserCheck className="w-4 h-4" /> }
      ]
    },
    {
      title: "Farmer Tools",
      icon: <Leaf className="w-5 h-5" />,
      items: [
        { label: "Budget Estimation", path: "/finance", icon: <Calculator className="w-4 h-4" /> },
        { label: "Soil Testing", path: "/soiltesting", icon: <TestTube className="w-4 h-4" /> }
      ]
    },
    {
      title: "Services",
      icon: <Wrench className="w-5 h-5" />,
      items: [
        { label: "Infrastructure Planning", path: "/planning", icon: <MapPin className="w-4 h-4" /> },
        { label: "Direct Selling D2C", path: "/direct-to-selling", icon: <ShoppingCart className="w-4 h-4" />, disabled: false }
      ]
    },
    {
      title: "Profile",
      icon: <Users className="w-5 h-5" />,
      items: [
        { label: "Admin", path: "/AdminLogin", icon: <Shield className="w-4 h-4" /> },
        { label: "Farmer Login", path: "/FarmerLogin", icon: <User className="w-4 h-4" /> },
        { label: "Buyer Login", path: "/BuyerLogin", icon: <User className="w-4 h-4" /> },
        { label: "Service Provider Login", path: "/ServiceProviderLogin", icon: <Settings className="w-4 h-4" /> }
      ]
    }
  ];

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      // Check for admin session in localStorage as fallback
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession) {
        const adminData = JSON.parse(adminSession);
        if (adminData.isAdmin) {
          setUser(adminData.user);
          setProfilePath('/AdminProfile');
          return;
        }
      }
      
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
        // Check admins table
        const { data: admin } = await supabase
          .from('admins')
          .select('id')
          .eq('id', userId)
          .single();
        if (admin) {
          setProfilePath('/AdminProfile');
          return;
        }
        // TODO: Add service provider check if needed
        setProfilePath('/profile');
      }
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      
      // Check for admin session in localStorage as fallback
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession) {
        const adminData = JSON.parse(adminSession);
        if (adminData.isAdmin) {
          setUser(adminData.user);
          setProfilePath('/AdminProfile');
          return;
        }
      }
      
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
          const { data: admin } = await supabase
            .from('admins')
            .select('id')
            .eq('id', userId)
            .single();
          if (admin) {
            setProfilePath('/AdminProfile');
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
            {/* Enhanced Hamburger menu button */}
            <button
              className="mr-3 p-2 rounded-lg hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-white transition-transform duration-200 rotate-180" />
              ) : (
                <Menu className="w-6 h-6 text-white transition-transform duration-200" />
              )}
            </button>
            <Link to="/" className="text-2xl font-bold text-white ml-2 hover:text-kisaan-yellow-lightest transition-colors duration-200">
              Kisaan Suvidha
            </Link>
          </div>

          {/* Enhanced Sidebar */}
          <div className={`sidebar-container fixed inset-0 z-50 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            
            {/* Sidebar Content */}
            <div className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              {/* Header */}
              <div className="bg-gradient-green-yellow p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Menu</h2>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Kisaan Suvidha</p>
                    <p className="text-sm opacity-90">Your Farming Companion</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-140px)]">
                {menuItems.map((section, sectionIndex) => (
                  <div key={section.title} className="space-y-3">
                    <div className="flex items-center space-x-3 text-kisaan-green-dark font-semibold text-sm uppercase tracking-wide">
                      {section.icon}
                      <span>{section.title}</span>
                    </div>
                    <div className="ml-8 space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <Link
                          key={item.label}
                          to={item.path}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                            item.disabled 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-gray-700 hover:text-kisaan-green-dark hover:bg-kisaan-green-lightest'
                          }`}
                          style={{
                            animationDelay: `${(sectionIndex * 100) + (itemIndex * 50)}ms`
                          }}
                        >
                          <span className={`transition-colors duration-200 ${
                            item.disabled ? 'text-gray-400' : 'text-kisaan-green-dark group-hover:text-kisaan-green-dark'
                          }`}>
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.label}</span>
                          {item.disabled && (
                            <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                              Coming Soon
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Quick Actions */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3 text-kisaan-green-dark font-semibold text-sm uppercase tracking-wide mb-3">
                    <LogIn className="w-5 h-5" />
                    <span>Quick Actions</span>
                  </div>
                  <div className="ml-8 space-y-1">
                    <Link
                      to="/"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-kisaan-green-dark hover:bg-kisaan-green-lightest transition-all duration-200 group"
                    >
                      <Home className="w-4 h-4 text-kisaan-green-dark group-hover:text-kisaan-green-dark transition-colors duration-200" />
                      <span className="font-medium">Back to Home</span>
                    </Link>
                    <Link
                      to="/explore"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:text-kisaan-green-dark hover:bg-kisaan-green-lightest transition-all duration-200 group"
                    >
                      <Compass className="w-4 h-4 text-kisaan-green-dark group-hover:text-kisaan-green-dark transition-colors duration-200" />
                      <span className="font-medium">Explore More</span>
                    </Link>
              </div>
              </div>
              </div>
            </div>
          </div>

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

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .sidebar-container .space-y-1 > * {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }
        
        .sidebar-container {
          animation: fadeIn 0.2s ease-out;
        }
        
        .sidebar-container > div:last-child {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 