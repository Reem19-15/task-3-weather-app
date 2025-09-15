// A mapping of weather conditions to their corresponding icons.
const iconMap = {
  Clear: "Sun",
  Clouds: "Cloud",
  Rain: "CloudRain",
  Drizzle: "CloudDrizzle",
  Thunderstorm: "CloudLightning",
  Snow: "CloudSnow",
  Mist: "CloudFog",
  Fog: "CloudFog",
  Haze: "CloudFog",
  Dust: "Wind",
  Sand: "Wind",
  Ash: "Wind",
  Squall: "Wind",
  Tornado: "Tornado",
};

// Returns the appropriate icon name based on the main weather condition.
export const getWeatherIcon = (weatherData) => {
  return iconMap[weatherData.main] || "Cloud";
};

// Formats a temperature value based on the specified unit (Fahrenheit or Celsius).
export const formatTemperature = (temp, unit) => {
  if (unit === "F") {
    // Converts Celsius to Fahrenheit and rounds the result.
    return Math.round((temp * 9) / 5 + 32);
  }
  // Rounds the temperature if the unit is Celsius.
  return Math.round(temp);
};

// Formats a timestamp into a localized time string.
export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Formats a timestamp into a localized date string with weekday, month, and day.
export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

// Determines the cardinal wind direction from a degree value.
export const getWindDirection = (deg) => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
};
