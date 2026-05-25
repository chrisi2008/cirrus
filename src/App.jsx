import { useState, useEffect } from "react";
import { Scene } from "./components/Scene";
import { TitleBar } from "./components/TitleBar";
import { SearchBar } from "./components/SearchBar";
import { Hero } from "./components/Hero";
import { StatChips } from "./components/StatChips";
import { HourlyChart } from "./components/HourlyChart";
import { Forecast } from "./components/Forecast";
import { UVCard, SunCard, WindCard, AirCard, MiniStat } from "./components/DetailCards";
import { useWeather } from "./hooks/useWeather";
import "./index.css";

function App() {
  const [locationInput, setLocationInput] = useState(null); // Wait for IP location
  const [activeTab, setActiveTab] = useState("home");
  const { data, loading, error } = useWeather(locationInput);

  // Initial Geolocation
  useEffect(() => {
    let mounted = true;
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(geo => {
        if (mounted && geo.latitude && geo.longitude) {
          setLocationInput({
            latitude: geo.latitude,
            longitude: geo.longitude,
            name: geo.city || "Lokal",
            country: geo.country_name || "",
            admin1: geo.region || ""
          });
        } else if (mounted) {
          setLocationInput("Berlin"); // Fallback
        }
      })
      .catch(() => {
        if (mounted) setLocationInput("Berlin"); // Fallback
      });
    return () => { mounted = false; };
  }, []);

  // Remove the old hard error return block so we keep rendering!

  // Clear error after some time (optional, or just let the toast vanish using CSS/animations, but hiding it via state is cleaner)
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (error) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const mood = data ? data.mood : "cloudy";
  const isLightMood = ['sunny', 'cloudy', 'snow'].includes(mood);
  const footerTextColor = isLightMood ? "text-black/50" : "text-white/50";
  const footerBorderColor = isLightMood ? "border-black/10" : "border-white/5";

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black text-white font-sans selection:bg-white/30">
      <Scene mood={mood} data={data} />
      
      <TitleBar city={data?.city} activeTab={activeTab} onTabChange={setActiveTab} />
      <SearchBar onSearch={setLocationInput} />

      {/* Toast Error Notification */}
      {showToast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-in slide-in-from-top-4 fade-in">
          <div className="glass-tiny px-5 py-2 rounded-full text-white/95 text-[12.5px] border border-red-500/30 flex items-center gap-2.5 shadow-[0_4px_24px_rgba(220,38,38,0.2)]" style={{ background: "rgba(220, 38, 38, 0.15)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]"></span>
            {error}
          </div>
        </div>
      )}

      <div className="absolute inset-0 pt-16 flex justify-center" style={{ zIndex: 1 }}>
        <div className="w-full max-w-[1440px] overflow-y-auto scrolly h-full px-6 md:px-10 pb-12 pt-12">
          {loading && !data ? (
            <div className="h-full flex items-center justify-center text-white/50">
              Lade Wetterdaten...
            </div>
          ) : data ? (
            <>
              {activeTab === "home" && (
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Column: Hero, Stats, Hourly */}
                  <div className="flex-1 flex flex-col gap-5 min-w-0">
                    <Hero data={data} />
                    <StatChips data={data} />
                    <HourlyChart hourly={data.hourly} />
                  </div>

                  {/* Right Column: Detail Cards grid (auto-fit) */}
                  <div className="w-full lg:w-[480px] xl:w-[560px] grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", alignContent: "start" }}>
                    <UVCard data={data} />
                    <SunCard data={data} />
                    <WindCard data={data} />
                    <AirCard data={data} />
                    <MiniStat icon="eye" label="Sicht" value={`${data.current.visibility} km`} sub="Gemessen" />
                    <MiniStat icon="drop" label="Niederschlag" value={`${data.current.precip} mm`} sub="Aktuell" />
                    <MiniStat icon="thermometer" label="Taupunkt" value={`${data.current.dew}°`} sub="Komfortabel" />
                    <MiniStat icon="aqi" label="Luftdruck" value={`${data.current.pressure}`} sub="hPa · stabil" />
                  </div>
                </div>
              )}

              {activeTab === "cal" && (
                <div className="w-full h-[600px] lg:h-[700px] max-w-6xl mx-auto">
                  <Forecast forecast={data.forecast} currentTemp={data.current.temp} />
                </div>
              )}

              {/* Footer */}
              <div className={`w-full mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center text-[10.5px] gap-2 text-center md:text-left transition-colors duration-500 ${footerBorderColor} ${footerTextColor}`}>
                <div>Cirrus v1.0.0</div>
                <div className="md:text-right">
                  Zur Standortbestimmung wird deine IP-Adresse einmalig an ipapi.co übermittelt.<br className="hidden md:inline" /> Wetterdaten via Open-Meteo.
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
