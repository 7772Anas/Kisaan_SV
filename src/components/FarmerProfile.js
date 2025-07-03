import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Pencil, Trash, Plus, Box, Inbox, PanelLeft, LayoutDashboard, Database, LogOut, X, User, Phone, MapPin, Info, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// CSS Animation Styles
const cardStyles = `
  .animated-card {
    width: 190px;
    height: 120px;
    transition: all .5s;
    box-shadow: 15px 15px 30px rgba(25, 25, 25, 0.11),
               -15px -15px 30px rgba(60, 60, 60, 0.082);
    text-align: center;
    overflow: hidden;
    border-radius: 8px;
  }

  .animated-card:hover {
    height: 260px;
    background: linear-gradient(360deg,rgba(115, 202, 34, 0.77) 60%, hsla(0, 0%, 13%, 1) 70%);
  }

  .animated-card .header {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #212121;
    margin-bottom: 16px;
  }

  .animated-card .header .img-box {
    width: 50px;
  }

  .animated-card .header .title {
    font-size: 1em;
    letter-spacing: .1em;
    font-weight: 900;
    text-transform: uppercase;
    padding: 4px 0 14px 0;
    transition: all .5s;
    color: #edededc5;
  }

  .animated-card:hover .header {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 96%);
  }

  .animated-card:hover .header .title {
    padding: 0;
  }

  .animated-card .content {
    display: block;
    text-align: left;
    color: #212121;
    margin: 0 18px;
  }

  .animated-card .content p {
    transition: all .5s;
    font-size: .8em;
    margin-bottom: 8px;
  }

  .animated-card .content a {
    color: #1d8122;
    cursor: pointer;
    transition: all .5s;
    font-size: .7rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .animated-card .content .btn-link:hover {
    border-bottom: 1px solid #1d8122;
  }
`;

