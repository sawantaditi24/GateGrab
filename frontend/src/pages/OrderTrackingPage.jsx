import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getOrder, getOrderByConfirmation, updateOrderStatus } from '../services/api';
import { OrderWebSocket } from '../utils/websocket';

const statusConfig = {
  order_placed: {
    label: 'Order Placed',
    icon: '✓',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Your order has been received',
  },
  restaurant_preparing: {
    label: 'Restaurant Preparing',
    icon: '👨‍🍳',
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Restaurant is preparing your order',
  },
  agent_assigned: {
    label: 'Delivery Agent Assigned',
    icon: '👤',
    gradient: 'from-purple-500 to-pink-500',
    description: 'A delivery agent has been assigned',
  },
  picked_up: {
    label: 'Picked Up',
    icon: '📦',
    gradient: 'from-indigo-500 to-purple-500',
    description: 'Order picked up from restaurant',
  },
  in_transit: {
    label: 'In Transit',
    icon: '🚶',
    gradient: 'from-orange-500 to-red-500',
    description: 'On the way to your gate',
  },
  delivered: {
    label: 'Delivered',
    icon: '✓',
    gradient: 'from-green-500 to-emerald-500',
    description: 'Order delivered at your gate',
  },
  cancelled: {
    label: 'Cancelled',
    icon: '✕',
    gradient: 'from-red-500 to-rose-500',
    description: 'Order has been cancelled',
  },
};

