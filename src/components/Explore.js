import React from 'react';
import { Link } from 'react-router-dom';
import p11box1 from '../ks-images/p11box1.jpg';
import p11box2 from '../ks-images/p11box2.jpg';
import p11box3 from '../ks-images/p11box3.jpg';
import p1box4 from '../ks-images/p1box4.jpg';
import p1box5 from '../ks-images/p1box5.jpg';
import p1box6 from '../ks-images/p1box6.jpg';
// import p1box7 from '../ks-images/p1box7.jpg';
// import p22b1 from '../ks-images/p22b1.jpg';
import p22b2 from '../ks-images/p22b2.jpg';
import p22b3 from '../ks-images/p22b3.jpg';
// import p22b4 from '../ks-images/p22b4.jpg';
import p22b5 from '../ks-images/p22b5.jpg';
// import p22b6 from '../ks-images/p22b6.jpg';
import p22b7 from '../ks-images/p22b7.jpg';

const Explore = () => {
  const phase1Boxes = [
    {
      id: 1,
      title: "Local Market Prices",
      description: "A Step Towards Knowing Your Market",
      link: "/explore/market-hub",
      image: p11box1,
      
    },
    {
      id: 2,
      title: "Calculate Budget",
      description: "A Formulated Dashboard for your Personal Profit",
      link: "/finance",
      image: p11box2,
      
    },
    {
      id: 3,
      title: "Weather Uncertainty",
      description: "Real-time weather forecasts and climate insights",
      link: "/climateconnect",
      image: p11box3,
      
    },
    {
      id: 4,
      title: "Farming Services",
      description: "Services, Workpersons, Labour Works- all Here.",
      link: "/planning",
      image: p1box4,
      
    },
    {
      id: 5,
      title: "Agro Purchase",
      description: "Top agro-shopping websites for tools, pesticides, fertilizers, and more.",
      link: "/agrobazar",
      image: p1box5,
      
    },
    {
      id: 6,
      title: "Need A Soil Test?",
      description: "Professional soil testing and analysis services",
      link: "/soiltesting",
      image: p1box6,
      
    },
   
  ];

  const phase2Boxes = [
   
    {
      id: 2,
      title: "Direct To Selling",
      description: "D2S: Connect with your Buyers, Exporters",
      link: "/storage-solutions",
      image: p22b2,
     
    },
    {
      id: 3,
      title: "Cold Storage and Transportation Services",
      description: "Logistics and transport services for your produce....",
      link: "/transportation",
      image: p22b3,
      
    },
    
    {
      id: 5,
      title: "Need Financial Support?",
      description: "Loans, Offers, Access to Governament Schemes, and many more",
      link: "/finance",
      image: p22b5,
      
    },
   
    {
      id: 7,
      title: "Access to Agro-Experts",
      description: "We at KisaanSuvidha provide 1:1 Support for any Queries",
      link: "/agroexpert",
      image: p22b7,
      
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Explore Our Services</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Phase 1: Pre-Farming */}
          <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-3xl font-semibold text-white mb-6 text-center">Phase 1: Pre-Farming</h2>
            <div className="grid grid-cols-1 gap-6">
              {phase1Boxes.map((box, index) => (
                <Link
                  key={box.id}
                  to={box.link}
                  className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`relative ${index % 2 === 0 ? 'h-56' : 'h-48'} p-6`}>
                    <div className={`absolute ${index % 2 === 0 ? 'w-56 h-56' : 'w-48 h-48'} ${index % 2 === 0 ? 'right-0' : 'left-0'} ${index % 2 === 0 ? 'rounded-l-[100px]' : 'rounded-r-[100px]'} overflow-hidden`}>
                      <img 
                        src={box.image} 
                        alt={box.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`${index % 2 === 0 ? 'mr-56' : 'ml-48'} h-full flex flex-col justify-center`}>
                      <h3 className="text-xl font-semibold text-white mb-2">{box.title}</h3>
                      <p className="text-gray-300">{box.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Phase 2: Post-Farming */}
          <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-3xl font-semibold text-white mb-6 text-center">Phase 2: Post-Farming</h2>
            <div className="grid grid-cols-1 gap-6">
              {phase2Boxes.map((box, index) => (
                <Link
                  key={box.id}
                  to={box.link}
                  className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`relative ${index % 2 === 0 ? 'h-56' : 'h-48'} p-6`}>
                    <div className={`absolute ${index % 2 === 0 ? 'w-56 h-56' : 'w-48 h-48'} ${index % 2 === 0 ? 'right-0' : 'left-0'} ${index % 2 === 0 ? 'rounded-l-[100px]' : 'rounded-r-[100px]'} overflow-hidden`}>
                      <img 
                        src={box.image} 
                        alt={box.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`${index % 2 === 0 ? 'mr-56' : 'ml-48'} h-full flex flex-col justify-center`}>
                      <h3 className="text-xl font-semibold text-white mb-2">{box.title}</h3>
                      <p className="text-gray-300">{box.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore; 