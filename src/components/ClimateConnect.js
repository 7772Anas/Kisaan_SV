import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


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

    return (
      <div className="bg-gray-800 rounded-lg p-4 mt-4">
        <h3 className="text-xl font-semibold mb-3">Air Quality Index</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-400">CO</p>
            <p className="text-lg font-semibold">{aqi.co.toFixed(1)}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-400">PM2.5</p>
            <p className="text-lg font-semibold">{aqi.pm2_5.toFixed(1)}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-400">O3</p>
            <p className="text-lg font-semibold">{aqi.o3.toFixed(1)}</p>
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
      <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6 text-gray-100">7-Day Rain Forecast</h3>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="day" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Bar
                dataKey="rainChance"
                fill="url(#rainGradient)"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <text
                    key={`label-${index}`}
                    x={index * (100 / chartData.length) + (100 / chartData.length / 2)}
                    y={entry.rainChance - 10}
                    fill="#60A5FA"
                    textAnchor="middle"
                    fontSize={12}
                  >
                    {entry.rainChance}%
                  </text>
                ))}
              </Bar>
              <defs>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8}/>
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
      <div className="flex justify-between items-center mt-4 p-4 bg-gray-700/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🌅</span>
          <div>
            <p className="text-sm text-gray-400">Sunrise</p>
            <p className="font-medium">{astroData.sunrise}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🌇</span>
          <div>
            <p className="text-sm text-gray-400">Sunset</p>
            <p className="font-medium">{astroData.sunset}</p>
          </div>
        </div>
      </div>
    );
  };

  // Function to get weather icon
  const getWeatherIcon = (condition) => {
    const conditionText = condition?.toLowerCase() || '';
    
    if (conditionText.includes('sunny') || conditionText.includes('clear')) {
      return '☀️';
    } else if (conditionText.includes('cloud')) {
      return '☁️';
    } else if (conditionText.includes('rain')) {
      return '🌧️';
    } else if (conditionText.includes('snow')) {
      return '❄️';
    } else if (conditionText.includes('thunder')) {
      return '⛈️';
    } else if (conditionText.includes('mist') || conditionText.includes('fog')) {
      return '🌫️';
    } else {
      return '🌤️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 pt-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg">
        {/* Left section: Location and Search */}
        <div className="flex items-center flex-grow">
          <span className="text-xl mr-4 font-semibold">
            📍 {weatherData ? `${weatherData.location.name}, ${weatherData.location.country}` : 'Search for a city...'}
          </span>
          <form onSubmit={fetchWeatherData} className="relative flex-grow max-w-sm">
            <input
              type="text"
              placeholder="Search city..."
              value={city}
              onChange={handleInputChange}
              className="bg-gray-700 text-white rounded-full py-2 px-5 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
          </form>
        </div>

        {/* Right section: Forecast/Air Quality toggle */}
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white rounded-full px-5 py-2 text-base font-medium hover:bg-blue-700 transition-colors">Forecast</button>
          <button className="text-gray-400 px-5 py-2 text-base font-medium hover:text-white transition-colors">Air quality</button>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 text-gray-400">Loading weather data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Weather details section */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Left column: Today's forecast card */}
        <div className="w-full lg:w-1/3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">
              {weatherData ? new Date(weatherData.location.localtime).toLocaleDateString('en-US', { weekday: 'long' }) : 'Today'}
            </h3>
          </div>
          <div className="text-center py-4">
            <div className="text-8xl mb-4">
              {getWeatherIcon(weatherData ? weatherData.current.condition.text : defaultWeatherData.current.condition.text)}
            </div>
            <h2 className="text-4xl font-bold mt-2">
              {weatherData ? `${weatherData.current.temp_c}°C` : `${defaultWeatherData.current.temp_c}°C`}
            </h2>
            <p className="text-gray-400">
              {weatherData ? weatherData.current.condition.text : defaultWeatherData.current.condition.text}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Feels Like</p>
              <p className="text-lg font-semibold">
                {weatherData ? `${weatherData.current.feelslike_c}°C` : `${defaultWeatherData.current.feelslike_c}°C`}
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Humidity</p>
              <p className="text-lg font-semibold">
                {weatherData ? `${weatherData.current.humidity}%` : `${defaultWeatherData.current.humidity}%`}
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Wind</p>
              <p className="text-lg font-semibold">
                {weatherData ? `${weatherData.current.wind_kph} km/h` : `${defaultWeatherData.current.wind_kph} km/h`}
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">UV Index</p>
              <p className="text-lg font-semibold">
                {weatherData ? weatherData.current.uv : defaultWeatherData.current.uv}
              </p>
            </div>
          </div>
          <SunriseSunset astroData={weatherData ? weatherData.forecast.forecastday[0].astro : defaultWeatherData.forecast.forecastday[0].astro} />
        </div>

        {/* Right column: 7-day forecast and air quality */}
        <div className="w-full lg:w-2/3">
          <RainChanceGraph forecastData={weatherData ? weatherData.forecast.forecastday : defaultWeatherData.forecast.forecastday} />
          <AirQualityIndex data={weatherData || defaultWeatherData} />
        </div>
      </div>

      {/* Recent searches */}
      {recentCities.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Recent Searches</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentCities.map((city, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-4 cursor-pointer hover:bg-gray-800/70 transition-colors"
                onClick={() => {
                  setCity(city.name);
                  fetchWeatherData({ preventDefault: () => {} });
                }}
              >
                <h4 className="font-medium">{city.name}</h4>
                <p className="text-sm text-gray-400">{city.country}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClimateConnect; 