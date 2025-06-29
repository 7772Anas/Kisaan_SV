import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import pmKisanAudio from '../ks-audios/pmkisan.mp3';
import pmKisanImage1 from '../ks-images/pmkisan11.jpg';
import pmKisanImage2 from '../ks-images/pmkisan2.jpg';
import pmfbyImage2 from '../ks-images/pmfby2.png';
import pmfbyImage3 from '../ks-images/pmfby3.jpg';
import pmfbyAudio from '../ks-audios/pmfby.mp3';
import nabardImage from '../ks-images/nabard1.jpg';
import nabardAudio from '../ks-audios/nabard.mp3';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AgriWebsitesTable = () => {
  const websites = [
    {
      sno: 1,
      government: { name: 'Agri India', url: 'https://agricoop.nic.in/' },
      state: { name: 'Rajasthan Krishi', url: 'https://krishi.rajasthan.gov.in/' },
      banking: { name: 'NABARD', url: 'https://www.nabard.org/' },
      private: { name: 'AgroStar', url: 'https://www.agrostar.in/' },
      basket: { name: 'BigHaat', url: 'https://www.bighaat.com/' },
    },
    {
      sno: 2,
      government: { name: 'PM Kisan', url: 'https://pmkisan.gov.in/' },
      state: { name: 'Mahagov', url: 'https://mahaagri.gov.in/' },
      banking: { name: 'SBI Kisan', url: 'https://www.sbi.co.in/web/agri-rural/agriculture-banking/kisan-credit-card' },
      private: { name: 'BigHaat', url: 'https://www.bighaat.com/' },
      basket: { name: 'DeHaat', url: 'https://agrevolution.in/' },
    },
    {
      sno: 3,
      government: { name: 'Fasal Bima', url: 'https://pmfby.gov.in/' },
      state: { name: 'UP Agriculture', url: 'http://upagriculture.com/' },
      banking: { name: 'ICICI Agri', url: 'https://www.icicibank.com/business-banking/agri-and-rural/agriculture' },
      private: { name: 'Gramophone', url: 'https://www.gramophone.in/' },
      basket: { name: 'AgroStar', url: 'https://www.corporate.agrostar.in/' },
    },
    {
      sno: 4,
      government: { name: 'eNAM', url: 'https://enam.gov.in/web/' },
      state: { name: 'Punjab Mandi Board', url: 'https://mandiboard.nic.in/' },
      banking: { name: 'HDFC Rural', url: 'https://www.hdfcbank.com/personal/borrow/popular-loans/kisan-gold-card' },
      private: { name: 'DeHaat', url: 'https://www.dehaat.com/' },
      basket: { name: 'Kisan Mandi', url: 'https://www.kisanmandi.com/' },
    },
    // Additional links as per user request:
    {
      sno: 5,
      government: { name: 'Agmarknet', url: 'https://agmarknet.gov.in' },
      state: { name: 'Kisan Sabha (multi-state)', url: 'https://www.kisansabha.in/' },
      banking: { name: 'HDFC Agri Loans', url: 'https://www.hdfcbank.com/agri/gov-schemes/agriculture-infrastructure-fund' },
      private: { name: 'Arya.ag', url: 'https://www.arya.ag/' },
      basket: { name: '-', url: '-' },
    },
    {
      sno: 6,
      government: { name: 'ICAR', url: 'https://icar.org.in' },
      state: { name: 'Apni Kheti (Punjab)', url: 'https://blog.apnikheti.com/' },
      banking: { name: 'MyScheme – KCC', url: 'https://www.myscheme.gov.in/schemes/kcc' },
      private: { name: 'RML AgTech', url: 'https://www.rmlagtech.com/' },
      basket: { name: '-', url: '-' },
    },
    {
      sno: 7,
      government: { name: 'Ministry of Agriculture', url: 'https://agricoop.gov.in' },
      state: { name: 'Gujarat AgriStack', url: 'https://gjfr.agristack.gov.in/' },
      banking: { name: 'Netafim NAFA', url: 'https://nafa.co.in' },
      private: { name: '-', url: '-' },
      basket: { name: '-', url: '-' },
    },
    // {/* 🔻 Add more websites manually below this row */}
  ];
  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-white rounded-xl shadow-md border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-center border-b">S.No.</th>
            <th className="py-3 px-4 text-center border-b">Government Portals</th>
            <th className="py-3 px-4 text-center border-b">State-Specific Portals</th>
            <th className="py-3 px-4 text-center border-b">Banking & Credit Links</th>
            <th className="py-3 px-4 text-center border-b">Private Platforms</th>
            <th className="py-3 px-4 text-center border-b">Agricultural Basket</th>
          </tr>
        </thead>
        <tbody>
          {websites.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="py-2 px-4 text-center border-b">{row.sno}</td>
              <td className="py-2 px-4 text-center border-b">
                {row.government.name && row.government.name !== '-' ? <a href={row.government.url} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">{row.government.name}</a> : '-'}
              </td>
              <td className="py-2 px-4 text-center border-b">
                {row.state.name && row.state.name !== '-' ? <a href={row.state.url} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">{row.state.name}</a> : '-'}
              </td>
              <td className="py-2 px-4 text-center border-b">
                {row.banking.name && row.banking.name !== '-' ? <a href={row.banking.url} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">{row.banking.name}</a> : '-'}
              </td>
              <td className="py-2 px-4 text-center border-b">
                {row.private.name && row.private.name !== '-' ? <a href={row.private.url} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">{row.private.name}</a> : '-'}
              </td>
              <td className="py-2 px-4 text-center border-b">
                {row.basket.name && row.basket.name !== '-' ? <a href={row.basket.url} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">{row.basket.name}</a> : '-'}
              </td>
            </tr>
          ))}
          {/* 🔻 Add more websites manually below this row */}
        </tbody>
      </table>
    </div>
  );
};

const Finance = () => {
  const [showResults, setShowResults] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [formData, setFormData] = useState({
    cropType: '',
    landSize: '',
    expectedYield: '',
    marketPrice: '',
    isShared: 'no',
    farmerShare: '100',
    expenses: {
      seeds: '',
      fertilizers: '',
      labor: '',
      machinery: '',
      irrigation: '',
      transport: '',
    }
  });

  // Government schemes data (for each card's mini-carousel)
  const governmentSchemes = [
    {
      id: 1,
      title: "PM-KISAN Samman Nidhi",
      description: "Central government scheme providing financial support to small and marginal farmers.",
      detailedDescription: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) is a central government scheme that provides income support of ₹6,000 per year to eligible farmer families. The amount is transferred directly to the bank accounts of farmers in three equal installments of ₹2,000 each.",
      images: [pmKisanImage1, pmKisanImage2],
      audios: [pmKisanAudio],
      link: "https://pmkisan.gov.in"
    },
    {
      id: 2,
      title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      description: "Pradhan Mantri Fasal Bima Yojana ek kendriya fasal beema yojana hai",
      detailedDescription: (
        <>
          <p>Pradhan Mantri Fasal Bima Yojana (PMFBY) ek kendriya sarkari yojana haipradan karti hai. Yojana ka uddeshya kis highlights:</p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Prakritik aapda, keet rog, ya any karan se fasal nuksan par beema suraksha</li>
            
            
            <li>Desh bhar ke sabhi kisan eligible</li>
          </ul>
        </>
      ),
      images: [pmfbyImage2, pmfbyImage3],
      audios: [pmfbyAudio],
      link: "https://pmfby.gov.in"
    },
    {
      id: 3,
      title: "NABARD",
      description: "Nabard Website",
      detailedDescription: "Nabard is an agricultural bank",
      images: [nabardImage],
      audios: [nabardAudio],
      link: "https://www.nabard.org/"
    }
  ];

  // Toggle dropdown
  // eslint-disable-next-line no-unused-vars
  const toggleDropdown = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  // Initial data for visualization
  const [results, setResults] = useState({
    cropIncome: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    expenseBreakdown: {
      seeds: 12000,
      fertilizers: 18000,
      labor: 25000,
      machinery: 15000,
      irrigation: 8000,
      transport: 10000
    }
  });

  const cropTypes = [
    'Paddy', 'Wheat', 'Cotton', 'Maize', 'Sugarcane', 
    'Vegetables', 'Fruits', 'Pulses', 'Oilseeds', 'Tomato','Other'
  ];

  const calculateResults = () => {
    const landSize = parseFloat(formData.landSize) || 0;
    const expectedYield = parseFloat(formData.expectedYield) || 0;
    const price = parseFloat(formData.marketPrice) || 0;
    const share = parseFloat(formData.farmerShare) || 100;

    // Calculate Crop Income
    const cropIncome = landSize * expectedYield * price * (share / 100);

    // Calculate Expenses
    const expenses = {
      seeds: (parseFloat(formData.expenses.seeds) || 0) * landSize,
      fertilizers: (parseFloat(formData.expenses.fertilizers) || 0) * landSize,
      labor: (parseFloat(formData.expenses.labor) || 0) * landSize,
      machinery: (parseFloat(formData.expenses.machinery) || 0) * landSize,
      irrigation: (parseFloat(formData.expenses.irrigation) || 0) * landSize,
      transport: (parseFloat(formData.expenses.transport) || 0) * landSize
    };

    const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);
    const totalIncome = cropIncome;
    const netProfit = totalIncome - totalExpenses;

    setResults({
      cropIncome,
      totalIncome,
      totalExpenses,
      netProfit,
      expenseBreakdown: expenses
    });
    setShowResults(true);
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'expenses') {
      setFormData(prev => ({
        ...prev,
        expenses: {
          ...prev.expenses,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate total expenses for initial data
  const totalInitialExpenses = Object.values(results.expenseBreakdown).reduce((sum, val) => sum + val, 0);
  const initialIncome = totalInitialExpenses * 1.2; // 20% profit margin for initial data
  const initialProfit = initialIncome - totalInitialExpenses;

  // Chart data
  const pieChartData = {
    labels: ['Seeds & Plants', 'Fertilizers', 'Labor', 'Machinery', 'Irrigation', 'Transport'],
    datasets: [{
      data: [
        results.expenseBreakdown.seeds,
        results.expenseBreakdown.fertilizers,
        results.expenseBreakdown.labor,
        results.expenseBreakdown.machinery,
        results.expenseBreakdown.irrigation,
        results.expenseBreakdown.transport
      ],
      backgroundColor: [
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFEB3B',
        '#FFC107',
        '#FF9800'
      ],
      borderWidth: 1,
    }]
  };

  const barChartData = {
    labels: ['Income', 'Expenses', 'Profit'],
    datasets: [{
      label: 'Amount (₹)',
      data: [initialIncome, totalInitialExpenses, initialProfit],
      backgroundColor: [
        '#4CAF50',
        '#FF9800',
        initialProfit >= 0 ? '#2196F3' : '#F44336'
      ],
      borderWidth: 1,
    }]
  };

  // Place this before the return statement in the Finance component
  const [miniCarouselIndices, setMiniCarouselIndices] = useState({ 1: 0, 2: 0 });

  const handleMiniCarousel = (schemeId, direction, type) => {
    setMiniCarouselIndices(prev => {
      const arr = type === 'image' ? governmentSchemes.find(s => s.id === schemeId).images : governmentSchemes.find(s => s.id === schemeId).audios;
      const max = arr.length;
      const current = prev[schemeId + type] || 0;
      let nextIdx = direction === 'next' ? (current + 1) % max : (current - 1 + max) % max;
      return { ...prev, [schemeId + type]: nextIdx };
    });
  };

  const [playingAudioId, setPlayingAudioId] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* New Intro Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Budget Estimation Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            👉 This Budget Estimation Tool helps farmers plan finances by estimating expected income, expenses, and profit or loss for a crop cycle.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            How does this work?
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl mx-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Formula Logic Behind Estimation</h2>
              <div className="space-y-4 text-gray-600">
                <p><strong>Total Income =</strong> Land Size × Expected Yield × Market Price (× Share %, if crop is shared)</p>
                <p><strong>Total Expenses =</strong> Sum of all per-acre expenses × Land Size</p>
                <p><strong>Net Profit / Loss =</strong> Total Income – Total Expenses</p>
                <p className="mt-4 text-sm italic">This tool provides rough estimations only. Actual values may vary due to market conditions, weather, or local cost variations.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Forms */}
          <div className="space-y-8">
            {/* Crop Income Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Crop Income</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Crop Type</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    value={formData.cropType}
                    onChange={(e) => handleInputChange('', 'cropType', e.target.value)}
                  >
                    <option value="">Select Crop</option>
                    {cropTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Land Size (Acres)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={formData.landSize}
                      onChange={(e) => handleInputChange('', 'landSize', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expected Yield (kg/acre)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={formData.expectedYield}
                      onChange={(e) => handleInputChange('', 'expectedYield', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Market Price (₹/kg)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={formData.marketPrice}
                      onChange={(e) => handleInputChange('', 'marketPrice', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Is the crop shared?</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={formData.isShared}
                      onChange={(e) => handleInputChange('', 'isShared', e.target.value)}
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>

                {formData.isShared === 'yes' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Farmer's Share (%)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={formData.farmerShare}
                      onChange={(e) => handleInputChange('', 'farmerShare', e.target.value)}
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Expenses Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expenses (per acre)</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Seeds & Plants Cost (₹)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={formData.expenses.seeds}
                      onChange={(e) => handleInputChange('expenses', 'seeds', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fertilizers & Pesticides Cost (₹)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={formData.expenses.fertilizers}
                      onChange={(e) => handleInputChange('expenses', 'fertilizers', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Labor Cost (₹)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={formData.expenses.labor}
                      onChange={(e) => handleInputChange('expenses', 'labor', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Machinery Rental (₹)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={formData.expenses.machinery}
                      onChange={(e) => handleInputChange('expenses', 'machinery', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Irrigation (₹)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={formData.expenses.irrigation}
                      onChange={(e) => handleInputChange('expenses', 'irrigation', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transport (₹)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={formData.expenses.transport}
                      onChange={(e) => handleInputChange('expenses', 'transport', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results & Charts */}
          <div className="space-y-8">
            {/* Results Panel */}
            <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-500 ${showResults ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Results</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(initialIncome)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInitialExpenses)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Net Profit/Loss</h3>
                  <p className={`text-2xl font-bold ${initialProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(initialProfit)}
                  </p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-500 ${showResults ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expense Breakdown</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="h-64">
                  <Pie
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                        title: {
                          display: true,
                          text: 'Expense Distribution'
                        }
                      }
                    }}
                  />
                </div>
                
                {/* Bar Chart */}
                <div className="h-64">
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        },
                        title: {
                          display: true,
                          text: 'Income vs Expenses'
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '₹' + value.toLocaleString('en-IN');
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="mt-8 text-center">
          <button
            onClick={calculateResults}
            className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 transition-colors duration-200"
          >
            Calculate Budget
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This is a rough estimate. Actual values may vary based on market conditions and other factors.</p>
        </div>

        {/* Government Schemes Section (Two Cards, Each With Mini-Carousel) */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Access Government Schemes</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {governmentSchemes.map((scheme) => (
              <div key={scheme.id} className="w-full md:w-1/3 max-w-xs flex-shrink-0 px-2 mb-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-200 cursor-pointer h-full flex flex-col">
                  {/* Mini-Carousel for Images */}
                  <div className="h-40 bg-gray-200 overflow-hidden relative flex items-center justify-center">
                    <button
                      onClick={() => handleMiniCarousel(scheme.id, 'prev', 'image')}
                      className="absolute left-2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-50 transition-colors duration-200"
                      style={{ top: '50%', transform: 'translateY(-50%)' }}
                      disabled={scheme.images.length <= 1}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <img
                      src={scheme.images[miniCarouselIndices[scheme.id + 'image'] || 0]}
                      alt={scheme.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleMiniCarousel(scheme.id, 'next', 'image')}
                      className="absolute right-2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-50 transition-colors duration-200"
                      style={{ top: '50%', transform: 'translateY(-50%)' }}
                      disabled={scheme.images.length <= 1}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  {/* Scheme Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{scheme.title}</h3>
                    <p className="text-gray-600 mb-4">{scheme.description}</p>
                    {/* Dropdown Toggle */}
                    <button
                      onClick={() => setExpandedCard(expandedCard === scheme.id ? null : scheme.id)}
                      className="flex items-center justify-between w-full text-left text-green-600 hover:text-green-700 transition-colors duration-200 mb-2"
                    >
                      <span>View Details</span>
                      <svg 
                        className={`w-5 h-5 transform transition-transform duration-200 ${expandedCard === scheme.id ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {/* Dropdown Content */}
                    <div className={`overflow-hidden transition-all duration-300 ${expandedCard === scheme.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="pt-4 space-y-4">
                        {typeof scheme.detailedDescription === 'string' ? (
                          <p className="text-gray-700 leading-relaxed">{scheme.detailedDescription}</p>
                        ) : (
                          scheme.detailedDescription
                        )}
                        {/* Mini-Carousel for Audio (if more than one audio) */}
                        <div className={`bg-gray-50 rounded-lg flex items-center gap-2 transition-all duration-300 ${playingAudioId === `${scheme.id}-${miniCarouselIndices[scheme.id + 'audio'] || 0}` ? 'p-4 border-2 border-green-500 shadow-lg' : 'p-3'}`}>
                          {scheme.audios.length > 1 && (
                            <button
                              onClick={() => handleMiniCarousel(scheme.id, 'prev', 'audio')}
                              className="bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors duration-200"
                              disabled={scheme.audios.length <= 1}
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                          )}
                          <AudioPlayer
                            src={scheme.audios[miniCarouselIndices[scheme.id + 'audio'] || 0]}
                            onPlay={() => setPlayingAudioId(`${scheme.id}-${miniCarouselIndices[scheme.id + 'audio'] || 0}`)}
                            onPause={() => setPlayingAudioId(null)}
                            onEnded={() => setPlayingAudioId(null)}
                            style={{ width: '100%' }}
                            showJumpControls={false}
                            customAdditionalControls={[]}
                            customVolumeControls={['volume']}
                          />
                          {scheme.audios.length > 1 && (
                            <button
                              onClick={() => handleMiniCarousel(scheme.id, 'next', 'audio')}
                              className="bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-colors duration-200"
                              disabled={scheme.audios.length <= 1}
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}
                        </div>
                        {/* Learn More Button */}
                        <a 
                          href={scheme.link}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          Learn More
                          <svg 
                            className="w-4 h-4 ml-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agricultural Websites Table */}
        <AgriWebsitesTable />
      </div>
    </div>
  );
};

export default Finance; 