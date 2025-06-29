import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import GoogleSignInButton from './GoogleSignInButton';
import { IoLocationSharp } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";

const ROLES = [
  {
    key: 'admin',
    label: 'Admin',
    emoji: (
      <svg width="55" height="55" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="currentColor"/>
      </svg>
    ),
    color: 'purple',
    border: 'border-purple-500',
  },
  {
    key: 'farmer',
    label: 'Farmer',
    emoji: (
      <svg width="55" height="55" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" fill="currentColor"/>
        <path d="M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z" fill="currentColor"/>
        <path d="M8 18h8v2H8z" fill="currentColor"/>
        <path d="M6 12h4v2H6z" fill="currentColor"/>
        <path d="M14 12h4v2h-4z" fill="currentColor"/>
      </svg>
    ),
    color: 'green',
    border: 'border-green-500',
  },
  {
    key: 'buyer',
    label: 'Buyer/Consumer',
    emoji: (
      <svg width="55" height="55" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
      </svg>
    ),
    color: 'blue',
    border: 'border-blue-500',
  },
  {
    key: 'service',
    label: 'Service Provider',
    emoji: (
      <svg width="55" height="55" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" fill="currentColor"/>
      </svg>
    ),
    color: 'orange',
    border: 'border-orange-500',
  },
];

const SERVICE_TYPES = ['Water', 'Electricity', 'Labor', 'Machinery'];

const initialLogin = { email: '', password: '' };
const initialSignUp = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  // Farmer
  farmName: '',
  farmLocation: '',
  farmAddress: '',
  // Buyer
  homeAddress: '',
  homeAddressFull: '',
  // Service Provider
  orgName: '',
  serviceType: '',
  serviceLocation: '',
  serviceAddress: '',
  // Location
  lat: '',
  lng: '',
};

