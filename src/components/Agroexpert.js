// src/components/Agroexpert.js
import React from 'react';
import p1box4 from '../ks-images/p1box4.jpg';
import { IoMdCall } from "react-icons/io";
import { CiGlobe } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa6";
import Navbar from './Navbar';

const Agroexpert = () => {
  return (
    <div className="bg-gradient-to-b from-green-100 to-green-200 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-2xl max-w-4xl w-full p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <img
              src={p1box4}
              alt="Agro Expert with Farmer"
              className="w-40 h-40 rounded-full border-4 border-green-500 object-cover"
            />

            <div>
              <h1 className="text-3xl font-bold text-green-700">1:1 Agro Expert Support</h1>
              <p className="text-gray-600 mt-1">Speak directly with agriculture experts across India</p>
            </div>
          </div>

          {/* National Helpline */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-300 mb-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2"><IoMdCall size="1.2em" className="mr-1 inline" /> Kisan Call Centre (Govt. of India)</h2>
            <p className="text-gray-700 mb-1">Toll-Free, Language-Specific Support</p>
            <p><span className="font-semibold">Hours:</span> 6 AM – 10 PM (Every Day)</p>
            <p><span className="font-semibold">Phone:</span>
              <a href="tel:18001801551" className="text-green-700 underline font-medium">1800-180-1551</a>
            </p>
            <p><span className="font-semibold">SMS Info:</span> Send <code className="bg-gray-200 px-1 py-0.5 rounded">KISAAN</code> to <a href="tel:51969" className="text-green-700 underline font-medium">51969</a></p>
          </div>

          {/* Online Platforms */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-green-800 mb-3"><CiGlobe size="1.5em" className="mr-1 inline" /> Online Platforms for Direct Expert Advice</h3>
            <ul className="space-y-3 text-gray-800">
              <li>
                🔹 <strong>DeHaat</strong> – Free 1:1 crop support via mobile
                <a href="https://agrevolution.in" target="_blank" rel="noreferrer" className="text-blue-700 underline ml-1">Visit DeHaat Website</a>
              </li>
              <li>
                🔹 <strong>AgroStar</strong> – Talk to experts through app/chat
                <a href="https://www.agrostar.in" target="_blank" rel="noreferrer" className="text-blue-700 underline ml-1">Visit AgroStar Website</a>
              </li>
              <li>
                🔹 <strong>Krishi Network</strong> – Post crop issues, get expert responses
                <a href="https://krishinetwork.com" target="_blank" rel="noreferrer" className="text-blue-700 underline ml-1">Visit Krishi Network</a>
              </li>
            </ul>
          </div>

          {/* WhatsApp Support */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-300 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2"><FaWhatsapp size="1.5em" className="mr-1 inline" /> WhatsApp Support (DeHaat)</h3>
            <p>Send a message to get personalized agro assistance:</p>
            <a href="https://wa.me/917710005555"  rel="noreferrer" target="_blank"
              className="inline-block mt-3 px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
              Chat on WhatsApp
            </a>
          </div>

          {/* State-wise Info */}
          <div className="text-sm text-gray-700">
            <p className="italic">
              Want to connect with experts in your state or district? Visit your nearest
              Krishi Vigyan Kendra (KVK) or contact the agriculture department in your area.
            </p>
          </div>

          {/* Footer CTA */}
          <div className="mt-8 text-center">
            <a href="tel:18001801551"
              className="inline-block bg-green-600 text-white px-3 py-1.5 rounded-full shadow hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm" style={{ transform: 'scale(1)', display: 'inline-flex' }}>
              <IoMdCall size="1em" className="mr-1" />
              Call National Kisan Helpline
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agroexpert;