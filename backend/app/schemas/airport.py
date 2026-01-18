from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class GateResponse(BaseModel):
    id: int
    gate_number: str
    coordinates: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class TerminalResponse(BaseModel):
    id: int
    name: str
    layout_data: Optional[Dict[str, Any]] = None
    gates: List[GateResponse] = []

    class Config:
        from_attributes = True


class AirportResponse(BaseModel):
    id: int
    code: str
    name: str
    city: str
    state: str
    timezone: str
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    terminals: List[TerminalResponse] = []

    class Config:
        from_attributes = True



