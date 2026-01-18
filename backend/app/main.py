from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import airports, restaurants, orders, websocket, agents
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Airport Food Delivery API",
    description="Backend API for airport food delivery coordination platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(airports.router, prefix="/api/airports", tags=["airports"])
app.include_router(restaurants.router, prefix="/api/restaurants", tags=["restaurants"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])
app.include_router(websocket.router, prefix="/ws", tags=["websocket"])


@app.get("/")
async def root():
    return {"message": "Airport Food Delivery API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

