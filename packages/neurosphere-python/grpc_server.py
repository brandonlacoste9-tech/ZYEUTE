"""
Neurosphere gRPC Server

Exposes the Mind via gRPC for Node.js Kernel integration.

Endpoints:
- Embed: Generate orbital embeddings
- Classify: Semantic classification
- Reason: Multi-hop reasoning over knowledge graph
"""

from __future__ import annotations

import asyncio
import logging
from concurrent import futures
from typing import Optional

import grpc
import torch

# Import orbital kernel
from orbital_kernel import (
    OrbitalEmbedder,
    SemanticGraph,
    ThreeRingsClassifier,
    orbital_propagation_kernel,
    validate_orbital_dynamics,
)
from visual_primitives import (
    VisualFeatureExtractor,
    ResonanceEngine,
    create_multimodal_graph,
)

# Generated protobuf code (will be created next)
# from generated import neurosphere_pb2, neurosphere_pb2_grpc

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class NeurosphereService:
    """
    gRPC service implementation for Neurosphere Mind.
    
    Implements CMAR-1 specifications with Gemini's rulings.
    """
    
    def __init__(self):
        self.embedder = OrbitalEmbedder(dim=512, eta=0.06, cycles=24)
        self.visual_extractor = VisualFeatureExtractor()
        self.resonance_engine = ResonanceEngine()
        self.three_rings = ThreeRingsClassifier()
        
        logger.info("Neurosphere service initialized")
        logger.info(f"  Embedding dim: {self.embedder.dim}")
        logger.info(f"  Eta: {self.embedder.eta}")
        logger.info(f"  Cycles: {self.embedder.cycles}")
    
    async def Embed(self, request, context):
        """
        Generate orbital embedding on unit sphere.
        
        Request:
            input: str - Text to embed
            model: str - Model variant ('orbital-512', 'orbital-1024')
        
        Response:
            embedding: List[float] - Unit vector on S^(d-1)
            confidence: float
            metadata: dict
        """
        try:
            input_text = request.input
            model = request.model or 'orbital-512'
            
            # Generate embedding
            embedding = self.embedder.embed(input_text)
            
            # Convert to list
            embedding_list = embedding.tolist()
            
            # Compute confidence (placeholder - would use model uncertainty)
            confidence = 0.94
            
            logger.info(f"Embedded text (len={len(input_text)}): {input_text[:50]}...")
            
            return {
                'embedding': embedding_list,
                'confidence': confidence,
                'metadata': {
                    'model': model,
                    'dim': len(embedding_list),
                    'on_unit_sphere': True
                }
            }
        
        except Exception as e:
            logger.error(f"Embed error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Embedding failed: {str(e)}")
            return {}
    
    async def Classify(self, request, context):
        """
        Semantic classification using orbital dynamics.
        
        Request:
            input: str - Text to classify
            categories: List[str] - Optional category constraints
        
        Response:
            labels: List[str] - Semantic labels
            category: str - Primary category
            confidence: float
        """
        try:
            input_text = request.input
            
            # Extract concepts
            concepts = self._extract_concepts(input_text)
            
            # Classify into bee roles (primary use case)
            category = self._classify_to_bee_role(concepts)
            
            # Generate semantic labels
            labels = concepts[:5]  # Top 5 concepts
            
            confidence = 0.87
            
            logger.info(f"Classified: {input_text[:50]}... → {category}")
            
            return {
                'labels': labels,
                'category': category,
                'confidence': confidence,
                'metadata': {
                    'concepts_extracted': len(concepts)
                }
            }
        
        except Exception as e:
            logger.error(f"Classify error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Classification failed: {str(e)}")
            return {}
    
    async def Reason(self, request, context):
        """
        Multi-hop reasoning using orbital propagation.
        
        Request:
            query: str - Question or reasoning task
            context: dict - Additional context
            max_hops: int - Maximum reasoning depth
            include_visual: bool - Enable visual reasoning
        
        Response:
            reasoning: str - Reasoning chain
            next_action: str - Recommended action
            confidence: float
            metadata: dict
        """
        try:
            query = request.query
            req_context = request.context or {}
            max_hops = request.max_hops or 3
            include_visual = request.include_visual or False
            
            logger.info(f"Reasoning query: {query[:100]}...")
            
            # Build semantic graph
            if include_visual and 'image_description' in req_context:
                graph = create_multimodal_graph(
                    text=query,
                    image_description=req_context['image_description'],
                    dim=self.embedder.dim
                )
                logger.info("  Using multimodal graph (concept + visual)")
            else:
                graph = self._build_text_graph(query)
                logger.info("  Using text-only graph")
            
            # Get initial positions
            merged = graph.merge_for_propagation() if hasattr(graph, 'merge_for_propagation') else graph
            embeddings = merged.get_node_positions()
            
            # Run orbital propagation with CMAR-1 rulings
            final_embeddings, metrics = orbital_propagation_kernel(
                embeddings,
                merged,
                eta=self.embedder.eta,
                cycles=self.embedder.cycles,
                verbose=False
            )
            
            # Extract reasoning from top-activated nodes
            reasoning_chain = self._extract_reasoning(merged, final_embeddings)
            
            # Determine next action
            next_action = self._determine_action(merged, final_embeddings)
            
            # Compute confidence from energy convergence
            confidence = self._compute_confidence(metrics)
            
            logger.info(f"  Reasoning complete: {reasoning_chain[:100]}...")
            logger.info(f"  Next action: {next_action}")
            logger.info(f"  Confidence: {confidence:.3f}")
            
            return {
                'reasoning': reasoning_chain,
                'next_action': next_action,
                'confidence': confidence,
                'metadata': {
                    'convergence_cycle': metrics['convergence_cycle'],
                    'final_energy': metrics['final_energy'],
                    'pairwise_uplift': metrics['pairwise_uplift'],
                    'clustering': metrics['clustering_coefficient'],
                    'graph_nodes': len(merged.nodes),
                    'graph_edges': len(merged.edges)
                }
            }
        
        except Exception as e:
            logger.error(f"Reason error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Reasoning failed: {str(e)}")
            return {}
    
    def _extract_concepts(self, text: str) -> List[str]:
        """Extract concepts from text (simple implementation)."""
        # TODO: Use spaCy or similar NLP library
        words = text.lower().split()
        # Filter out common words
        stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'}
        concepts = [w for w in words if w not in stopwords and len(w) > 3]
        return concepts[:10]  # Limit to top 10
    
    def _classify_to_bee_role(self, concepts: List[str]) -> str:
        """Classify concepts to bee role."""
        # Simple keyword matching (would use orbital similarity in production)
        doc_keywords = ['document', 'write', 'report', 'summary', 'content']
        code_keywords = ['code', 'program', 'function', 'debug', 'test']
        vision_keywords = ['image', 'video', 'visual', 'design', 'graphic']
        ops_keywords = ['deploy', 'infrastructure', 'server', 'monitor']
        
        concept_str = ' '.join(concepts)
        
        if any(kw in concept_str for kw in doc_keywords):
            return 'DocBee'
        if any(kw in concept_str for kw in code_keywords):
            return 'CodeBee'
        if any(kw in concept_str for kw in vision_keywords):
            return 'VisionBee'
        if any(kw in concept_str for kw in ops_keywords):
            return 'OpsBee'
        
        return 'GeneralBee'
    
    def _build_text_graph(self, text: str) -> SemanticGraph:
        """Build semantic graph from text only."""
        from orbital_kernel import Node
        
        graph = SemanticGraph(self.embedder.dim)
        concepts = self._extract_concepts(text)
        
        for concept in concepts:
            node = Node(
                id=f"concept:{concept}",
                type='concept',
                value=concept,
                position=torch.randn(self.embedder.dim)
            )
            node.position = F.normalize(node.position, p=2, dim=-1)
            graph.add_node(node)
        
        # Add edges between all concepts (will be refined by rewiring)
        node_ids = list(graph.nodes.keys())
        for i, id1 in enumerate(node_ids):
            for id2 in node_ids[i+1:]:
                graph.add_edge(id1, id2, weight=0.5, edge_type='semantic')
        
        return graph
    
    def _extract_reasoning(
        self,
        graph: SemanticGraph,
        embeddings: torch.Tensor
    ) -> str:
        """Extract reasoning chain from top-activated nodes."""
        # Sort nodes by activation
        sorted_nodes = sorted(
            graph.nodes.values(),
            key=lambda n: n.activation,
            reverse=True
        )
        
        # Top 5 nodes form reasoning chain
        top_nodes = sorted_nodes[:5]
        reasoning = ' → '.join([n.value for n in top_nodes])
        
        return reasoning
    
    def _determine_action(
        self,
        graph: SemanticGraph,
        embeddings: torch.Tensor
    ) -> str:
        """Determine next action from graph state."""
        # Find highest-activation action node
        action_nodes = [n for n in graph.nodes.values() if n.type == 'action']
        
        if action_nodes:
            best_action = max(action_nodes, key=lambda n: n.activation)
            return best_action.value
        
        # Fallback: infer from concepts
        return 'analyze'
    
    def _compute_confidence(self, metrics: Dict) -> float:
        """
        Compute confidence from orbital dynamics metrics.
        
        High confidence when:
        - System converged (reached Attractor Well)
        - Low final energy (stable configuration)
        - Good clustering (structure formed)
        """
        confidence = 0.5
        
        # Boost for convergence
        if metrics['converged']:
            confidence += 0.2
        
        # Boost for low energy (stable)
        if metrics['final_energy'] < 0.5:
            confidence += 0.15
        
        # Boost for good clustering
        if metrics['clustering_coefficient'] > 0.3:
            confidence += 0.15
        
        return min(confidence, 1.0)


async def serve(port: int = 8000):
    """
    Start Neurosphere gRPC server.
    
    Args:
        port: Port to listen on (default: 8000)
    """
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
    
    # Add service
    service = NeurosphereService()
    # neurosphere_pb2_grpc.add_NeurosphereServiceServicer_to_server(service, server)
    
    # Listen
    server.add_insecure_port(f'[::]:{port}')
    
    logger.info(f"🧠 Neurosphere Mind starting on port {port}...")
    logger.info("  Implementing CMAR-1 rulings:")
    logger.info("    ✅ Q1: Emergent wells + energy detector")
    logger.info("    ✅ Q2: Adaptive annealing (sigmoid decay)")
    logger.info("    ✅ Q3: Bridged subgraphs (resonance model)")
    
    await server.start()
    logger.info("✅ Neurosphere Mind online")
    
    await server.wait_for_termination()


if __name__ == '__main__':
    asyncio.run(serve(port=8000))

