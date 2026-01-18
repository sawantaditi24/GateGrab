from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Integer as SQLInteger
from sqlalchemy.orm import relationship
from app.database import Base


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    terminal_id = Column(Integer, ForeignKey("terminals.id"), nullable=False)
    name = Column(String(255), nullable=False)
    cuisine_type = Column(String(100))  # e.g., "Mexican", "Fast Food", "Coffee"
    location = Column(JSON)  # Store x, y coordinates for map
    nearby_gates = Column(JSON)  # List of gate numbers nearby, e.g., ["A10", "A11", "A12"]
    estimated_prep_time = Column(Integer, default=15)  # minutes
    mock_ordering_slug = Column(String(100))  # e.g., "chipotle", "mcdonalds"
    description = Column(String(500))

    terminal = relationship("Terminal", back_populates="restaurants")
    orders = relationship("Order", back_populates="restaurant")



