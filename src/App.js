import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import Explore from './components/Explore';
import MarketHub from './components/MarketHub';
import ClimateConnect from './components/ClimateConnect';
import Planning from './components/Planning';
import Finance from './components/Finance';
import Agrobazar from './components/agrobazar';
import SoilTesting from './components/SoilTesting';
import Agroexpert from './components/Agroexpert';
import ServiceProviderProfile from './components/ServiceProviderProfile';
import AdminLogin from './components/AdminLogin';
import FarmerLogin from './components/FarmerLogin';
import FarmerProfile from './components/FarmerProfile';
import BuyerLogin from './components/BuyerLogin';
import BuyerProfile from './components/BuyerProfile';
import ServiceProviderLogin from './components/ServiceProviderLogin';

function AppLayout() {
  const location = useLocation();
  // List of routes where Navbar should be shown
  const publicRoutes = [
    '/',
    '/explore',
    '/explore/market-hub',
    '/climateconnect',
    '/planning',
    '/finance',
    '/agrobazar',
    '/soiltesting',
    '/Agroexpert',
    '/serviceprovider',
    '/AdminLogin',
    '/FarmerLogin',
    '/BuyerLogin',
  ];
  const showNavbar = publicRoutes.includes(location.pathname);
  return (
        <div className="min-h-screen bg-white">
      {showNavbar && <Navbar />}
          <Routes>
        <Route path="/" element={<><Hero /><Features /></>} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/market-hub" element={<MarketHub />} />
            <Route path="/climateconnect" element={<ClimateConnect />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/agrobazar" element={<Agrobazar />} />
            <Route path="/soiltesting" element={<SoilTesting />} />
            <Route path="/Agroexpert" element={<Agroexpert />} />
        <Route path="/serviceprovider" element={<ServiceProviderProfile />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/FarmerLogin" element={<FarmerLogin />} />
        <Route path="/FarmerProfile" element={<FarmerProfile />} />
        <Route path="/BuyerLogin" element={<BuyerLogin />} />
        <Route path="/BuyerProfile" element={<BuyerProfile />} />
        <Route path="/ServiceProviderLogin" element={<ServiceProviderLogin />} />
        <Route path="/ServiceProviderProfile" element={<ServiceProviderProfile />} />
        {/* Admin and protected routes removed for now */}
          </Routes>
          <Footer />
        </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
      </Router>
  );
}

export default App; 