export default function FarmerProfile() {
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState({
    name: "",
    phone_number: "",
    email: "",
    address: "",
    description: ""
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone_number: "", address: "", description: "" });
  const [activeTab, setActiveTab] = useState("stocks");
  const [stockEditModalOpen, setStockEditModalOpen] = useState(false);
  const [stockFormData, setStockFormData] = useState({ commodityName: "", stockQuantity: "1" });
  const [editingStockIndex, setEditingStockIndex] = useState(null);
  const [farmerStocks, setFarmerStocks] = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session?.user) {
          console.error('Session error:', sessionError);
          return;
        }
        
        const userId = sessionData.session.user.id;
        const userEmail = sessionData.session.user.email;
        
        // Fetch data from both tables
        const [farmersResult, profileResult] = await Promise.all([
          supabase
            .from("farmers")
            .select("name, phone_number")
            .eq("id", userId)
            .single(),
          supabase
            .from("farmer_profile_table")
            .select("name, phone_number, address, description")
            .eq("id", userId)
            .single()
        ]);
        
        // Handle farmers table data
        if (farmersResult.error) {
          console.error('Error fetching farmers data:', farmersResult.error);
        }
        
        // Handle profile table data
        if (profileResult.error) {
          console.error('Error fetching profile data:', profileResult.error);
          console.log('Profile record may not exist yet for user:', userId);
        }
        
        // Combine data with priority to profile table, fallback to farmers table
        const farmersData = farmersResult.data || {};
        const profileData = profileResult.data || {};
        
        const combinedData = {
          name: profileData.name || farmersData.name || "No name provided",
          phone_number: profileData.phone_number || farmersData.phone_number || "No phone number provided",
          email: userEmail,
          address: profileData.address || "No address provided",
          description: profileData.description || "No description provided."
        };
        
        setFarmer(combinedData);
        setFormData({
          name: combinedData.name,
          phone_number: combinedData.phone_number,
          address: combinedData.address,
          description: combinedData.description
        });
        
        // If profile record doesn't exist but we have basic data, create it
        if (profileResult.error && farmersData.name) {
          console.log('Creating initial profile record from farmers data');
          try {
            await supabase
              .from("farmer_profile_table")
              .insert([{
                id: userId,
                name: farmersData.name,
                phone_number: farmersData.phone_number,
                address: "No address provided",
                description: "No description provided."
              }]);
            console.log('Initial profile record created successfully');
          } catch (insertError) {
            console.error('Error creating initial profile record:', insertError);
          }
        }
        
        // Fetch farmer's stocks
        await fetchFarmerStocks(userId);
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    }
    fetchData();
  }, []);

  const fetchFarmerStocks = async (userId) => {
    try {
      setLoadingStocks(true);
      const { data, error } = await supabase
        .from('stocks_info')
        .select('*')
        .eq('farmer_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stocks:', error);
        return;
      }

      setFarmerStocks(data || []);
    } catch (error) {
      console.error('Unexpected error fetching stocks:', error);
    } finally {
      setLoadingStocks(false);
    }
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSavingProfile(true);
      
      // Validate form data
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

      // Optional: Validate address and description (allow empty but warn if too long)
      if (formData.address && formData.address.length > 500) {
        alert('Address is too long. Please keep it under 500 characters.');
        setSavingProfile(false);
        return;
      }

      if (formData.description && formData.description.length > 1000) {
        alert('Description is too long. Please keep it under 1000 characters.');
        setSavingProfile(false);
        return;
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session?.user) {
        alert('User not authenticated. Please login again.');
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // First, check if profile record exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("farmer_profile_table")
        .select("id")
        .eq("id", userId)
        .single();

      let profileResult;
      
      if (checkError || !existingProfile) {
        // Profile record doesn't exist, create it
        console.log('Creating new profile record for user:', userId);
        profileResult = await supabase
          .from("farmer_profile_table")
          .insert([{
            id: userId,
            name: formData.name.trim(),
            phone_number: formData.phone_number.trim(),
            address: formData.address.trim(),
            description: formData.description.trim()
          }]);
      } else {
        // Profile record exists, update it
        console.log('Updating existing profile record for user:', userId);
        profileResult = await supabase
          .from("farmer_profile_table")
          .update({
            name: formData.name.trim(),
            phone_number: formData.phone_number.trim(),
            address: formData.address.trim(),
            description: formData.description.trim()
          })
          .eq("id", userId);
      }

      // Update farmers table (name, phone_number only)
      const farmersResult = await supabase
        .from("farmers")
        .update({
          name: formData.name.trim(),
          phone_number: formData.phone_number.trim()
        })
        .eq("id", userId);
      
      // Check for errors
      if (profileResult.error) {
        console.error('Profile update error:', profileResult.error);
        console.error('Attempted to update with data:', {
          name: formData.name.trim(),
          phone_number: formData.phone_number.trim(),
          address: formData.address.trim(),
          description: formData.description.trim()
        });
        alert('Failed to update profile information. Please try again.');
        setSavingProfile(false);
        return;
      }
      
      if (farmersResult.error) {
        console.error('Farmers table update error:', farmersResult.error);
        console.error('Attempted to update with data:', {
          name: formData.name.trim(),
          phone_number: formData.phone_number.trim()
        });
        alert('Failed to update basic information. Please try again.');
        setSavingProfile(false);
        return;
      }
      
      // Success - show feedback and re-fetch data
      alert('Profile updated successfully!');
      setEditModalOpen(false);
      
      // Re-fetch data to ensure consistency
      const { data: sessionData2 } = await supabase.auth.getSession();
      if (sessionData2.session?.user) {
        const userId2 = sessionData2.session.user.id;
        const userEmail2 = sessionData2.session.user.email;
        
        // Re-fetch from both tables
        const [farmersResult2, profileResult2] = await Promise.all([
          supabase
            .from("farmers")
            .select("name, phone_number")
            .eq("id", userId2)
            .single(),
          supabase
            .from("farmer_profile_table")
            .select("name, phone_number, address, description")
            .eq("id", userId2)
            .single()
        ]);
        
        // Update state with fresh data
        const farmersData2 = farmersResult2.data || {};
        const profileData2 = profileResult2.data || {};
        
        const updatedData = {
          name: profileData2.name || farmersData2.name || "No name provided",
          phone_number: profileData2.phone_number || farmersData2.phone_number || "No phone number provided",
          email: userEmail2,
          address: profileData2.address || "No address provided",
          description: profileData2.description || "No description provided."
        };
        
        setFarmer(updatedData);
        setFormData({
          name: updatedData.name,
          phone_number: updatedData.phone_number,
          address: updatedData.address,
          description: updatedData.description
        });
      }
      
          } catch (error) {
        console.error('Unexpected error in handleSave:', error);
        alert('An unexpected error occurred. Please try again.');
      } finally {
        setSavingProfile(false);
      }
  };

  const handleStockEdit = (index) => {
    setEditingStockIndex(index);
    setStockFormData({ commodityName: "", stockQuantity: "1" });
    setStockEditModalOpen(true);
  };

  const handleStockSave = async () => {
    try {
      // Get current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        alert('User not authenticated. Please login again.');
        return;
      }

      // Validate form data
      if (!stockFormData.commodityName.trim()) {
        alert('Please enter a commodity name.');
        return;
      }

      if (!stockFormData.stockQuantity || parseInt(stockFormData.stockQuantity) <= 0) {
        alert('Please enter a valid stock quantity.');
        return;
      }

      // Insert new stock record into stocks_info table
      const { data, error } = await supabase
        .from('stocks_info')
        .insert([
          {
            commodity_name: stockFormData.commodityName.trim(),
            stock_quantity: parseInt(stockFormData.stockQuantity),
            farmer_id: user.id
          }
        ])
        .select();

      if (error) {
        console.error('Error saving stock:', error);
        alert('Failed to save stock. Please try again.');
        return;
      }

      if (data) {
        console.log('Stock saved successfully:', data);
        alert('Stock saved successfully!');
        setStockEditModalOpen(false);
        setEditingStockIndex(null);
        // Reset form data
        setStockFormData({ commodityName: "", stockQuantity: "1" });
        // Refresh the stocks display
        await fetchFarmerStocks(user.id);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleStockFormChange = (e) => {
    setStockFormData({ ...stockFormData, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (increment) => {
    const currentValue = parseInt(stockFormData.stockQuantity) || 1;
    const newValue = Math.max(1, currentValue + increment);
    setStockFormData({ ...stockFormData, stockQuantity: newValue.toString() });
  };

  const handleStockDelete = async (stockId) => {
    try {
      // Delete the stock from stocks_info table
      const { error } = await supabase
        .from('stocks_info')
        .delete()
        .eq('id', stockId);
      if (error) {
        alert('Failed to delete stock, try again later as servers are busy');
        return;
      }
      alert('Stock deleted successfully!');
      // Refresh the stocks display
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user) {
        await fetchFarmerStocks(sessionData.session.user.id);
      }
    } catch (error) {
      alert('Failed to delete stock, try again later as servers are busy');
    }
  };

  // Logout handler
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
          <h2 className="text-lg font-bold mb-6 text-green-700 flex items-center gap-2"><PanelLeft className="w-6 h-6 text-green-600" />Profile Menu</h2>
          <ul className="space-y-2 mt-10">
            <li
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-all"
              onClick={() => navigate('/')}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Home</span>
            </li>
            <li className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-all">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </li>
            <li className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-all">
              <Database className="w-5 h-5" />
              <span>Services</span>
            </li>
            <li
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-all"
              onClick={() => setLogoutModalOpen(true)}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </div>
      {drawerOpen && <div className="fixed inset-0 bg-black bg-opacity-20 z-30" onClick={() => setDrawerOpen(false)}></div>}

      <div className="flex-1 flex flex-col">
        <div className="px-6 pt-8 pb-6">
          <div className="relative bg-white/60 backdrop-blur-md shadow-xl rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border border-green-100" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)'}}>
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
              <div className="relative w-28 h-28 bg-gradient-to-br from-green-200 to-green-50 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <User className="w-16 h-16 text-green-700" />
                <button onClick={() => setEditModalOpen(true)} className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-green-50 transition">
                  <Pencil className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="mt-2 text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
                  <User className="w-6 h-6 text-green-600" />
                  {farmer.name}
                </h1>
                <p className="text-xs text-gray-400">@{farmer.name?.toLowerCase().replace(/\s+/g, '') || 'farmer'}</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4 justify-center md:ml-8 w-full max-w-xl">
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <User className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Name:</span>
                <span className="font-medium text-gray-900">{farmer.name}</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <Phone className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Phone:</span>
                <span className="font-medium text-gray-900">{farmer.phone_number}</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Address:</span>
                <span className="font-medium text-gray-900">{farmer.address}</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <Info className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Description:</span>
                <span className="font-medium text-gray-900">{farmer.description}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6">
            <div className="flex relative">
              <button
                onClick={() => setActiveTab("stocks")}
                className={`px-6 py-4 text-lg font-medium transition-colors duration-200 ${
                  activeTab === "stocks" 
                    ? "text-green-600" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Stocks
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`px-6 py-4 text-lg font-medium transition-colors duration-200 ${
                  activeTab === "requests" 
                    ? "text-green-600" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Requests
              </button>
              {/* Animated underline */}
              <div 
                className="absolute bottom-0 h-0.5 bg-green-600 transition-all duration-300 ease-in-out"
                style={{
                  width: '80px',
                  left: activeTab === "stocks" ? '24px' : '104px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6">
          {activeTab === "stocks" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Stocks</h3>
              
              {/* Stock Overview Paragraph */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-lg mb-6 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-semibold"></span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2"><Inbox className="w-5 h-5 text-green-600" />Stock Overview</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {/* Add your text here */}
                    </p>
                  </div>
                </div>
              </div>
              
              <style>{cardStyles}</style>
              {loadingStocks ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-gray-600">Loading stocks...</span>
                </div>
              ) : (
                <div className="flex gap-4 flex-wrap">
                  {/* Always show Add Stock box */}
                  <div className="animated-card relative group border border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50 to-white">
                    <button 
                      onClick={() => handleStockEdit('new')}
                      className="absolute top-2 right-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shadow-sm hover:bg-green-200 transition-colors z-10 border border-green-200 group-hover:scale-110"
                      title="Add Stock"
                    >
                      <Plus className="w-5 h-5 text-green-700" />
                    </button>
                    <div className="header">
                      <div className="img-box flex items-center justify-center"><Box className="w-8 h-8 text-green-600" /></div>
                      <div className="title text-green-700">Add Stock</div>
                    </div>
                    <div className="content text-green-800">
                      <p className="font-semibold">Click to add new stock</p>
                      <p className="text-xs">Track your inventory</p>
                    </div>
                  </div>
                  
                  {/* Display existing stocks in queue */}
                  {farmerStocks.map((stock, index) => (
                    <div key={stock.id} className="animated-card relative group border border-gray-200 hover:border-green-400 bg-gradient-to-br from-white to-green-50">
                      <button 
                        onClick={() => handleStockEdit(index)}
                        className="absolute top-2 right-12 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-green-100 transition-colors z-10 border border-gray-200 group-hover:scale-110"
                        title="Edit Stock"
                      >
                        <Pencil className="w-5 h-5 text-green-700" />
                      </button>
                      {/* Delete button */}
                      <button
                        onClick={() => handleStockDelete(stock.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shadow-sm hover:bg-red-200 transition-colors z-10 border border-red-200 group-hover:scale-110"
                        title="Delete Stock"
                      >
                        <Trash className="w-5 h-5 text-red-600" />
                      </button>
                      <div className="header">
                        <div className="img-box flex items-center justify-center"><Box className="w-8 h-8 text-green-600" /></div>
                        <div className="title text-gray-800">{stock.commodity_name}</div>
                      </div>
                      <div className="content">
                        <p className="font-semibold text-gray-700">Current stock level: <span className="text-green-700">{stock.stock_quantity} kg</span></p>
                        <p className="text-xs text-gray-500">Last updated: {new Date(stock.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === "requests" && (
            <div className="bg-white rounded-lg shadow-sm p-6 relative">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Requests</h3>
              <div className="text-gray-500 text-center py-8">
                <div className="text-4xl mb-2">📋</div>
                <p>No requests available yet</p>
                <p className="text-sm">Your request information will appear here</p>
              </div>
              {/* Explore Services Button */}
              <button
                className="absolute right-6 bottom-6 bg-gradient-to-r from-green-500 to-lime-400 text-white px-5 py-2 rounded-lg shadow hover:from-green-600 hover:to-lime-500 transition-all duration-200 font-semibold text-base flex items-center gap-2"
                onClick={() => {
                  navigate('/planning');
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 0);
                }}
              >
                <Search className="w-5 h-5" />
                Explore Services
              </button>
            </div>
          )}
        </div>

        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-5xl mb-4 shadow">
                👨‍🌾
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{formData.name || "Your Name"}</h2>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full mb-4">Farmer</span>
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
                  value={farmer.email}
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
                ×
              </button>
            </div>
          </div>
        )}

        {/* Stock Edit Modal */}
        {stockEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-3xl mb-4 shadow">
                📦
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {editingStockIndex === 'new' ? 'Add New Stock' : 'Edit Stock'}
              </h2>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full mb-6">
                {editingStockIndex === 'new' ? 'New Stock' : `Stock ${editingStockIndex + 1}`}
              </span>
              
              <div className="w-full space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commodity Name</label>
                  <input
                    name="commodityName"
                    value={stockFormData.commodityName}
                    onChange={handleStockFormChange}
                    placeholder="Enter commodity name"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        name="stockQuantity"
                        type="number"
                        min="1"
                        value={stockFormData.stockQuantity}
                        onChange={handleStockFormChange}
                        className="w-full p-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-t-sm transition-colors"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(-1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-b-sm transition-colors"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                    <span className="text-gray-600 font-medium px-3">kg</span>
                  </div>
                </div>
              </div>
              
              <div className="flex w-full gap-4">
                <button
                  onClick={handleStockSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
                >
                  Save Stock
                </button>
                <button
                  onClick={() => setStockEditModalOpen(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
              
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                onClick={() => setStockEditModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        )}

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
    </div>
  );
}

/* Animations for modal */
<style>{`
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fadeIn { animation: fadeIn 0.2s; }
@keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.animate-popIn { animation: popIn 0.25s cubic-bezier(.4,2,.6,1); }
@keyframes fadeInScale { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
.animate-fadeInScale { animation: fadeInScale 0.2s; }
`}</style>
