import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { LogOut, Home, Users, ShoppingCart, Wrench, Mail, X, Menu, LayoutDashboard, User, UserCog, UserCheck, UserPlus, Clock } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
  { label: 'Farmers', icon: <Users className="w-5 h-5 mr-3" /> },
  { label: 'Buyers', icon: <ShoppingCart className="w-5 h-5 mr-3" /> },
  { label: 'Service Providers', icon: <Wrench className="w-5 h-5 mr-3" /> },
  { label: 'Requests', icon: <Mail className="w-5 h-5 mr-3" /> },
];

export default function AdminProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [selectedSection, setSelectedSection] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [dashboardCounts, setDashboardCounts] = useState({ users: 0, farmers: 0, buyers: 0, providers: 0, pendingRequests: 0 });
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch dashboard counts
  useEffect(() => {
    if (selectedSection !== 'Dashboard') return;
    setDashboardLoading(true);
    setError('');
    async function fetchCounts() {
      try {
        // Total Farmers
        const { count: farmersCount, error: farmersError } = await supabase
          .from('farmers')
          .select('id', { count: 'exact', head: true });
        // Total Buyers
        const { count: buyersCount, error: buyersError } = await supabase
          .from('buyers')
          .select('id', { count: 'exact', head: true });
        // Total Service Providers
        const { count: providersCount, error: providersError } = await supabase
          .from('service_providers')
          .select('id', { count: 'exact', head: true });
        // Total Pending Requests (from soil_table)
        const { count: pendingCount, error: pendingError } = await supabase
          .from('soil_table')
          .select('id', { count: 'exact', head: true });
        if (farmersError || buyersError || providersError || pendingError) {
          setError('Failed to fetch dashboard counts.');
        } else {
          setDashboardCounts({
            users: (farmersCount || 0) + (buyersCount || 0) + (providersCount || 0),
            farmers: farmersCount || 0,
            buyers: buyersCount || 0,
            providers: providersCount || 0,
            pendingRequests: pendingCount || 0,
          });
        }
      } catch (err) {
        setError('Failed to fetch dashboard counts.');
      }
      setDashboardLoading(false);
    }
    fetchCounts();
  }, [selectedSection]);

  // Fetch data from Supabase on section change
  useEffect(() => {
    const fetchData = async () => {
      setError('');
      if (selectedSection === 'Farmers') {
        setLoading(true);
        try {
          // Fetch all farmers
          const { data: farmersData, error: farmersError } = await supabase
            .from('farmers')
            .select('id, name, phone_number');
          if (farmersError) throw farmersError;

          // Fetch all farmer profiles
          const { data: profilesData, error: profilesError } = await supabase
            .from('farmer_profile_table')
            .select('id, address, description');
          if (profilesError) throw profilesError;

          // Merge by id
          const profileMap = Object.fromEntries((profilesData || []).map(p => [p.id, p]));
          const merged = (farmersData || []).map(farmer => ({
            id: farmer.id,
            name: farmer.name || 'N/A',
            phone_number: farmer.phone_number || 'N/A',
            address: profileMap[farmer.id]?.address || 'N/A',
            description: profileMap[farmer.id]?.description || 'N/A',
          }));
          setFarmers(merged);
        } catch (err) {
          console.error('Farmers fetch exception:', err);
          setError('Failed to fetch farmers data.');
        }
        setLoading(false);
      } else if (selectedSection === 'Buyers') {
        setLoading(true);
        try {
          // Fetch all buyers
          const { data: buyersData, error: buyersError } = await supabase
            .from('buyers')
            .select('id, name, phone_number');
          if (buyersError) throw buyersError;

          // Fetch all buyer profiles
          const { data: profilesData, error: profilesError } = await supabase
            .from('buyer_profile_table')
            .select('id, address, description');
          if (profilesError) throw profilesError;

          // Merge by id
          const profileMap = Object.fromEntries((profilesData || []).map(p => [p.id, p]));
          const merged = (buyersData || []).map(buyer => ({
            id: buyer.id,
            name: buyer.name || 'N/A',
            phone_number: buyer.phone_number || 'N/A',
            address: profileMap[buyer.id]?.address || 'N/A',
            description: profileMap[buyer.id]?.description || 'N/A',
          }));
          setBuyers(merged);
        } catch (err) {
          console.error('Buyers fetch exception:', err);
          setError('Failed to fetch buyers data.');
        }
        setLoading(false);
      } else if (selectedSection === 'Service Providers') {
        setLoading(true);
        try {
          // Fetch all service providers
          const { data: providersData, error: providersError } = await supabase
            .from('service_providers')
            .select('id, name, phone_number');
          if (providersError) throw providersError;

          // Fetch all service provider profiles
          const { data: profilesData, error: profilesError } = await supabase
            .from('service_provider_table')
            .select('id, address, description');
          if (profilesError) throw profilesError;

          // Merge by id
          const profileMap = Object.fromEntries((profilesData || []).map(p => [p.id, p]));
          const merged = (providersData || []).map(provider => ({
            id: provider.id,
            name: provider.name || 'N/A',
            phone_number: provider.phone_number || 'N/A',
            address: profileMap[provider.id]?.address || 'N/A',
            description: profileMap[provider.id]?.description || 'N/A',
          }));
          setProviders(merged);
        } catch (err) {
          console.error('Service providers fetch exception:', err);
          setError('Failed to fetch service providers data.');
        }
        setLoading(false);
      } else if (selectedSection === 'Requests') {
        setLoading(true);
        try {
          // Fetch requests from soil_table with farmer details
          // soil_table.farmer_id references farmer_profile_table(id)
          const { data, error } = await supabase
            .from('soil_table')
            .select(`
              id,
              farmer_id,
              land_size,
              land_unit,
              crop,
              from_date,
              to_date,
              description,
              created_at,
              farmer_profile_table (
                name,
                phone_number
              )
            `)
            .order('created_at', { ascending: false });
          
          if (error) {
            console.error('Requests fetch error:', error);
            setError('Failed to fetch requests data.');
          } else {
            console.log('Requests data received:', data);
            // Transform data to flatten the structure
            const transformedData = data?.map(request => ({
              id: request.id,
              farmer_name: request.farmer_profile_table?.name || 'N/A',
              farmer_phone: request.farmer_profile_table?.phone_number || 'N/A',
              land_size: request.land_size,
              land_unit: request.land_unit,
              crop: request.crop,
              from_date: request.from_date,
              to_date: request.to_date,
              description: request.description,
              created_at: request.created_at
            })) || [];
            setRequests(transformedData);
          }
        } catch (err) {
          console.error('Requests fetch exception:', err);
          setError('Failed to fetch requests data.');
        }
        setLoading(false);
      }
    };
    if (["Farmers", "Buyers", "Service Providers", "Requests"].includes(selectedSection)) {
      fetchData();
    }
  }, [selectedSection]);

  const handleLogout = async () => {
    setLoggingOut(true);
    setTimeout(() => {
      localStorage.clear();
      setLoggingOut(false);
      setLogoutModalOpen(false);
      navigate('/AdminLogin');
    }, 800);
  };

  // Table rendering logic
  const renderTable = () => {
    let data = [];
    let title = '';
    let columns = [];
    
    if (selectedSection === 'Farmers') {
      data = farmers;
      title = 'Farmers List';
      columns = ['Name', 'Phone Number', 'Address', 'Description'];
    } else if (selectedSection === 'Buyers') {
      data = buyers;
      title = 'Buyers List';
      columns = ['Name', 'Phone Number', 'Address', 'Description'];
    } else if (selectedSection === 'Service Providers') {
      data = providers;
      title = 'Service Providers List';
      columns = ['Name', 'Phone Number', 'Address', 'Description'];
    } else if (selectedSection === 'Requests') {
      data = requests;
      title = 'Soil Testing Requests List';
      columns = ['Farmer Name', 'Farmer Phone', 'Land Size', 'Crop', 'From Date', 'To Date', 'Description', 'Created Date'];
    } else {
      return null;
    }
    
    return (
      <div className="w-full max-w-7xl mx-auto mt-8 bg-white rounded-xl shadow-md p-6 animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4 text-kisaan-green-dark text-center animate-slideIn">{title}</h2>
        {loading ? (
          <div className="text-center py-8 text-kisaan-green-dark font-semibold animate-pulse">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 font-semibold animate-fadeIn">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-kisaan-green-lightest">
                <tr>
                  {columns.map((column, index) => (
                    <th key={index} className="px-4 py-2 text-left text-xs font-semibold text-kisaan-green-dark uppercase tracking-wider">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-kisaan-green-lightest transition animate-rowFadeIn">
                    {selectedSection === 'Requests' ? (
                      <>
                        <td className="px-4 py-2 text-gray-800 font-medium">{row.farmer_name}</td>
                        <td className="px-4 py-2 text-gray-700">{row.farmer_phone}</td>
                        <td className="px-4 py-2 text-gray-700">{row.land_size} {row.land_unit}</td>
                        <td className="px-4 py-2 text-gray-700">{row.crop}</td>
                        <td className="px-4 py-2 text-gray-700">{row.from_date ? new Date(row.from_date).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-4 py-2 text-gray-700">{row.to_date ? new Date(row.to_date).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-4 py-2 text-gray-700">{row.description || 'N/A'}</td>
                        <td className="px-4 py-2 text-gray-700">{row.created_at ? new Date(row.created_at).toLocaleString() : 'N/A'}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2 text-gray-800 font-medium">{row.name}</td>
                        <td className="px-4 py-2 text-gray-700">{row.phone_number}</td>
                        <td className="px-4 py-2 text-gray-700">{row.address}</td>
                        <td className="px-4 py-2 text-gray-700">{row.description}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length === 0 && (
              <div className="text-center py-8 text-gray-500 animate-fadeIn">No records found.</div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Animated Sidebar
  const sidebarClass = `fixed z-30 inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-[-100%]'} md:translate-x-0 transition-transform duration-300 ease-in-out md:static md:w-56 w-64 bg-gradient-green-yellow shadow-lg flex flex-col md:rounded-none rounded-r-2xl md:mt-0 mt-0 animate-sidebarSlide`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={sidebarClass}>
        <div className="flex items-center justify-between md:justify-center px-6 py-4 border-b border-kisaan-green-dark/20">
          <span className="text-xl font-bold text-white tracking-wide animate-fadeIn">Admin</span>
          <button
            className="md:hidden text-white text-2xl focus:outline-none transition-transform duration-200 hover:scale-110"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex items-center w-full px-4 py-3 rounded-lg font-semibold text-lg transition text-left duration-200 ${selectedSection === item.label ? 'bg-white text-kisaan-green-dark shadow scale-105' : 'text-white hover:bg-kisaan-green-dark/80 hover:scale-105 active:scale-95'}`}
              onClick={() => setSelectedSection(item.label)}
            >
              {item.icon}
              <span className="transition-colors duration-200">{item.label}</span>
            </button>
          ))}
          {/* Logout button */}
          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            className="flex items-center w-full px-4 py-3 rounded-lg text-white font-semibold text-lg hover:bg-red-600 transition text-left mt-4 duration-200 hover:scale-105 active:scale-95"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
        {/* Home button at the bottom */}
        <div className="px-4 pb-6 mt-auto">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center w-full px-4 py-3 rounded-lg text-white font-semibold text-lg hover:bg-kisaan-yellow-dark transition text-left bg-kisaan-green-dark duration-200 hover:scale-105 active:scale-95"
          >
            <Home className="w-5 h-5 mr-3" />
            Home
          </button>
        </div>
      </div>

      {/* Hamburger button (mobile only) */}
      <button
        className="fixed top-4 left-4 z-40 md:hidden bg-kisaan-green-dark p-2 rounded-full shadow-lg text-white focus:outline-none transition-transform duration-200 hover:scale-110"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
        style={{ display: sidebarOpen ? 'none' : 'block' }}
      >
        <Menu className="w-7 h-7" />
      </button>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start md:ml-56 ml-0 w-full animate-fadeIn">
        {/* Page Title */}
        <div className="w-full flex justify-center mt-12 md:mt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-kisaan-green-dark drop-shadow mb-8 text-center animate-slideIn">
            Admin Dashboard
          </h1>
        </div>
        {/* Dashboard Cards or Table */}
        {selectedSection === 'Dashboard' ? (
          <div className="w-full max-w-5xl px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fadeIn">
            {/* Total Users Card */}
            <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center animate-appear border-t-4 border-blue-500 transition-transform duration-300 hover:scale-105">
              <span className="text-5xl mb-3"><User className="w-10 h-10 text-blue-600" /></span>
              <span className="text-lg font-bold text-gray-700 mb-1">Total Users</span>
              <span className="text-3xl font-extrabold text-blue-600">{dashboardLoading ? '...' : dashboardCounts.users}</span>
            </div>
            {/* Total Farmers Card */}
            <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center animate-appear border-t-4 border-kisaan-green transition-transform duration-300 hover:scale-105">
              <span className="text-5xl mb-3"><UserCheck className="w-10 h-10 text-kisaan-green-dark" /></span>
              <span className="text-lg font-bold text-gray-700 mb-1">Total Farmers</span>
              <span className="text-3xl font-extrabold text-kisaan-green-dark">{dashboardLoading ? '...' : dashboardCounts.farmers}</span>
            </div>
            {/* Total Buyers Card */}
            <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center animate-appear border-t-4 border-kisaan-yellow transition-transform duration-300 hover:scale-105">
              <span className="text-5xl mb-3"><UserPlus className="w-10 h-10 text-kisaan-yellow-dark" /></span>
              <span className="text-lg font-bold text-gray-700 mb-1">Total Buyers</span>
              <span className="text-3xl font-extrabold text-kisaan-yellow-dark">{dashboardLoading ? '...' : dashboardCounts.buyers}</span>
            </div>
            {/* Total Service Providers Card */}
            <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center animate-appear border-t-4 border-kisaan-green-dark transition-transform duration-300 hover:scale-105">
              <span className="text-5xl mb-3"><UserCog className="w-10 h-10 text-kisaan-green-dark" /></span>
              <span className="text-lg font-bold text-gray-700 mb-1">Total Service Providers</span>
              <span className="text-3xl font-extrabold text-kisaan-green-dark">{dashboardLoading ? '...' : dashboardCounts.providers}</span>
            </div>
            {/* Total Pending Requests Card */}
            <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center animate-appear border-t-4 border-yellow-500 transition-transform duration-300 hover:scale-105">
              <span className="text-5xl mb-3"><Clock className="w-10 h-10 text-yellow-600" /></span>
              <span className="text-lg font-bold text-gray-700 mb-1">Total Pending Requests</span>
              <span className="text-3xl font-extrabold text-yellow-600">{dashboardLoading ? '...' : dashboardCounts.pendingRequests}</span>
            </div>
          </div>
        ) : (
          renderTable()
        )}
      </div>

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
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .animate-fadeIn { animation: fadeIn 0.2s; }
            @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
            .animate-popIn { animation: popIn 0.25s cubic-bezier(.4,2,.6,1); }
            @keyframes slideIn { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
            .animate-slideIn { animation: slideIn 0.4s cubic-bezier(.4,2,.6,1); }
            @keyframes sidebarSlide { 0% { transform: translateX(-100%); } 100% { transform: translateX(0); } }
            .animate-sidebarSlide { animation: sidebarSlide 0.4s cubic-bezier(.4,2,.6,1); }
            @keyframes rowFadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
            .animate-rowFadeIn { animation: rowFadeIn 0.3s cubic-bezier(.4,2,.6,1); }
          `}</style>
        </div>
      )}
    </div>
  );
}
