import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const FarmerLogin = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Animation classes
  const cardBase = 'w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-green-200 transition-all duration-500';
  const cardLogin = isSignup ? 'translate-x-full opacity-0 absolute' : 'translate-x-0 opacity-100 relative';
  const cardSignup = isSignup ? 'translate-x-0 opacity-100 relative' : '-translate-x-full opacity-0 absolute';

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!loginEmail || !loginPassword) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }
    // 1. Sign in with Supabase Auth
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (signInError || !data.user) {
      setError('Incorrect login.');
      alert('Incorrect login.');
      setLoading(false);
      return;
    }
    // 2. Check if user exists in farmers table
    const user = data.user;
    const { data: farmer, error: farmerError } = await supabase
      .from('farmers')
      .select('*')
      .eq('id', user.id)
      .single();
    if (farmerError || !farmer) {
      setError('Incorrect login.');
      alert('Incorrect login.');
      setLoading(false);
      return;
    }
    setSuccess('Login successful!');
    setLoading(false);
    setLoginEmail('');
    setLoginPassword('');
    navigate('/FarmerProfile');
  };

  // Sign-up handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!signupName || !signupPhone || !signupEmail || !signupPassword) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
    });
    if (signUpError) {
      setError('Sign up failed: ' + signUpError.message);
      setLoading(false);
      return;
    }
    const user = data.user;
    if (user) {
      const { error: insertError } = await supabase
        .from('farmers')
        .insert([
          {
            id: user.id,
            name: signupName,
            phone_number: signupPhone,
          },
        ]);
      if (insertError) {
        setError('Sign up succeeded, but failed to save extra info: ' + insertError.message);
      } else {
        setSuccess('Sign up successful! Please check your email to verify your account.');
        setIsSignup(false);
        setSignupName('');
        setSignupPhone('');
        setSignupEmail('');
        setSignupPassword('');
      }
    } else {
      setError('Sign up failed: No user returned.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-lime-200 to-green-300 p-4 overflow-hidden">
      <div className="relative w-full max-w-md h-[480px]">
        {/* Login Card */}
        <div className={`${cardBase} ${cardLogin}`}
             style={{ boxShadow: '0 8px 32px 0 rgba(34,197,94,0.15)' }}>
          <h2 className="text-3xl font-bold text-green-800 text-center mb-6">🌾 Farmer Login</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-green-700">Email Address</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="farmer@example.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700">Password</label>
              <input
                type="password"
                className="w-full mt-1 px-4 py-2 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="••••••••"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition duration-300"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-green-600">
            Don't have an account?{' '}
            <span
              className="underline cursor-pointer hover:text-green-800 transition"
              onClick={() => setIsSignup(true)}
            >
              Register here
            </span>
          </div>
          {error && !isSignup && <div className="text-red-600 text-center mt-2 text-sm">{error}</div>}
          {success && !isSignup && <div className="text-green-600 text-center mt-2 text-sm">{success}</div>}
        </div>
        {/* Sign-Up Card */}
        <div className={`${cardBase} ${cardSignup}`}
             style={{ boxShadow: '0 8px 32px 0 rgba(34,197,94,0.15)' }}>
          <h2 className="text-3xl font-bold text-green-800 text-center mb-6">🌱 Farmer Sign-Up</h2>
          <form className="space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-medium text-green-700">Name</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Your Name"
                value={signupName}
                onChange={e => setSignupName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700">Phone Number</label>
              <input
                type="tel"
                className="w-full mt-1 px-4 py-2 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="e.g. 9876543210"
                value={signupPhone}
                onChange={e => setSignupPhone(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700">Email Address</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="farmer@example.com"
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700">Password</label>
              <input
                type="password"
                className="w-full mt-1 px-4 py-2 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Create a password"
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-xl transition duration-300"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-green-600">
            Already have an account?{' '}
            <span
              className="underline cursor-pointer hover:text-green-800 transition"
              onClick={() => setIsSignup(false)}
            >
              Login here
            </span>
          </div>
          {error && isSignup && <div className="text-red-600 text-center mt-2 text-sm">{error}</div>}
          {success && isSignup && <div className="text-green-600 text-center mt-2 text-sm">{success}</div>}
        </div>
      </div>
    </div>
  );
};

export default FarmerLogin;
