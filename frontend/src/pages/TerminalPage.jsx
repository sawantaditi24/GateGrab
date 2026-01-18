import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAirport, getRestaurantsByAirport } from '../services/api';

function TerminalPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [airport, setAirport] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedGate, setSelectedGate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGateInput, setShowGateInput] = useState(false);

  useEffect(() => {
    loadAirportData();
  }, [code]);

  useEffect(() => {
    if (selectedGate && code) {
      loadRestaurants();
    }
  }, [selectedGate, code]);

  const loadAirportData = async () => {
    try {
      setLoading(true);
      const response = await getAirport(code);
      setAirport(response.data);
    } catch (err) {
      setError('Failed to load airport data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurants = async () => {
    try {
      const response = await getRestaurantsByAirport(code, selectedGate);
      setRestaurants(response.data.restaurants);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    }
  };

  const handleGateSubmit = (e) => {
    e.preventDefault();
    if (selectedGate.trim()) {
      setShowGateInput(false);
      loadRestaurants();
    }
  };

  const handleRestaurantClick = (restaurant) => {
    if (restaurant.mock_ordering_slug) {
      // Make sure we pass the full restaurant object with ID
      navigate(`/order/${restaurant.mock_ordering_slug}`, {
        state: { 
          restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            mock_ordering_slug: restaurant.mock_ordering_slug,
            cuisine_type: restaurant.cuisine_type
          }, 
          gate: selectedGate, 
          airportCode: code 
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="mt-6 text-xl text-white/80 font-medium">Loading airport data...</p>
        </div>
      </div>
    );
  }

  if (error || !airport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md border border-white/20">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-white text-lg mb-4">{error || 'Airport not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-medium transition-all shadow-lg shadow-purple-500/50"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-white/20"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {airport.name}
                </h1>
                <p className="text-sm text-white/60">{airport.code}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Gate Input Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            {!showGateInput && !selectedGate ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/50">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  Where's Your Gate?
                </h2>
                <p className="text-white/70 mb-8 text-lg">
                  Enter your boarding gate to find nearby restaurants
                </p>
                <button
                  onClick={() => setShowGateInput(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-semibold text-lg transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105"
                >
                  Enter Gate Number
                </button>
              </div>
            ) : showGateInput ? (
              <form onSubmit={handleGateSubmit}>
                <label className="block text-white font-semibold text-lg mb-4">
                  Boarding Gate
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={selectedGate}
                      onChange={(e) => setSelectedGate(e.target.value.toUpperCase())}
                      placeholder="e.g., A12, B5, C20"
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-semibold transition-all shadow-lg shadow-purple-500/50 hover:scale-105"
                  >
                    Find Restaurants
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-2">Your Gate</p>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-black text-white">{selectedGate}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-xl">Gate {selectedGate}</p>
                      <p className="text-white/60 text-sm">Restaurants nearby</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedGate('');
                    setShowGateInput(true);
                    setRestaurants([]);
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Restaurants List */}
        {selectedGate && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">
                Restaurants Near Gate {selectedGate}
              </h2>
              <span className="text-white/60 text-sm">
                {restaurants.length} {restaurants.length === 1 ? 'restaurant' : 'restaurants'} found
              </span>
            </div>
            
            {restaurants.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center border border-white/20">
                <svg className="w-20 h-20 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-white/80 text-lg mb-2">No restaurants found</p>
                <p className="text-white/60 text-sm">
                  Try a different gate or check back later
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant, index) => (
                  <div
                    key={restaurant.id}
                    onClick={() => handleRestaurantClick(restaurant)}
                    className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 cursor-pointer border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all">
                            {restaurant.name}
                          </h3>
                          <p className="text-white/70 mb-3">{restaurant.cuisine_type}</p>
                          {restaurant.distance_from_gate && (
                            <div className="flex items-center gap-2 text-purple-300 text-sm font-medium mb-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              ~{restaurant.distance_from_gate.toFixed(1)} units away
                            </div>
                          )}
                        </div>
                        <div className="ml-4 p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                          <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-white/50 text-xs">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{restaurant.estimated_prep_time} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Terminal Info */}
        {!selectedGate && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Terminal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {airport.terminals && airport.terminals.length > 0 ? (
                  airport.terminals.map((terminal) => (
                    <div key={terminal.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">{terminal.name.charAt(terminal.name.length - 1)}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white">{terminal.name}</h3>
                      </div>
                      <p className="text-white/60 text-sm">
                        {terminal.gates?.length || 0} gates available
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60">Terminal information not available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TerminalPage;
