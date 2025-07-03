// BuyerDashboard.js
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Filter, User, Phone, MapPin, Info, Pencil, X, PanelLeft, LayoutDashboard, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const BuyerProfile = () => {
  const [buyer, setBuyer] = useState({
    name: '',
    phone_number: '',
    address: '',
    description: '',
    email: '',
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    address: '',
    description: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [basketBounce, setBasketBounce] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [farmerProfile, setFarmerProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchAllStocks();
  }, []);

  const fetchProfile = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session?.user) {
      console.error('Session error:', sessionError);
      return;
    }
    const userId = sessionData.session.user.id;
    const userEmail = sessionData.session.user.email;
    // Fetch from both tables
    const [buyersResult, profileResult] = await Promise.all([
      supabase
        .from('buyers')
        .select('name, phone_number')
        .eq('id', userId)
        .single(),
      supabase
        .from('buyer_profile_table')
        .select('address, description')
        .eq('id', userId)
        .single(),
    ]);
    const buyersData = buyersResult.data || {};
    const profileData = profileResult.data || {};
    setBuyer({
      name: buyersData.name || '',
      phone_number: buyersData.phone_number || '',
      address: profileData.address || '',
      description: profileData.description || '',
      email: userEmail,
    });
    setFormData({
      name: buyersData.name || '',
      phone_number: buyersData.phone_number || '',
      address: profileData.address || '',
      description: profileData.description || '',
    });
    // If profile record doesn't exist but we have basic data, create it
    if (profileResult.error && buyersData.name) {
      try {
        await supabase
          .from('buyer_profile_table')
          .insert([{
            id: userId,
            address: '',
            description: '',
          }]);
      } catch (insertError) {
        console.error('Error creating initial buyer profile record:', insertError);
      }
    }
  };

  const fetchAllStocks = async () => {
    try {
    const { data, error } = await supabase
      .from('stocks_info')
        .select('*');
    if (error) {
      console.error('Error fetching stocks:', error);
        setStocks([]);
        return;
      }
      setStocks(data || []);
    } catch (err) {
      console.error('Unexpected error fetching stocks:', err);
      setStocks([]);
    }
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSavingProfile(true);
    // Validate
    if (!formData.name.trim()) {
      alert('Please enter a name.');
      setSavingProfile(false);
      return;
    }
    if (!formData.phone_number.trim()) {
      alert('Please enter a phone number.');
      setSavingProfile(false);
      return;
    }
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session?.user) {
      alert('User not authenticated. Please login again.');
      setSavingProfile(false);
      return;
    }
    const userId = sessionData.session.user.id;
    let buyersUpdateSuccess = false;
    let profileUpdateSuccess = false;
    // Update buyers table (name, phone_number)
    const { error: buyersError } = await supabase
      .from('buyers')
      .update({
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
      })
      .eq('id', userId);
    if (buyersError) {
      alert('Failed to update name/phone in buyers table.');
    } else {
      buyersUpdateSuccess = true;
    }
    // Update buyer_profile_table (name, phone_number, address, description)
    const { data: updateData, error: profileError } = await supabase
      .from('buyer_profile_table')
      .update({
        name: formData.name.trim(),
        phone_number: formData.phone_number.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
      })
      .eq('id', userId)
      .select();
    if (profileError) {
      alert('Failed to update profile table.');
      console.error('Profile update error:', profileError);
    } else if (updateData && updateData.length > 0) {
      profileUpdateSuccess = true;
    } else {
      // No rows updated, try insert
      const { error: insertError } = await supabase
        .from('buyer_profile_table')
        .insert([{
          id: userId,
          name: formData.name.trim(),
          phone_number: formData.phone_number.trim(),
          address: formData.address.trim(),
          description: formData.description.trim(),
        }]);
      if (insertError) {
        alert('Failed to create profile record.');
        console.error('Profile insert error:', insertError);
      } else {
        profileUpdateSuccess = true;
      }
    }
    if (buyersUpdateSuccess && profileUpdateSuccess) {
      alert('Profile updated successfully!');
      setEditModalOpen(false);
      await fetchProfile();
    }
    setSavingProfile(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        alert('Logout failed. Please try again.');
        setLoggingOut(false);
        return;
      }
      setLogoutModalOpen(false);
      navigate('/');
    } catch (err) {
      alert('Logout failed. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  const handleOpenProfile = async (farmerId, stock) => {
    setProfileModalOpen(true);
    setProfileLoading(true);
    setProfileError('');
    setFarmerProfile(null);
    try {
      // Fetch farmer details from backend
      const { data: farmer, error } = await supabase
        .from('farmer_profile_table')
        .select('name, phone_number, address')
        .eq('id', farmerId)
        .single();
      if (error || !farmer) {
        setProfileError('Could not fetch farmer details.');
        setProfileLoading(false);
        return;
      }
      setFarmerProfile({
        name: farmer.name,
        phone: farmer.phone_number,
        address: farmer.address,
        stock: stock.stock_quantity,
      });
      setProfileLoading(false);
    } catch (err) {
      setProfileError('Could not fetch farmer details.');
      setProfileLoading(false);
    }
  };

  const handleCloseProfile = () => {
    setProfileModalOpen(false);
    setFarmerProfile(null);
    setProfileError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 h-full w-56 bg-white shadow-lg z-40 transform transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="p-6">
          {/* X icon for closing sidebar */}
          {drawerOpen && (
            <button
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-transform duration-200 animate-fadeInScale"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close Menu"
            >
              <X className="w-6 h-6 text-green-700" />
            </button>
          )}
          <h2 className="text-lg font-bold mb-6 text-green-700 flex items-center gap-2"><PanelLeft className="w-6 h-6 text-green-600 animate-pulse" />Profile Menu</h2>
          <ul className="space-y-2 mt-10">
            <li
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-all group"
              onClick={() => navigate('/')}
            >
              <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </li>
            <li className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-all group">
              <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Dashboard</span>
            </li>
            <li
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-all group"
              onClick={() => { setEditModalOpen(true); setDrawerOpen(false); }}
            >
              <Pencil className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-transform text-blue-600" />
              <span className="font-semibold">Edit Profile</span>
            </li>
            <li
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-all group"
              onClick={() => setLogoutModalOpen(true)}
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform text-red-600" />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </div>
      {drawerOpen && <div className="fixed inset-0 bg-black bg-opacity-20 z-30" onClick={() => setDrawerOpen(false)}></div>}

      <div className="flex-1 flex flex-col">
        <div className="px-6 pt-8 pb-6">
          <div className="relative bg-white/60 backdrop-blur-md shadow-xl rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border border-green-100" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)'}}>
            {/* Hamburger menu button */}
            <button
              className={`absolute top-4 left-4 z-50 transition-transform duration-300 focus:outline-none ${drawerOpen ? 'rotate-90 scale-110' : ''}`}
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label="Open Menu"
            >
              <span className="block relative w-7 h-7">
                <span className={`absolute inset-0 transition-opacity duration-200 ${drawerOpen ? 'opacity-0' : 'opacity-100'}`}>
                  <PanelLeft className="w-7 h-7 text-green-700" />
                </span>
                <span className={`absolute inset-0 transition-opacity duration-200 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}>
                  <X className="w-7 h-7 text-green-700" />
                </span>
              </span>
            </button>
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-28 h-28 bg-gradient-to-br from-green-200 to-green-50 rounded-full flex items-center justify-center shadow-lg border-4 border-white cursor-pointer"
                   onClick={() => { setBasketBounce(true); }}>
                <ShoppingCart className={`w-16 h-16 text-green-700 transition-transform ${basketBounce ? 'animate-bounce-once' : ''}`} 
                  onAnimationEnd={() => setBasketBounce(false)} />
              </div>
              <div className="mt-2 text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
                  <User className="w-6 h-6 text-green-600 animate-pulse" />
                  {buyer.name}
                </h1>
                <p className="text-xs text-gray-400">@{buyer.name?.toLowerCase().replace(/\s+/g, '') || 'buyer'}</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4 justify-center md:ml-8 w-full max-w-xl">
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <User className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Name:</span>
                <span className="font-medium text-gray-900">{buyer.name}</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <Phone className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Phone:</span>
                <span className="font-medium text-gray-900">{buyer.phone_number}</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Address:</span>
                <span className="font-medium text-gray-900">{buyer.address}</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <Info className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Description:</span>
                <span className="font-medium text-gray-900">{buyer.description}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-5xl mb-4 shadow">
                🛒
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{formData.name || 'Your Name'}</h2>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full mb-4">Buyer</span>
              <div className="w-full space-y-3 mb-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleEditChange}
                  placeholder="Full Name"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400"
                />
                <input
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleEditChange}
                  placeholder="Phone Number"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400"
                />
                <input
                  name="email"
                  value={buyer.email}
                  readOnly
                  className="w-full p-3 border border-gray-100 rounded-xl bg-gray-100 cursor-not-allowed"
                />
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleEditChange}
                  placeholder="Address"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleEditChange}
                  placeholder="Description"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400"
                  rows={3}
                />
              </div>
              <div className="flex w-full gap-4">
                <button
                  onClick={handleSave}
                  disabled={savingProfile}
                  className={`flex-1 font-semibold py-2 rounded-xl transition flex items-center justify-center ${
                    savingProfile
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {savingProfile ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
                <button
                  onClick={() => setEditModalOpen(false)}
                  disabled={savingProfile}
                  className={`flex-1 font-semibold py-2 rounded-xl transition ${
                    savingProfile
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => setEditModalOpen(false)}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-lime-500 text-transparent bg-clip-text flex justify-center items-center gap-2">
          <ShoppingCart className="w-8 h-8" /> Welcome, Buyer
        </h1>
        <p className="text-muted-foreground mt-2">Browse crops available from verified farmers</p>
      </header>

      <div className="mb-6 flex gap-4 items-center">
        <Filter className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Search crops..."
          className="border px-4 py-2 rounded-md w-full"
        />
      </div>

        {/* Animated Card Box (Uiverse.io) */}
        <div className="flex mb-8 flex-wrap gap-6">
          {stocks.map((stock, idx) => (
            <div key={stock.id || idx} className="card" style={{ width: '200px', height: '200px', minWidth: '200px', minHeight: '200px' }}>
              <div className="background"></div>
              <div className="profile-circle flex items-center justify-center">
                <User className="w-10 h-10 text-green-700" />
              </div>
              <div className="box box1">
                <span className="icon font-bold text-lg text-green-900 drop-shadow-sm">{stock.commodity_name}</span>
              </div>
              <div className="box box2">
                <span className="icon font-semibold text-base text-blue-900 drop-shadow-sm">{stock.stock_quantity} kg</span>
              </div>
              <div className="box box3">
                <span className="icon font-medium text-base text-lime-800 drop-shadow-sm cursor-pointer" onClick={() => handleOpenProfile(stock.farmer_id, stock)}>Open Profile</span>
              </div>
              <div className="box box4"></div>
            </div>
          ))}
        </div>

        {/* Farmer Profile Modal */}
        {profileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center relative animate-popIn">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                onClick={handleCloseProfile}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <User className="w-7 h-7 text-green-600" /> Farmer Details
              </h2>
              {profileLoading ? (
                <div className="text-gray-500 py-8">Loading...</div>
              ) : profileError ? (
                <div className="text-red-600 py-8">{profileError}</div>
              ) : farmerProfile ? (
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 text-lg text-gray-700">
                    <User className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">Name:</span>
                    <span className="font-medium text-gray-900">{farmerProfile.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg text-gray-700">
                    <Phone className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">Phone:</span>
                    <span className="font-medium text-gray-900">{farmerProfile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg text-gray-700">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">Address:</span>
                    <span className="font-medium text-gray-900">{farmerProfile.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg text-gray-700">
                    <ShoppingCart className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">Available Stock:</span>
                    <span className="font-medium text-gray-900">{farmerProfile.stock} kg</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Remove stocks grid display, leave placeholder for future implementation */}
        {/* STOCKS GRID REMOVED -- Awaiting new fetch/display instructions from user */}

        {/* Logout Confirmation Modal */}
        {logoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col items-center relative animate-popIn">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <LogOut className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                Log out?
              </h2>
              <p className="text-gray-600 mb-6 text-center">Log-out the current account?</p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-semibold transition-all ${loggingOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                >
                  {loggingOut ? (
                    <span className="animate-spin inline-block"><LogOut className="w-5 h-5" /></span>
                  ) : (
                    <LogOut className="w-5 h-5" />
                  )}
                  Log out
                </button>
                <button
                  onClick={() => setLogoutModalOpen(false)}
                  disabled={loggingOut}
                  className="flex-1 py-2 rounded-xl font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => setLogoutModalOpen(false)}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Single-use bounce animation for basket */}
      <style>{`
      @keyframes bounce-once {
        0%, 100% { transform: translateY(0); }
        20% { transform: translateY(-20px); }
        40% { transform: translateY(-30px); }
        60% { transform: translateY(-15px); }
        80% { transform: translateY(-8px); }
      }
      .animate-bounce-once {
        animation: bounce-once 0.7s cubic-bezier(.4,2,.6,1);
      }
      .card {
        position: relative;
        width: 200px;
        height: 200px;
        min-width: 200px;
        min-height: 200px;
        background: lightgrey;
        border-radius: 1.6em;
        overflow: hidden;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 0.8em 3em 0px;
        transition: all 1s ease-in-out;
        user-select: none;
      }
      .background {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 100% 107%, #e6ff70 0%, #b5ec9c 30%, #1effe0 60%, #57d85d 100%);
      }
      .profile-circle {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #bfff00 0%, #00ffe7 100%);
        border-radius: 50%;
        box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10);
        transform: translate(-50%, -50%) scale(1);
        transition: all 0.7s cubic-bezier(.4,2,.6,1);
        border: 4px solid #fff;
        z-index: 2;
      }
      .card:hover .profile-circle {
        left: 80%;
        top: 20%;
        width: 40px;
        height: 40px;
        transform: translate(-50%, -50%) scale(0.7);
      }
      .icon {
        display: inline-block;
        width: 2em;
        height: 2em;
      }
      .icon .svg {
        fill: rgba(255, 255, 255, 0.797);
        width: 100hw;
        transition: all 0.5s ease-in-out;
      }
      .box {
        position: absolute;
        padding: 1em;
        text-align: right;
        background: rgba(255, 255, 255, 0.389);
        border-top: 0.2em solid rgb(255, 255, 255);
        border-right: 0.1em solid white;
        border-radius: 10% 13% 42% 0%/10% 12% 75% 0%;
        box-shadow: rgba(100, 100, 111, 0.364) -0.8em 0.8em 3em 0px;
        transform-origin: bottom left;
        transition: all 1s ease-in-out;
      }
      .box::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        opacity: 0;
        transition: all 0.5s ease-in-out;
      }
      .box:hover .svg {
        fill: white;
      }
      .box1 {
        width: 70%;
        height: 70%;
        bottom: -70%;
        left: -70%;
      }
      .box1::before {
        background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #ff53d4 60%, #62c2fe 90%);
      }
      .box1:hover::before {
        opacity: 1;
      }
      .box1:hover .icon .svg {
        filter: drop-shadow(0 0 0.5em white);
      }
      .box2 {
        width: 50%;
        height: 50%;
        bottom: -50%;
        left: -50%;
        transition-delay: 0.2s;
      }
      .box2::before {
        background: radial-gradient(circle at 30% 107%, #91e9ff 0%, #00acee 90%);
      }
      .box2:hover::before {
        opacity: 1;
      }
      .box2:hover .icon .svg {
        filter: drop-shadow(0 0 0.5em white);
      }
      .box3 {
        width: 30%;
        height: 30%;
        bottom: -30%;
        left: -30%;
        transition-delay: 0.4s;
      }
      .box3::before {
        background: radial-gradient(circle at 30% 107%, #969fff 0%, #b349ff 90%);
      }
      .box3:hover::before {
        opacity: 1;
      }
      .box3:hover .icon .svg {
        filter: drop-shadow(0 0 0.5em white);
      }
      .box4 {
        width: 10%;
        height: 10%;
        bottom: -10%;
        left: -10%;
        transition-delay: 0.6s;
      }
      .card:hover {
        transform: scale(1.1);
      }
      .card:hover .box {
        bottom: -0.1em;
        left: -0.1em;
      }
      `}</style>
    </div>
  );
};

export default BuyerProfile;
