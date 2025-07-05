import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import s1 from '../ks-images/s1.jpg';
import s2 from '../ks-images/s2.jpg';
import s3 from '../ks-images/s3.jpg';
import s4 from '../ks-images/s4.jpg';

const SoilTesting = () => {
  // Farmer profile state
  const [profile, setProfile] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    landSize: '',
    landUnit: 'acre',
    crop: '',
    fromDate: '',
    toDate: '',
    description: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        setError('Please log in as a farmer to request soil testing.');
        return;
      }
      const { data: farmerProfile } = await supabase
        .from('farmer_profile_table')
        .select('name, phone_number, address')
        .eq('id', user.id)
        .single();
      if (farmerProfile) {
        setProfile({
          name: farmerProfile.name,
          phone: farmerProfile.phone_number,
          address: farmerProfile.address,
        });
      } else {
        setError('Farmer profile not found.');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    // Get logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Please log in as a farmer to request soil testing.');
      return;
    }
    // Insert into soil_table
    const { error: insertError } = await supabase
      .from('soil_table')
      .insert([
        {
          farmer_id: user.id,
          land_size: formData.landSize,
          land_unit: formData.landUnit,
          crop: formData.crop,
          from_date: formData.fromDate,
          to_date: formData.toDate,
          description: formData.description,
        },
      ]);
    if (insertError) {
      setError('Failed to submit request. Please try again.');
      return;
    }
    setSuccess(true);
    setFormData({
      landSize: '',
      landUnit: 'acre',
      crop: '',
      fromDate: '',
      toDate: '',
      description: '',
    });
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#f0fff0] py-12 px-2">
      {/* Soil Testing Information Section (enhanced) */}
      <div className="mt-12 max-w-5xl mx-auto px-2 md:px-6">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">Soil Testing Guide</h2>
        {/* Block 1 */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">What is the process of soil testing?</h3>
            <img 
              src={s1} 
              alt="Soil testing process illustration"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-gray-700 leading-relaxed text-base">
              Soil testing is a scientific process that analyzes the physical and chemical properties of soil. 
              It involves collecting soil samples from different parts of your field, sending them to a laboratory, 
              and receiving detailed reports about nutrient levels, pH balance, and other important factors that 
              affect crop growth.
            </p>
          </div>
        </div>
        {/* Block 2 */}
        <div className="flex flex-col md:flex-row-reverse items-start gap-6 mb-8">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-3 text-green-400">Why should farmers get their soil tested?</h3>
            <img 
              src={s2} 
              alt="Benefits of soil testing for farmers"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-gray-700 leading-relaxed text-base">
              Regular soil testing helps farmers make informed decisions about fertilizer application, 
              crop selection, and soil management practices. It can significantly improve crop yields, 
              reduce input costs, and prevent environmental damage from over-fertilization.
            </p>
          </div>
        </div>
        {/* Block 3 */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-3 text-yellow-400">Types of soil testing available</h3>
            <img 
              src={s3} 
              alt="Types of soil testing"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-gray-700 leading-relaxed text-base">
              There are several types of soil tests available, including basic nutrient analysis, 
              complete soil analysis, organic matter testing, and specialized tests for specific 
              elements. Each type provides different insights into soil health and fertility.
            </p>
          </div>
        </div>
        {/* Block 4 */}
        <div className="flex flex-col md:flex-row-reverse items-start gap-6 mb-8">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">How to test soil quality by yourself?</h3>
            <img 
              src={s4} 
              alt="DIY soil testing guide"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-gray-700 leading-relaxed text-base">
              While professional testing is recommended, you can perform basic soil tests at home 
              using simple kits. These tests can measure pH levels, basic nutrient content, and 
              soil texture. However, for comprehensive analysis, it's best to use professional 
              laboratory services.
            </p>
          </div>
        </div>
      </div>
      {/* New Soil Testing Request Form */}
      <div className="flex justify-center items-center mt-12 mb-16">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 border border-green-100">
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Request Soil Testing</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading profile...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Farmer Name</label>
                  <input type="text" value={profile.name} readOnly className="w-full bg-gray-100 rounded-lg px-4 py-2 text-gray-700 cursor-not-allowed" />
            </div>
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="text" value={profile.phone} readOnly className="w-full bg-gray-100 rounded-lg px-4 py-2 text-gray-700 cursor-not-allowed" />
            </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={profile.address} readOnly className="w-full bg-gray-100 rounded-lg px-4 py-2 text-gray-700 cursor-not-allowed" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Land Size</label>
                  <div className="flex gap-2 items-center">
                    <input type="number" name="landSize" value={formData.landSize} onChange={handleChange} className="w-full bg-green-50 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-green-400" placeholder="e.g. 2.5" min="0" step="0.01" required />
                    <select name="landUnit" value={formData.landUnit} onChange={handleChange} className="bg-green-50 rounded-lg px-2 py-2 text-gray-700 border border-green-200 focus:ring-2 focus:ring-green-400">
                      <option value="hectare">Hectare</option>
                      <option value="acre">Acre</option>
                      <option value="gaz">Gaz</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current/Latest Crop Grown</label>
                  <input type="text" name="crop" value={formData.crop} onChange={handleChange} className="w-full bg-green-50 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-green-400" placeholder="e.g. Rice, Wheat" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time (From Date)</label>
                  <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} className="w-full bg-green-50 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-green-400" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time (To Date)</label>
                  <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} className="w-full bg-green-50 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-green-400" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Additional Info</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-green-50 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-green-400" placeholder="Describe any specific requirements or concerns" />
            </div>
              {success && <div className="text-green-600 text-center font-medium">Request submitted successfully!</div>}
              {error && <div className="text-red-600 text-center font-medium">{error}</div>}
              <button type="submit" className="w-full bg-green-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-green-700 transition-colors text-lg">Submit Request</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilTesting;
