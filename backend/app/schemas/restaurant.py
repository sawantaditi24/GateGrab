from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class RestaurantResponse(BaseModel):
    id: int
    name: str
    cuisine_type: Optional[str] = None
    location: Optional[Dict[str, Any]] = None
    nearby_gates: Optional[List[str]] = None
    estimated_prep_time: int
    mock_ordering_slug: Optional[str] = None
    description: Optional[str] = None
    distance_from_gate: Optional[float] = None  # Calculated field

    class Config:
        from_attributes = True


class RestaurantListResponse(BaseModel):
    restaurants: List[RestaurantResponse]
    total: int



