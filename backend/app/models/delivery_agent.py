from sqlalchemy import Column, String, Integer, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class AgentStatus(str, enum.Enum):
    AVAILABLE = "available"
    ASSIGNED = "assigned"
    ON_DELIVERY = "on_delivery"
    OFFLINE = "offline"


class DeliveryAgent(Base):
    __tablename__ = "delivery_agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    agent_code = Column(String(20), unique=True, nullable=False)  # Unique agent code for login
    password = Column(String(255), nullable=True)  # For future authentication
    status = Column(SQLEnum(AgentStatus), default=AgentStatus.AVAILABLE, nullable=False)
    current_location = Column(String(100))  # Terminal or gate location
    contact = Column(String(255))

    orders = relationship("Order", back_populates="delivery_agent")

