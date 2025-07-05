import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
//import mh1 from '../ks-images/mh2.jpg';
//import mh2 from '../ks-images/mh1.jpg';
import { 
  TrendingUp, 
  Search, 
  BarChart3, 
  PieChart, 
  Activity, 
  Calendar,
  MapPin,
  Package,
  DollarSign,
  ArrowRight,
  RefreshCw,
  Eye,
  EyeOff,
 
  Filter,
  Info
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function MarketHub() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [selectedType, setSelectedType] = useState('Price');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/marchdata1.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch CSV data: ${response.status} ${response.statusText}`);
        }
        
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const parsedData = results.data.filter(item => 
              item.CommName && item.AmcName && item.YardName && item.DDate
            );
            
            setData(parsedData);
            
            // Extract unique values and sort them
            const uniqueCommodities = [...new Set(parsedData.map(item => item.CommName))].sort();
            const uniqueDistricts = [...new Set(parsedData.map(item => item.AmcName))].sort();
            const uniqueMarkets = [...new Set(parsedData.map(item => item.YardName))].sort();
            
            setCommodities(uniqueCommodities);
            setDistricts(uniqueDistricts);
            setMarkets(uniqueMarkets);
            
            setIsLoading(false);
          },
          error: (error) => {
            setError('Error parsing CSV data: ' + error.message);
            setIsLoading(false);
          }
        });
      } catch (error) {
        setError('Error loading CSV data: ' + error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    let filtered = data.filter(item => {
      const itemDate = new Date(item.DDate);
      return (
        (!selectedCommodity || item.CommName === selectedCommodity) &&
        (!selectedDistrict || item.AmcName === selectedDistrict) &&
        (!selectedMarket || item.YardName === selectedMarket) &&
        (!fromDate || itemDate >= new Date(fromDate)) &&
        (!toDate || itemDate <= new Date(toDate))
      );
    });
    setFilteredData(filtered);
  };

  const analyzeDemandSupply = (data) => {
    if (!data.length) return { text: '', emoji: '' };

    const avgArrival = data.reduce((sum, item) => sum + parseFloat(item.Arrivals), 0) / data.length;
    const avgPrice = data.reduce((sum, item) => sum + parseFloat(item.Model), 0) / data.length;

    const latestArrival = parseFloat(data[data.length - 1].Arrivals);
    const latestPrice = parseFloat(data[data.length - 1].Model);

    if (latestArrival > avgArrival * 1.3 && latestPrice < avgPrice) {
      return {
        text: "Supply is high, but prices are low — indicating weak market demand for this commodity.",
        emoji: "🟠"
      };
    } else if (latestArrival < avgArrival * 0.7 && latestPrice > avgPrice) {
      return {
        text: "Supply is low, and prices are high — suggesting strong market demand and potential profit.",
        emoji: "🟢"
      };
    } else {
      return {
        text: "Market conditions are balanced. Supply and demand seem stable for this commodity.",
        emoji: "⚪"
      };
    }
  };

  const analyzePriceTrend = (data) => {
    if (!data.length) return { text: '', emoji: '' };

    const prices = data.map(item => parseFloat(item.Model));
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;

    // Calculate trend consistency
    const priceChanges = prices.slice(1).map((price, i) => price - prices[i]);
    const isConsistent = priceChanges.every(change => Math.sign(change) === Math.sign(priceChanges[0]));

    if (priceChange > 5 && isConsistent) {
      return {
        text: "Prices are steadily increasing — possibly due to demand growth or limited arrivals.",
        emoji: "🟢"
      };
    } else if (priceChange < -5 && isConsistent) {
      return {
        text: "Prices are declining — could be due to oversupply or reduced market demand.",
        emoji: "🔴"
      };
    } else {
      return {
        text: "Prices are fluctuating — indicating market instability or varying demand-supply conditions.",
        emoji: "🟡"
      };
    }
  };

  const analyzePriceDistribution = (data) => {
    if (!data.length) return { text: '', emoji: '' };

    const prices = data.map(item => ({
      modal: parseFloat(item.Model),
      min: parseFloat(item.Minimum),
      max: parseFloat(item.Maximum)
    }));

    const modalCount = prices.filter(p => p.modal === Math.max(...prices.map(p => p.modal))).length;
    const modalPercentage = (modalCount / prices.length) * 100;

    const hasHighOutliers = prices.some(p => p.max > p.modal * 1.5);

    if (modalPercentage > 60) {
      return {
        text: "Most trades are happening at the modal price — market is stable.",
        emoji: "🟢"
      };
    } else if (hasHighOutliers) {
      return {
        text: "There are high price outliers — possibly due to premium quality or sudden demand spikes.",
        emoji: "🔴"
      };
    } else {
      return {
        text: "Price distribution is spread out — indicating negotiation or variable quality.",
        emoji: "🟡"
      };
    }
  };

  const prepareChartData = () => {
    if (!filteredData.length) return null;

    // Sort data by date
    const sortedData = [...filteredData].sort((a, b) => new Date(a.DDate) - new Date(b.DDate));

    // Prepare data for Demand vs Supply chart
    const demandVsSupplyData = {
      labels: sortedData.map(item => new Date(item.DDate).toLocaleDateString()),
      datasets: [
        {
          label: 'Arrivals (Supply)',
          data: sortedData.map(item => parseFloat(item.Arrivals)),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Modal Price (Demand)',
          data: sortedData.map(item => parseFloat(item.Model)),
          borderColor: '#eab308',
          backgroundColor: 'rgba(234, 179, 8, 0.5)',
          yAxisID: 'y1',
        },
      ],
    };

    // Prepare data for Arrival vs Modal Price trend
    const arrivalVsPriceData = {
      labels: sortedData.map(item => new Date(item.DDate).toLocaleDateString()),
      datasets: [
        {
          label: 'Arrivals',
          data: sortedData.map(item => parseFloat(item.Arrivals)),
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
        },
        {
          label: 'Modal Price',
          data: sortedData.map(item => parseFloat(item.Model)),
          borderColor: '#eab308',
          backgroundColor: 'rgba(234, 179, 8, 0.5)',
        },
      ],
    };

    // Prepare data for Price Distribution pie chart
    const priceRanges = {
      'Low (< 1000)': 0,
      'Medium (1000-5000)': 0,
      'High (> 5000)': 0,
    };

    sortedData.forEach(item => {
      const price = parseFloat(item.Model);
      if (price < 1000) priceRanges['Low (< 1000)']++;
      else if (price <= 5000) priceRanges['Medium (1000-5000)']++;
      else priceRanges['High (> 5000)']++;
    });

    const priceDistributionData = {
      labels: Object.keys(priceRanges),
      datasets: [
        {
          data: Object.values(priceRanges),
          backgroundColor: [
            'rgba(34, 197, 94, 0.6)',
            'rgba(234, 179, 8, 0.6)',
            'rgba(239, 68, 68, 0.6)',
          ],
          borderColor: [
            '#22c55e',
            '#eab308',
            '#ef4444',
          ],
          borderWidth: 2,
        },
      ],
    };

    return {
      demandVsSupplyData,
      arrivalVsPriceData,
      priceDistributionData,
      analysis: {
        demandSupply: analyzeDemandSupply(sortedData),
        priceTrend: analyzePriceTrend(sortedData),
        priceDistribution: analyzePriceDistribution(sortedData)
      }
    };
  };

  const handleChartClick = (chartRef) => {
    if (chartRef.current) {
      // Reset the chart's animation
      chartRef.current.reset();
      // Force a re-render of the chart
      setAnimationKey(prev => prev + 1);
    }
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Market Analysis',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#374151'
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      onComplete: function() {
        // Enable click interaction after animation completes
        if (this.chart) {
          this.chart.options.onClick = () => handleChartClick(barChartRef);
        }
      }
    },
    onClick: () => handleChartClick(barChartRef),
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Arrivals',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Price',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    animation: {
      ...chartOptions.animation,
      onComplete: function() {
        if (this.chart) {
          this.chart.options.onClick = () => handleChartClick(lineChartRef);
        }
      }
    },
    onClick: () => handleChartClick(lineChartRef),
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Price Distribution',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#374151'
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      onComplete: function() {
        if (this.chart) {
          this.chart.options.onClick = () => handleChartClick(pieChartRef);
        }
      }
    },
    onClick: () => handleChartClick(pieChartRef),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-kisaan-green-lightest to-gray-100 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-kisaan-green/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-kisaan-yellow/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-kisaan-green/5 to-kisaan-yellow/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-kisaan-green/20 to-kisaan-yellow/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-kisaan-green/20">
            <TrendingUp className="w-5 h-5 text-kisaan-green" />
            <span className="text-kisaan-green-dark font-medium">Market Intelligence</span>
            <BarChart3 className="w-5 h-5 text-kisaan-yellow" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Know Your Local
            <span className="block bg-gradient-to-r from-kisaan-green to-kisaan-yellow bg-clip-text text-transparent">
              Mandi Prices
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Access real-time market data and make informed decisions for your agricultural produce. 
            Stay updated with the latest market trends and maximize your profits.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-kisaan-green/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-kisaan-green to-kisaan-green-dark rounded-xl mb-4 mx-auto">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{commodities.length}</h3>
              <p className="text-gray-600">Commodities</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-kisaan-green/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-kisaan-yellow to-kisaan-yellow-dark rounded-xl mb-4 mx-auto">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{districts.length}</h3>
              <p className="text-gray-600">Districts</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-kisaan-green/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-kisaan-green to-kisaan-yellow rounded-xl mb-4 mx-auto">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{markets.length}</h3>
              <p className="text-gray-600">Markets</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className={`bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-kisaan-green/20 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-kisaan-green to-kisaan-green-dark rounded-xl">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Search Market Data</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Data Type
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-kisaan-green focus:border-kisaan-green transition-all duration-300 bg-white/80 backdrop-blur-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="Price">Price</option>
                <option value="Arrival">Arrival</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Commodity
              </label>
              <select 
                className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-kisaan-green focus:border-kisaan-green transition-all duration-300 bg-white/80 backdrop-blur-sm ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                disabled={isLoading}
              >
                <option value="">All Commodities</option>
                {commodities.map(commodity => (
                  <option key={commodity} value={commodity}>{commodity}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                District
              </label>
              <select 
                className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-kisaan-green focus:border-kisaan-green transition-all duration-300 bg-white/80 backdrop-blur-sm ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={isLoading}
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Market
              </label>
              <select 
                className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-kisaan-green focus:border-kisaan-green transition-all duration-300 bg-white/80 backdrop-blur-sm ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                disabled={isLoading}
              >
                <option value="">All Markets</option>
                {markets.map(market => (
                  <option key={market} value={market}>{market}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-kisaan-green focus:border-kisaan-green transition-all duration-300 bg-white/80 backdrop-blur-sm ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={isLoading}
                max={toDate || undefined}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-kisaan-green focus:border-kisaan-green transition-all duration-300 bg-white/80 backdrop-blur-sm ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={isLoading}
                min={fromDate || undefined}
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
              <Info className="w-5 h-5" />
              {error}
            </div>
          )}

          <button 
            onClick={handleSearch}
            className={`group bg-gradient-to-r from-kisaan-green to-kisaan-green-dark text-white px-8 py-4 rounded-xl hover:from-kisaan-green-dark hover:to-kisaan-green-darkest transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 mx-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search Data
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {filteredData.length > 0 ? (
          <div className={`bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-kisaan-green/20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-kisaan-green to-kisaan-green-dark rounded-xl">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Search Results</h3>
              </div>
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                {filteredData.length} records found
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-kisaan-green/10 to-kisaan-yellow/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Commodity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Market</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Arrivals/qui</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Min Price/qui</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Max Price/qui</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Modal Price/qui</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gradient-to-r hover:from-kisaan-green/5 hover:to-kisaan-yellow/5 transition-all duration-300">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.DDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.CommName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.YardName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Arrivals}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Minimum}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Maximum}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-kisaan-green-dark">{item.Model}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className={`group bg-gradient-to-r from-kisaan-yellow to-kisaan-yellow-dark text-white px-8 py-3 rounded-xl hover:from-kisaan-yellow-dark hover:to-kisaan-yellow-darkest transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2`}
              >
                {showAnalysis ? (
                  <>
                    <EyeOff className="w-5 h-5" />
                    Hide Analysis
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    Show Analysis
                  </>
                )}
              </button>
            </div>

            {showAnalysis && (
              <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-kisaan-green/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-kisaan-green to-kisaan-green-dark rounded-lg">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Demand vs Supply Analysis</h4>
                  </div>
                  <div 
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    title="Click to replay animation"
                  >
                    <Bar 
                      ref={barChartRef}
                      key={`bar-${animationKey}`}
                      data={prepareChartData()?.demandVsSupplyData} 
                      options={chartOptions} 
                    />
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-kisaan-green/10 to-kisaan-yellow/10 rounded-xl border border-kisaan-green/20">
                    <p className="text-gray-700 flex items-start gap-3">
                      <span className="text-2xl">{prepareChartData()?.analysis.demandSupply.emoji}</span>
                      <span>{prepareChartData()?.analysis.demandSupply.text}</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-kisaan-green/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-kisaan-yellow to-kisaan-yellow-dark rounded-lg">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Arrival vs Price Trend</h4>
                  </div>
                  <div 
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    title="Click to replay animation"
                  >
                    <Line 
                      ref={lineChartRef}
                      key={`line-${animationKey}`}
                      data={prepareChartData()?.arrivalVsPriceData} 
                      options={lineChartOptions} 
                    />
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-kisaan-green/10 to-kisaan-yellow/10 rounded-xl border border-kisaan-green/20">
                    <p className="text-gray-700 flex items-start gap-3">
                      <span className="text-2xl">{prepareChartData()?.analysis.priceTrend.emoji}</span>
                      <span>{prepareChartData()?.analysis.priceTrend.text}</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-kisaan-green/20 lg:col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-kisaan-green to-kisaan-yellow rounded-lg">
                      <PieChart className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Price Distribution</h4>
                  </div>
                  <div className="max-w-md mx-auto">
                    <div 
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                      title="Click to replay animation"
                    >
                      <Pie 
                        ref={pieChartRef}
                        key={`pie-${animationKey}`}
                        data={prepareChartData()?.priceDistributionData} 
                        options={pieOptions} 
                      />
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-kisaan-green/10 to-kisaan-yellow/10 rounded-xl border border-kisaan-green/20">
                    <p className="text-gray-700 flex items-start gap-3">
                      <span className="text-2xl">{prepareChartData()?.analysis.priceDistribution.emoji}</span>
                      <span>{prepareChartData()?.analysis.priceDistribution.text}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={`text-center py-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-kisaan-green/20 shadow-lg">
              {isLoading ? (
                <div className="flex items-center justify-center gap-3 text-gray-600">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span className="text-lg">Loading market data...</span>
                </div>
              ) : (
                <div className="text-gray-600">
                  <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">No data found for the selected criteria.</p>
                  <p className="text-sm mt-2">Try adjusting your search filters.</p>
                </div>
              )}
            </div>
          </div>
        )}
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
}

export default MarketHub; 