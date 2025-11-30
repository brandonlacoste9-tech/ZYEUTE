from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from uuid import uuid4
from datetime import datetime, timezone
import logging

router = APIRouter(prefix="/api/v1/discovery", tags=["discovery"])
logger = logging.getLogger(__name__)

# --- Models ---

class DiscoveryItem(BaseModel):
    id: str
    name: str
    category: str  # "restaurant", "bar", "sport", "show"
    region: str    # e.g., "Montreal", "Quebec_City"
    description: Optional[str] = None
    ai_score: float = 0.0  # Score from Neurosphere (Mind)
    image_url: Optional[str] = None


class DiscoveryQuery(BaseModel):
    query: str
    region: Optional[str] = None
    category: Optional[str] = None
    limit: int = 10


# --- In-Memory Mock Data (TRUE QUEBEC Data Set) ---
# This data feeds into the Neurosphere for ZYEUTÉ recommendations.
# Authentic Quebec culture - what locals actually care about.
# Target demographic: 16+ (especially girls/women), all content in French/Joual

_discovery_data: List[DiscoveryItem] = [
    DiscoveryItem(
        id=uuid4().hex,
        name="Le Dagobert",
        category="bar",
        region="Quebec_City",
        description="Un classique pour les shows live et la scène musicale québécoise.",
        ai_score=0.88
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Canadiens vs Bruins",
        category="sport",
        region="Montreal",
        description="Match de hockey épique - la rivalité classique.",
        ai_score=0.92
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Les Colocs en spectacle",
        category="show",
        region="Montreal",
        description="Hommage à un groupe légendaire de la scène québécoise.",
        ai_score=0.90
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Festival de Jazz de Montréal",
        category="show",
        region="Montreal",
        description="Le plus grand festival de jazz au monde.",
        ai_score=0.93
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Cabane à Sucre",
        category="restaurant",
        region="Laurentides",
        description="Expérience authentique de la saison des sucres.",
        ai_score=0.85
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Marché Jean-Talon",
        category="restaurant",
        region="Montreal",
        description="Marché public authentique avec produits locaux.",
        ai_score=0.87
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Festival d'été de Québec",
        category="show",
        region="Quebec_City",
        description="Le plus grand festival de musique en plein air au Canada.",
        ai_score=0.91
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Laval Rocket",
        category="sport",
        region="Laval",
        description="Hockey de la LNH américaine - équipe locale.",
        ai_score=0.84
    ),
    # Nightlife venues - Quebec has amazing nightlife
    DiscoveryItem(
        id=uuid4().hex,
        name="Stereo",
        category="bar",
        region="Montreal",
        description="Club techno légendaire - la meilleure sound system de la ville.",
        ai_score=0.94
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="New City Gas",
        category="bar",
        region="Montreal",
        description="Gros événements électroniques et shows internationaux.",
        ai_score=0.91
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Le Belmont",
        category="bar",
        region="Montreal",
        description="Bar rock alternatif avec shows live - scène locale authentique.",
        ai_score=0.89
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="L'Astral",
        category="bar",
        region="Quebec_City",
        description="Bar branché avec musique live et ambiance électrique.",
        ai_score=0.87
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Le Fou-Bar",
        category="bar",
        region="Quebec_City",
        description="Bar underground avec DJ sets et scène alternative.",
        ai_score=0.86
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Café Campus",
        category="bar",
        region="Montreal",
        description="Bar étudiant classique - ambiance décontractée et prix abordables.",
        ai_score=0.83
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Le Divan Orange",
        category="bar",
        region="Montreal",
        description="Bar intime avec shows acoustiques et scène folk québécoise.",
        ai_score=0.88
    ),
    # All-ages venues (16+) - important for younger demographic
    DiscoveryItem(
        id=uuid4().hex,
        name="Café Cléopâtre",
        category="bar",
        region="Montreal",
        description="Café-bar avec ambiance décontractée - accueille les 16+ pour les shows.",
        ai_score=0.82
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Le National",
        category="show",
        region="Montreal",
        description="Salle de spectacle pour tous les âges - concerts et événements.",
        ai_score=0.87
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="MTelus",
        category="show",
        region="Montreal",
        description="Grande salle de spectacles - concerts majeurs, tous âges bienvenus.",
        ai_score=0.91
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Place Bell",
        category="sport",
        region="Laval",
        description="Aréna moderne - hockey et événements pour toute la famille.",
        ai_score=0.86
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Le Studio TD",
        category="show",
        region="Montreal",
        description="Salle intime pour concerts - ambiance chaleureuse, tous âges.",
        ai_score=0.89
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Café Campus",
        category="bar",
        region="Montreal",
        description="Bar étudiant - ambiance décontractée, prix abordables, 18+ le soir mais accueillant.",
        ai_score=0.83
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Le Balattou",
        category="bar",
        region="Montreal",
        description="Bar avec musique live - ambiance festive, tous les styles musicaux.",
        ai_score=0.85
    ),
    DiscoveryItem(
        id=uuid4().hex,
        name="Olympia de Montréal",
        category="show",
        region="Montreal",
        description="Salle historique - concerts et spectacles pour tous les âges.",
        ai_score=0.88
    ),
]

# --- Endpoints ---

@router.get("/items", response_model=List[DiscoveryItem])
async def list_discovery_items(
    query: Optional[str] = None,
    region: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 20
):
    """
    Lists all local discovery items (restaurants, events, etc.) with optional filtering.
    This endpoint provides TRUE QUEBEC data for ZYEUTÉ recommendations.
    """
    # Simple mock filter logic
    filtered = [
        item for item in _discovery_data
        if (not region or item.region == region) and \
           (not category or item.category == category)
    ]
    
    return filtered[:limit]


@router.post("/search", response_model=List[DiscoveryItem])
async def search_discovery(query_data: DiscoveryQuery):
    """
    Advanced semantic search through discovery items (simulates Neurosphere integration).
    TODO: Actual implementation will embed query and search pgvector against Discovery table.
    """
    # Mocking semantic routing to find "best match" based on name
    query_lower = query_data.query.lower()
    
    # Search by keywords in name or description
    matches = [
        item for item in _discovery_data
        if query_lower in item.name.lower() or 
           (item.description and query_lower in item.description.lower())
    ]
    
    if matches:
        return matches[:query_data.limit]
    
    # Filter by category if provided
    if query_data.category:
        return [
            item for item in _discovery_data
            if item.category == query_data.category
        ][:query_data.limit]
    
    # Default: return all items up to limit
    return _discovery_data[:query_data.limit]

