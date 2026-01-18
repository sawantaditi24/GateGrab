import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Airports API
export const getAirports = () => api.get('/api/airports');
export const getAirport = (code) => api.get(`/api/airports/${code}`);

// Restaurants API
export const getRestaurantsByAirport = (airportCode, gate = null) => {
  const params = gate ? { gate } : {};
  return api.get(`/api/restaurants/airport/${airportCode}`, { params });
};
export const getRestaurant = (id) => api.get(`/api/restaurants/${id}`);

// Orders API
export const createOrder = (orderData) => api.post('/api/orders', orderData);
export const getOrder = (id) => api.get(`/api/orders/${id}`);
export const getOrderByConfirmation = (confirmation) => 
  api.get(`/api/orders/confirmation/${confirmation}`);
export const updateOrderStatus = (id, status) => 
  api.put(`/api/orders/${id}/status`, { status });

// Agents API
export const getAgentOrders = (agentId) => api.get(`/api/agents/${agentId}/orders`);
export const getAgent = (agentId) => api.get(`/api/agents/${agentId}`);
export const markPickedUp = (orderId, agentId) => 
  api.put(`/api/agents/orders/${orderId}/pickup?agent_id=${agentId}`);
export const markInTransit = (orderId, agentId) => 
  api.put(`/api/agents/orders/${orderId}/transit?agent_id=${agentId}`);
export const markDelivered = (orderId, agentId, otp) => 
  api.post(`/api/agents/orders/${orderId}/deliver?agent_id=${agentId}`, { otp });

// WebSocket helper
export const getWebSocketUrl = (orderId) => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsHost = import.meta.env.VITE_API_URL 
    ? new URL(import.meta.env.VITE_API_URL).host
    : 'localhost:8000';
  return `${wsProtocol}//${wsHost}/ws/order/${orderId}`;
};

export default api;

