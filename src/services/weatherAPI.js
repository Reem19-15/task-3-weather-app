const API_KEY = "b6014d30e56b9334f06e397dede6d86a";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export const getCurrentWeather = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `City "${city}" not found, please check the spelling and try again.`
        );
      } else if (response.status === 401) {
        throw new Error(
          "Invalid API Key, please check your OpenWeatherMap API configuration."
        );
      } else {
        throw new Error(
          "Weather service is temporarily unavailable. Please try again later."
        );
      }
    }

    const data = await response.json();
    // ensure we have the current timestamp if not provided
    if (!data.dt) {
      data.dt = Math.floor(Date.now() / 1000);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Unable to connect. Please check your internet connection."
      );
    }
    throw error; // re-throw any other errors
  }
};

export const getCurrentWeatherByCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `City not found for the given coordinates. Please try again.`
        );
      } else if (response.status === 401) {
        throw new Error(
          "Invalid API Key, please check your OpenWeatherMap API configuration."
        );
      } else {
        throw new Error(
          "Weather service is temporarily unavailable. Please try again later."
        );
      }
    }

    const data = await response.json();

    // ensure we have the current timestamp if not provided
    if (!data.dt) {
      data.dt = Math.floor(Date.now() / 1000);
    }

    // If the city name exists, attach it to the error messaging logic
    if (!data.name) {
      data.name = "Unknown location";
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Unable to connect. Please check your internet connection."
      );
    }
    throw error; // re-throw any other errors
  }
};

export const getWeatherForecast = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `City "${city}" not found, please check the spelling and try again.`
        );
      } else if (response.status === 401) {
        throw new Error(
          "Invalid API Key, please check your OpenWeatherMap API configuration."
        );
      } else {
        throw new Error(
          "Weather service is temporarily unavailable. Please try again later."
        );
      }
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Unable to connect. Please check your internet connection."
      );
    }
    throw error; // re-throw any other errors
  }
};

export const searchCities = async (query) => {
  try {
    // FIX: Removed duplicate 'geo/1.0' from the URL path
    const response = await fetch(
      `${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          "Invalid API Key, please check your OpenWeatherMap API configuration."
        );
      } else {
        throw new Error(
          "City search service is temporarily unavailable. Please try again later."
        );
      }
    }

    const data = await response.json();

    // Transform the geocoding API response to match expected format
    return data.map((city) => ({
      name: city.name,
      lat: city.lat,
      lon: city.lon,
      country: city.country,
      state: city.state || "", // fallback if no state provided
    }));
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Please check your internet connection and try again."
      );
    }
    throw error;
  }
};
