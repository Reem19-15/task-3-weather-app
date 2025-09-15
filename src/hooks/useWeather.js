import { useEffect, useState } from "react";
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getWeatherForecast,
} from "../services/weatherAPI";

export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForeCast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnits] = useState("C");

  const fetchWeatherByCity = async (city) => {
    setLoading(true);
    setError(null);

    try {
      // 🟢 fix: Use Promise.all to fetch both current and forecast data concurrently for better performance.
      const [weatherData, foreCastData] = await Promise.all([
        getCurrentWeather(city),
        getWeatherForecast(city),
      ]);

      setCurrentWeather(weatherData);
      setForeCast(foreCastData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    const getPosition = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };

    try {
      const position = await getPosition();
      const { latitude, longitude } = position.coords;

      // ✅ first fetch current weather
      const weatherData = await getCurrentWeatherByCoords(latitude, longitude);

      // ✅ then fetch forecast using city name from weatherData
      const forecastData = await getWeatherForecast(weatherData.name);

      setCurrentWeather(weatherData);
      setForeCast(forecastData);
    } catch (err) {
      setError(
        err.message ||
          "Unable to retrieve your location. Please allow location access and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleUnits = () => {
    setUnits(unit === "C" ? "F" : "C");
  };

  // 🟢 fix: Use a single useEffect hook for initial data fetch.
  // 🟢 fix: It is good practice to handle the initial fetch here rather than in App.jsx.
  useEffect(() => {
    fetchWeatherByCity("New York");
  }, []);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    unit,
    fetchWeatherByCity,
    fetchWeatherByLocation,
    toggleUnits,
  };
};
