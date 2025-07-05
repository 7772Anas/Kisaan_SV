import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Calculator, 
  Cloud, 
  Wrench, 
  ShoppingCart, 
  TestTube, 
  Truck, 
  DollarSign, 
  UserCheck, 
  ArrowRight,
  Leaf,
  Sprout,
  Zap,
  Star
} from 'lucide-react';
import p11box1 from '../ks-images/p11box1.jpg';
import p11box2 from '../ks-images/p11box2.jpg';
import p11box3 from '../ks-images/p11box3.jpg';
import p1box4 from '../ks-images/p1box4.jpg';
import p1box5 from '../ks-images/p1box5.jpg';
import p1box6 from '../ks-images/p1box6.jpg';
// import p1box7 from '../ks-images/p1box7.jpg';
// import p22b1 from '../ks-images/p22b1.jpg';
import p22b2 from '../ks-images/p22b2.jpg';
//import p22b3 from '../ks-images/p22b3.jpg';
// import p22b4 from '../ks-images/p22b4.jpg';
import p22b5 from '../ks-images/p22b5.jpg';
// import p22b6 from '../ks-images/p22b6.jpg';
import p22b7 from '../ks-images/p22b7.jpg';

const Explore = () => {
  const [activePhase, setActivePhase] = useState('phase1');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCardClick = (link) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Navigate to the route
    navigate(link);
  };

  const phase1Boxes = [
    {
      id: 1,
      title: "Local Market Prices",
      description: "A Step Towards Knowing Your Market",
      link: "/explore/market-hub",
      image: p11box1,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-kisaan-green to-kisaan-green-dark",
      gradient: "from-kisaan-green/20 to-kisaan-green-dark/20"
    },
    {
      id: 2,
      title: "Calculate Budget",
      description: "A Formulated Dashboard for your Personal Profit",
      link: "/finance",
      image: p11box2,
      icon: <Calculator className="w-6 h-6" />,
      color: "from-kisaan-yellow to-kisaan-yellow-dark",
      gradient: "from-kisaan-yellow/20 to-kisaan-yellow-dark/20"
    },
    {
      id: 3,
      title: "Weather Uncertainty",
      description: "Real-time weather forecasts and climate insights",
      link: "/climateconnect",
      image: p11box3,
      icon: <Cloud className="w-6 h-6" />,
      color: "from-kisaan-green-light to-kisaan-green",
      gradient: "from-kisaan-green-light/20 to-kisaan-green/20"
    },
    {
      id: 4,
      title: "Farming Services",
      description: "Services, Workpersons, Labour Works- all Here.",
      link: "/planning",
      image: p1box4,
      icon: <Wrench className="w-6 h-6" />,
      color: "from-kisaan-green-dark to-kisaan-green-darkest",
      gradient: "from-kisaan-green-dark/20 to-kisaan-green-darkest/20"
    },
    {
      id: 5,
      title: "Agro Purchase",
      description: "Top agro-shopping websites for tools, pesticides, fertilizers, and more.",
      link: "/agrobazar",
      image: p1box5,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "from-kisaan-yellow-light to-kisaan-yellow",
      gradient: "from-kisaan-yellow-light/20 to-kisaan-yellow/20"
    },
    {
      id: 6,
      title: "Need A Soil Test?",
      description: "Professional soil testing and analysis services",
      link: "/soiltesting",
      image: p1box6,
      icon: <TestTube className="w-6 h-6" />,
      color: "from-kisaan-green to-kisaan-yellow",
      gradient: "from-kisaan-green/20 to-kisaan-yellow/20"
    },
   
  ];

  const phase2Boxes = [
    {
      id: 1,
      title: "Direct To Selling",
      description: "D2S: Connect with your Buyers, Exporters",
      link: "/direct-to-selling",
      image: p22b2,
      icon: <Truck className="w-6 h-6" />,
      color: "from-kisaan-green to-kisaan-green-dark",
      gradient: "from-kisaan-green/20 to-kisaan-green-dark/20"
    },
    {
      id: 5,
      title: "Need Financial Support?",
      description: "Loans, Offers, Access to Governament Schemes, and many more",
      link: "/finance",
      image: p22b5,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-kisaan-yellow to-kisaan-yellow-dark",
      gradient: "from-kisaan-yellow/20 to-kisaan-yellow-dark/20"
    },
    {
      id: 7,
      title: "Access to Agro-Experts",
      description: "We at KisaanSuvidha provide 1:1 Support for any Queries",
      link: "/agroexpert",
      image: p22b7,
      icon: <UserCheck className="w-6 h-6" />,
      color: "from-kisaan-green-dark to-kisaan-green-darkest",
      gradient: "from-kisaan-green-dark/20 to-kisaan-green-darkest/20"
    }
  ];

  const ServiceCard = ({ box, index, phase }) => (
    <button
      onClick={() => handleCardClick(box.link)}
      className={`group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-xl border border-kisaan-green/20 hover:border-kisaan-green/40 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-kisaan-green/20 animate-fadeInUp w-full text-left`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-kisaan-green/5 to-kisaan-yellow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-4 h-full flex flex-col">
        {/* Header with Icon */}
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${box.color} shadow-lg`}>
            {box.icon}
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-kisaan-green group-hover:translate-x-1 transition-all duration-300" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-kisaan-green-dark transition-all duration-300">
            {box.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            {box.description}
          </p>
        </div>

        {/* Image */}
        <div className="mt-3 relative">
          <div className="w-full h-24 rounded-lg overflow-hidden">
            <img 
              src={box.image} 
              alt={box.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-kisaan-green-lightest to-gray-100 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-kisaan-green/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-kisaan-yellow/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-kisaan-green/5 to-kisaan-yellow/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Main Heading */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
            Kisaan Suvidha Presents
            <span className="block bg-gradient-to-r from-kisaan-green to-kisaan-yellow bg-clip-text text-transparent">
              Agricultural Services
            </span>
          </h1>
        </div>

        {/* Hero Section */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-kisaan-green/20 to-kisaan-yellow/20 backdrop-blur-sm rounded-full px-6 py-2 mb-4 border border-kisaan-green/20">
            <Leaf className="w-5 h-5 text-kisaan-green" />
            <span className="text-kisaan-green-dark font-medium">Explore Our Services</span>
            <Sprout className="w-5 h-5 text-kisaan-yellow" />
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            From pre-farming planning to post-harvest success, explore comprehensive tools and services designed to empower your agricultural journey.
          </p>
        </div>

        {/* Phase Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-kisaan-green/20 shadow-lg">
            <button
              onClick={() => setActivePhase('phase1')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activePhase === 'phase1'
                  ? 'bg-gradient-to-r from-kisaan-green to-kisaan-yellow text-white shadow-lg'
                  : 'text-gray-600 hover:text-kisaan-green-dark'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5" />
                Pre-Farming
              </div>
            </button>
            <button
              onClick={() => setActivePhase('phase2')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activePhase === 'phase2'
                  ? 'bg-gradient-to-r from-kisaan-green to-kisaan-yellow text-white shadow-lg'
                  : 'text-gray-600 hover:text-kisaan-green-dark'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Post-Farming
              </div>
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {activePhase === 'phase1' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phase1Boxes.map((box, index) => (
                <ServiceCard key={box.id} box={box} index={index} phase="phase1" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phase2Boxes.map((box, index) => (
                <ServiceCard key={box.id} box={box} index={index} phase="phase2" />
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-kisaan-green/20 to-kisaan-yellow/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-kisaan-green/20 shadow-lg">
            <Star className="w-6 h-6 text-kisaan-yellow animate-pulse" />
            <span className="text-kisaan-green-dark font-medium">Ready to transform your farming experience?</span>
            <Star className="w-6 h-6 text-kisaan-green animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Explore; 