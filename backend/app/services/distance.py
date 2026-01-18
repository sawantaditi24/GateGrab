import math
from typing import Dict, Any


def calculate_distance(point1: Dict[str, Any], point2: Dict[str, Any]) -> float:
    """
    Calculate Euclidean distance between two points on a map.
    Points should have 'x' and 'y' coordinates.
    Returns distance in arbitrary units (can be converted to walking time).
    """
    if not point1 or not point2:
        return float('inf')
    
    x1 = point1.get('x', 0)
    y1 = point1.get('y', 0)
    x2 = point2.get('x', 0)
    y2 = point2.get('y', 0)
    
    distance = math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    return round(distance, 2)


def calculate_walking_time(distance: float, walking_speed: float = 1.0) -> int:
    """
    Convert distance to walking time in minutes.
    Assumes walking_speed in units per minute.
    For a typical airport terminal, 1 unit ≈ 10-20 meters.
    """
    if distance == float('inf'):
        return 0
    
    # Rough estimate: 1 unit = 15 meters, walking speed = 5 km/h = 83 m/min
    # So 1 unit takes about 0.18 minutes
    time_minutes = (distance * 0.18)
    return max(1, int(time_minutes))  # At least 1 minute



