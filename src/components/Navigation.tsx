import React, { useState } from 'react';
import { Search, Navigation as NavigationIcon, MapPin, Clock, Route, ArrowRight } from 'lucide-react';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { url } = useAuth();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      try {
        const results = await fetch(`${url}/api/navigation/search?query=${query}`);
        const data = await results.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleFindRoute = async () => {
    if (!fromLocation || !toLocation) return;
    
    setLoading(true);
    try {
      const routeData = await apiService.findRoute(fromLocation, toLocation);
      setRoute(routeData);
    } catch (error) {
      console.error('Route finding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectLocation = (location: any, isFrom: boolean) => {
    const locationName = `${location.name} (${location.code})`;
    if (isFrom) {
      setFromLocation(locationName);
    } else {
      setToLocation(locationName);
    }
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div 
          className="relative bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 overflow-hidden"
          style={{
            backgroundImage: 'url(/image.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Campus Navigation</h1>
            <p className="text-gray-700 text-lg">Find your way around PCTE campus with turn-by-turn directions</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <NavigationIcon className="w-5 h-5 text-blue-600" />
              Find Route
            </h2>

            <div className="space-y-4">
              {/* From Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => {
                      setFromLocation(e.target.value);
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="Enter starting location"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* To Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => {
                      setToLocation(e.target.value);
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="Enter destination"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Search Results</h3>
                  <div className="space-y-2">
                    {searchResults.map((result, index) => (
                      <div key={index} className="flex gap-2">
                        <button
                          onClick={() => selectLocation(result, true)}
                          className="flex-1 text-left p-2 bg-white hover:bg-blue-50 rounded border text-sm"
                        >
                          <div className="font-medium">{result.name}</div>
                          <div className="text-gray-600">{result.code} • {result.type}</div>
                        </button>
                        <button
                          onClick={() => selectLocation(result, false)}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          To
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleFindRoute}
                disabled={!fromLocation || !toLocation || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Route className="w-5 h-5" />
                    Find Route
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Locations */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Locations</h3>
            <div className="space-y-2">
              {[
                { name: 'Main Entrance', code: 'MAIN' },
                { name: 'Library', code: 'LIB' },
                { name: 'Cafeteria', code: 'CAF' },
                { name: 'Admin Office', code: 'ADM' },
                { name: 'Parking Area', code: 'PARK' }
              ].map((location) => (
                <button
                  key={location.code}
                  onClick={() => setToLocation(`${location.name} (${location.code})`)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900">{location.name}</div>
                  <div className="text-sm text-gray-600">{location.code}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Route Display */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {route ? (
              <div>
                {/* Route Header */}
                <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <h2 className="text-xl font-bold mb-2">Route Found!</h2>
                  <div className="flex items-center gap-6 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{route.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Route className="w-4 h-4" />
                      <span>{route.distance}m</span>
                    </div>
                  </div>
                </div>

                {/* Route Steps */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Directions</h3>
                  <div className="space-y-4">
                    {route.route.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">{step}</p>
                          {index < route.route.steps.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-gray-400 mt-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Route Map Visualization */}
                <div className="p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Map</h3>
                  <div className="h-64 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p>Interactive route map visualization</p>
                      <p className="text-sm">From: {route.from.name}</p>
                      <p className="text-sm">To: {route.to.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <NavigationIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Find Your Way</h3>
                  <p>Enter your starting point and destination to get directions</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;