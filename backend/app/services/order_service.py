from sqlalchemy.orm import Session
from app.models.order import Order, OrderStatus
from app.models.delivery_agent import DeliveryAgent, AgentStatus


def assign_delivery_agent(order_id: int, db: Session):
    """
    Assign an available delivery agent to an order.
    For MVP, this is simulated - we'll use existing agents or reuse them.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return
    
    # Find an available agent first
    agent = db.query(DeliveryAgent).filter(
        DeliveryAgent.status == AgentStatus.AVAILABLE
    ).first()
    
    # If no available agent, find any agent (even if assigned) and reuse it
    if not agent:
        agent = db.query(DeliveryAgent).first()
    
    # If still no agent exists, create one with a unique code
    if not agent:
        # Generate unique agent code
        import random
        agent_code = f"AGENT{random.randint(100, 999)}"
        # Make sure it's unique
        while db.query(DeliveryAgent).filter(DeliveryAgent.agent_code == agent_code).first():
            agent_code = f"AGENT{random.randint(100, 999)}"
        
        agent = DeliveryAgent(
            name="Delivery Agent",
            agent_code=agent_code,
            status=AgentStatus.ASSIGNED,
            current_location=order.boarding_gate
        )
        db.add(agent)
        db.commit()
        db.refresh(agent)
    else:
        # Update existing agent
        agent.status = AgentStatus.ASSIGNED
        agent.current_location = order.boarding_gate
        db.commit()
    
    # Assign agent to order
    order.delivery_agent_id = agent.id
    order.status = OrderStatus.AGENT_ASSIGNED
    db.commit()

