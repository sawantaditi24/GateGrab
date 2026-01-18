from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json
from datetime import datetime
from app.database import SessionLocal
from app.models.order import Order
from app.schemas.order import OrderResponse

router = APIRouter()

# Store active WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}  # order_id -> [websockets]
    
    async def connect(self, websocket: WebSocket, order_id: int):
        await websocket.accept()
        if order_id not in self.active_connections:
            self.active_connections[order_id] = []
        self.active_connections[order_id].append(websocket)
    
    def disconnect(self, websocket: WebSocket, order_id: int):
        if order_id in self.active_connections:
            self.active_connections[order_id].remove(websocket)
            if not self.active_connections[order_id]:
                del self.active_connections[order_id]
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)
    
    async def broadcast_to_order(self, order_id: int, message: dict):
        if order_id in self.active_connections:
            for connection in self.active_connections[order_id]:
                try:
                    await connection.send_json(message)
                except:
                    # Connection closed, remove it
                    self.active_connections[order_id].remove(connection)

manager = ConnectionManager()


@router.websocket("/order/{order_id}")
async def websocket_order_tracking(websocket: WebSocket, order_id: int):
    """WebSocket endpoint for real-time order tracking"""
    await manager.connect(websocket, order_id)
    
    try:
        # Send initial order status
        db = SessionLocal()
        try:
            order = db.query(Order).filter(Order.id == order_id).first()
            if order:
                from app.models.restaurant import Restaurant
                restaurant = db.query(Restaurant).filter(Restaurant.id == order.restaurant_id).first()
                response = OrderResponse.model_validate(order)
                if restaurant:
                    response.restaurant_name = restaurant.name
                if order.delivery_agent:
                    response.delivery_agent_name = order.delivery_agent.name
                
                # Convert to dict with JSON-compatible serialization
                order_dict = response.model_dump(mode='json')
                
                await manager.send_personal_message({
                    "type": "order_status",
                    "data": order_dict
                }, websocket)
        finally:
            db.close()
        
        # Keep connection alive and listen for messages
        while True:
            data = await websocket.receive_text()
            # Echo back or handle client messages if needed
            await manager.send_personal_message({
                "type": "ack",
                "message": "Message received"
            }, websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, order_id)


# Function to broadcast order status updates (can be called from other parts of the app)
async def broadcast_order_update(order_id: int, status: str, data: dict):
    """Broadcast order status update to all connected clients"""
    # Send in the same format as initial order_status message for consistency
    await manager.broadcast_to_order(order_id, {
        "type": "order_status_update",
        "status": status,
        "data": data  # Full order object
    })

