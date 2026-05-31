import { useState, useEffect } from "react";
import { getWeatherMood, getConditionText, getEmoji, getWindDirection, formatTime } from "../utils/weatherMapper";

export function useWeather(locationInput = "Berlin") {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    async function fetchWeather() {
      if (!locationInput) return;
      setLoading(true);
      setError(null);
      try {
        let location;
        
        if (typeof locationInput === "string") {
          // 1. Geocoding
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationInput)}`);
          const geoData = await geoRes.json();
          if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Stadt nicht gefunden");
          }
          location = geoData.results[0];
        } else {
          location = locationInput; // Expects { latitude, longitude, name, country, admin1 }
        }

        // 2. Weather & Air Quality Data
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,is_day,weathercode,windspeed_10m,winddirection_10m,relative_humidity_2m,uv_index,apparent_temperature,precipitation,surface_pressure&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,sunrise,sunset&hourly=temperature_2m,weathercode,precipitation&timezone=auto`;
        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=european_aqi,pm2_5,pm10,ozone&timezone=auto`;
        
        const [weatherRes, aqiRes] = await Promise.all([
          fetch(weatherUrl),
          fetch(aqiUrl)
        ]);
        
        const wd = await weatherRes.json();
        const aqiData = await aqiRes.json();

        if (mounted) {
          const current = wd.current;
          const daily = wd.daily;
          const hourly = wd.hourly;
          const isDay = current.is_day === 1;

          // Parse hourly data for the next 12 hours starting from now
          const currentHourIndex = hourly.time.findIndex(t => t.startsWith(current.time.substring(0, 13)));
          const startIdx = currentHourIndex >= 0 ? currentHourIndex : 0;
          const next12Hours = hourly.time.slice(startIdx, startIdx + 12).map((t, idx) => {
            const hIdx = startIdx + idx;
            const hourStr = idx === 0 ? "Jetzt" : t.substring(11, 13);
            return {
              h: hourStr,
              t: Math.round(hourly.temperature_2m[hIdx]),
              e: getEmoji(hourly.weathercode[hIdx], hourStr === "Jetzt" ? isDay : true) // Simplification for day/night
            };
          });

          // Parse daily forecast
          const forecast = daily.time.map((t, idx) => {
            const dateObj = new Date(t);
            const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
            const dayName = idx === 0 ? "Heute" : days[dateObj.getDay()];
            
            const dateStr = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.`;

            // Extract 24h slice for this day
            const dayStartIdx = idx * 24;
            const dayHourly = [];
            for(let i=0; i<24; i++) {
              const globalIdx = dayStartIdx + i;
              if (globalIdx < hourly.time.length) {
                dayHourly.push({
                  h: hourly.time[globalIdx].substring(11, 13) + ":00",
                  t: Math.round(hourly.temperature_2m[globalIdx]),
                  e: getEmoji(hourly.weathercode[globalIdx], true) // simplifiziert
                });
              }
            }

            return {
              day: dayName,
              date: dateStr,
              emoji: getEmoji(daily.weathercode[idx], true),
              hi: Math.round(daily.temperature_2m_max[idx]),
              lo: Math.round(daily.temperature_2m_min[idx]),
              prec: daily.precipitation_probability_max[idx] || (daily.precipitation_sum[idx] > 0 ? 100 : 0),
              hourly: dayHourly
            };
          });

          const mood = getWeatherMood(current.weathercode, isDay);
          
          setData({
            city: location.name,
            country: location.country,
            region: location.admin1,
            lat: location.latitude,
            lon: location.longitude,
            mood: mood,
            current: {
              temp: Math.round(current.temperature_2m),
              feels: Math.round(current.apparent_temperature),
              condition: getConditionText(current.weathercode),
              sub: daily.precipitation_sum[0] > 0 ? `Niederschlag heute` : `Trocken heute`,
              high: Math.round(daily.temperature_2m_max[0]),
              low: Math.round(daily.temperature_2m_min[0]),
              wind: Math.round(current.windspeed_10m),
              windDir: getWindDirection(current.winddirection_10m),
              humidity: current.relative_humidity_2m,
              uv: Math.round(current.uv_index),
              pressure: Math.round(current.surface_pressure),
              precip: current.precipitation,
              visibility: 10, // Not all endpoints provide this without extra flags
              dew: Math.round(current.temperature_2m - (100 - current.relative_humidity_2m)/5), // Approx
              aqi: Math.round(aqiData.current.european_aqi),
              pm25: Math.round(aqiData.current.pm2_5),
              pm10: Math.round(aqiData.current.pm10),
              ozone: Math.round(aqiData.current.ozone),
              sunrise: formatTime(daily.sunrise[0]),
              sunset: formatTime(daily.sunset[0]),
            },
            hourly: next12Hours,
            forecast: forecast
          });
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchWeather();
    return () => { mounted = false; };
  }, [locationInput]);

  return { data, loading, error };
}
