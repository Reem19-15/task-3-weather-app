import { MapPin, Search, X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { searchCities } from "../services/weatherAPI";

function Searchbar({ onSearch, onLocationSearch, loading }) {
  // ✅ CHANGE: renamed prop
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeOut = setTimeout(async () => {
      if (query.length > 2) {
        setSearchLoading(true);

        try {
          const result = await searchCities(query);
          setSuggestions(result);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Search Failed:", error);
          setSuggestions([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeOut);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
      setShowSuggestions(false);
    }
  };

  // ✅ CHANGE: Call the parent’s location handler
  const handleLocationSearch = (e) => {
    e.preventDefault();
    onLocationSearch();
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (city) => {
    const cityName = `${city.name}${city.state ? `, ${city.state}` : ""}${
      city.country ? `, ${city.country}` : ""
    }`;
    onSearch(cityName);
    setQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <form className="relative" onSubmit={handleSearch}>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray/60 w-5 h-5 group-focus-within:text-white transition-all" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for any city worldwide....."
            className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all duration-300 hover:bg-white/15"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-all p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {/* ✅ CHANGE: make sure this triggers parent handler */}
          <button
            type="button"
            onClick={handleLocationSearch}
            disabled={loading}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-all p-1 rounded-full hover:bg-white/10"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50">
          {searchLoading ? (
            <div className="p-6 text-center text-white/70">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white mx-auto"></div>
              <p className="mt-4">Searching for city...</p>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((city, index) => (
              <button
                key={`${city.name}-${city.country}-${index}`}
                onClick={() => handleSuggestionClick(city)}
                className="w-full px-6 py-4 text-left hover:bg-white/10 transition-all duration-200 flex items-center justify-between group border-b border-white/10 last:border-b-0 "
              >
                <div>
                  <div className="font-medium text-white group-hover:text-white/90">
                    {city.name} ,
                    {city.state && (
                      <span className="text-white/70">{city.state}</span>
                    )}
                  </div>
                  <div className="text-sm text-white/60">{city.country}</div>
                </div>
                <Search className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-all" />
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-white/70">No cities found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Searchbar;
