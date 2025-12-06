"""
Orbital Propagation Kernel - The Native Brain

Implements CMAR-1 rulings from Gemini:
- Q1: Emergent wells + energy detector
- Q2: Adaptive annealing (sigmoid decay)
- Q3: Bridged subgraphs (resonance model)

Mathematical Foundation:
- Spherical manifold S^(d-1)
- Gravitational message passing
- Tangential velocity updates
- Dynamic rewiring with annealing
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

import torch
import torch.nn.functional as F


@dataclass
class Node:
    """Node on the spherical manifold."""
    
    id: str
    type: str  # 'concept', 'action', 'visual:*', 'relation'
    value: str
    position: torch.Tensor  # Unit vector on sphere
    activation: float = 0.0
    ring: str = 'middle'  # 'inner', 'middle', 'outer'
    metadata: Dict = field(default_factory=dict)


@dataclass
class Edge:
    """Connection between nodes."""
    
    source_id: str
    target_id: str
    weight: float
    edge_type: str  # 'structural', 'semantic', 'resonance'


class SemanticGraph:
    """Graph structure for orbital propagation."""
    
    def __init__(self, dim: int = 512):
        self.dim = dim
        self.nodes: Dict[str, Node] = {}
        self.edges: List[Edge] = []
    
    def add_node(self, node: Node) -> None:
        """Add node to graph."""
        self.nodes[node.id] = node
    
    def add_edge(self, source_id: str, target_id: str, weight: float, edge_type: str = 'semantic') -> None:
        """Add edge between nodes."""
        self.edges.append(Edge(source_id, target_id, weight, edge_type))
    
    def get_neighbors(self, node_id: str) -> List[Tuple[Node, float]]:
        """Get neighbors of a node with edge weights."""
        neighbors = []
        for edge in self.edges:
            if edge.source_id == node_id:
                neighbor = self.nodes.get(edge.target_id)
                if neighbor:
                    neighbors.append((neighbor, edge.weight))
            elif edge.target_id == node_id:
                neighbor = self.nodes.get(edge.source_id)
                if neighbor:
                    neighbors.append((neighbor, edge.weight))
        return neighbors
    
    def get_node_positions(self) -> torch.Tensor:
        """Get all node positions as tensor."""
        positions = [node.position for node in self.nodes.values()]
        return torch.stack(positions)
    
    def update_node_positions(self, positions: torch.Tensor) -> None:
        """Update node positions from tensor."""
        for i, node in enumerate(self.nodes.values()):
            node.position = positions[i]


class OrbitalEmbedder:
    """
    Orbital embedding engine implementing CMAR-1 specifications.
    
    Key Parameters (from sweep experiments):
    - eta = 0.06: Optimal gravitational strength
    - cycles = 24: Sufficient convergence
    - dim = 512: Standard embedding dimension
    """
    
    def __init__(
        self,
        dim: int = 512,
        eta: float = 0.06,
        cycles: int = 24,
        convergence_threshold: float = 0.001
    ):
        self.dim = dim
        self.eta = eta
        self.cycles = cycles
        self.convergence_threshold = convergence_threshold
    
    def embed(self, text: str) -> torch.Tensor:
        """
        Generate orbital embedding on unit sphere.
        
        Args:
            text: Input text to embed
        
        Returns:
            Unit vector on S^(d-1)
        """
        # TODO: Replace with actual transformer model
        # For now, use random initialization (will be replaced with sentence-transformers)
        base_emb = torch.randn(self.dim)
        
        # Project to unit sphere
        emb = F.normalize(base_emb, p=2, dim=-1)
        
        return emb
    
    def orbital_propagation(
        self,
        graph: SemanticGraph,
        verbose: bool = False
    ) -> SemanticGraph:
        """
        24-cycle orbital dynamics with CMAR-1 rulings.
        
        Implements:
        - Gravitational message passing
        - Tangential velocity updates
        - Adaptive annealing (Q2 ruling)
        - Energy-based convergence detection (Q1 ruling)
        
        Args:
            graph: Semantic graph with initialized positions
            verbose: Print convergence metrics
        
        Returns:
            Updated graph after orbital evolution
        """
        embeddings = graph.get_node_positions()
        N = embeddings.size(0)
        
        energy_history = []
        
        for cycle in range(self.cycles):
            # ═══════════════════════════════════════════════════
            # RULING Q2: ADAPTIVE ANNEALING (SIGMOID DECAY)
            # ═══════════════════════════════════════════════════
            
            # Temperature schedule (simulated cooling)
            temperature = 1.0 / (1.0 + math.exp(cycle - 12))
            
            # Adaptive threshold: starts at 0.6, ends at 0.9
            threshold = 0.6 + (0.3 * (1 - temperature))
            
            # ═══════════════════════════════════════════════════
            # STEP 1: GRAVITATIONAL MESSAGE PASSING
            # ═══════════════════════════════════════════════════
            
            # Compute pairwise cosine similarities (gravity)
            similarities = embeddings @ embeddings.T
            
            # Gravitational force (attraction)
            gravity = similarities @ embeddings
            
            # ═══════════════════════════════════════════════════
            # STEP 2: TANGENTIAL VELOCITY (MANIFOLD-AWARE)
            # ═══════════════════════════════════════════════════
            
            # Cross-product for tangential movement
            # Gemini's insight: "temporal trajectory on manifold surface"
            velocity = torch.zeros_like(embeddings)
            for i in range(N):
                for j in range(N):
                    if i != j:
                        velocity[i] += torch.cross(
                            embeddings[i],
                            gravity[j],
                            dim=-1
                        ) * similarities[i, j]
            velocity = velocity / N
            
            # ═══════════════════════════════════════════════════
            # STEP 3: POSITION UPDATE
            # ═══════════════════════════════════════════════════
            
            embeddings = embeddings + self.eta * (gravity + velocity)
            
            # Project back to unit sphere
            embeddings = F.normalize(embeddings, p=2, dim=-1)
            
            # ═══════════════════════════════════════════════════
            # STEP 4: DYNAMIC REWIRING (ADAPTIVE THRESHOLD)
            # ═══════════════════════════════════════════════════
            
            # Recompute similarities after position update
            new_similarities = embeddings @ embeddings.T
            
            # Rewire based on adaptive threshold
            self._rewire_graph(graph, new_similarities, threshold)
            
            # ═══════════════════════════════════════════════════
            # STEP 5: ACTIVATION DECAY
            # ═══════════════════════════════════════════════════
            
            for node in graph.nodes.values():
                node.activation *= 0.95  # Prevent runaway activation
            
            # ═══════════════════════════════════════════════════
            # RULING Q1: ENERGY-BASED CONVERGENCE DETECTION
            # ═══════════════════════════════════════════════════
            
            system_energy = self._compute_energy(graph, embeddings)
            energy_history.append(system_energy)
            
            # Check for convergence (energy plateau)
            if cycle > 5 and len(energy_history) >= 3:
                recent_energies = energy_history[-3:]
                energy_delta = max(recent_energies) - min(recent_energies)
                
                if energy_delta < self.convergence_threshold:
                    if verbose:
                        print(f"Convergence at cycle {cycle}: energy plateau detected")
                    break
            
            if verbose and cycle % 5 == 0:
                print(f"Cycle {cycle}: energy={system_energy:.4f}, threshold={threshold:.3f}, temp={temperature:.3f}")
        
        # Update graph with final positions
        graph.update_node_positions(embeddings)
        
        return graph
    
    def _rewire_graph(
        self,
        graph: SemanticGraph,
        similarities: torch.Tensor,
        threshold: float
    ) -> None:
        """
        Dynamic rewiring based on cosine similarity.
        
        Implements adaptive threshold from Q2 ruling.
        """
        # Clear existing semantic edges (keep structural/resonance)
        graph.edges = [
            e for e in graph.edges
            if e.edge_type in ['structural', 'resonance']
        ]
        
        # Add new edges above threshold
        node_list = list(graph.nodes.values())
        N = len(node_list)
        
        for i in range(N):
            for j in range(i + 1, N):
                sim = similarities[i, j].item()
                
                if sim > threshold:
                    graph.add_edge(
                        node_list[i].id,
                        node_list[j].id,
                        weight=sim,
                        edge_type='semantic'
                    )
    
    def _compute_energy(
        self,
        graph: SemanticGraph,
        embeddings: torch.Tensor
    ) -> float:
        """
        Compute total system energy (Q1 ruling: detector only).
        
        Energy = sum of weighted distances across edges
        
        Low energy = stable configuration (Attractor Well)
        High energy = active drift (still thinking)
        """
        total_energy = 0.0
        node_list = list(graph.nodes.values())
        
        for edge in graph.edges:
            # Find node indices
            source_idx = next(i for i, n in enumerate(node_list) if n.id == edge.source_id)
            target_idx = next(i for i, n in enumerate(node_list) if n.id == edge.target_id)
            
            # Compute distance (1 - cosine similarity)
            distance = 1.0 - F.cosine_similarity(
                embeddings[source_idx].unsqueeze(0),
                embeddings[target_idx].unsqueeze(0)
            ).item()
            
            # Weighted by edge strength
            total_energy += edge.weight * distance
        
        return total_energy


class MultimodalGraph:
    """
    Bridged subgraph topology (Q3 ruling).
    
    Maintains separate concept and visual subgraphs
    connected by explicit resonance bridges.
    """
    
    def __init__(self, dim: int = 512):
        self.dim = dim
        self.concept_subgraph = SemanticGraph(dim)
        self.visual_subgraph = SemanticGraph(dim)
        self.resonance_bridges: List[Edge] = []
    
    def add_concept_node(self, node: Node) -> None:
        """Add node to concept subgraph."""
        node.metadata['subgraph'] = 'concept'
        self.concept_subgraph.add_node(node)
    
    def add_visual_node(self, node: Node) -> None:
        """Add node to visual subgraph."""
        node.metadata['subgraph'] = 'visual'
        self.visual_subgraph.add_node(node)
    
    def add_resonance_bridge(
        self,
        concept_id: str,
        visual_id: str,
        weight: float
    ) -> None:
        """
        Create explicit cross-modal connection (resonance bridge).
        
        These bridges enable multimodal fusion while maintaining
        modular control over each subgraph.
        """
        self.resonance_bridges.append(Edge(
            source_id=concept_id,
            target_id=visual_id,
            weight=weight,
            edge_type='resonance'
        ))
    
    def get_concept_nodes(self) -> List[Node]:
        """Query only concept nodes."""
        return list(self.concept_subgraph.nodes.values())
    
    def get_visual_nodes(self) -> List[Node]:
        """Query only visual nodes."""
        return list(self.visual_subgraph.nodes.values())
    
    def amplify_visual_cortex(self, factor: float = 2.0) -> None:
        """
        Amplify visual processing by increasing resonance bridge weights.
        
        Use for creative tasks requiring strong visual reasoning.
        """
        for bridge in self.resonance_bridges:
            bridge.weight *= factor
    
    def mute_visual_cortex(self) -> None:
        """
        Mute visual processing to save compute.
        
        Use for pure text/logic tasks.
        """
        for bridge in self.resonance_bridges:
            bridge.weight = 0.0
    
    def merge_for_propagation(self) -> SemanticGraph:
        """
        Merge subgraphs for orbital propagation.
        
        Returns unified graph with all nodes and edges.
        """
        merged = SemanticGraph(self.dim)
        
        # Add all concept nodes
        for node in self.concept_subgraph.nodes.values():
            merged.add_node(node)
        
        # Add all visual nodes
        for node in self.visual_subgraph.nodes.values():
            merged.add_node(node)
        
        # Add concept edges
        merged.edges.extend(self.concept_subgraph.edges)
        
        # Add visual edges
        merged.edges.extend(self.visual_subgraph.edges)
        
        # Add resonance bridges
        merged.edges.extend(self.resonance_bridges)
        
        return merged


class ThreeRingsClassifier:
    """
    Classify nodes into Inner/Middle/Outer rings.
    
    Based on Gemini's hierarchical mapping:
    - Inner: High centrality, dense connections (executive function)
    - Middle: Moderate centrality (contextual fusion)
    - Outer: Low centrality, transient (sensory horizon)
    """
    
    def __init__(
        self,
        inner_centrality_threshold: float = 0.8,
        inner_edge_threshold: int = 10,
        outer_centrality_threshold: float = 0.3
    ):
        self.inner_centrality_threshold = inner_centrality_threshold
        self.inner_edge_threshold = inner_edge_threshold
        self.outer_centrality_threshold = outer_centrality_threshold
    
    def classify_node(self, node: Node, graph: SemanticGraph) -> str:
        """
        Classify node into Inner/Middle/Outer ring.
        
        Returns:
            'inner', 'middle', or 'outer'
        """
        # Compute centrality (normalized degree)
        neighbors = graph.get_neighbors(node.id)
        edge_count = len(neighbors)
        centrality = edge_count / max(len(graph.nodes), 1)
        
        # Inner Ring: High centrality + dense connections
        if centrality > self.inner_centrality_threshold and edge_count > self.inner_edge_threshold:
            return 'inner'
        
        # Outer Ring: Low centrality OR input nodes
        if centrality < self.outer_centrality_threshold or node.metadata.get('is_input'):
            return 'outer'
        
        # Middle Ring: Everything else (fusion zone)
        return 'middle'
    
    def classify_all_nodes(self, graph: SemanticGraph) -> None:
        """Update ring classification for all nodes."""
        for node in graph.nodes.values():
            node.ring = self.classify_node(node, graph)
    
    def get_ring_visualization(self, graph: SemanticGraph) -> Dict:
        """
        Generate visualization specification per Gemini's guidance.
        
        Returns dict with ring-specific styling.
        """
        self.classify_all_nodes(graph)
        
        inner_nodes = [n for n in graph.nodes.values() if n.ring == 'inner']
        middle_nodes = [n for n in graph.nodes.values() if n.ring == 'middle']
        outer_nodes = [n for n in graph.nodes.values() if n.ring == 'outer']
        
        return {
            'inner': {
                'nodes': inner_nodes,
                'color': 'white/gold',
                'luminosity': 'intense',
                'stability': 'high',
                'drift': 'low',
                'visual_signature': 'Intense white/gold luminosity; stable, low-drift nodes'
            },
            'middle': {
                'nodes': middle_nodes,
                'color': 'violet/blue',
                'luminosity': 'pulsing',
                'velocity': 'high',
                'activity': 'high',
                'visual_signature': 'Pulsing violet/blue gradients; high orbital velocity'
            },
            'outer': {
                'nodes': outer_nodes,
                'color': 'faint',
                'luminosity': 'low',
                'turnover': 'high',
                'transient': True,
                'visual_signature': 'Fainter, transient nodes; high turnover'
            }
        }


def orbital_propagation_kernel(
    embeddings: torch.Tensor,
    graph: SemanticGraph,
    eta: float = 0.06,
    cycles: int = 24,
    convergence_threshold: float = 0.001,
    verbose: bool = False
) -> Tuple[torch.Tensor, Dict]:
    """
    Core orbital propagation with CMAR-1 rulings integrated.
    
    Implements Gemini's technical determinations:
    - Q1: Emergent wells + energy detector
    - Q2: Adaptive annealing (sigmoid decay)
    - Q3: Bridged subgraphs (handled at graph construction)
    
    Args:
        embeddings: (N, D) tensor on unit sphere
        graph: Semantic graph structure
        eta: Gravitational strength (optimal: 0.06)
        cycles: Number of propagation steps (24 for convergence)
        convergence_threshold: Energy delta for early stopping
        verbose: Print metrics
    
    Returns:
        (updated_embeddings, metrics_dict)
    """
    N, D = embeddings.shape
    energy_history = []
    convergence_cycle = cycles
    
    for cycle in range(cycles):
        # ═══════════════════════════════════════════════════
        # RULING Q2: ADAPTIVE ANNEALING
        # ═══════════════════════════════════════════════════
        
        # Sigmoid temperature schedule
        temperature = 1.0 / (1.0 + math.exp(cycle - 12))
        
        # Adaptive threshold: 0.6 → 0.9 over 24 cycles
        threshold = 0.6 + (0.3 * (1 - temperature))
        
        # ═══════════════════════════════════════════════════
        # STEP 1: GRAVITATIONAL MESSAGE PASSING
        # ═══════════════════════════════════════════════════
        
        # Compute pairwise cosine similarities (gravity field)
        similarities = embeddings @ embeddings.T
        
        # Gravitational force (high-activation nodes pull neighbors)
        gravity = similarities @ embeddings
        
        # ═══════════════════════════════════════════════════
        # STEP 2: TANGENTIAL VELOCITY
        # ═══════════════════════════════════════════════════
        
        # Gemini: "Orbital drift = vector rotating along manifold"
        # Use cross-product for manifold-aware movement
        velocity = torch.zeros_like(embeddings)
        for i in range(N):
            cross_sum = torch.zeros(D)
            for j in range(N):
                if i != j:
                    cross_sum += torch.cross(
                        embeddings[i],
                        gravity[j],
                        dim=-1
                    ) * similarities[i, j]
            velocity[i] = cross_sum / N
        
        # ═══════════════════════════════════════════════════
        # STEP 3: UPDATE POSITIONS
        # ═══════════════════════════════════════════════════
        
        embeddings = embeddings + eta * (gravity + velocity)
        
        # Project back to unit sphere (maintain manifold constraint)
        embeddings = F.normalize(embeddings, p=2, dim=-1)
        
        # ═══════════════════════════════════════════════════
        # STEP 4: DYNAMIC REWIRING
        # ═══════════════════════════════════════════════════
        
        # Recompute similarities after movement
        new_similarities = embeddings @ embeddings.T
        
        # Rewire edges above adaptive threshold
        _dynamic_rewire(graph, new_similarities, threshold)
        
        # ═══════════════════════════════════════════════════
        # STEP 5: ACTIVATION DECAY
        # ═══════════════════════════════════════════════════
        
        # Prevent runaway activation
        for node in graph.nodes.values():
            node.activation *= 0.95
        
        # ═══════════════════════════════════════════════════
        # RULING Q1: ENERGY-BASED CONVERGENCE DETECTION
        # ═══════════════════════════════════════════════════
        
        system_energy = _compute_system_energy(graph, embeddings)
        energy_history.append(system_energy)
        
        # Check for convergence (Attractor Well detected)
        if cycle > 5 and len(energy_history) >= 3:
            recent = energy_history[-3:]
            energy_delta = max(recent) - min(recent)
            
            if energy_delta < convergence_threshold:
                convergence_cycle = cycle
                if verbose:
                    print(f"✓ Attractor Well detected at cycle {cycle}")
                    print(f"  Energy: {system_energy:.6f}")
                    print(f"  Delta: {energy_delta:.6f}")
                break
        
        if verbose and cycle % 5 == 0:
            print(f"Cycle {cycle:2d}: E={system_energy:.4f}, τ={threshold:.3f}, T={temperature:.3f}")
    
    # Compute final metrics
    final_similarities = embeddings @ embeddings.T
    uplift = _compute_pairwise_uplift(embeddings)
    clustering = _compute_clustering_coefficient(graph)
    
    metrics = {
        'convergence_cycle': convergence_cycle,
        'final_energy': energy_history[-1] if energy_history else 0.0,
        'energy_history': energy_history,
        'pairwise_uplift': uplift,
        'clustering_coefficient': clustering,
        'converged': convergence_cycle < cycles
    }
    
    return embeddings, metrics


def _dynamic_rewire(
    graph: SemanticGraph,
    similarities: torch.Tensor,
    threshold: float
) -> None:
    """Rewire graph based on adaptive threshold."""
    # Clear semantic edges (keep structural/resonance)
    graph.edges = [e for e in graph.edges if e.edge_type != 'semantic']
    
    # Add new edges above threshold
    node_list = list(graph.nodes.values())
    N = len(node_list)
    
    for i in range(N):
        for j in range(i + 1, N):
            sim = similarities[i, j].item()
            if sim > threshold:
                graph.add_edge(
                    node_list[i].id,
                    node_list[j].id,
                    weight=sim,
                    edge_type='semantic'
                )


def _compute_system_energy(
    graph: SemanticGraph,
    embeddings: torch.Tensor
) -> float:
    """
    Compute total system energy (Q1 ruling).
    
    Energy = sum of weighted distances across edges
    """
    total_energy = 0.0
    node_list = list(graph.nodes.values())
    
    for edge in graph.edges:
        source_idx = next(i for i, n in enumerate(node_list) if n.id == edge.source_id)
        target_idx = next(i for i, n in enumerate(node_list) if n.id == edge.target_id)
        
        distance = 1.0 - F.cosine_similarity(
            embeddings[source_idx].unsqueeze(0),
            embeddings[target_idx].unsqueeze(0)
        ).item()
        
        total_energy += edge.weight * distance
    
    return total_energy


def _compute_pairwise_uplift(embeddings: torch.Tensor) -> float:
    """
    Compute average pairwise cosine similarity uplift.
    
    Optimal regime: +0.000111 (gentle fusion)
    """
    similarities = embeddings @ embeddings.T
    N = embeddings.size(0)
    
    # Average off-diagonal similarities
    mask = ~torch.eye(N, dtype=torch.bool)
    avg_similarity = similarities[mask].mean().item()
    
    return avg_similarity


def _compute_clustering_coefficient(graph: SemanticGraph) -> float:
    """
    Compute clustering coefficient (structure formation).
    
    Optimal regime: >0.3
    """
    if len(graph.nodes) < 3:
        return 0.0
    
    total_clustering = 0.0
    
    for node in graph.nodes.values():
        neighbors = [n for n, _ in graph.get_neighbors(node.id)]
        k = len(neighbors)
        
        if k < 2:
            continue
        
        # Count triangles
        triangles = 0
        for i, n1 in enumerate(neighbors):
            for n2 in neighbors[i+1:]:
                # Check if n1 and n2 are connected
                if any(
                    (e.source_id == n1.id and e.target_id == n2.id) or
                    (e.source_id == n2.id and e.target_id == n1.id)
                    for e in graph.edges
                ):
                    triangles += 1
        
        # Clustering coefficient for this node
        max_triangles = k * (k - 1) / 2
        if max_triangles > 0:
            total_clustering += triangles / max_triangles
    
    return total_clustering / len(graph.nodes)


# ═══════════════════════════════════════════════════════════════
# VISUAL PRIMITIVES (Q3 RULING: FIRST-CLASS NODES)
# ═══════════════════════════════════════════════════════════════

VISUAL_NODE_TYPES = [
    'visual:subject',      # Primary focus
    'visual:composition',  # Layout/framing
    'visual:lighting',     # Light setup
    'visual:mood',         # Emotional atmosphere
    'visual:style',        # Artistic style
    'visual:texture',      # Surface qualities
    'visual:perspective',  # Camera angle
    'visual:depth',        # Depth cues
    'visual:motion',       # Movement
    'visual:detail',       # Fine details
    'visual:contrast',     # Contrast levels
]

# Resonance Rings (explicit cross-modal connections)
RESONANCE_RINGS = {
    ('concept:moody', 'visual:lighting'): 0.85,
    ('concept:urban', 'visual:composition'): 0.80,
    ('visual:lighting', 'visual:mood'): 0.90,
    ('visual:perspective', 'visual:depth'): 0.75,
    ('concept:shallow', 'visual:depth'): 0.80,
}


def create_multimodal_graph(
    text: str,
    image_description: Optional[str] = None,
    dim: int = 512
) -> MultimodalGraph:
    """
    Create bridged multimodal graph (Q3 ruling).
    
    Args:
        text: Text input
        image_description: Optional visual description
        dim: Embedding dimension
    
    Returns:
        MultimodalGraph with concept + visual subgraphs + resonance bridges
    """
    graph = MultimodalGraph(dim)
    
    # Parse text concepts
    concepts = _extract_concepts(text)
    for concept in concepts:
        node = Node(
            id=f"concept:{concept}",
            type='concept',
            value=concept,
            position=torch.randn(dim),  # Will be normalized
            ring='middle'
        )
        node.position = F.normalize(node.position, p=2, dim=-1)
        graph.add_concept_node(node)
    
    # Parse visual features (if provided)
    if image_description:
        visual_features = _extract_visual_features(image_description)
        for feature_type, value in visual_features.items():
            node = Node(
                id=f"{feature_type}:{value}",
                type=feature_type,
                value=value,
                position=torch.randn(dim),
                ring='outer'
            )
            node.position = F.normalize(node.position, p=2, dim=-1)
            graph.add_visual_node(node)
    
    # Add resonance bridges
    for (concept_type, visual_type), weight in RESONANCE_RINGS.items():
        # Find matching nodes
        concept_nodes = [n for n in graph.get_concept_nodes() if concept_type in n.id]
        visual_nodes = [n for n in graph.get_visual_nodes() if visual_type in n.id]
        
        for c_node in concept_nodes:
            for v_node in visual_nodes:
                graph.add_resonance_bridge(c_node.id, v_node.id, weight)
    
    return graph


def _extract_concepts(text: str) -> List[str]:
    """Extract concepts from text (placeholder)."""
    # TODO: Use NLP parser (spaCy, etc.)
    # For now, simple word extraction
    words = text.lower().split()
    return [w for w in words if len(w) > 3]


def _extract_visual_features(description: str) -> Dict[str, str]:
    """Extract visual features from description (placeholder)."""
    # TODO: Use visual feature extractor
    # For now, keyword matching
    features = {}
    
    if 'moody' in description.lower():
        features['visual:mood'] = 'moody'
    if 'urban' in description.lower():
        features['visual:composition'] = 'urban'
    if 'dusk' in description.lower() or 'golden hour' in description.lower():
        features['visual:lighting'] = 'golden hour'
    if 'shallow' in description.lower() or 'dof' in description.lower():
        features['visual:depth'] = 'shallow DOF'
    if '50mm' in description or 'lens' in description.lower():
        features['visual:perspective'] = '50mm lens'
    
    return features


# ═══════════════════════════════════════════════════════════════
# VALIDATION METRICS (FROM NIC-1)
# ═══════════════════════════════════════════════════════════════

def validate_orbital_dynamics(
    embeddings: torch.Tensor,
    graph: SemanticGraph,
    metrics: Dict
) -> Dict[str, bool]:
    """
    Validate orbital dynamics against NIC-1 specifications.
    
    Optimal regimes:
    - Pairwise uplift: +0.000111 (gentle fusion)
    - Clustering coefficient: >0.3 (structure forms)
    - Convergence: <24 cycles (efficiency)
    """
    validations = {}
    
    # Check pairwise uplift
    uplift = metrics['pairwise_uplift']
    validations['uplift_in_range'] = 0.00001 < uplift < 0.001
    
    # Check clustering
    clustering = metrics['clustering_coefficient']
    validations['clustering_sufficient'] = clustering > 0.3
    
    # Check convergence
    validations['converged'] = metrics['converged']
    validations['efficient_convergence'] = metrics['convergence_cycle'] < cycles
    
    # Check manifold constraint (all on unit sphere)
    norms = torch.norm(embeddings, p=2, dim=-1)
    validations['on_unit_sphere'] = torch.allclose(norms, torch.ones_like(norms), atol=1e-5)
    
    return validations

