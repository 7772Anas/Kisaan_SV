import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Search, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
 
  Sunrise, 
  Sunset,
  Calendar,
  Clock,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  AirVent,
  Gauge,
  
  CloudFog,
  CloudLightning
} from 'lucide-react';

function ClimateConnect() {
  // State variables
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(() => {
    // Initialize from localStorage if available
    const savedData = localStorage.getItem('weatherData');
    return savedData ? JSON.parse(savedData) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentCities, setRecentCities] = useState(() => {
    // Initialize from localStorage if available
    const savedCities = localStorage.getItem('recentCities');
    return savedCities ? JSON.parse(savedCities) : [];
  });
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('forecast');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Save to localStorage whenever weatherData or recentCities changes
  useEffect(() => {
    if (weatherData) {
      localStorage.setItem('weatherData', JSON.stringify(weatherData));
    }
    if (recentCities.length > 0) {
      localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }
  }, [weatherData, recentCities]);

  // Default weather data for initial UI
  const defaultWeatherData = {
    location: {
      name: 'New Delhi',
      country: 'India',
      localtime: new Date().toISOString()
    },
    current: {
      temp_c: 25,
      condition: {
        text: 'Partly cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png'
      },
      feelslike_c: 26,
      humidity: 65,
      wind_kph: 12,
      uv: 5,
      air_quality: {
        co: 2.1,
        pm2_5: 15.2,
        o3: 45.6
      }
    },
    forecast: {
      forecastday: Array(7).fill().map((_, index) => ({
        date: new Date(Date.now() + index * 86400000).toISOString(),
        day: {
          daily_chance_of_rain: Math.floor(Math.random() * 50)
        },
        astro: {
          sunrise: '06:00 AM',
          sunset: '06:00 PM'
        }
      }))
    }
  };

  // Input change handler
  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  // Fetch weather data
  const fetchWeatherData = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${city}&days=7&aqi=yes`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
      
      // Update recent cities
      setRecentCities(prev => {
        const newCities = [
          { name: data.location.name, country: data.location.country, data: data },
          ...prev.filter(city => city.name !== data.location.name)
        ].slice(0, 3);
        return newCities;
      });

    } catch (err) {
      setError(err.message);
      console.error('Error fetching weather data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Air Quality Index component
  const AirQualityIndex = ({ data }) => {
    if (!data) return null;
    
    const aqi = data.current.air_quality;
    if (!aqi) return null;

    const getAQIColor = (value, type) => {
      if (type === 'co') {
        if (value < 2) return 'text-green-400';
        if (value < 4) return 'text-yellow-400';
        return 'text-red-400';
      }
      if (type === 'pm2_5') {
        if (value < 12) return 'text-green-400';
        if (value < 35) return 'text-yellow-400';
        return 'text-red-400';
      }
      if (type === 'o3') {
        if (value < 54) return 'text-green-400';
        if (value < 70) return 'text-yellow-400';
        return 'text-red-400';
      }
      return 'text-gray-400';
    };

    return (
      <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-6 border border-white/20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <AirVent className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Air Quality Index</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-4 h-4 text-blue-400" />
              <p className="text-sm text-gray-300">CO</p>
            </div>
            <p className={`text-2xl font-bold ${getAQIColor(aqi.co, 'co')}`}>{aqi.co.toFixed(1)}</p>
            <p className="text-xs text-gray-400 mt-1">Carbon Monoxide</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              <p className="text-sm text-gray-300">PM2.5</p>
            </div>
            <p className={`text-2xl font-bold ${getAQIColor(aqi.pm2_5, 'pm2_5')}`}>{aqi.pm2_5.toFixed(1)}</p>
            <p className="text-xs text-gray-400 mt-1">Fine Particles</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4 text-blue-400" />
              <p className="text-sm text-gray-300">O3</p>
            </div>
            <p className={`text-2xl font-bold ${getAQIColor(aqi.o3, 'o3')}`}>{aqi.o3.toFixed(1)}</p>
            <p className="text-xs text-gray-400 mt-1">Ozone</p>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Rain Chance Graph component
  const RainChanceGraph = ({ forecastData }) => {
    if (!forecastData) return null;

    // Prepare data for the chart
    const chartData = forecastData.map(day => ({
      day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      rainChance: day.day.daily_chance_of_rain
    }));

    return (
      <div className={`w-full bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">7-Day Rain Forecast</h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="day" 
                stroke="rgba(255,255,255,0.7)"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.7)"
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '0.75rem',
                  color: '#ffffff',
                  backdropFilter: 'blur(10px)'
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
              />
              <Bar
                dataKey="rainChance"
                fill="url(#rainGradient)"
                radius={[8, 8, 0, 0]}
                animationDuration={2000}
              >
                {chartData.map((entry, index) => (
                  <text
                    key={`label-${index}`}
                    x={index * (100 / chartData.length) + (100 / chartData.length / 2)}
                    y={entry.rainChance - 10}
                    fill="#22c55e"
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight="bold"
                  >
                    {entry.rainChance}%
                  </text>
                ))}
              </Bar>
              <defs>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Enhanced Sunrise/Sunset component
  const SunriseSunset = ({ astroData }) => {
    if (!astroData) return null;

    return (
      <div className={`flex justify-between items-center mt-6 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
            <Sunrise className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-300">Sunrise</p>
            <p className="font-semibold text-white">{astroData.sunrise}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
            <Sunset className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-300">Sunset</p>
            <p className="font-semibold text-white">{astroData.sunset}</p>
          </div>
        </div>
      </div>
    );
  };

  // Function to get weather icon
  const getWeatherIcon = (condition) => {
    const conditionText = condition?.toLowerCase() || '';
    
    if (conditionText.includes('sunny') || conditionText.includes('clear')) {
      return <Sun className="w-16 h-16 text-yellow-400" />;
    } else if (conditionText.includes('cloud')) {
      return <Cloud className="w-16 h-16 text-gray-400" />;
    } else if (conditionText.includes('rain')) {
      return <CloudRain className="w-16 h-16 text-blue-400" />;
    } else if (conditionText.includes('snow')) {
      return <CloudSnow className="w-16 h-16 text-blue-200" />;
    } else if (conditionText.includes('thunder')) {
      return <CloudLightning className="w-16 h-16 text-yellow-400" />;
    } else if (conditionText.includes('mist') || conditionText.includes('fog')) {
      return <CloudFog className="w-16 h-16 text-gray-300" />;
    } else {
      return <Cloud className="w-16 h-16 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 pt-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Left section: Location and Search */}
          <div className="flex items-center flex-grow gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-green-400" />
              <span className="text-xl font-semibold text-white">
                {weatherData ? `${weatherData.location.name}, ${weatherData.location.country}` : 'Search for a city...'}
              </span>
            </div>
            <form onSubmit={fetchWeatherData} className="relative flex-grow max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search city..."
                  value={city}
                  onChange={handleInputChange}
                  className="bg-white/10 backdrop-blur-sm text-white rounded-full py-3 px-5 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white/20 transition-all duration-300 text-base border border-white/20"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right section: Forecast/Air Quality toggle */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
            <button 
              onClick={() => setActiveTab('forecast')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'forecast' 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Forecast
            </button>
            <button 
              onClick={() => setActiveTab('air')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'air' 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <AirVent className="w-4 h-4 inline mr-2" />
              Air Quality
            </button>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className={`text-center py-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-300 flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Loading weather data...
            </p>
          </div>
        )}

        {error && (
          <div className={`bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 backdrop-blur-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Weather details section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Left column: Today's forecast card */}
          <div className={`w-full lg:w-1/3 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {weatherData ? new Date(weatherData.location.localtime).toLocaleDateString('en-US', { weekday: 'long' }) : 'Today'}
              </h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-center py-6">
              <div className="mb-6 transform hover:scale-110 transition-transform duration-300">
                {getWeatherIcon(weatherData ? weatherData.current.condition.text : defaultWeatherData.current.condition.text)}
              </div>
              <h2 className="text-5xl font-bold mb-2 text-white">
                {weatherData ? `${weatherData.current.temp_c}°C` : `${defaultWeatherData.current.temp_c}°C`}
              </h2>
              <p className="text-gray-300 text-lg">
                {weatherData ? weatherData.current.condition.text : defaultWeatherData.current.condition.text}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-4 h-4 text-red-400" />
                  <p className="text-sm text-gray-300">Feels Like</p>
                </div>
                <p className="text-lg font-semibold text-white">
                  {weatherData ? `${weatherData.current.feelslike_c}°C` : `${defaultWeatherData.current.feelslike_c}°C`}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <p className="text-sm text-gray-300">Humidity</p>
                </div>
                <p className="text-lg font-semibold text-white">
                  {weatherData ? `${weatherData.current.humidity}%` : `${defaultWeatherData.current.humidity}%`}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-300">Wind</p>
                </div>
                <p className="text-lg font-semibold text-white">
                  {weatherData ? `${weatherData.current.wind_kph} km/h` : `${defaultWeatherData.current.wind_kph} km/h`}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="w-4 h-4 text-purple-400" />
                  <p className="text-sm text-gray-300">UV Index</p>
                </div>
                <p className="text-lg font-semibold text-white">
                  {weatherData ? weatherData.current.uv : defaultWeatherData.current.uv}
                </p>
              </div>
            </div>
            <SunriseSunset astroData={weatherData ? weatherData.forecast.forecastday[0].astro : defaultWeatherData.forecast.forecastday[0].astro} />
          </div>

          {/* Right column: 7-day forecast and air quality */}
          <div className="w-full lg:w-2/3">
            {activeTab === 'forecast' ? (
              <RainChanceGraph forecastData={weatherData ? weatherData.forecast.forecastday : defaultWeatherData.forecast.forecastday} />
            ) : (
              <AirQualityIndex data={weatherData || defaultWeatherData} />
            )}
          </div>
        </div>

        {/* Recent searches */}
        {recentCities.length > 0 && (
          <div className={`mt-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-green-400" />
              <h3 className="text-2xl font-bold text-white">Recent Searches</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentCities.map((city, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 border border-white/20"
                  onClick={() => {
                    setCity(city.name);
                    fetchWeatherData({ preventDefault: () => {} });
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-green-400" />
                    <h4 className="font-semibold text-white">{city.name}</h4>
                  </div>
                  <p className="text-sm text-gray-300">{city.country}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClimateConnect; 