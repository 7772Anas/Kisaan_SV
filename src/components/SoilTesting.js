import React from 'react';
import s1 from '../ks-images/s1.jpg';
import s2 from '../ks-images/s2.jpg';
import s3 from '../ks-images/s3.jpg';
import s4 from '../ks-images/s4.jpg';

const SoilTesting = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 pt-16">
      {/* Soil Testing Information Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">Soil Testing Guide</h2>
        {/* Block 1 */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">What is the process of soil testing?</h3>
            <img 
              src={s1} 
              alt="Soil testing process illustration"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-gray-300 leading-relaxed text-base">
              Soil testing is a scientific process that analyzes the physical and chemical properties of soil. 
              It involves collecting soil samples from different parts of your field, sending them to a laboratory, 
              and receiving detailed reports about nutrient levels, pH balance, and other important factors that 
              affect crop growth.
            </p>
          </div>
        </div>
        {/* Block 2 */}
        <div className="flex flex-col md:flex-row-reverse items-start gap-6 mb-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-3 text-green-400">Why should farmers get their soil tested?</h3>
            <img 
              src={s2} 
              alt="Benefits of soil testing for farmers"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-gray-300 leading-relaxed text-base">
              Regular soil testing helps farmers make informed decisions about fertilizer application, 
              crop selection, and soil management practices. It can significantly improve crop yields, 
              reduce input costs, and prevent environmental damage from over-fertilization.
            </p>
          </div>
        </div>
        {/* Block 3 */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-3 text-yellow-400">Types of soil testing available</h3>
            <img 
              src={s3} 
              alt="Types of soil testing"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-gray-300 leading-relaxed text-base">
              There are several types of soil tests available, including basic nutrient analysis, 
              complete soil analysis, organic matter testing, and specialized tests for specific 
              elements. Each type provides different insights into soil health and fertility.
            </p>
          </div>
        </div>
        {/* Block 4 */}
        <div className="flex flex-col md:flex-row-reverse items-start gap-6 mb-8 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">How to test soil quality by yourself?</h3>
            <img 
              src={s4} 
              alt="DIY soil testing guide"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-2/3">
            <p className="text-gray-300 leading-relaxed text-base">
              While professional testing is recommended, you can perform basic soil tests at home 
              using simple kits. These tests can measure pH levels, basic nutrient content, and 
              soil texture. However, for comprehensive analysis, it's best to use professional 
              laboratory services.
            </p>
          </div>
        </div>
      </div>
      {/* Soil Testing Appointment Dashboard */}
      <div className="mt-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">Book Your Soil Test</h2>
        {/* Book New Appointment Section */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">Book New Appointment</h3>
          <form className="space-y-6">
            {/* Location Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location/Pincode</label>
              <input
                type="text"
                placeholder="Enter your location or pincode"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Testing Center Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nearest Testing Center</label>
              <select className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a testing center</option>
                <option value="center1">Hyderabad Soil Testing Lab - Gachibowli</option>
                <option value="center2">Agricultural Research Center - Secunderabad</option>
                <option value="center3">Soil Analysis Lab - Madhapur</option>
                <option value="center4">Farmers Soil Testing Center - Uppal</option>
                <option value="center5">Agricultural University Lab - Rajendranagar</option>
              </select>
            </div>
            {/* Date & Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                <input
                  type="time"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* Crop Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Crop Type</label>
              <select className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select crop type</option>
                <option value="rice">Rice</option>
                <option value="wheat">Wheat</option>
                <option value="cotton">Cotton</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* Notes Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Additional Notes</label>
              <textarea
                placeholder="Any specific requirements or notes"
                rows="3"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Field Image (Optional)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-400">
                    <label className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
            >
              Book Appointment
            </button>
          </form>
        </div>
        {/* My Appointments Section */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6">My Appointments</h3>
          <div className="space-y-4">
            {/* Sample Appointment Cards */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium">Hyderabad Soil Testing Lab - Gachibowli</h4>
                  <p className="text-sm text-gray-400">March 15, 2024 - 10:00 AM</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">
                    Pending
                  </span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Reschedule
                  </button>
                  <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium">Agricultural Research Center - Secunderabad</h4>
                  <p className="text-sm text-gray-400">March 10, 2024 - 2:30 PM</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                    Completed
                  </span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Download Report
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium">Soil Analysis Lab - Madhapur</h4>
                  <p className="text-sm text-gray-400">March 20, 2024 - 11:00 AM</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
                    Confirmed
                  </span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Reschedule
                  </button>
                  <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilTesting;
