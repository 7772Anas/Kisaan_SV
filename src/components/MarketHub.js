import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import mh1 from '../ks-images/mh2.jpg';
import mh2 from '../ks-images/mh1.jpg';
import Navbar from './Navbar';
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
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

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
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          yAxisID: 'y',
        },
        {
          label: 'Modal Price (Demand)',
          data: sortedData.map(item => parseFloat(item.Model)),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Modal Price',
          data: sortedData.map(item => parseFloat(item.Model)),
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
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
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgb(75, 192, 192)',
            'rgb(255, 206, 86)',
            'rgb(255, 99, 132)',
          ],
          borderWidth: 1,
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
      },
      title: {
        display: true,
        text: 'Market Analysis',
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
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Price',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
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
      },
      title: {
        display: true,
        text: 'Price Distribution',
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
    <div className="min-h-screen bg-gray-50">
      <Navbar showAuth={false} />
      
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-white">
            Know Your Local Mandi Prices
          </h1>
          <p className="text-xl text-center text-green-100 mb-12">
            Access real-time market data and make informed decisions for your agricultural produce
          </p>
          
          {/* First Image and Text Section */}
          <div className="flex flex-col md:flex-row items-start gap-8 mb-16 bg-white/10 backdrop-blur-sm p-8 rounded-lg">
            <div className="w-full md:w-1/4">
              <img 
                src={mh1}
                alt="Market Data Analysis" 
                className="w-full h-auto rounded-lg shadow-lg object-cover"
                style={{ maxHeight: '250px' }}
              />
            </div>
            <div className="w-full md:w-3/4 pl-0">
              <p className="text-base text-white leading-relaxed">
                Access comprehensive market data including arrivals and prices across various commodities. 
                Our platform provides real-time insights to help you make informed decisions about your agricultural produce.
                Stay updated with the latest market trends and make data-driven decisions for your farming business. 
                Our comprehensive database covers multiple markets and commodities across different districts.
                Understanding market requirements and real-time price trends is crucial for every farmer aiming to make informed decisions before selling their produce. Local mandis and Agricultural Produce Market Committees (APMCs) play a vital role in determining how agricultural commodities are priced and distributed across districts. However, farmers often struggle with access to timely and accurate data, resulting in poor price realization and budget mismanagement. With fluctuating demand, unpredictable arrivals, and lack of transparent pricing structures, many are forced to rely on middlemen or outdated sources. Our platform addresses this gap by offering updated market insights, commodity-wise pricing, and mandi-level data specific to Telangana — empowering farmers to plan better, negotiate confidently, and maximize their profits.
              </p>
            </div>
          </div>

          {/* Second Image and Text Section */}
          <div className="flex flex-col md:flex-row-reverse items-start gap-8 bg-white/10 backdrop-blur-sm p-8 rounded-lg">
            <div className="w-full md:w-1/4">
              <img 
                src={mh2}
                alt="Market Trends" 
                className="w-full h-auto rounded-lg shadow-lg object-cover"
                style={{ maxHeight: '250px' }}
              />
            </div>
            <div className="w-full md:w-3/4 pr-0">
              <p className="text-base text-white leading-relaxed">
                Stay updated with the latest market trends and make data-driven decisions for your farming business. 
                Our comprehensive database covers multiple markets and commodities across different districts.
                Access comprehensive market data including arrivals and prices across various commodities. 
                Our platform provides real-time insights to help you make informed decisions about your agricultural produce.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Market Data</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
              <select 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="Price">Price</option>
                <option value="Arrival">Arrival</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commodity</label>
              <select 
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <select 
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Market</label>
              <select 
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={isLoading}
                max={toDate || undefined}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={isLoading}
                min={fromDate || undefined}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <button 
            onClick={handleSearch}
            className={`w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Search Data'}
          </button>

          {/* Results Section */}
          {filteredData.length > 0 ? (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Search Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commodity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrivals/qui</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Price/qui</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Price/qui</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modal Price/qui</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.DDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.CommName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.YardName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Arrivals}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Minimum}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Maximum}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.Model}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
                </button>
              </div>

              {showAnalysis && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold mb-4">Demand vs Supply Analysis</h4>
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
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">
                        <span className="text-2xl mr-2">{prepareChartData()?.analysis.demandSupply.emoji}</span>
                        {prepareChartData()?.analysis.demandSupply.text}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold mb-4">Arrival vs Price Trend</h4>
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
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">
                        <span className="text-2xl mr-2">{prepareChartData()?.analysis.priceTrend.emoji}</span>
                        {prepareChartData()?.analysis.priceTrend.text}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                    <h4 className="text-lg font-semibold mb-4">Price Distribution</h4>
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
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">
                        <span className="text-2xl mr-2">{prepareChartData()?.analysis.priceDistribution.emoji}</span>
                        {prepareChartData()?.analysis.priceDistribution.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8 text-center text-gray-600">
              {isLoading ? 'Loading data...' : 
               filteredData.length === 0 && data.length > 0 ? 'No data found for the selected criteria.' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketHub; 