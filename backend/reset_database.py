"""
Reset database script - Deletes old database and recreates with new schema
Run this when you've added new columns to models
"""
import os
from app.database import engine, Base
from app.models import Airport, Terminal, Gate, Restaurant, Order, DeliveryAgent

# Delete old database
db_file = "airport_delivery.db"
if os.path.exists(db_file):
    os.remove(db_file)
    print(f"✅ Deleted old database: {db_file}")

# Create new tables with updated schema
Base.metadata.create_all(bind=engine)
print("✅ Created new database with updated schema")
print("\nNow run: python seed_data.py")



