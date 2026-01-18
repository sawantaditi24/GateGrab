from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class OrderStatus(str, enum.Enum):
    ORDER_PLACED = "order_placed"
    RESTAURANT_PREPARING = "restaurant_preparing"
    AGENT_ASSIGNED = "agent_assigned"
    PICKED_UP = "picked_up"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_confirmation = Column(String(50), unique=True, index=True, nullable=False)  # User's order number from restaurant
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    user_name = Column(String(255), nullable=False)
    user_contact = Column(String(255), nullable=False)  # Email or phone
    boarding_gate = Column(String(20), nullable=False)
    flight_number = Column(String(20))
    estimated_pickup_time = Column(DateTime)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.ORDER_PLACED, nullable=False)
    delivery_agent_id = Column(Integer, ForeignKey("delivery_agents.id"), nullable=True)
    delivery_otp = Column(String(6), nullable=True)  # 6-digit OTP for delivery verification
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    restaurant = relationship("Restaurant", back_populates="orders")
    delivery_agent = relationship("DeliveryAgent", back_populates="orders")

