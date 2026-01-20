# GateGrab - Airport Food Delivery Platform

## The Problem

Traveling through airports is stressful enough without having to worry about missing your flight while searching for food. Every traveler has faced this dilemma: you're hungry, but your boarding gate is far away, and you're not sure if you have enough time to walk to the nearest restaurant, order, wait, and make it back to your gate on time.

This uncertainty forces many travelers to either:
- Skip meals entirely and travel hungry
- Risk missing their flight by venturing too far from their gate
- Settle for whatever overpriced snack is closest, regardless of preference

For airport restaurants, this means lost revenue from travelers who would have ordered if they knew delivery was an option. The problem is clear: there's no convenient way for travelers to order food from airport restaurants and have it delivered directly to their boarding gate.

## The Solution

GateGrab is a delivery coordination platform that connects hungry travelers with airport restaurants and delivery agents. Travelers can browse nearby restaurants based on their terminal and gate location, place orders through the restaurant's system, and have their food delivered directly to their boarding gate - all while tracking their order in real-time.

### Key Benefits

**For Travelers:**
- Order food from any restaurant in the airport without leaving your gate
- Real-time order tracking so you know exactly when your food will arrive
- Peace of mind knowing you won't miss your flight
- Access to a wider variety of food options, not just what's nearby

**For Restaurants:**
- Increased revenue from travelers who would otherwise skip ordering
- Better customer reach across large airport terminals
- Opportunity to serve customers who discover them through the platform

**For Airports:**
- Improved traveler satisfaction
- Better utilization of existing restaurant infrastructure
- Enhanced airport experience

## Features

### Core Functionality

- **Multi-Airport Support**: Currently supports 8 major US airports (JFK, LAX, ATL, ORD, DFW, SFO, MIA, DEN) with terminal and gate layouts
- **Smart Restaurant Discovery**: Find restaurants near your boarding gate with distance calculations
- **Seamless Ordering Flow**: Browse restaurant menus, add items to cart, and complete checkout
- **Delivery Coordination**: Enter your gate details, contact information, and order confirmation to coordinate delivery
- **Real-time Order Tracking**: Live status updates via WebSocket connection showing order progress
- **Delivery Agent Portal**: Dedicated interface for delivery agents to manage orders and update status
- **Secure Delivery Verification**: OTP-based confirmation system to ensure orders reach the right person

### Technical Features

- **Real-time Updates**: WebSocket-based live tracking of order status
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **RESTful API**: Well-structured backend API with comprehensive documentation
- **Database Seeding**: Easy setup with pre-populated airport and restaurant data

## Tech Stack

### Frontend
- **React** (JavaScript) - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls
- **React Router DOM** - Client-side routing
- **React Hot Toast** - User notifications
- **Native WebSocket API** - Real-time order tracking

### Backend
- **FastAPI** (Python) - High-performance web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Production database (SQLite for development)
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server
- **WebSockets** - Real-time bidirectional communication

## Project Structure

```
.
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── TerminalPage.jsx
│   │   │   ├── RestaurantOrderPage.jsx
│   │   │   ├── DeliveryFormPage.jsx
│   │   │   ├── OrderTrackingPage.jsx
│   │   │   ├── AgentLoginPage.jsx
│   │   │   ├── AgentDashboardPage.jsx
│   │   │   └── AgentOrderPage.jsx
│   │   ├── services/        # API service layer
│   │   │   └── api.js
│   │   ├── utils/           # Utility functions
│   │   │   └── websocket.js
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── models/          # SQLAlchemy database models
│   │   │   ├── airport.py
│   │   │   ├── restaurant.py
│   │   │   ├── order.py
│   │   │   └── delivery_agent.py
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routers/         # API route handlers
│   │   │   ├── airports.py
│   │   │   ├── restaurants.py
│   │   │   ├── orders.py
│   │   │   ├── agents.py
│   │   │   ├── websocket.py
│   │   │   └── admin.py
│   │   ├── services/        # Business logic
│   │   │   ├── order_service.py
│   │   │   └── otp_service.py
│   │   ├── database.py      # Database configuration
│   │   └── main.py          # FastAPI application
│   ├── requirements.txt
│   ├── seed_data.py         # Database seeding script
│   └── Procfile             # Deployment configuration
│
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** (v20 or higher)
- **Python** (v3.9 or higher)
- **PostgreSQL** (optional for development, SQLite works locally)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables (create a `.env` file):
```env
DATABASE_URL=sqlite:///./airport_delivery.db
# For production: DATABASE_URL=postgresql://user:password@host:5432/dbname

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
```

5. Seed the database with initial data:
```bash
python seed_data.py
```

6. Start the development server:
```bash
uvicorn app.main:app --reload
```

The backend API will be available at `http://localhost:8000`

