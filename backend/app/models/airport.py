from sqlalchemy import Column, String, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Airport(Base):
    __tablename__ = "airports"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(3), unique=True, index=True, nullable=False)  # IATA code (JFK, LAX, etc.)
    name = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(50), nullable=False)
    timezone = Column(String(50), nullable=False)
    latitude = Column(String(20))
    longitude = Column(String(20))

    terminals = relationship("Terminal", back_populates="airport", cascade="all, delete-orphan")


class Terminal(Base):
    __tablename__ = "terminals"

    id = Column(Integer, primary_key=True, index=True)
    airport_id = Column(Integer, ForeignKey("airports.id"), nullable=False)
    name = Column(String(100), nullable=False)  # e.g., "Terminal 1", "Terminal A"
    layout_data = Column(JSON)  # Store SVG path or coordinate data

    airport = relationship("Airport", back_populates="terminals")
    gates = relationship("Gate", back_populates="terminal", cascade="all, delete-orphan")
    restaurants = relationship("Restaurant", back_populates="terminal")


class Gate(Base):
    __tablename__ = "gates"

    id = Column(Integer, primary_key=True, index=True)
    terminal_id = Column(Integer, ForeignKey("terminals.id"), nullable=False)
    gate_number = Column(String(20), nullable=False)  # e.g., "A12", "B5"
    coordinates = Column(JSON)  # Store x, y coordinates for map display

    terminal = relationship("Terminal", back_populates="gates")



