"""
Visual Primitives - First-Class Nodes in Semantic Graph

Implements Gemini's Q3 ruling:
"Visual elements are not 'descriptions' of images; they are nodes equal to text."

When the system "sees" an image of a city at dusk:
1. Activate visual:lighting ("golden hour") node
2. Activate visual:composition ("depth") node
3. Resonance rings physically pull concept:moody node closer on sphere
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

import torch
import torch.nn.functional as F


# ═══════════════════════════════════════════════════════════════
# VISUAL NODE TYPE TAXONOMY
# ═══════════════════════════════════════════════════════════════

VISUAL_NODE_TYPES = {
    'visual:subject': 'Primary focus of the image',
    'visual:composition': 'Layout, framing, spatial arrangement',
    'visual:lighting': 'Light setup, time of day, mood lighting',
    'visual:mood': 'Emotional atmosphere, feeling',
    'visual:style': 'Artistic style, aesthetic',
    'visual:texture': 'Surface qualities, materials',
    'visual:perspective': 'Camera angle, lens choice',
    'visual:depth': 'Depth of field, focus plane',
    'visual:motion': 'Movement, blur, dynamism',
    'visual:detail': 'Fine details, sharpness',
    'visual:contrast': 'Contrast levels, tonal range',
    'visual:color': 'Color palette, saturation',
}


# ═══════════════════════════════════════════════════════════════
# RESONANCE RINGS (CROSS-MODAL CONNECTIONS)
# ═══════════════════════════════════════════════════════════════

RESONANCE_RINGS = {
    # Mood ↔ Lighting (strong correlation)
    ('concept:moody', 'visual:lighting'): 0.85,
    ('concept:dramatic', 'visual:lighting'): 0.80,
    ('concept:serene', 'visual:lighting'): 0.75,
    
    # Lighting ↔ Mood (bidirectional)
    ('visual:lighting', 'visual:mood'): 0.90,
    
    # Composition ↔ Subject
    ('concept:urban', 'visual:composition'): 0.80,
    ('concept:portrait', 'visual:composition'): 0.85,
    ('concept:landscape', 'visual:composition'): 0.85,
    
    # Perspective ↔ Depth
    ('visual:perspective', 'visual:depth'): 0.75,
    
    # Depth ↔ Concepts
    ('concept:shallow', 'visual:depth'): 0.80,
    ('concept:bokeh', 'visual:depth'): 0.85,
    
    # Style ↔ Mood
    ('visual:style', 'visual:mood'): 0.70,
    
    # Motion ↔ Concepts
    ('concept:dynamic', 'visual:motion'): 0.80,
    ('concept:static', 'visual:motion'): 0.75,
    
    # Color ↔ Mood
    ('visual:color', 'visual:mood'): 0.75,
}


@dataclass
class VisualFeature:
    """Extracted visual feature with confidence."""
    
    feature_type: str  # 'visual:lighting', etc.
    value: str
    confidence: float
    source: str  # 'image_analysis', 'text_description', 'user_input'


class VisualFeatureExtractor:
    """
    Extract visual primitives from image descriptions.
    
    In production, this would use:
    - CLIP for image understanding
    - GPT-4V for detailed analysis
    - Custom vision models
    
    For now, uses keyword matching and pattern recognition.
    """
    
    def __init__(self):
        self.lighting_keywords = {
            'golden hour': ['dusk', 'sunset', 'golden', 'warm light'],
            'blue hour': ['twilight', 'blue hour', 'pre-dawn'],
            'harsh': ['midday', 'harsh', 'direct sun'],
            'soft': ['overcast', 'diffused', 'soft light'],
            'dramatic': ['dramatic', 'high contrast', 'chiaroscuro'],
        }
        
        self.mood_keywords = {
            'moody': ['moody', 'atmospheric', 'brooding'],
            'serene': ['serene', 'calm', 'peaceful'],
            'energetic': ['energetic', 'vibrant', 'dynamic'],
            'melancholic': ['melancholic', 'somber', 'wistful'],
        }
        
        self.composition_keywords = {
            'urban': ['urban', 'city', 'street', 'architecture'],
            'portrait': ['portrait', 'face', 'person', 'subject'],
            'landscape': ['landscape', 'nature', 'scenery'],
            'abstract': ['abstract', 'geometric', 'pattern'],
        }
        
        self.depth_keywords = {
            'shallow DOF': ['shallow', 'dof', 'bokeh', 'blurred background'],
            'deep focus': ['deep focus', 'everything sharp', 'f/16'],
        }
        
        self.perspective_keywords = {
            '50mm lens': ['50mm', 'normal lens'],
            'wide angle': ['wide', '24mm', '16mm', 'fisheye'],
            'telephoto': ['telephoto', '85mm', '200mm', 'compressed'],
        }
    
    def extract(self, description: str) -> List[VisualFeature]:
        """
        Extract visual features from text description.
        
        Args:
            description: Text describing visual elements
        
        Returns:
            List of VisualFeature objects
        """
        features = []
        desc_lower = description.lower()
        
        # Extract lighting
        for value, keywords in self.lighting_keywords.items():
            if any(kw in desc_lower for kw in keywords):
                features.append(VisualFeature(
                    feature_type='visual:lighting',
                    value=value,
                    confidence=0.85,
                    source='text_description'
                ))
                break
        
        # Extract mood
        for value, keywords in self.mood_keywords.items():
            if any(kw in desc_lower for kw in keywords):
                features.append(VisualFeature(
                    feature_type='visual:mood',
                    value=value,
                    confidence=0.80,
                    source='text_description'
                ))
                break
        
        # Extract composition
        for value, keywords in self.composition_keywords.items():
            if any(kw in desc_lower for kw in keywords):
                features.append(VisualFeature(
                    feature_type='visual:composition',
                    value=value,
                    confidence=0.85,
                    source='text_description'
                ))
                break
        
        # Extract depth
        for value, keywords in self.depth_keywords.items():
            if any(kw in desc_lower for kw in keywords):
                features.append(VisualFeature(
                    feature_type='visual:depth',
                    value=value,
                    confidence=0.80,
                    source='text_description'
                ))
                break
        
        # Extract perspective
        for value, keywords in self.perspective_keywords.items():
            if any(kw in desc_lower for kw in keywords):
                features.append(VisualFeature(
                    feature_type='visual:perspective',
                    value=value,
                    confidence=0.75,
                    source='text_description'
                ))
                break
        
        return features


class ResonanceEngine:
    """
    Manages resonance bridges between concept and visual subgraphs.
    
    Gemini's insight:
    "The activation of 'golden hour' physically pulls the 'concept:moody' 
    node closer on the sphere (Orbital Mechanics)."
    """
    
    def __init__(self):
        self.resonance_map = RESONANCE_RINGS
    
    def find_resonances(
        self,
        concept_nodes: List[str],
        visual_nodes: List[str]
    ) -> List[Tuple[str, str, float]]:
        """
        Find resonance bridges between concept and visual nodes.
        
        Args:
            concept_nodes: List of concept node IDs
            visual_nodes: List of visual node IDs
        
        Returns:
            List of (concept_id, visual_id, weight) tuples
        """
        bridges = []
        
        for concept_id in concept_nodes:
            for visual_id in visual_nodes:
                # Extract types (remove instance identifiers)
                concept_type = self._extract_type(concept_id)
                visual_type = self._extract_type(visual_id)
                
                # Check if resonance exists
                key = (concept_type, visual_type)
                if key in self.resonance_map:
                    weight = self.resonance_map[key]
                    bridges.append((concept_id, visual_id, weight))
        
        return bridges
    
    def _extract_type(self, node_id: str) -> str:
        """Extract type from node ID (e.g., 'concept:moody' → 'concept:moody')."""
        # For now, return as-is (assumes node IDs are formatted as type:value)
        return node_id
    
    def amplify_resonance(self, factor: float = 2.0) -> None:
        """
        Amplify all resonance bridge weights.
        
        Use for creative tasks requiring strong visual reasoning.
        """
        self.resonance_map = {
            k: min(v * factor, 1.0)  # Cap at 1.0
            for k, v in self.resonance_map.items()
        }
    
    def mute_resonance(self) -> None:
        """
        Mute all resonance bridges.
        
        Use for pure text/logic tasks to save compute.
        """
        self.resonance_map = {k: 0.0 for k in self.resonance_map.keys()}


# ═══════════════════════════════════════════════════════════════
# EXAMPLE USAGE
# ═══════════════════════════════════════════════════════════════

def example_multimodal_reasoning():
    """
    Example: "Moody urban running scene at dusk, shallow DOF, 50mm lens"
    
    Demonstrates Gemini's interpretation:
    - Text concepts: moody, urban, running
    - Visual features: lighting (golden hour), depth (shallow DOF), perspective (50mm)
    - Resonance bridges: moody ↔ lighting, urban ↔ composition
    """
    from orbital_kernel import create_multimodal_graph, orbital_propagation_kernel
    
    # Create multimodal graph
    graph = create_multimodal_graph(
        text="moody urban running scene",
        image_description="dusk, shallow DOF, 50mm lens",
        dim=512
    )
    
    print("📊 Graph Structure:")
    print(f"  Concept nodes: {len(graph.get_concept_nodes())}")
    print(f"  Visual nodes: {len(graph.get_visual_nodes())}")
    print(f"  Resonance bridges: {len(graph.resonance_bridges)}")
    
    # Merge for propagation
    merged = graph.merge_for_propagation()
    embeddings = merged.get_node_positions()
    
    print("\n🌀 Running orbital propagation (24 cycles)...")
    
    # Run orbital dynamics
    final_embeddings, metrics = orbital_propagation_kernel(
        embeddings,
        merged,
        eta=0.06,
        cycles=24,
        verbose=True
    )
    
    print("\n✅ Propagation complete!")
    print(f"  Convergence cycle: {metrics['convergence_cycle']}")
    print(f"  Final energy: {metrics['final_energy']:.6f}")
    print(f"  Pairwise uplift: {metrics['pairwise_uplift']:.6f}")
    print(f"  Clustering: {metrics['clustering_coefficient']:.3f}")
    
    # Validate
    from orbital_kernel import validate_orbital_dynamics
    validations = validate_orbital_dynamics(final_embeddings, merged, metrics)
    
    print("\n🔍 Validation:")
    for check, passed in validations.items():
        status = "✅" if passed else "❌"
        print(f"  {status} {check}")
    
    # Classify into Three Rings
    from orbital_kernel import ThreeRingsClassifier
    classifier = ThreeRingsClassifier()
    viz = classifier.get_ring_visualization(merged)
    
    print("\n🎨 Three Rings Classification:")
    for ring_name, ring_data in viz.items():
        print(f"  {ring_name.upper()}: {len(ring_data['nodes'])} nodes")
        print(f"    Visual: {ring_data['visual_signature']}")


if __name__ == '__main__':
    example_multimodal_reasoning()

