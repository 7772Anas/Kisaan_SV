import React from 'react';
import video from '../ks-images/video.mp4';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="relative h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          className="absolute min-w-full min-h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src={video}
            type="video/mp4"
          />
        </video>
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-kisaan-green-darkest/30 to-kisaan-yellow-darkest/30"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center bg-gradient-yellow-green bg-clip-text text-transparent drop-shadow-lg">
          Kisaan Suvidha
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-center text-white drop-shadow-lg">
          From Soil to Sales, connecting everything throughout the country
        </p>
        <button
          className="bg-gradient-green-yellow hover:bg-gradient-yellow-green text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
          onClick={() => navigate('/explore')}
        >
          Explore Features
        </button>
      </div>
    </div>
  );
};

export default Hero; 