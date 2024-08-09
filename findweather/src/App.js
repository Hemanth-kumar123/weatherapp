import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: city,
          units: 'metric',
          appid: '87adbaafbd4f448dd23c3dff95b0978f'
        }
      });
      setWeather(response.data);
    } catch (err) {
      console.error('Error fetching weather data:', err.response ? err.response.data : err.message);
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeather();
    }
  }, [city]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const getBackgroundClass = () => {
    if (!weather) return '';
    const temp = weather.main.temp;
    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes('rain')) return 'weather-background-rain';
    if (temp > 30) return 'weather-background-hot';
    if (temp < 0) return 'weather-background-cold';
    return '';
  };

  return (
    <div className={`weather-container ${getBackgroundClass()}`}>
      <form
        className="weather-form"
        onSubmit={(e) => {
          e.preventDefault();
          fetchWeather();
        }}
      >
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city"
        />
        <button type="submit">Get Weather</button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {weather && (
        <div className="weather-data">
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <img
            src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
            alt="Weather icon"
          />
        </div>
      )}
    </div>
  );
};

export default App;
