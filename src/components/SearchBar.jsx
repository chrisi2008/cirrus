import { useState, useEffect, useRef } from "react";
import { Icon } from "./Icon";

export function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`);
        const data = await res.json();
        if (data.results) {
          setSuggestions(data.results);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
        }
      } catch (e) {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
      setQuery("");
    }
  };

  const handleSelect = (item) => {
    onSearch({
      latitude: item.latitude,
      longitude: item.longitude,
      name: item.name,
      country: item.country || "",
      admin1: item.admin1 || ""
    });
    setQuery("");
    setShowDropdown(false);
  };

  return (
    <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40" style={{ WebkitAppRegion: "no-drag" }} ref={dropdownRef}>
      <div className="relative">
        <div className="glass-tiny rounded-full flex items-center gap-2 px-4 py-2 w-72 shadow-lg"
             style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
          <Icon name="search" size={14} color="rgba(255,255,255,0.7)" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder="Stadt suchen..."
            className="bg-transparent outline-none flex-1 text-[13px] placeholder-white/50 text-white"
          />
        </div>

        {/* Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col py-1 animate-in fade-in zoom-in-95 duration-200">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-2.5 hover:bg-white/10 cursor-pointer flex flex-col transition-colors"
                onClick={() => handleSelect(item)}
              >
                <div className="text-white text-[13px] font-medium">{item.name}</div>
                <div className="text-white/50 text-[11px] truncate">
                  {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
