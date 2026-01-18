import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Mock menu data for different restaurants
const restaurantMenus = {
  chipotle: {
    name: 'Chipotle',
    color: 'from-green-600 to-green-800',
    icon: '🌯',
    items: [
      { id: 1, name: 'Burrito Bowl', price: 9.50, description: 'Rice, beans, protein, salsa, cheese', image: '🥗' },
      { id: 2, name: 'Burrito', price: 9.50, description: 'Tortilla, rice, beans, protein, salsa', image: '🌯' },
      { id: 3, name: 'Tacos (3)', price: 8.50, description: 'Three soft or hard shell tacos', image: '🌮' },
      { id: 4, name: 'Salad Bowl', price: 9.50, description: 'Lettuce, protein, salsa, cheese', image: '🥗' },
      { id: 5, name: 'Chips & Guacamole', price: 4.50, description: 'Fresh chips with guacamole', image: '🥑' },
    ],
  },
  mcdonalds: {
    name: "McDonald's",
    color: 'from-yellow-500 to-red-600',
    icon: '🍔',
    items: [
      { id: 1, name: 'Big Mac', price: 5.99, description: 'Two all-beef patties, special sauce', image: '🍔' },
      { id: 2, name: 'Quarter Pounder', price: 6.49, description: 'Quarter pound beef patty', image: '🍔' },
      { id: 3, name: 'Chicken McNuggets (10pc)', price: 5.99, description: '10 piece chicken nuggets', image: '🍗' },
      { id: 4, name: 'French Fries (Large)', price: 3.49, description: 'Large crispy fries', image: '🍟' },
      { id: 5, name: 'McFlurry', price: 4.49, description: 'Ice cream with mix-ins', image: '🍦' },
    ],
  },
  starbucks: {
    name: 'Starbucks',
    color: 'from-green-700 to-emerald-900',
    icon: '☕',
    items: [
      { id: 1, name: 'Caffe Latte', price: 4.95, description: 'Espresso with steamed milk', image: '☕' },
      { id: 2, name: 'Cappuccino', price: 4.95, description: 'Espresso with foamed milk', image: '☕' },
      { id: 3, name: 'Caramel Macchiato', price: 5.45, description: 'Espresso with caramel and vanilla', image: '☕' },
      { id: 4, name: 'Blueberry Muffin', price: 2.95, description: 'Fresh baked blueberry muffin', image: '🧁' },
      { id: 5, name: 'Chocolate Chip Cookie', price: 2.45, description: 'Warm chocolate chip cookie', image: '🍪' },
    ],
  },
  subway: {
    name: 'Subway',
    color: 'from-yellow-400 to-green-600',
    icon: '🥪',
    items: [
      { id: 1, name: 'Italian B.M.T.', price: 7.99, description: 'Pepperoni, salami, ham', image: '🥪' },
      { id: 2, name: 'Turkey Breast', price: 7.49, description: 'Oven roasted turkey', image: '🥪' },
      { id: 3, name: 'Veggie Delite', price: 6.99, description: 'Fresh vegetables', image: '🥪' },
      { id: 4, name: 'Tuna', price: 7.99, description: 'Tuna salad', image: '🥪' },
      { id: 5, name: 'Cookies (2)', price: 1.99, description: 'Two fresh baked cookies', image: '🍪' },
    ],
  },
};

function RestaurantOrderPage() {
  const { restaurantSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const restaurant = restaurantMenus[restaurantSlug];
  const { restaurant: restaurantInfo, gate, airportCode } = location.state || {};

  useEffect(() => {
    if (!restaurant) {
      navigate('/');
    }
  }, [restaurant, navigate]);

  if (!restaurant) {
    return null;
  }

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() }]);
    toast.success(`${item.name} added to cart!`, {
      icon: '🛒',
      duration: 2000,
    });
  };

  const removeFromCart = (cartId) => {
    const item = cart.find(i => i.cartId === cartId);
    setCart(cart.filter(item => item.cartId !== cartId));
    if (item) {
      toast.success(`${item.name} removed from cart`, {
        icon: '🗑️',
        duration: 2000,
      });
    }
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  };

  const handleCheckout = () => {
    const mockOrderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    setOrderNumber(mockOrderNumber);
    setOrderConfirmed(true);
  };

  const handleContinueToDelivery = () => {
    navigate('/delivery', {
      state: {
        orderConfirmation: orderNumber,
        restaurant: restaurantInfo,
        gate,
        airportCode,
      },
    });
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 max-w-md w-full border border-white/20 shadow-2xl">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50 animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-white mb-3">Order Confirmed!</h2>
            <p className="text-white/70 mb-8 text-lg">Your order has been placed successfully</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
              <p className="text-white/60 text-sm mb-2 uppercase tracking-wider">Order Number</p>
              <p className="text-3xl font-black text-white tracking-wider">{orderNumber}</p>
            </div>
            <button
              onClick={handleContinueToDelivery}
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-bold text-lg transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:scale-105"
            >
              Continue to Delivery Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className={`bg-gradient-to-r ${restaurant.color} sticky top-0 z-50 shadow-xl`}>
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
            >
              <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{restaurant.icon}</span>
              <h1 className="text-3xl font-black text-white">{restaurant.name}</h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-6">Menu</h2>
            <div className="space-y-4">
              {restaurant.items.map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-5xl">{item.image}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                        <p className="text-white/70 text-sm mb-2">{item.description}</p>
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="ml-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-semibold transition-all shadow-lg shadow-purple-500/50 hover:scale-105"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 sticky top-24 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Your Order</h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">🛒</div>
                  <p className="text-white/60">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.cartId} className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">{item.image}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                            <p className="text-xs text-white/60">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="ml-2 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-white/20 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-bold text-white">Total</span>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        ${getTotal()}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-bold text-lg transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:scale-105"
                    >
                      Place Order
                    </button>
                    <p className="text-xs text-white/50 text-center mt-3">
                      This is a simulated order. No payment will be processed.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantOrderPage;
