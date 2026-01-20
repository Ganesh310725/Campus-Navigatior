
import { NODES, EDGES } from '../constants';
import { RoutePreference, PathNode } from '../types';

export function calculateRoute(startNodeId: string, endNodeId: string, preference: RoutePreference): PathNode[] {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const nodes = new Set(NODES.map(n => n.id));

  NODES.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });

  distances[startNodeId] = 0;

  while (nodes.size > 0) {
    let closestNodeId: string | null = null;
    nodes.forEach(id => {
      if (closestNodeId === null || distances[id] < distances[closestNodeId]) {
        closestNodeId = id;
      }
    });

    if (closestNodeId === null || distances[closestNodeId] === Infinity || closestNodeId === endNodeId) {
      break;
    }

    nodes.delete(closestNodeId);

    const neighbors = EDGES.filter(e => e.from === closestNodeId || e.to === closestNodeId);
    
    for (const edge of neighbors) {
      const neighborId = edge.from === closestNodeId ? edge.to : edge.from;
      if (!nodes.has(neighborId)) continue;

      let weightMultiplier = 1;
      if (preference === 'accessible' && !edge.tags.includes('accessible')) weightMultiplier = 5;
      if (preference === 'scenic' && !edge.tags.includes('scenic')) weightMultiplier = 0.5;
      if (preference === 'covered' && !edge.tags.includes('covered')) weightMultiplier = 0.3;

      const alt = distances[closestNodeId] + (edge.distance * weightMultiplier);
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = closestNodeId;
      }
    }
  }

  const path: PathNode[] = [];
  let current: string | null = endNodeId;
  while (current !== null) {
    const node = NODES.find(n => n.id === current);
    if (node) path.unshift(node);
    current = previous[current];
  }

  return path;
}
