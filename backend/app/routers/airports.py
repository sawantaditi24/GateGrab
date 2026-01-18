from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.airport import Airport
from app.schemas.airport import AirportResponse

router = APIRouter()


@router.get("/", response_model=List[AirportResponse])
async def get_airports(db: Session = Depends(get_db)):
    """Get all available airports"""
    airports = db.query(Airport).all()
    return airports


@router.get("/{airport_code}", response_model=AirportResponse)
async def get_airport(airport_code: str, db: Session = Depends(get_db)):
    """Get airport details by code (e.g., JFK, LAX)"""
    airport = db.query(Airport).filter(Airport.code == airport_code.upper()).first()
    if not airport:
        raise HTTPException(status_code=404, detail="Airport not found")
    return airport



