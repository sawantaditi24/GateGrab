from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import airports, restaurants, orders, websocket, agents, admin
from app.database import engine, Base
import os
from dotenv import load_dotenv

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Airport Food Delivery API",
    description="Backend API for airport food delivery coordination platform",
    version="1.0.0"
)

# CORS configuration - allow frontend URL from environment or default to localhost
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [
    frontend_url,
    "http://localhost:5173",
    "http://localhost:3000",
]

# Add production frontend URL if provided
if os.getenv("FRONTEND_URL"):
    allowed_origins.append(os.getenv("FRONTEND_URL"))

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])


@app.get("/")
async def root():
    return {"message": "Airport Food Delivery API", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

