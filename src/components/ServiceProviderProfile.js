import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Phone, MapPin, Clock, User, PanelLeft, X, LayoutDashboard, Pencil, LogOut, BarChart2, Hourglass, RefreshCw, CheckCircle, Zap, Droplet, Flame, Building2, HardHat, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const ServiceProviderProfile = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Service Provider',
    email: 'provider@example.com',
    phone: '+91 9000000000',
    address: '',
    description: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/ServiceProviderLogin');
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) return;
      const userId = sessionData.session.user.id;
      // Fetch from service_providers
      const { data: providerData } = await supabase
        .from('service_providers')
        .select('name, phone_number')
        .eq('id', userId)
        .single();
      // Fetch from service_provider_table
      const { data: tableData } = await supabase
        .from('service_provider_table')
        .select('address, description')
        .eq('id', userId)
        .single();
      setFormData({
        name: providerData?.name || '',
        phone: providerData?.phone_number || '',
        email: sessionData.session.user.email,
        address: tableData?.address || '',
        description: tableData?.description || ''
      });
    };
    fetchProfile();
  }, []);

  // Sample data for service requests
  const [requests] = useState([
    {
      id: 1,
      farmerName: "Ramesh Kumar",
      phoneNo: "+91 9876543210",
      address: "Village Kheda, Taluka Anand, Gujarat - 388001",
      serviceType: "Electricity",
      description: "Power outage in agricultural field for last 3 days. Need immediate restoration for irrigation pump.",
      status: "Pending",
      priority: "High",
      dateRequested: "2024-07-01",
      timeRequested: "10:30 AM"
    },
    {
      id: 2,
      farmerName: "Priya Sharma",
      phoneNo: "+91 8765432109",
      address: "Village Mehsana, District Mehsana, Gujarat - 384002",
      serviceType: "Water",
      description: "Borewell pump not working. Water supply needed urgently for crop irrigation.",
      status: "In Progress",
      priority: "High",
      dateRequested: "2024-06-30",
      timeRequested: "02:15 PM"
    },
    {
      id: 3,
      farmerName: "Suresh Patel",
      phoneNo: "+91 7654321098",
      address: "Village Nadiad, Taluka Nadiad, Gujarat - 387001",
      serviceType: "Labour",
      description: "Need 5 workers for harvesting wheat crop. Work duration approximately 3 days.",
      status: "Pending",
      priority: "Medium",
      dateRequested: "2024-06-29",
      timeRequested: "09:45 AM"
    },
    {
      id: 4,
      farmerName: "Kavita Desai",
      phoneNo: "+91 6543210987",
      address: "Village Petlad, District Anand, Gujarat - 388450",
      serviceType: "Fire",
      description: "Fire incident in storage area. Need immediate fire safety assistance and damage assessment.",
      status: "Completed",
      priority: "Critical",
      dateRequested: "2024-06-28",
      timeRequested: "11:20 AM"
    },
    {
      id: 5,
      farmerName: "Mahesh Thakkar",
      phoneNo: "+91 5432109876",
      address: "Village Vallabh Vidyanagar, District Anand, Gujarat - 388120",
      serviceType: "Infrastructure",
      description: "Road access to farm damaged due to heavy rains. Need repair for transportation of goods.",
      status: "In Progress",
      priority: "Medium",
      dateRequested: "2024-06-27",
      timeRequested: "04:30 PM"
    },
    {
      id: 6,
      farmerName: "Nita Joshi",
      phoneNo: "+91 4321098765",
      address: "Village Borsad, District Anand, Gujarat - 388540",
      serviceType: "Electricity",
      description: "Transformer blown in our area. Multiple farmers affected. Urgent repair needed.",
      status: "Pending",
      priority: "High",
      dateRequested: "2024-06-26",
      timeRequested: "07:00 AM"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Get unique service types
  const serviceTypes = ['All', ...new Set(requests.map(req => req.serviceType))];
  const statusTypes = ['All', 'Pending', 'In Progress', 'Completed'];

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.phoneNo.includes(searchTerm) ||
                         request.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
   
    const matchesService = filterService === 'All' || request.serviceType === filterService;
    const matchesStatus = filterStatus === 'All' || request.status === filterStatus;
   
    return matchesSearch && matchesService && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'Electricity': return <Zap className="h-7 w-7 text-yellow-500 animate-pulse" />;
      case 'Water': return <Droplet className="h-7 w-7 text-blue-500" />;
      case 'Fire': return <Flame className="h-7 w-7 text-red-500 animate-pulse" />;
      case 'Infrastructure': return <Building2 className="h-7 w-7 text-gray-700" />;
      case 'Labour': return <HardHat className="h-7 w-7 text-green-700 animate-pulse" />;
      default: return <Wrench className="h-7 w-7 text-gray-500 animate-spin-slow" />;
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setLogoutModalOpen(false);
      navigate('/');
    } catch (err) {
      alert('Logout failed. Please try again.');
    }
  };

  const handleSave = async () => {
    setSavingProfile(true);
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) return;
    const userId = sessionData.session.user.id;
    // Update service_providers (name, phone_number)
    const { error: providerError } = await supabase
      .from('service_providers')
      .update({
        name: formData.name,
        phone_number: formData.phone
      })
      .eq('id', userId);
    // Check if row exists in service_provider_table
    const { data: existingRow } = await supabase
      .from('service_provider_table')
      .select('id')
      .eq('id', userId)
      .single();
    let tableError = null;
    if (existingRow) {
      // Update ALL fields
      const { error } = await supabase
        .from('service_provider_table')
        .update({
          name: formData.name,
          phone_number: formData.phone,
          address: formData.address,
          description: formData.description
        })
        .eq('id', userId);
      tableError = error;
    } else {
      // Insert ALL required fields
      const { error } = await supabase
        .from('service_provider_table')
        .insert({
          id: userId,
          name: formData.name,
          phone_number: formData.phone,
          address: formData.address,
          description: formData.description
        });
      tableError = error;
    }
    setSavingProfile(false);
    if (!providerError && !tableError) {
      alert('Profile updated successfully!');
      setEditModalOpen(false);
    } else {
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 h-full w-56 bg-white shadow-lg z-40 transform transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          {/* X icon for closing sidebar */}
          {drawerOpen && (
            <button
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-transform duration-200"
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
        {/* Profile Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="relative bg-white/60 backdrop-blur-md shadow-xl rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border border-green-100 animate-fade-in" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)'}}>
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
              <div className="relative w-28 h-28 bg-gradient-to-br from-green-200 to-green-50 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <User className="w-16 h-16 text-green-700" />
              </div>
              <div className="mt-2 text-center">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
                  <User className="w-6 h-6 text-green-600 animate-pulse" />
                  {formData.name}
                </h1>
                <p className="text-xs text-gray-400">@{formData.name.toLowerCase().replace(/\s+/g, '')}</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4 justify-center md:ml-8 w-full max-w-xl">
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <User className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Name:</span>
                <span className="font-medium text-gray-900">{formData.name}</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <Phone className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Phone:</span>
                <span className="font-medium text-gray-900">{formData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Email:</span>
                <span className="font-medium text-gray-900">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Address:</span>
                <span className="font-medium text-gray-900">{formData.address}</span>
              </div>
              <div className="flex items-center gap-3 text-lg text-gray-700">
                <span className="font-semibold">Description:</span>
                <span className="font-medium text-gray-900">{formData.description}</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Dashboard Heading and Dummy Paragraph */}
        <div className="px-6 mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold text-green-800 mb-2 tracking-tight drop-shadow-lg animate-pulse">My Dashboard</h1>
          <p className="text-lg text-gray-600 max-w-2xl animate-fade-in delay-200">This is your dashboard overview. You can add your own text here later to describe the dashboard or provide instructions.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
              </div>
              <BarChart2 className="h-10 w-10 text-blue-600 animate-pulse" />
            </div>
          </div>
         
          <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up delay-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{requests.filter(r => r.status === 'Pending').length}</p>
              </div>
              <Hourglass className="h-10 w-10 text-yellow-500" />
            </div>
          </div>
         
          <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up delay-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{requests.filter(r => r.status === 'In Progress').length}</p>
              </div>
              <RefreshCw className="h-10 w-10 text-blue-400 animate-spin-slow" />
            </div>
          </div>
         
          <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up delay-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === 'Completed').length}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by farmer name, phone, address, or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Service Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
              >
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statusTypes.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Service Requests Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Service Requests ({filteredRequests.length})</h2>
          </div>
         
          <div className="overflow-x-auto">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No service requests found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4 p-6">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{getServiceIcon(request.serviceType)}</div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {request.farmerName}
                              </h3>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {request.phoneNo}
                              </p>
                            </div>
                          </div>
                         
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                              {request.priority}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          <p className="text-sm text-gray-700 flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{request.address}</span>
                          </p>
                         
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {request.dateRequested} at {request.timeRequested}
                            </span>
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium">
                              {request.serviceType}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-md p-3">
                          <p className="text-sm text-gray-700">
                            <strong>Description:</strong> {request.description}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                          <Eye className="h-4 w-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-semibold transition-all bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="w-5 h-5" /> Log out
              </button>
              <button
                onClick={() => setLogoutModalOpen(false)}
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

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-5xl mb-4 shadow">
              <User className="w-16 h-16 text-green-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{formData.name || 'Your Name'}</h2>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full mb-4">Service Provider</span>
            <div className="w-full space-y-3 mb-4">
              <input
                name="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400"
              />
              <input
                name="email"
                value={formData.email}
                readOnly
                className="w-full p-3 border border-gray-100 rounded-xl bg-gray-100 cursor-not-allowed"
              />
              <input
                name="address"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400"
                rows={3}
              />
            </div>
            <div className="flex w-full gap-4">
              <button
                onClick={handleSave}
                disabled={savingProfile}
                className={`flex-1 font-semibold py-2 rounded-xl transition flex items-center justify-center ${savingProfile ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
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
                className={`flex-1 font-semibold py-2 rounded-xl transition ${savingProfile ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
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
    </div>
  );
};

export default ServiceProviderProfile;