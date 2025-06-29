import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
import AccountSetup from './components/AccountSetup';
import AdminPage from './components/AdminPage';
import Agroexpert from './components/Agroexpert';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Features />
              </>
            } />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/market-hub" element={<MarketHub />} />
            <Route path="/climateconnect" element={<ClimateConnect />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/agrobazar" element={<Agrobazar />} />
            <Route path="/soiltesting" element={<SoilTesting />} />
            <Route path="/AccountSetup" element={<AccountSetup />} />
            <Route path="/Agroexpert" element={<Agroexpert />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 