const AccountSetup = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState('login');
  const [role, setRole] = useState('admin');
  const [loginData, setLoginData] = useState(initialLogin);
  const [signUpData, setSignUpData] = useState(initialSignUp);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirm, setShowSignUpConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Color maps
  const colorMap = {
    purple: 'text-purple-500',
    green: 'text-green-500',
    blue: 'text-blue-500',
    orange: 'text-orange-500',
  };
  const labelColorMap = {
    purple: 'text-purple-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
  };

  // Validation helpers
  const validateLogin = () => {
    const errs = {};
    if (!loginData.email) errs.email = 'Email is required.';
    if (!loginData.password) errs.password = 'Password is required.';
    return errs;
  };
  const validateSignUp = () => {
    const errs = {};
    if (role === 'admin') return errs; // No signup for admin
    if (!signUpData.fullName) errs.fullName = 'Full Name is required.';
    if (!signUpData.email) errs.email = 'Email is required.';
    if (!signUpData.phone) errs.phone = 'Phone Number is required.';
    if (!signUpData.password) errs.password = 'Password is required.';
    if (!signUpData.confirmPassword) errs.confirmPassword = 'Confirm Password is required.';
    if (signUpData.password && signUpData.confirmPassword && signUpData.password !== signUpData.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (role === 'farmer') {
      if (!signUpData.farmName) errs.farmName = 'Farm Name is required.';
      if (!signUpData.farmLocation) errs.farmLocation = 'Farm Location is required.';
    }
    if (role === 'buyer') {
      if (!signUpData.homeAddress) errs.homeAddress = 'Home Address is required.';
    }
    if (role === 'service') {
      if (!signUpData.orgName) errs.orgName = 'Organization/Service Name is required.';
      if (!signUpData.serviceType) errs.serviceType = 'Type of Service is required.';
      if (!signUpData.serviceLocation) errs.serviceLocation = 'Service Location is required.';
    }
    return errs;
  };

  // Input handlers
  const handleInput = (e, type = 'login') => {
    const { name, value } = e.target;
    if (type === 'login') {
      setLoginData({ ...loginData, [name]: value });
    } else {
      // For signup, update both the display field and the corresponding address field
      if (name === 'farmLocation') {
        setSignUpData({ ...signUpData, farmLocation: value, farmAddress: value });
      } else if (name === 'homeAddress') {
        setSignUpData({ ...signUpData, homeAddress: value, homeAddressFull: value });
      } else if (name === 'serviceLocation') {
        setSignUpData({ ...signUpData, serviceLocation: value, serviceAddress: value });
      } else {
        setSignUpData({ ...signUpData, [name]: value });
      }
    }
  };

  // Location fetch
  const handleLocation = (field) => {
    setLocLoading(true);
    setLocError('');
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported.');
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        
        try {
          // Reverse geocoding to get address using OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          
          if (data.display_name) {
            const address = data.display_name;
            
            if (role === 'farmer') {
              setSignUpData((d) => ({ 
                ...d, 
                farmLocation: `${latitude}, ${longitude}`, 
                farmAddress: address,
                lat: latitude, 
                lng: longitude 
              }));
            } else if (role === 'buyer') {
              setSignUpData((d) => ({ 
                ...d, 
                homeAddress: `${latitude}, ${longitude}`, 
                homeAddressFull: address,
                lat: latitude, 
                lng: longitude 
              }));
            } else if (role === 'service') {
              setSignUpData((d) => ({ 
                ...d, 
                serviceLocation: `${latitude}, ${longitude}`, 
                serviceAddress: address,
                lat: latitude, 
                lng: longitude 
              }));
            }
          } else {
            // Fallback to coordinates if address not found
            if (role === 'farmer') {
              setSignUpData((d) => ({ 
                ...d, 
                farmLocation: `${latitude}, ${longitude}`, 
                farmAddress: `${latitude}, ${longitude}`,
                lat: latitude, 
                lng: longitude 
              }));
            } else if (role === 'buyer') {
              setSignUpData((d) => ({ 
                ...d, 
                homeAddress: `${latitude}, ${longitude}`, 
                homeAddressFull: `${latitude}, ${longitude}`,
                lat: latitude, 
                lng: longitude 
              }));
            } else if (role === 'service') {
              setSignUpData((d) => ({ 
                ...d, 
                serviceLocation: `${latitude}, ${longitude}`, 
                serviceAddress: `${latitude}, ${longitude}`,
                lat: latitude, 
                lng: longitude 
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching address:', error);
          // Fallback to coordinates if geocoding fails
          if (role === 'farmer') {
            setSignUpData((d) => ({ 
              ...d, 
              farmLocation: `${latitude}, ${longitude}`, 
              farmAddress: `${latitude}, ${longitude}`,
              lat: latitude, 
              lng: longitude 
            }));
          } else if (role === 'buyer') {
            setSignUpData((d) => ({ 
              ...d, 
              homeAddress: `${latitude}, ${longitude}`, 
              homeAddressFull: `${latitude}, ${longitude}`,
              lat: latitude, 
              lng: longitude 
            }));
          } else if (role === 'service') {
            setSignUpData((d) => ({ 
              ...d, 
              serviceLocation: `${latitude}, ${longitude}`, 
              serviceAddress: `${latitude}, ${longitude}`,
              lat: latitude, 
              lng: longitude 
            }));
          }
        }
        
        setLocLoading(false);
        // TODO: Store latitude, longitude, and address in DB for backend integration.
      },
      (err) => { 
        setLocError('Unable to fetch your location. Please allow GPS access.');
        setLocLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validateLogin();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setAuthLoading(true);
    setAuthError('');

    try {
      const { data, error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        setAuthError(error.message);
        return;
      }

      // Check if user has admin role and redirect accordingly
      if (role === 'admin') {
        navigate('/admin');
      } else {
        // For other roles, you can redirect to appropriate pages
        navigate('/');
      }
    } catch (error) {
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const errs = validateSignUp();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setAuthLoading(true);
    setAuthError('');

    try {
      const { data, error } = await signUp({ ...signUpData, role });
      
      if (error) {
        setAuthError(error.message);
        return;
      }

      // Show success message and redirect
      alert('Account created successfully! Please check your email to verify your account.');
      navigate('/');
    } catch (error) {
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Tab underline animation
  const tabUnderline = tab === 'login' ? 'translate-x-0' : 'translate-x-full';

  // Render role-specific signup form
  const renderSignUpForm = () => {
    if (role === 'admin') {
      // TODO: Secure this route at backend to prevent unauthorized admin creation.
      return (
        <div className="text-center text-red-500 py-8 font-semibold">
          Signup for Admin is restricted. Only existing admins can log in.
        </div>
      );
    }
    return (
      <>
        <div>
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={signUpData.fullName}
            onChange={e => handleInput(e, 'signup')}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            placeholder="Enter your full name"
          />
          {errors.fullName && <div className="text-red-500 text-xs mt-1">{errors.fullName}</div>}
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={signUpData.email}
            onChange={e => handleInput(e, 'signup')}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            placeholder="Enter your email"
          />
          {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={signUpData.phone}
            onChange={e => handleInput(e, 'signup')}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            placeholder="Enter your phone number"
          />
          {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
        </div>
        {role === 'farmer' && (
          <>
            <div>
              <label className="block text-gray-700 mb-1">Farm Name</label>
              <input
                type="text"
                name="farmName"
                value={signUpData.farmName}
                onChange={e => handleInput(e, 'signup')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                placeholder="Enter your farm name"
              />
              {errors.farmName && <div className="text-red-500 text-xs mt-1">{errors.farmName}</div>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1 flex items-center">Farm Location
                <button
                  type="button"
                  className="ml-2 px-2 py-1 text-xs bg-green-100 rounded hover:bg-green-200 transition flex items-center"
                  onClick={() => handleLocation('farmLocation')}
                  disabled={locLoading}
                >
                  {locLoading ? <span className="animate-spin mr-1"><AiOutlineLoading /></span> : <span className="mr-1"> <IoLocationSharp size="1.5em"/> </span>}
                  Use current location
                </button>
              </label>
              <input
                type="text"
                name="farmLocation"
                value={signUpData.farmAddress || signUpData.farmLocation}
                onChange={e => handleInput(e, 'signup')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                placeholder="Enter your farm location"
              />
              {errors.farmLocation && <div className="text-red-500 text-xs mt-1">{errors.farmLocation}</div>}
              {locError && <div className="text-orange-500 text-xs mt-1">{locError}</div>}
            </div>
          </>
        )}
        {role === 'buyer' && (
          <div>
            <label className="block text-gray-700 mb-1 flex items-center">Home Address
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-green-100 rounded hover:bg-green-200 transition flex items-center"
                onClick={() => handleLocation('homeAddress')}
                disabled={locLoading}
              >
                {locLoading ? <span className="animate-spin mr-1"><AiOutlineLoading size="1.5em"/></span> : <span className="mr-1"><IoLocationSharp size="1.5em"/> </span>}
                Use current location
              </button>
            </label>
            <input
              type="text"
              name="homeAddress"
              value={signUpData.homeAddressFull || signUpData.homeAddress}
              onChange={e => handleInput(e, 'signup')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              placeholder="Enter your home address"
            />
            {errors.homeAddress && <div className="text-red-500 text-xs mt-1">{errors.homeAddress}</div>}
            {locError && <div className="text-orange-500 text-xs mt-1">{locError}</div>}
          </div>
        )}
        {role === 'service' && (
          <>
            <div>
              <label className="block text-gray-700 mb-1">Organization/Service Name</label>
              <input
                type="text"
                name="orgName"
                value={signUpData.orgName}
                onChange={e => handleInput(e, 'signup')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                placeholder="Enter your organization/service name"
              />
              {errors.orgName && <div className="text-red-500 text-xs mt-1">{errors.orgName}</div>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Type of Service</label>
              <select
                name="serviceType"
                value={signUpData.serviceType}
                onChange={e => handleInput(e, 'signup')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
              >
                <option value="">Select a service</option>
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.serviceType && <div className="text-red-500 text-xs mt-1">{errors.serviceType}</div>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1 flex items-center">Service Location
                <button
                  type="button"
                  className="ml-2 px-2 py-1 text-xs bg-green-100 rounded hover:bg-green-200 transition flex items-center"
                  onClick={() => handleLocation('serviceLocation')}
                  disabled={locLoading}
                >
                  {locLoading ? <span className="animate-spin mr-1"><AiOutlineLoading size="1.5em"/></span> : <span className="mr-1"><IoLocationSharp size="1.5em"/></span>}
                  Use my current location
                </button>
              </label>
              <input
                type="text"
                name="serviceLocation"
                value={signUpData.serviceAddress || signUpData.serviceLocation}
                onChange={e => handleInput(e, 'signup')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                placeholder="Enter your service location"
              />
              {errors.serviceLocation && <div className="text-red-500 text-xs mt-1">{errors.serviceLocation}</div>}
              {locError && <div className="text-orange-500 text-xs mt-1">{locError}</div>}
            </div>
          </>
        )}
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showSignUpPassword ? 'text' : 'password'}
              name="password"
              value={signUpData.password}
              onChange={e => handleInput(e, 'signup')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition pr-10"
              placeholder="Enter your password"
            />
            <button type="button" className="absolute right-2 top-2 text-sm" onClick={() => setShowSignUpPassword(v => !v)} tabIndex={-1}>
              {showSignUpPassword ? <FaRegEye size="1.5em" /> : <FaRegEyeSlash size="1.5em"/>}
            </button>
          </div>
          {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <input
              type={showSignUpConfirm ? 'text' : 'password'}
              name="confirmPassword"
              value={signUpData.confirmPassword}
              onChange={e => handleInput(e, 'signup')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition pr-10"
              placeholder="Confirm your password"
            />
            <button type="button" className="absolute right-2 top-2 text-sm" onClick={() => setShowSignUpConfirm(v => !v)} tabIndex={-1}>
              {showSignUpConfirm ?  <FaRegEye size="1.5em" /> : <FaRegEyeSlash size="1.5em"/>}
            </button>
          </div>
          {errors.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col md:flex-row items-stretch justify-center relative overflow-hidden">
      {/* Video Section (left side) */}
      <div className="hidden md:block md:w-1/2 h-full bg-green-50 pt-10">
        <video
          src={require('../ks-videos/account-setup12.mp4')}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover bg-green-50"
          style={{ backgroundColor: '#f0fdf4' }}
        />
      </div>
      
      {/* Form Section (right side) */}
      <div className="flex-1 flex flex-col items-center w-full bg-green-50 min-h-screen">
        {/* Logo & Title at the top center */}
        <div className="w-full flex flex-col items-center justify-center pt-10 pb-4">
          <div className="bg-green-600 rounded-full p-4 shadow-lg mb-2">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9l11.21 11.21C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9z"/></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 text-center">Kisaan Suvidha</h1>
        </div>
        
        {/* Tabs */}
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          <div className="flex w-full bg-white rounded-lg shadow overflow-hidden relative mb-6">
            <button
              className={`flex-1 py-2 text-center font-medium transition-colors duration-300 focus:outline-none ${tab === 'login' ? 'text-green-700' : 'text-gray-400'}`}
              onClick={() => setTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-center font-medium transition-colors duration-300 focus:outline-none ${tab === 'signup' ? 'text-green-700' : 'text-gray-400'}`}
              onClick={() => setTab('signup')}
            >
              Sign Up
            </button>
            {/* Animated underline */}
            <span
              className={`absolute bottom-0 left-0 w-1/2 h-1 bg-green-500 rounded transition-transform duration-300 ease-in-out ${tabUnderline}`}
            />
          </div>
        </div>

        {/* Role Selection */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {ROLES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={`flex flex-col items-center px-6 py-4 rounded-xl shadow-md bg-white border-2 transition-all duration-200 focus:outline-none
                ${role === r.key ? `${r.border} scale-105 shadow-lg` : 'border-transparent'}
                hover:scale-105 hover:shadow-lg`}
              style={{ minWidth: 120 }}
            >
              <span className={`mb-2 text-3xl ${role === r.key ? colorMap[r.color] : 'text-gray-400'}`}>{r.emoji}</span>
              <span className={`font-semibold ${role === r.key ? labelColorMap[r.color] : 'text-gray-700'}`}>{r.label}</span>
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mb-6">
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleInput}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition"
                  placeholder="Enter your email"
                />
                {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginData.password}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none transition pr-10"
                    placeholder="Enter your password"
                  />
                  <button type="button" className="absolute right-2 top-2 text-sm" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                    {showPassword ?  <FaRegEye size="1.5em" /> : <FaRegEyeSlash size="1.5em"/>}
                  </button>
                </div>
                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
              </div>
              <div className="flex justify-between items-center mb-2">
                <span></span>
                <button type="button" className="text-green-600 text-sm hover:underline focus:outline-none transition">Forgot your password?</button>
              </div>
              
              {/* Error message display */}
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {authError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 rounded-lg shadow transition-colors duration-200 flex items-center justify-center"
              >
                {authLoading ? (
                  <>
                    <AiOutlineLoading className="animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
              <div className="flex items-center my-3">
                <div className="flex-grow h-px bg-gray-200" />
                <span className="mx-2 text-gray-400 text-sm">Or continue with</span>
                <div className="flex-grow h-px bg-gray-200" />
              </div>
              <GoogleSignInButton />
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-5">
              {renderSignUpForm()}
              {role !== 'admin' && (
                <>
                  {/* Error message display */}
                  {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {authError}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 rounded-lg shadow transition-colors duration-200 flex items-center justify-center"
                  >
                    {authLoading ? (
                      <>
                        <AiOutlineLoading className="animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                  <div className="flex items-center my-3">
                    <div className="flex-grow h-px bg-gray-200" />
                    <span className="mx-2 text-gray-400 text-sm">Or continue with</span>
                    <div className="flex-grow h-px bg-gray-200" />
                  </div>
                  <GoogleSignInButton />
                </>
              )}
            </form>
          )}
        </div>

        {/* Features (bottom) */}
        <div className="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 mb-8">
          <div className="bg-green-100 rounded-xl p-4 flex flex-col items-center shadow-sm">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#22c55e" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9l11.21 11.21C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9z"/></svg>
            <div className="font-semibold mt-2">Direct Trading</div>
            <div className="text-xs text-gray-500 text-center">Connect farmers directly with buyers</div>
          </div>
          <div className="bg-blue-100 rounded-xl p-4 flex flex-col items-center shadow-sm">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#3b82f6"/><path fill="#fff" d="M7 12l3 3 7-7"/></svg>
            <div className="font-semibold mt-2">Smart Analytics</div>
            <div className="text-xs text-gray-500 text-center">Data driven farming insights</div>
          </div>
          <div className="bg-orange-100 rounded-xl p-4 flex flex-col items-center shadow-sm">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fb923c"/><path fill="#fff" d="M8 12h8M12 8v8"/></svg>
            <div className="font-semibold mt-2">Service Network</div>
            <div className="text-xs text-gray-500 text-center">Access to agricultural services</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSetup; 