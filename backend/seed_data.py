"""
Seed script to populate initial airport, terminal, gate, and restaurant data.
Run this after setting up the database.
"""
from app.database import SessionLocal, engine, Base
from app.models.airport import Airport, Terminal, Gate
from app.models.restaurant import Restaurant
from app.models.delivery_agent import DeliveryAgent

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Check if data already exists
    if db.query(Airport).count() > 0:
        print("Data already seeded. Skipping...")
        exit(0)
    
    # JFK Airport
    jfk = Airport(
        code="JFK",
        name="John F. Kennedy International Airport",
        city="New York",
        state="NY",
        timezone="America/New_York",
        latitude="40.6413",
        longitude="-73.7781"
    )
    db.add(jfk)
    db.flush()
    
    # JFK Terminal 1
    jfk_terminal1 = Terminal(
        airport_id=jfk.id,
        name="Terminal 1",
        layout_data={"width": 800, "height": 600}
    )
    db.add(jfk_terminal1)
    db.flush()
    
    # JFK Terminal 1 Gates
    jfk_gates = [
        Gate(terminal_id=jfk_terminal1.id, gate_number="A1", coordinates={"x": 100, "y": 200}),
        Gate(terminal_id=jfk_terminal1.id, gate_number="A2", coordinates={"x": 150, "y": 200}),
        Gate(terminal_id=jfk_terminal1.id, gate_number="A3", coordinates={"x": 200, "y": 200}),
        Gate(terminal_id=jfk_terminal1.id, gate_number="A10", coordinates={"x": 500, "y": 200}),
        Gate(terminal_id=jfk_terminal1.id, gate_number="A11", coordinates={"x": 550, "y": 200}),
        Gate(terminal_id=jfk_terminal1.id, gate_number="A12", coordinates={"x": 600, "y": 200}),
    ]
    db.add_all(jfk_gates)
    db.flush()
    
    # JFK Restaurants
    jfk_restaurants = [
        Restaurant(
            terminal_id=jfk_terminal1.id,
            name="Chipotle",
            cuisine_type="Mexican",
            location={"x": 520, "y": 300},
            nearby_gates=["A10", "A11", "A12", "A13"],
            estimated_prep_time=15,
            mock_ordering_slug="chipotle",
            description="Fresh Mexican food"
        ),
        Restaurant(
            terminal_id=jfk_terminal1.id,
            name="McDonald's",
            cuisine_type="Fast Food",
            location={"x": 200, "y": 300},
            nearby_gates=["A1", "A2", "A3", "A4"],
            estimated_prep_time=10,
            mock_ordering_slug="mcdonalds",
            description="Classic fast food"
        ),
        Restaurant(
            terminal_id=jfk_terminal1.id,
            name="Starbucks",
            cuisine_type="Coffee",
            location={"x": 350, "y": 300},
            nearby_gates=["A5", "A6", "A7", "A8"],
            estimated_prep_time=5,
            mock_ordering_slug="starbucks",
            description="Coffee and light snacks"
        ),
    ]
    db.add_all(jfk_restaurants)
    
    # LAX Airport
    lax = Airport(
        code="LAX",
        name="Los Angeles International Airport",
        city="Los Angeles",
        state="CA",
        timezone="America/Los_Angeles",
        latitude="33.9425",
        longitude="-118.4081"
    )
    db.add(lax)
    db.flush()
    
    # LAX Terminal 1
    lax_terminal1 = Terminal(
        airport_id=lax.id,
        name="Terminal 1",
        layout_data={"width": 800, "height": 600}
    )
    db.add(lax_terminal1)
    db.flush()
    
    # LAX Terminal 1 Gates
    lax_gates = [
        Gate(terminal_id=lax_terminal1.id, gate_number="B1", coordinates={"x": 100, "y": 200}),
        Gate(terminal_id=lax_terminal1.id, gate_number="B2", coordinates={"x": 150, "y": 200}),
        Gate(terminal_id=lax_terminal1.id, gate_number="B10", coordinates={"x": 500, "y": 200}),
        Gate(terminal_id=lax_terminal1.id, gate_number="B11", coordinates={"x": 550, "y": 200}),
    ]
    db.add_all(lax_gates)
    db.flush()
    
    # LAX Restaurants
    lax_restaurants = [
        Restaurant(
            terminal_id=lax_terminal1.id,
            name="Chipotle",
            cuisine_type="Mexican",
            location={"x": 520, "y": 300},
            nearby_gates=["B10", "B11", "B12"],
            estimated_prep_time=15,
            mock_ordering_slug="chipotle",
            description="Fresh Mexican food"
        ),
        Restaurant(
            terminal_id=lax_terminal1.id,
            name="Subway",
            cuisine_type="Sandwiches",
            location={"x": 200, "y": 300},
            nearby_gates=["B1", "B2", "B3"],
            estimated_prep_time=8,
            mock_ordering_slug="subway",
            description="Fresh sandwiches"
        ),
    ]
    db.add_all(lax_restaurants)
    
    # ATL Airport (Atlanta)
    atl = Airport(
        code="ATL",
        name="Hartsfield-Jackson Atlanta International Airport",
        city="Atlanta",
        state="GA",
        timezone="America/New_York",
        latitude="33.6407",
        longitude="-84.4277"
    )
    db.add(atl)
    db.flush()
    
    atl_terminal1 = Terminal(
        airport_id=atl.id,
        name="Terminal S",
        layout_data={"width": 800, "height": 600}
    )
    db.add(atl_terminal1)
    db.flush()
    
    atl_gates = [
        Gate(terminal_id=atl_terminal1.id, gate_number="S1", coordinates={"x": 100, "y": 200}),
        Gate(terminal_id=atl_terminal1.id, gate_number="S2", coordinates={"x": 150, "y": 200}),
        Gate(terminal_id=atl_terminal1.id, gate_number="S10", coordinates={"x": 500, "y": 200}),
        Gate(terminal_id=atl_terminal1.id, gate_number="S11", coordinates={"x": 550, "y": 200}),
    ]
    db.add_all(atl_gates)
    db.flush()
    
    atl_restaurants = [
        Restaurant(
            terminal_id=atl_terminal1.id,
            name="Chipotle",
            cuisine_type="Mexican",
            location={"x": 520, "y": 300},
            nearby_gates=["S10", "S11", "S12"],
            estimated_prep_time=15,
            mock_ordering_slug="chipotle",
            description="Fresh Mexican food"
        ),
        Restaurant(
            terminal_id=atl_terminal1.id,
            name="McDonald's",
            cuisine_type="Fast Food",
            location={"x": 200, "y": 300},
            nearby_gates=["S1", "S2", "S3"],
            estimated_prep_time=10,
            mock_ordering_slug="mcdonalds",
            description="Classic fast food"
        ),
    ]
    db.add_all(atl_restaurants)
    
    # ORD Airport (Chicago)
    ord = Airport(
        code="ORD",
        name="Chicago O'Hare International Airport",
        city="Chicago",
        state="IL",
        timezone="America/Chicago",
        latitude="41.9786",
        longitude="-87.9048"
    )
    db.add(ord)
    db.flush()
    
    ord_terminal1 = Terminal(
        airport_id=ord.id,
        name="Terminal 1",
        layout_data={"width": 800, "height": 600}
    )
    db.add(ord_terminal1)
    db.flush()
    
    ord_gates = [
        Gate(terminal_id=ord_terminal1.id, gate_number="C1", coordinates={"x": 100, "y": 200}),
        Gate(terminal_id=ord_terminal1.id, gate_number="C2", coordinates={"x": 150, "y": 200}),
        Gate(terminal_id=ord_terminal1.id, gate_number="C10", coordinates={"x": 500, "y": 200}),
        Gate(terminal_id=ord_terminal1.id, gate_number="C11", coordinates={"x": 550, "y": 200}),
    ]
    db.add_all(ord_gates)
    db.flush()
    
    ord_restaurants = [
        Restaurant(
            terminal_id=ord_terminal1.id,
            name="Starbucks",
            cuisine_type="Coffee",
            location={"x": 350, "y": 300},
            nearby_gates=["C5", "C6", "C7"],
            estimated_prep_time=5,
            mock_ordering_slug="starbucks",
            description="Coffee and light snacks"
        ),
        Restaurant(
            terminal_id=ord_terminal1.id,
            name="Subway",
            cuisine_type="Sandwiches",
            location={"x": 200, "y": 300},
            nearby_gates=["C1", "C2", "C3"],
            estimated_prep_time=8,
            mock_ordering_slug="subway",
            description="Fresh sandwiches"
        ),
    ]
    db.add_all(ord_restaurants)
    
    # DFW Airport (Dallas)
    dfw = Airport(
        code="DFW",
        name="Dallas/Fort Worth International Airport",
        city="Dallas",
        state="TX",
        timezone="America/Chicago",
        latitude="32.8998",
        longitude="-97.0403"
    )
    db.add(dfw)
    db.flush()
    
    dfw_terminal1 = Terminal(
        airport_id=dfw.id,
        name="Terminal A",
        layout_data={"width": 800, "height": 600}
    )
    db.add(dfw_terminal1)
    db.flush()
    
    dfw_gates = [
        Gate(terminal_id=dfw_terminal1.id, gate_number="A1", coordinates={"x": 100, "y": 200}),
        Gate(terminal_id=dfw_terminal1.id, gate_number="A2", coordinates={"x": 150, "y": 200}),
        Gate(terminal_id=dfw_terminal1.id, gate_number="A10", coordinates={"x": 500, "y": 200}),
        Gate(terminal_id=dfw_terminal1.id, gate_number="A11", coordinates={"x": 550, "y": 200}),
    ]
    db.add_all(dfw_gates)
    db.flush()
    
    dfw_restaurants = [
        Restaurant(
            terminal_id=dfw_terminal1.id,
            name="Chipotle",
            cuisine_type="Mexican",
            location={"x": 520, "y": 300},
            nearby_gates=["A10", "A11", "A12"],
            estimated_prep_time=15,
            mock_ordering_slug="chipotle",
            description="Fresh Mexican food"
        ),
        Restaurant(
            terminal_id=dfw_terminal1.id,
            name="McDonald's",
            cuisine_type="Fast Food",
            location={"x": 200, "y": 300},
            nearby_gates=["A1", "A2", "A3"],
            estimated_prep_time=10,
            mock_ordering_slug="mcdonalds",
            description="Classic fast food"
        ),
    ]
    db.add_all(dfw_restaurants)
    
    # SFO Airport (San Francisco)
    sfo = Airport(
        code="SFO",
        name="San Francisco International Airport",
        city="San Francisco",
        state="CA",
        timezone="America/Los_Angeles",
        latitude="37.6213",
        longitude="-122.3790"
    )
    db.add(sfo)
    db.flush()
    
    sfo_terminal1 = Terminal(
        airport_id=sfo.id,
        name="Terminal 1",
        layout_data={"width": 800, "height": 600}
    )
    db.add(sfo_terminal1)
    db.flush()
    
    sfo_gates = [
        Gate(terminal_id=sfo_terminal1.id, gate_number="B1", coordinates={"x": 100, "y": 200}),
        Gate(terminal_id=sfo_terminal1.id, gate_number="B2", coordinates={"x": 150, "y": 200}),
        Gate(terminal_id=sfo_terminal1.id, gate_number="B10", coordinates={"x": 500, "y": 200}),
        Gate(terminal_id=sfo_terminal1.id, gate_number="B11", coordinates={"x": 550, "y": 200}),
    ]
    db.add_all(sfo_gates)
    db.flush()
    
    sfo_restaurants = [
        Restaurant(
            terminal_id=sfo_terminal1.id,
            name="Starbucks",
            cuisine_type="Coffee",
            location={"x": 350, "y": 300},
            nearby_gates=["B5", "B6", "B7"],
            estimated_prep_time=5,
            mock_ordering_slug="starbucks",
            description="Coffee and light snacks"
        ),
        Restaurant(
            terminal_id=sfo_terminal1.id,
            name="Subway",
            cuisine_type="Sandwiches",
            location={"x": 200, "y": 300},
            nearby_gates=["B1", "B2", "B3"],
            estimated_prep_time=8,
            mock_ordering_slug="subway",
            description="Fresh sandwiches"
        ),
    ]
    db.add_all(sfo_restaurants)
    
    # MIA Airport (Miami)
    mia = Airport(
        code="MIA",
        name="Miami International Airport",
        city="Miami",
        state="FL",
        timezone="America/New_York",
        latitude="25.7959",
        longitude="-80.2870"
    )
    db.add(mia)
    db.flush()
    
    mia_terminal1 = Terminal(
        airport_id=mia.id,
        name="Concourse D",
        layout_data={"width": 800, "height": 600}
    )
    db.add(mia_terminal1)
    db.flush()
    
    mia_gates = [
        Gate(terminal_id=mia_terminal1.id, gate_number="D1", coordinates={"x": 100, "y": 200}),
        Gate(terminal_id=mia_terminal1.id, gate_number="D2", coordinates={"x": 150, "y": 200}),
        Gate(terminal_id=mia_terminal1.id, gate_number="D10", coordinates={"x": 500, "y": 200}),
        Gate(terminal_id=mia_terminal1.id, gate_number="D11", coordinates={"x": 550, "y": 200}),
    ]
    db.add_all(mia_gates)
    db.flush()
    
    mia_restaurants = [
        Restaurant(
            terminal_id=mia_terminal1.id,
            name="Chipotle",
            cuisine_type="Mexican",
            location={"x": 520, "y": 300},
            nearby_gates=["D10", "D11", "D12"],
            estimated_prep_time=15,
            mock_ordering_slug="chipotle",
            description="Fresh Mexican food"
        ),
        Restaurant(
            terminal_id=mia_terminal1.id,
            name="McDonald's",
            cuisine_type="Fast Food",
            location={"x": 200, "y": 300},
            nearby_gates=["D1", "D2", "D3"],
            estimated_prep_time=10,
            mock_ordering_slug="mcdonalds",
            description="Classic fast food"
        ),
    ]
    db.add_all(mia_restaurants)
    
    # DEN Airport (Denver)
    den = Airport(
        code="DEN",
        name="Denver International Airport",
        city="Denver",
        state="CO",
        timezone="America/Denver",
        latitude="39.8561",
        longitude="-104.6737"
    )
    db.add(den)
    db.flush()
    
    den_terminal1 = Terminal(
        airport_id=den.id,
        name="Concourse A",
        layout_data={"width": 800, "height": 600}
    )
    db.add(den_terminal1)
    db.flush()
    
    den_gates = [
        Gate(terminal_id=den_terminal1.id, gate_number="A1", coordinates={"x": 100, "y": 200}),
        Gate(terminal_id=den_terminal1.id, gate_number="A2", coordinates={"x": 150, "y": 200}),
        Gate(terminal_id=den_terminal1.id, gate_number="A10", coordinates={"x": 500, "y": 200}),
        Gate(terminal_id=den_terminal1.id, gate_number="A11", coordinates={"x": 550, "y": 200}),
    ]
    db.add_all(den_gates)
    db.flush()
    
    den_restaurants = [
        Restaurant(
            terminal_id=den_terminal1.id,
            name="Starbucks",
            cuisine_type="Coffee",
            location={"x": 350, "y": 300},
            nearby_gates=["A5", "A6", "A7"],
            estimated_prep_time=5,
            mock_ordering_slug="starbucks",
            description="Coffee and light snacks"
        ),
        Restaurant(
            terminal_id=den_terminal1.id,
            name="Subway",
            cuisine_type="Sandwiches",
            location={"x": 200, "y": 300},
            nearby_gates=["A1", "A2", "A3"],
            estimated_prep_time=8,
            mock_ordering_slug="subway",
            description="Fresh sandwiches"
        ),
    ]
    db.add_all(den_restaurants)
    
    # Create Delivery Agent
    agent = DeliveryAgent(
        name="Delivery Agent 1",
        agent_code="AGENT001",
        status="available",
        contact="agent1@airportdelivery.com"
    )
    db.add(agent)
    
    db.commit()
    print("✅ Seed data created successfully!")
    print(f"   - Airports: 8 (JFK, LAX, ATL, ORD, DFW, SFO, MIA, DEN)")
    print(f"   - Terminals: 8")
    print(f"   - Gates: 40")
    print(f"   - Restaurants: 20")
    print(f"   - Delivery Agents: 1 (Agent ID: 1, Code: AGENT001)")
    
except Exception as e:
    db.rollback()
    print(f"❌ Error seeding data: {e}")
    raise
finally:
    db.close()

