from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.database import get_db
from app.models.order import Order, OrderStatus
from app.models.delivery_agent import DeliveryAgent
from app.models.restaurant import Restaurant
from app.schemas.order import OrderResponse
from app.services.otp_service import generate_otp, verify_otp
from app.routers.websocket import broadcast_order_update

router = APIRouter()


class DeliverRequest(BaseModel):
    otp: str


@router.get("/{agent_id}/orders", response_model=List[OrderResponse])
async def get_agent_orders(agent_id: int, db: Session = Depends(get_db)):
    """Get all orders assigned to a delivery agent"""
    agent = db.query(DeliveryAgent).filter(DeliveryAgent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Get all orders assigned to this agent (excluding delivered and cancelled)
    from sqlalchemy import not_
    orders = db.query(Order).filter(
        Order.delivery_agent_id == agent_id
    ).filter(
        not_(Order.status.in_([
            OrderStatus.DELIVERED,
            OrderStatus.CANCELLED
        ]))
    ).order_by(Order.created_at.desc()).all()
    
    result = []
    for order in orders:
        restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
        response = OrderResponse.model_validate(order)
        if restaurant:
            response.restaurant_name = restaurant.name
        if order.delivery_agent:
            response.delivery_agent_name = order.delivery_agent.name
        result.append(response)
    
    return result


@router.put("/orders/{order_id}/pickup")
async def mark_picked_up(
    order_id: int, 
    agent_id: int = Query(..., description="Agent ID"),
    db: Session = Depends(get_db)
):
    """Mark order as picked up and generate OTP"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.delivery_agent_id != agent_id:
        raise HTTPException(status_code=403, detail="Order not assigned to this agent")
    
    # Generate OTP when order is picked up
    if not order.delivery_otp:
        order.delivery_otp = generate_otp()
    
    order.status = OrderStatus.PICKED_UP
    db.commit()
    db.refresh(order)
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    response = OrderResponse.model_validate(order)
    if restaurant:
        response.restaurant_name = restaurant.name
    if order.delivery_agent:
        response.delivery_agent_name = order.delivery_agent.name
    
    # Broadcast update to all connected clients (customer tracking page)
    order_dict = response.model_dump(mode='json')
    await broadcast_order_update(order_id, "picked_up", order_dict)
    
    return {
        "message": "Order marked as picked up",
        "order": response,
        "otp": order.delivery_otp  # Return OTP for agent to share
    }


@router.put("/orders/{order_id}/transit")
async def mark_in_transit(
    order_id: int, 
    agent_id: int = Query(..., description="Agent ID"),
    db: Session = Depends(get_db)
):
    """Mark order as in transit"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.delivery_agent_id != agent_id:
        raise HTTPException(status_code=403, detail="Order not assigned to this agent")
    
    order.status = OrderStatus.IN_TRANSIT
    db.commit()
    db.refresh(order)
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    response = OrderResponse.model_validate(order)
    if restaurant:
        response.restaurant_name = restaurant.name
    if order.delivery_agent:
        response.delivery_agent_name = order.delivery_agent.name
    
    # Broadcast update to all connected clients (customer tracking page)
    order_dict = response.model_dump(mode='json')
    await broadcast_order_update(order_id, "in_transit", order_dict)
    
    return {
        "message": "Order marked as in transit",
        "order": response
    }


@router.post("/orders/{order_id}/deliver")
async def mark_delivered(
    order_id: int,
    agent_id: int = Query(..., description="Agent ID"),
    request: DeliverRequest = Body(...),
    db: Session = Depends(get_db)
):
    """Mark order as delivered after OTP verification"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.delivery_agent_id != agent_id:
        raise HTTPException(status_code=403, detail="Order not assigned to this agent")
    
    if not order.delivery_otp:
        raise HTTPException(status_code=400, detail="OTP not generated for this order")
    
    if not verify_otp(request.otp, order.delivery_otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    order.status = OrderStatus.DELIVERED
    db.commit()
    db.refresh(order)
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
    response = OrderResponse.model_validate(order)
    if restaurant:
        response.restaurant_name = restaurant.name
    if order.delivery_agent:
        response.delivery_agent_name = order.delivery_agent.name
    
    # Broadcast update to all connected clients (customer tracking page)
    order_dict = response.model_dump(mode='json')
    await broadcast_order_update(order_id, "delivered", order_dict)
    
    return {
        "message": "Order delivered successfully",
        "order": response
    }


@router.get("/{agent_id}")
async def get_agent(agent_id: int, db: Session = Depends(get_db)):
    """Get agent details"""
    agent = db.query(DeliveryAgent).filter(DeliveryAgent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return {
        "id": agent.id,
        "name": agent.name,
        "agent_code": agent.agent_code,
        "status": agent.status,
        "current_location": agent.current_location
    }

