import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getOrder, markPickedUp, markInTransit, markDelivered } from '../services/api';

function AgentOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [otp, setOtp] = useState('');
  const agentId = sessionStorage.getItem('agentId');

  useEffect(() => {
    if (!agentId) {
      navigate('/agent/login');
      return;
    }
    loadOrder();
  }, [orderId, agentId, navigate]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await getOrder(orderId);
      setOrder(response.data);
    } catch (err) {
      toast.error('Failed to load order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickup = async () => {
    try {
      setUpdating(true);
      const response = await markPickedUp(orderId, agentId);
      toast.success('Order marked as picked up!', {
        icon: '📦',
      });
      if (response.data.otp) {
        toast.success(`OTP: ${response.data.otp} - Share this with the customer!`, {
          duration: 8000,
          icon: '🔑',
        });
      }
      await loadOrder();
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleInTransit = async () => {
    try {
      setUpdating(true);
      await markInTransit(orderId, agentId);
      toast.success('Order marked as in transit!', {
        icon: '🚶',
      });
      await loadOrder();
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeliver = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Please enter OTP');
      return;
    }

    try {
      setUpdating(true);
      await markDelivered(orderId, agentId, otp);
      toast.success('Order delivered successfully!', {
        icon: '✅',
      });
      setTimeout(() => {
        navigate('/agent/dashboard');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid OTP or failed to deliver');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-xl text-white/80 font-medium">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md border border-white/20">
          <p className="text-white text-lg mb-4">Order not found</p>
          <button
            onClick={() => navigate('/agent/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const canPickup = order.status === 'agent_assigned';
  const canTransit = order.status === 'picked_up';
  const canDeliver = order.status === 'in_transit';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/agent/dashboard')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Order Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <h1 className="text-4xl font-black text-white mb-6">Order Details</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-white/60 text-sm mb-2">Order Number</p>
              <p className="text-white font-bold text-xl">{order.order_confirmation}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-white/60 text-sm mb-2">Restaurant</p>
              <p className="text-white font-bold text-xl">{order.restaurant_name}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-white/60 text-sm mb-2">Delivery Gate</p>
              <p className="text-white font-bold text-xl">Gate {order.boarding_gate}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-white/60 text-sm mb-2">Customer</p>
              <p className="text-white font-bold text-xl">{order.user_name}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-white/60 text-sm mb-2">Contact</p>
              <p className="text-white font-bold text-xl">{order.user_contact}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-white/60 text-sm mb-2">Status</p>
              <p className="text-white font-bold text-xl capitalize">{order.status.replace('_', ' ')}</p>
            </div>
          </div>

          {/* OTP Display */}
          {order.delivery_otp && (
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-purple-500/50 mb-6">
              <p className="text-white/80 text-sm mb-2">Delivery OTP (Share with customer)</p>
              <p className="text-4xl font-black text-white tracking-wider">{order.delivery_otp}</p>
            </div>
          )}

          {/* Status Actions */}
          <div className="space-y-4">
            {canPickup && (
              <button
                onClick={handlePickup}
                disabled={updating}
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-bold text-lg transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl disabled:opacity-50"
              >
                {updating ? 'Updating...' : '📦 Mark as Picked Up'}
              </button>
            )}

            {canTransit && (
              <button
                onClick={handleInTransit}
                disabled={updating}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 font-bold text-lg transition-all shadow-lg shadow-orange-500/50 hover:shadow-xl disabled:opacity-50"
              >
                {updating ? 'Updating...' : '🚶 Mark as In Transit'}
              </button>
            )}

            {canDeliver && (
              <form onSubmit={handleDeliver} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <label className="block text-white font-semibold text-lg mb-4">
                  Enter OTP to Complete Delivery
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.toUpperCase())}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="flex-1 px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium text-center tracking-widest"
                    required
                  />
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-bold text-lg transition-all shadow-lg shadow-green-500/50 hover:shadow-xl disabled:opacity-50"
                  >
                    {updating ? 'Delivering...' : '✅ Deliver'}
                  </button>
                </div>
                <p className="text-white/60 text-sm mt-3">
                  Ask the customer for the OTP they received
                </p>
              </form>
            )}

            {order.status === 'delivered' && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/50 text-center">
                <p className="text-2xl font-bold text-white mb-2">✅ Order Delivered!</p>
                <p className="text-white/70">This order has been successfully delivered</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentOrderPage;



