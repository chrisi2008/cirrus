export const getWeatherMood = (code, isDay) => {
  if (code === 0) return isDay ? "sunny" : "night";
  if ([1, 2, 3, 45, 48].includes(code)) return "cloudy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "storm";
  return "cloudy";
};

export const getConditionText = (code) => {
  if (code === 0) return "Klar";
  if (code === 1) return "Heiter";
  if (code === 2) return "Wolkig";
  if (code === 3) return "Bedeckt";
  if ([45, 48].includes(code)) return "Nebel";
  if ([51, 53, 55].includes(code)) return "Nieselregen";
  if ([61, 63, 65].includes(code)) return "Regen";
  if ([71, 73, 75].includes(code)) return "Schneefall";
  if ([80, 81, 82].includes(code)) return "Regenschauer";
  if ([95, 96, 99].includes(code)) return "Gewitter";
  return "Unbekannt";
};

export const getEmoji = (code, isDay) => {
  const mood = getWeatherMood(code, isDay);
  const emojis = {
    sunny: "☀️",
    night: "🌙",
    cloudy: "☁️",
    rainy: "🌧️",
    snow: "❄️",
    storm: "⛈️"
  };
  return emojis[mood] || "⛅";
};

export const getWindDirection = (degrees) => {
  const dirs = ["N", "NO", "O", "SO", "S", "SW", "W", "NW", "N"];
  return dirs[Math.round((degrees % 360) / 45)];
};

// Formats a time string like "2023-08-01T05:48" to "05:48"
export const formatTime = (timeStr) => {
  if (!timeStr) return "00:00";
  return timeStr.split("T")[1].substring(0, 5);
};
