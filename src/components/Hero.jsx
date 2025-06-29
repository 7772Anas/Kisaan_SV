import React from "react";

export default function Hero() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600"
            alt="Farm landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Empowering Farmers, <br />
              Enriching Agriculture
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Your trusted partner in agricultural solutions, providing comprehensive support to farmers across India.
            </p>
            <button
              className="bg-kisaan-yellow hover:bg-kisaan-yellow-light text-black font-bold py-3 px-8 rounded-full transition-colors duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 