Interactive API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional for local development):
```env
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Airports
- `GET /api/airports/` - Get all available airports
- `GET /api/airports/{code}` - Get specific airport details

### Restaurants
- `GET /api/restaurants/airport/{code}?gate={gate}` - Get restaurants by airport (optionally filtered by gate proximity)
- `GET /api/restaurants/{id}` - Get restaurant details

### Orders
- `POST /api/orders/` - Create a new delivery order
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/confirmation/{confirmation}` - Get order by confirmation number

### Delivery Agents
- `GET /api/agents/{agent_id}` - Get agent details
- `GET /api/agents/{agent_id}/orders` - Get orders assigned to agent
- `POST /api/agents/{agent_id}/orders/{order_id}/picked-up` - Mark order as picked up
- `POST /api/agents/{agent_id}/orders/{order_id}/in-transit` - Mark order as in transit
- `POST /api/agents/{agent_id}/orders/{order_id}/delivered` - Mark order as delivered (requires OTP)

### WebSocket
- `WS /ws/order/{order_id}` - Real-time order status updates

### Admin
- `GET /api/admin/seed?secret=seed-me-please` - Seed database with initial data

## User Workflow

### Traveler Flow

1. **Select Airport**: Choose your departure airport from the list
2. **Enter Gate**: Input your boarding gate number
3. **Browse Restaurants**: View nearby restaurants with distance information
4. **Place Order**: Browse menu, add items to cart, and complete checkout (simulated)
5. **Enter Delivery Details**: Provide order confirmation number, name, contact, gate, and flight number
6. **Track Order**: Monitor real-time status updates as your order is prepared, picked up, and delivered

### Delivery Agent Flow

1. **Login**: Enter agent ID to access the agent portal
2. **View Assigned Orders**: See all orders assigned to you
3. **Update Status**: Mark orders as picked up, in transit, or delivered
4. **Verify Delivery**: Enter OTP provided by customer to complete delivery

## Deployment

### Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import your GateGrab repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
5. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL (e.g., `https://gategrab.onrender.com`)
6. Click "Deploy"

### Backend Deployment (Render)

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `gategrab-backend`
   - **Environment**: Python 3
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Create a **PostgreSQL Database**:
   - Create a new PostgreSQL instance
   - Copy the internal database URL
6. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `FRONTEND_URL`: Your Vercel frontend URL
   - `BACKEND_URL`: Your Render backend URL
7. Deploy the service
8. Seed the database:
   - Visit: `https://your-backend-url.onrender.com/api/admin/seed?secret=seed-me-please`

For detailed deployment instructions, see `RENDER_DEPLOY.md`

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
# Or for local development: sqlite:///./airport_delivery.db

# URLs
FRONTEND_URL=https://your-frontend.vercel.app
BACKEND_URL=https://your-backend.onrender.com
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend.onrender.com
```

## Database Schema

- **Airports**: Airport information (code, name, city, state)
- **Terminals**: Terminal data with layout information
- **Gates**: Gate locations with coordinates for distance calculations
- **Restaurants**: Restaurant information with terminal and location data
- **Orders**: Delivery orders with status, gate, customer info, and agent assignment
- **DeliveryAgents**: Delivery agent information and availability status

## Development

### Running Locally

1. Start the backend server:
```bash
cd backend
uvicorn app.main:app --reload
```

2. Start the frontend server:
```bash
cd frontend
npm run dev
```

3. Access the application:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`

### Database Seeding

To populate the database with initial data:

**Local Development:**
```bash
cd backend
python seed_data.py
```

**Production (via API):**
```bash
curl "https://your-backend-url.onrender.com/api/admin/seed?secret=seed-me-please"
```

## Future Enhancements

- Integration with real restaurant ordering APIs
- Flight status API integration for automatic gate updates
- Push notifications for order updates
- Payment processing integration
- Multi-language support
- Mobile app development
- Advanced route optimization for delivery agents
- Customer reviews and ratings
- Restaurant analytics dashboard

## Contributing

This is a personal project for learning and portfolio purposes. Contributions and suggestions are welcome.

## License

This project is for educational and portfolio purposes.

## Acknowledgments

Built as a learning project to explore full-stack development with React, FastAPI, WebSockets, and modern deployment practices.
