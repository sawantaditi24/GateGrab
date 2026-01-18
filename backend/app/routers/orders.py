from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.order import Order, OrderStatus
from app.models.restaurant import Restaurant
from app.models.delivery_agent import DeliveryAgent, AgentStatus
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate
from app.services.order_service import assign_delivery_agent

router = APIRouter()


@router.post("/", response_model=OrderResponse)
async def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    """Create a new delivery coordination order"""
    # Validate restaurant_id
    if not order_data.restaurant_id or order_data.restaurant_id <= 0:
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")
    
    # Verify restaurant exists
    restaurant = db.query(Restaurant).filter(Restaurant.id == order_data.restaurant_id).first()
    if not restaurant:
        raise HTTPException(
            status_code=404, 
            detail=f"Restaurant with ID {order_data.restaurant_id} not found. Please check if the restaurant exists."
        )
    
    # Check if order confirmation already exists
    existing = db.query(Order).filter(
        Order.order_confirmation == order_data.order_confirmation
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Order confirmation number already exists")
    
    # Create order
    new_order = Order(
        order_confirmation=order_data.order_confirmation,
        restaurant_id=order_data.restaurant_id,
        user_name=order_data.user_name,
        user_contact=order_data.user_contact,
        boarding_gate=order_data.boarding_gate,
        flight_number=order_data.flight_number,
        estimated_pickup_time=order_data.estimated_pickup_time,
        status=OrderStatus.ORDER_PLACED
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    # Automatically assign delivery agent (simulated)
    assign_delivery_agent(new_order.id, db)
    
    # Refresh to get agent info
    db.refresh(new_order)
    
    response = OrderResponse.model_validate(new_order)
    response.restaurant_name = restaurant.name
    if new_order.delivery_agent:
        response.delivery_agent_name = new_order.delivery_agent.name
    
    return response


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get order details by ID"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    response = OrderResponse.model_validate(order)
    if restaurant:
        response.restaurant_name = restaurant.name
    if order.delivery_agent:
        response.delivery_agent_name = order.delivery_agent.name
    
    return response


@router.get("/confirmation/{order_confirmation}", response_model=OrderResponse)
async def get_order_by_confirmation(order_confirmation: str, db: Session = Depends(get_db)):
    """Get order by confirmation number"""
    order = db.query(Order).filter(Order.order_confirmation == order_confirmation).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    response = OrderResponse.model_validate(order)
    if restaurant:
        response.restaurant_name = restaurant.name
    if order.delivery_agent:
        response.delivery_agent_name = order.delivery_agent.name
    
    return response


@router.put("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db)
):
    """Update order status"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status_update.status
    db.commit()
    db.refresh(order)
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    response = OrderResponse.model_validate(order)
    if restaurant:
        response.restaurant_name = restaurant.name
    if order.delivery_agent:
        response.delivery_agent_name = order.delivery_agent.name
    
    return response

