import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }
    
    try {
      // First, try to sign in with Supabase auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        // If Supabase auth fails, check if it's an admin in the admins table
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('admin_email', email)
          .single();

        if (adminError || !adminData) {
          setError('Invalid email or password.');
          setLoading(false);
          return;
        }

        // Validate admin password
        if (adminData.admin_password === password) {
          // Create a session manually or store admin info in localStorage
          localStorage.setItem('adminSession', JSON.stringify({
            user: { id: adminData.id, email: adminData.admin_email },
            isAdmin: true
          }));
          navigate('/AdminProfile');
        } else {
          setError('Invalid email or password.');
        }
      } else {
        // Supabase auth successful, check if user is admin
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('*')
          .eq('admin_email', email)
          .single();

        if (adminError || !adminData) {
          // Not an admin, sign out
          await supabase.auth.signOut();
          setError('Access denied. Admin privileges required.');
        } else {
          // Admin confirmed, proceed
          navigate('/AdminProfile');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 