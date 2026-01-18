# Airport Food Delivery Platform

A web application that helps travelers order food from airport restaurants and have it delivered to their boarding gates. This platform acts as a delivery coordination layer, connecting travelers with restaurants and delivery agents.

## Features

- **Airport Selection**: Choose from multiple US airports (JFK, LAX, ATL, ORD, DFW, SFO, MIA, DEN)
- **Terminal Maps**: Interactive terminal layouts with gate locations
- **Restaurant Discovery**: Find restaurants near your boarding gate
- **Mock Ordering**: Simulated restaurant ordering flow
- **Delivery Coordination**: Coordinate food delivery to your gate
- **Real-time Tracking**: Track your order status via WebSocket
- **Distance Calculation**: See estimated distance and delivery time
- **Delivery Agent Portal**: Agent login and order management system
- **OTP Verification**: Secure delivery confirmation with OTP

## Tech Stack

### Frontend
- **React** (JavaScript)
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Routing
- **React Hot Toast** - Notifications
- **WebSocket** - Real-time updates

### Backend
- **FastAPI** (Python) - Web framework
- **SQLite** - Database (PostgreSQL ready for production)
- **SQLAlchemy** - ORM
- **WebSockets** - Real-time updates
- **Uvicorn** - ASGI server

## Project Structure

```
.
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── routers/     # API routes
│   │   ├── services/    # Business logic
│   │   └── main.py      # FastAPI app
│   ├── requirements.txt
│   └── seed_data.py     # Initial data seeding
│
```

## Getting Started

### Prerequisites

- **Node.js** (v20+)
- **Python** (v3.9+)
- **PostgreSQL** (optional, SQLite works for development)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables (optional):
```bash
# Create .env file (see .env.example)
# For development, SQLite will be used by default
```

5. Seed initial data:
```bash
python seed_data.py
```

6. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend will run on `http://localhost:8000`

API docs available at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Airports
- `GET /api/airports/` - Get all airports
- `GET /api/airports/{code}` - Get airport by code

### Restaurants
- `GET /api/restaurants/airport/{code}?gate={gate}` - Get restaurants by airport (optionally filtered by gate)
- `GET /api/restaurants/{id}` - Get restaurant details

### Orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/confirmation/{confirmation}` - Get order by confirmation number
- `PUT /api/orders/{id}/status` - Update order status

### WebSocket
- `WS /ws/order/{order_id}` - Real-time order tracking

## Development Workflow

1. **Start Backend**: Run FastAPI server
2. **Start Frontend**: Run Vite dev server
3. **Access App**: Open `http://localhost:5173`
4. **API Testing**: Use `http://localhost:8000/docs` for interactive API docs

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/airport_delivery
# Or use SQLite (default): sqlite:///./airport_delivery.db

AIRPORTS_API_KEY=your_key_here
FLIGHT_API_KEY=your_key_here

BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

## Database Schema

- **Airports**: Airport information
- **Terminals**: Terminal data with layout
- **Gates**: Gate locations with coordinates
- **Restaurants**: Restaurant info with locations
- **Orders**: Delivery coordination orders
- **DeliveryAgents**: Delivery agent management

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway/Render)
- Set up PostgreSQL database
- Configure environment variables
- Deploy FastAPI app

## Documentation

API documentation available at `/docs` endpoint

## Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [WebSocket Guide](https://fastapi.tiangolo.com/advanced/websockets/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

This project is for educational purposes.



