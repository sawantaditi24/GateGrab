#!/bin/bash
# Railway startup script
set -e

# Wait for database to be ready (if using PostgreSQL)
if [ -n "$DATABASE_URL" ]; then
  echo "Database URL configured: ${DATABASE_URL:0:20}..."
fi

# Run database migrations/create tables (handled by main.py)
# Seed data if database is empty (optional - run manually via Railway CLI)
# python seed_data.py

# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}

