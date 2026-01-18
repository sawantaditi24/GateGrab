from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.order import OrderStatus


class OrderCreate(BaseModel):
    order_confirmation: str
    restaurant_id: int
    user_name: str
    user_contact: str
    boarding_gate: str
    flight_number: Optional[str] = None
    estimated_pickup_time: Optional[datetime] = None


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderResponse(BaseModel):
    id: int
    order_confirmation: str
    restaurant_id: int
    restaurant_name: Optional[str] = None
    user_name: str
    user_contact: str
    boarding_gate: str
    flight_number: Optional[str] = None
    estimated_pickup_time: Optional[datetime] = None
    status: OrderStatus
    delivery_agent_id: Optional[int] = None
    delivery_agent_name: Optional[str] = None
    delivery_otp: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

