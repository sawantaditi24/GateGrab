from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.restaurant import Restaurant
from app.models.airport import Terminal, Gate
from app.schemas.restaurant import RestaurantResponse, RestaurantListResponse
from app.services.distance import calculate_distance

router = APIRouter()


@router.get("/airport/{airport_code}", response_model=RestaurantListResponse)
async def get_restaurants_by_airport(
    airport_code: str,
    gate: Optional[str] = Query(None, description="Filter restaurants near this gate"),
    db: Session = Depends(get_db)
):
    """Get all restaurants in an airport, optionally filtered by gate proximity"""
    # Get terminal for the airport (simplified - in real app, you'd join properly)
    from app.models.airport import Airport
    airport = db.query(Airport).filter(Airport.code == airport_code.upper()).first()
    if not airport:
        raise HTTPException(status_code=404, detail="Airport not found")
    
    # Get all terminals for this airport
    terminals = db.query(Terminal).filter(Terminal.airport_id == airport.id).all()
    terminal_ids = [t.id for t in terminals]
    
    # Get restaurants in these terminals
    restaurants = db.query(Restaurant).filter(Restaurant.terminal_id.in_(terminal_ids)).all()
    
    # If gate is provided, calculate distances and filter
    if gate:
        # Find the gate
        gate_obj = None
        for terminal in terminals:
            gate_obj = db.query(Gate).filter(
                Gate.terminal_id == terminal.id,
                Gate.gate_number == gate.upper()
            ).first()
            if gate_obj:
                break
        
        if gate_obj and gate_obj.coordinates:
            # Calculate distance for each restaurant
            gate_coords = gate_obj.coordinates
            restaurants_with_distance = []
            
            for restaurant in restaurants:
                if restaurant.location:
                    distance = calculate_distance(
                        gate_coords,
                        restaurant.location
                    )
                    restaurant.distance_from_gate = distance
                    restaurants_with_distance.append(restaurant)
            
            # Sort by distance
            restaurants_with_distance.sort(key=lambda r: r.distance_from_gate or float('inf'))
            restaurants = restaurants_with_distance
    
    return RestaurantListResponse(
        restaurants=[RestaurantResponse.model_validate(r) for r in restaurants],
        total=len(restaurants)
    )


@router.get("/{restaurant_id}", response_model=RestaurantResponse)
async def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    """Get restaurant details by ID"""
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

