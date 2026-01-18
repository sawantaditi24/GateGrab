#!/bin/bash

# Start Backend Server
cd "$(dirname "$0")/backend"

# Activate virtual environment
source venv/bin/activate

# Check if dependencies are installed
if [ ! -d "venv/lib" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

# Check if database is seeded
if [ ! -f "airport_delivery.db" ] && [ ! -f ".db_seeded" ]; then
    echo "Seeding database..."
    python seed_data.py
    touch .db_seeded
fi

# Start server
echo "Starting backend server on http://localhost:8000"
uvicorn app.main:app --reload



