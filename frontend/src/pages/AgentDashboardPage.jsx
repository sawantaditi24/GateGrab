import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getAgentOrders, getAgent } from '../services/api';

function AgentDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const agentId = sessionStorage.getItem('agentId');

  useEffect(() => {
    if (!agentId) {
      navigate('/agent/login');
      return;
    }
    loadData();
    
    // Auto-refresh every 5 seconds to get new orders
    const interval = setInterval(() => {
      loadData();
    }, 5000);
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersResponse, agentResponse] = await Promise.all([
        getAgentOrders(agentId),
        getAgent(agentId)
      ]);
      setOrders(ordersResponse.data);
      setAgent(agentResponse.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('agentId');
    sessionStorage.removeItem('agentName');
    navigate('/agent/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      agent_assigned: 'from-purple-500 to-pink-500',
      picked_up: 'from-indigo-500 to-purple-500',
      in_transit: 'from-orange-500 to-red-500',
    };
    return colors[status] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-xl text-white/80 font-medium">Loading dashboard...</p>
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
              <h1 className="text-2xl font-bold text-white">Agent Dashboard</h1>
              {agent && (
                <span className="text-white/60 text-sm">Welcome, {agent.name}</span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white mb-2">Your Orders</h2>
          <p className="text-white/60">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} assigned
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center border border-white/20">
            <svg className="w-20 h-20 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-white/80 text-lg mb-2">No orders assigned</p>
            <p className="text-white/60 text-sm">You'll see orders here when they're assigned to you</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/agent/order/${order.id}`)}
                className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 cursor-pointer border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="text-sm text-white/60 mb-1">Order #{order.order_confirmation}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{order.restaurant_name}</h3>
                    <div className={`inline-block px-3 py-1 bg-gradient-to-r ${getStatusColor(order.status)} rounded-lg text-white text-xs font-semibold mb-3`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Gate {order.boarding_gate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{order.user_name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentDashboardPage;

