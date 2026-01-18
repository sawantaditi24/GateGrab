from pydantic import BaseModel
from app.models.delivery_agent import AgentStatus


class DeliveryAgentResponse(BaseModel):
    id: int
    name: str
    status: AgentStatus
    current_location: str | None
    contact: str | None

    class Config:
        from_attributes = True



