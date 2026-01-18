import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import TerminalPage from './pages/TerminalPage';
import RestaurantOrderPage from './pages/RestaurantOrderPage';
import DeliveryFormPage from './pages/DeliveryFormPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AgentLoginPage from './pages/AgentLoginPage';
import AgentDashboardPage from './pages/AgentDashboardPage';
import AgentOrderPage from './pages/AgentOrderPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/airport/:code" element={<TerminalPage />} />
          <Route path="/order/:restaurantSlug" element={<RestaurantOrderPage />} />
          <Route path="/delivery" element={<DeliveryFormPage />} />
          <Route path="/track/:orderId" element={<OrderTrackingPage />} />
          <Route path="/track/confirmation/:confirmation" element={<OrderTrackingPage />} />
          
          {/* Agent Routes */}
          <Route path="/agent/login" element={<AgentLoginPage />} />
          <Route path="/agent/dashboard" element={<AgentDashboardPage />} />
          <Route path="/agent/order/:orderId" element={<AgentOrderPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