function OrderTrackingPage() {
  const { orderId, confirmation } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState(null);
  const previousStatusRef = useRef(null);

  useEffect(() => {
    loadOrder();
  }, [orderId, confirmation]);

  useEffect(() => {
    let ws = null;
    
    if (order && order.id) {
      // Store initial status
      previousStatusRef.current = order.status;
      
      ws = new OrderWebSocket(
        order.id,
        (message) => {
          console.log('WebSocket message:', message);
          if (message.type === 'order_status' || message.type === 'order_status_update') {
            if (message.data) {
              const newStatus = message.data.status;
              const oldStatus = previousStatusRef.current;
              
              // Show notification if status changed
              if (oldStatus && newStatus !== oldStatus) {
                const statusInfo = statusConfig[newStatus];
                if (statusInfo) {
                  toast.success(`Order Update: ${statusInfo.label}`, {
                    icon: '🎉',
                    duration: 5000,
                  });
                }
              }
              
              previousStatusRef.current = newStatus;
              setOrder(message.data);
            }
          }
        },
        (err) => {
          console.error('WebSocket error:', err);
          setWsError('Connection error. Status updates may be delayed.');
          toast.error('Connection lost. Reconnecting...');
        }
      );

      ws.connect();
      setWsConnected(true);
      toast.success('Live tracking connected!', { icon: '🔴', duration: 3000 });

      return () => {
        if (ws) {
          ws.disconnect();
        }
      };
    }
  }, [order?.id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      let response;
      
      if (orderId) {
        response = await getOrder(orderId);
      } else if (confirmation) {
        response = await getOrderByConfirmation(confirmation);
      } else {
        throw new Error('No order ID or confirmation provided');
      }
      
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Order not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    const statuses = [
      'order_placed',
      'restaurant_preparing',
      'agent_assigned',
      'picked_up',
      'in_transit',
      'delivered',
    ];
    
    return statuses.map((status, index) => {
      const config = statusConfig[status];
      const isActive = order?.status === status;
      const isCompleted = statuses.indexOf(order?.status) > index;
      
      return {
        ...config,
        status,
        isActive,
        isCompleted,
        index,
      };
    });
  };

  const getNextStatus = () => {
    const statuses = [
      'order_placed',
      'restaurant_preparing',
      'agent_assigned',
      'picked_up',
      'in_transit',
      'delivered',
    ];
    
    const currentIndex = statuses.indexOf(order?.status);
    if (currentIndex < statuses.length - 1) {
      return statuses[currentIndex + 1];
    }
    return null;
  };

  const handleAdvanceStatus = async () => {
    const nextStatus = getNextStatus();
    if (!nextStatus || !order?.id) return;

    try {
      await updateOrderStatus(order.id, nextStatus);
      toast.success(`Status updated to: ${statusConfig[nextStatus]?.label}`, {
        icon: '✅',
      });
      // Reload order to get updated data
      await loadOrder();
    } catch (err) {
      toast.error('Failed to update status', { icon: '❌' });
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="mt-6 text-xl text-white/80 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md border border-white/20">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-white text-lg mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-medium transition-all shadow-lg shadow-purple-500/50"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentStatusConfig = statusConfig[order.status] || statusConfig.order_placed;
  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Home</span>
            </button>
            <div className="flex items-center gap-3">
              {wsConnected ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/50">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-green-300 text-sm font-medium">Live Tracking</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                  <span className="w-2 h-2 bg-white/40 rounded-full"></span>
                  <span className="text-white/60 text-sm">Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Order Info Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Order Tracking</h1>
              <p className="text-white/60 text-lg">Order #{order.order_confirmation}</p>
            </div>
            <div className={`px-6 py-3 bg-gradient-to-r ${currentStatusConfig.gradient} rounded-xl shadow-lg`}>
              <span className="text-white font-bold text-lg">{currentStatusConfig.label}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-white/60 text-sm mb-2">Restaurant</p>
              <p className="text-white font-bold text-xl">{order.restaurant_name || 'N/A'}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-white/60 text-sm mb-2">Delivery Gate</p>
              <p className="text-white font-bold text-xl">Gate {order.boarding_gate}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-white/60 text-sm mb-2">Passenger</p>
              <p className="text-white font-bold text-xl">{order.user_name}</p>
            </div>
            {order.delivery_agent_name && (
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-white/60 text-sm mb-2">Delivery Agent</p>
                <p className="text-white font-bold text-xl">{order.delivery_agent_name}</p>
              </div>
            )}
          </div>

          {/* OTP Display for Customer */}
          {order.delivery_otp && order.status !== 'delivered' && (
            <div className="mt-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-purple-500/50">
              <p className="text-white/80 text-sm mb-2">Delivery Verification Code</p>
              <p className="text-4xl font-black text-white tracking-wider mb-2">{order.delivery_otp}</p>
              <p className="text-white/60 text-sm">Share this code with the delivery agent to complete delivery</p>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-8">Order Status</h2>
          
          {wsError && (
            <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 text-yellow-200 px-6 py-4 rounded-xl mb-8">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{wsError}</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {statusSteps.map((step, index) => (
              <div key={step.status} className="flex items-start gap-6">
                {/* Status Icon */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl transition-all duration-300 ${
                  step.isCompleted
                    ? `bg-gradient-to-br ${step.gradient} text-white shadow-lg shadow-purple-500/50`
                    : step.isActive
                    ? `bg-gradient-to-br ${step.gradient} text-white shadow-lg shadow-purple-500/50 ring-4 ring-purple-500/30 scale-110`
                    : 'bg-white/10 text-white/40 border border-white/20'
                }`}>
                  {step.isCompleted ? '✓' : step.index + 1}
                </div>

                {/* Status Info */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-xl font-bold ${
                      step.isActive || step.isCompleted ? 'text-white' : 'text-white/50'
                    }`}>
                      {step.label}
                    </h3>
                    {step.isActive && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                        Current
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    step.isActive || step.isCompleted ? 'text-white/70' : 'text-white/40'
                  }`}>
                    {step.description}
                  </p>
                  {step.isActive && (
                    <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${step.gradient} rounded-full animate-pulse`} style={{ width: '60%' }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Manual Status Advancement Button */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Manual Status Update</h3>
                    <p className="text-white/60 text-sm">
                      {getNextStatus() 
                        ? `Advance to: ${statusConfig[getNextStatus()]?.label}`
                        : 'Order completed'}
                    </p>
                  </div>
                  {getNextStatus() && (
                    <button
                      onClick={handleAdvanceStatus}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-semibold transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:scale-105 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Next Status
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {order.flight_number && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mt-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-3">Flight Information</h3>
            <p className="text-white/70">Flight: <span className="font-semibold text-white">{order.flight_number}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderTrackingPage;
