import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createOrder, getRestaurantsByAirport } from '../services/api';

function DeliveryFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  
  const [formData, setFormData] = useState({
    orderConfirmation: location.state?.orderConfirmation || '',
    restaurantId: location.state?.restaurant?.id || '',
    userName: '',
    userContact: '',
    boardingGate: location.state?.gate || '',
    flightNumber: '',
    estimatedPickupTime: '',
  });

  useEffect(() => {
    if (location.state?.airportCode && location.state?.restaurant?.mock_ordering_slug) {
      loadRestaurants();
    }
  }, [location.state]);

  const loadRestaurants = async () => {
    try {
      const response = await getRestaurantsByAirport(location.state.airportCode);
      const restaurant = response.data.restaurants.find(
        r => r.mock_ordering_slug === location.state.restaurant.mock_ordering_slug
      );
      if (restaurant) {
        setFormData(prev => ({ ...prev, restaurantId: restaurant.id }));
        setRestaurants(response.data.restaurants);
      }
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate restaurant ID
    if (!formData.restaurantId || isNaN(parseInt(formData.restaurantId))) {
      const errorMsg = 'Please select a restaurant';
      setError(errorMsg);
      toast.error(errorMsg, { icon: '❌' });
      setLoading(false);
      return;
    }

    try {
      let pickupTime = formData.estimatedPickupTime;
      if (!pickupTime) {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 15);
        pickupTime = now.toISOString();
      }

      const restaurantId = parseInt(formData.restaurantId);
      if (isNaN(restaurantId)) {
        throw new Error('Invalid restaurant ID');
      }

      const orderData = {
        order_confirmation: formData.orderConfirmation,
        restaurant_id: restaurantId,
        user_name: formData.userName,
        user_contact: formData.userContact,
        boarding_gate: formData.boardingGate,
        flight_number: formData.flightNumber || null,
        estimated_pickup_time: pickupTime,
      };

      console.log('Creating order with data:', orderData); // Debug log

      const response = await createOrder(orderData);
      toast.success('Order created successfully! Redirecting to tracking...', {
        icon: '✅',
        duration: 3000,
      });
      setTimeout(() => {
        navigate(`/track/${response.data.id}`);
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to create order. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg, { icon: '❌' });
      console.error('Order creation error:', err);
      console.error('Error response:', err.response);
      console.error('Form data:', formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Home</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 shadow-2xl">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/50">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-white mb-3">Delivery Details</h1>
            <p className="text-white/70 text-lg">
              Provide your information so we can deliver your order to your gate
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-8">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Confirmation */}
            <div>
              <label className="block text-white font-semibold text-lg mb-3">
                Order Confirmation Number *
              </label>
              <input
                type="text"
                name="orderConfirmation"
                value={formData.orderConfirmation}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                placeholder="ORD-123456"
              />
            </div>

            {/* Restaurant ID - Always show if not set */}
            {!formData.restaurantId && (
              <div>
                <label className="block text-white font-semibold text-lg mb-3">
                  Restaurant *
                </label>
                {restaurants.length > 0 ? (
                  <select
                    name="restaurantId"
                    value={formData.restaurantId}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  >
                    <option value="" className="bg-slate-800">Select a restaurant</option>
                    {restaurants.map((r) => (
                      <option key={r.id} value={r.id} className="bg-slate-800">
                        {r.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 px-4 py-3 rounded-xl">
                    <p className="text-sm">Loading restaurants... If this persists, please select an airport and gate first.</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (location.state?.airportCode) {
                          loadRestaurants();
                        } else {
                          navigate('/');
                        }
                      }}
                      className="mt-2 text-sm underline"
                    >
                      {location.state?.airportCode ? 'Retry' : 'Go to Homepage'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Show restaurant name if already selected */}
            {formData.restaurantId && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/60 text-sm mb-1">Selected Restaurant</p>
                <p className="text-white font-semibold">
                  {restaurants.find(r => r.id === parseInt(formData.restaurantId))?.name || 'Restaurant ID: ' + formData.restaurantId}
                </p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-white font-semibold text-lg mb-3">
                Your Name *
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                placeholder="John Doe"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-white font-semibold text-lg mb-3">
                Contact (Email or Phone) *
              </label>
              <input
                type="text"
                name="userContact"
                value={formData.userContact}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                placeholder="john@example.com or +1234567890"
              />
            </div>

            {/* Boarding Gate */}
            <div>
              <label className="block text-white font-semibold text-lg mb-3">
                Boarding Gate *
              </label>
              <input
                type="text"
                name="boardingGate"
                value={formData.boardingGate}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
                placeholder="A12"
              />
            </div>

            {/* Flight Number */}
            <div>
              <label className="block text-white font-semibold text-lg mb-3">
                Flight Number (Optional)
              </label>
              <input
                type="text"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                placeholder="AA123"
              />
            </div>

            {/* Estimated Pickup Time */}
            <div>
              <label className="block text-white font-semibold text-lg mb-3">
                Estimated Pickup Time (Optional)
              </label>
              <input
                type="datetime-local"
                name="estimatedPickupTime"
                value={formData.estimatedPickupTime}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
              <p className="text-white/60 text-sm mt-2">
                Leave empty to use default (15 minutes from now)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-black text-lg transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Order...
                </span>
              ) : (
                'Submit Delivery Request'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeliveryFormPage;
