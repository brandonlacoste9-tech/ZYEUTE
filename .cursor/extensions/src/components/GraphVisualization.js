/**
 * 🧠 Graph Visualization Component
 * 
 * Simple visualization of the semantic graph returned by OrbitalProp
 * Displays nodes (concepts) and their relationships (edges)
 * 
 * This is the "visual cortex" showing how TI-Guy structures thoughts
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';

export default function GraphVisualization({ graph, metadata }) {
  if (!graph || !graph.nodes) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Aucun graphique à afficher</Text>
      </View>
    );
  }

  const nodes = Object.values(graph.nodes || {});
  const edges = graph.edges || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧠 Structure de la Pensée</Text>
        {metadata && (
          <>
            <Text style={styles.meta}>
              {metadata.nodeCount} concepts • {metadata.edgeCount} relations
            </Text>
            {metadata.dreamMode && (
              <Text style={styles.dreamMode}>🔮 Mode Rêve (Simulation)</Text>
            )}
          </>
        )}
      </View>

      <ScrollView style={styles.scroll}>
        {/* Nodes List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Concepts ({nodes.length})</Text>
          {nodes.map((node) => (
            <View key={node.id} style={styles.nodeCard}>
              <View style={styles.nodeHeader}>
                <Text style={styles.nodeLabel}>{node.label}</Text>
                <Text style={styles.nodeType}>{node.type}</Text>
              </View>
              <View style={styles.nodeStats}>
                <Text style={styles.stat}>
                  Masse: {node.mass?.toFixed(2) || '1.00'}
                </Text>
                <Text style={styles.stat}>
                  Activation: {(node.activation * 100).toFixed(0)}%
                </Text>
              </View>
              {node.position && (
                <Text style={styles.position}>
                  Position: ({node.position[0]?.toFixed(2)}, {node.position[1]?.toFixed(2)}, {node.position[2]?.toFixed(2)})
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Edges List */}
        {edges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Relations ({edges.length})</Text>
            {edges.slice(0, 20).map((edge, index) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              
              return (
                <View key={index} style={styles.edgeCard}>
                  <Text style={styles.edgeText}>
                    <Text style={styles.edgeSource}>
                      {sourceNode?.label || edge.source}
                    </Text>
                    {' → '}
                    <Text style={styles.edgeTarget}>
                      {targetNode?.label || edge.target}
                    </Text>
                  </Text>
                  <Text style={styles.edgeMeta}>
                    Type: {edge.type || 'sequence'} • Poids: {edge.weight?.toFixed(2) || '0.50'}
                  </Text>
                </View>
              );
            })}
            {edges.length > 20 && (
              <Text style={styles.moreText}>
                ... et {edges.length - 20} autres relations
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginVertical: 8,
  },
  header: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
  },
  dreamMode: {
    color: colors.gold,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  nodeCard: {
    backgroundColor: '#2F261C',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nodeLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  nodeType: {
    color: colors.gold,
    fontSize: 11,
    textTransform: 'uppercase',
    backgroundColor: colors.leather,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nodeStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  stat: {
    color: colors.muted,
    fontSize: 12,
  },
  position: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  edgeCard: {
    backgroundColor: '#2F261C',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    borderLeftWidth: 2,
    borderLeftColor: colors.gold,
  },
  edgeText: {
    color: colors.text,
    fontSize: 13,
    marginBottom: 4,
  },
  edgeSource: {
    fontWeight: '600',
    color: colors.gold,
  },
  edgeTarget: {
    fontWeight: '600',
    color: colors.text,
  },
  edgeMeta: {
    color: colors.muted,
    fontSize: 11,
  },
  moreText: {
    color: colors.muted,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});

