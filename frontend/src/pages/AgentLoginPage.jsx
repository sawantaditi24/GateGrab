import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getAgent } from '../services/api';

function AgentLoginPage() {
  const [agentId, setAgentId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!agentId.trim()) {
      toast.error('Please enter Agent ID');
      return;
    }

    try {
      setLoading(true);
      const response = await getAgent(parseInt(agentId));
      // Store agent info in sessionStorage
      sessionStorage.setItem('agentId', agentId);
      sessionStorage.setItem('agentName', response.data.name);
      toast.success(`Welcome, ${response.data.name}!`);
      navigate(`/agent/dashboard`);
    } catch (err) {
      toast.error('Invalid Agent ID. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 max-w-md w-full border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/50">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Agent Login</h1>
          <p className="text-white/70 text-lg">Enter your Agent ID to access the dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white font-semibold text-lg mb-3">
              Agent ID
            </label>
            <input
              type="number"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="e.g., 1"
              className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-medium"
              required
              autoFocus
            />
            <p className="text-white/60 text-sm mt-2">
              For demo: Use Agent ID 1
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 font-black text-lg transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AgentLoginPage;



