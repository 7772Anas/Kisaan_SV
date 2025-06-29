import React from 'react';
import img1 from '../ks-images/img1.jpg';
import img2 from '../ks-images/img2.jpg';
import img3 from '../ks-images/img3.jpg';

const Features = () => {
  const features = [
    {
      image: img1,
      title: "Smart Farming",
      description: "Advanced technology for precision agriculture and crop monitoring"
    },
    {
      image: img2,
      title: "Digital Solutions",
      description: "Modern tools for efficient farm management and resource optimization"
    },
    {
      image: img3,
      title: "Community Connect",
      description: "Building a strong network of farmers and agricultural experts"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-kisaan-green-lightest to-kisaan-yellow-lightest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-kisaan-green-darkest mb-12">
          Modern Agriculture Solutions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 border border-kisaan-green-light"
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gradient-to-br from-white to-kisaan-green-lightest">
                <h3 className="text-xl font-semibold text-kisaan-green-darkest mb-2">
                  {feature.title}
                </h3>
                <p className="text-kisaan-green-dark">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 