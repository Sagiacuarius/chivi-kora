// === Chiví Korá — Domain: Heurística Dual ===
// Funciones de evaluación para IA yaguareté (maximiza) y perros (minimiza).
// Ambas devuelven un número: mayor = mejor para el que evalúa.

import type { GameState, BoardTopology, Player, Piece } from './types';
import { bfsReachable, getValidMoves } from './game-rules';

// ──────────────────────────────────────────────────────────────
// FACTORY
// ──────────────────────────────────────────────────────────────

export type HeuristicFn = (topology: BoardTopology, state: GameState) => number;

/**
 * Retorna la función heurística apropiada para `player`.
 * - 'yaguarete' → maximize (mobility + captures + center proximity)
 * - 'perros'    → minimize
 */
export function getHeuristicForPlayer(player: Player): HeuristicFn {
  return player === 'yaguarete' ? evaluateYaguarete : evaluatePerros;
}

// ──────────────────────────────────────────────────────────────
// EVALUACIÓN YAGUARETÉ (maximiza)
// ──────────────────────────────────────────────────────────────

/**
 * Evalúa qué tan favorable es `state` para el yaguareté.
 * +∞ = victoria inminente, -∞ = derrota inminente.
 */
export function evaluateYaguarete(topology: BoardTopology, state: GameState): number {
  if (state.status === 'yaguarete_win_umbral') return 100_000;
  if (state.status === 'perros_win_acorralado') return -100_000;

  const yaguarete = state.pieces.find(p => p.type === 'yaguarete' && !p.captured);
  if (!yaguarete) return -100_000;

  const alivePerros = state.pieces.filter(p => p.type === 'perros' && !p.captured);

  const captures = countCapturesAvailable(topology, state, yaguarete.nodeId);
  const mobility = bfsReachable(topology, state, yaguarete.nodeId, 'yaguarete', 2).size;

  const centerNode = 12;
  const dx = (topology.getNodes()[centerNode]!.x - topology.getNodes()[yaguarete.nodeId]!.x) / 80;
  const dy = (topology.getNodes()[centerNode]!.y - topology.getNodes()[yaguarete.nodeId]!.y) / 80;
  const centerProximity = 8 - Math.sqrt(dx * dx + dy * dy);

  const dogCount = alivePerros.length;
  const avgDogDistance = alivePerros.reduce((sum, p) => sum + Math.abs(p.nodeId - yaguarete.nodeId), 0) / (alivePerros.length || 1);

  return (
    captures * 500
    + mobility * 30
    + centerProximity * 40
    - dogCount * 80
    - avgDogDistance * 10
  );
}

// ──────────────────────────────────────────────────────────────
// EVALUACIÓN PERROS (minimiza)
// ──────────────────────────────────────────────────────────────

/**
 * Evalúa qué tan favorable es `state` para los perros.
 * +∞ = victoria inminente para perros, -∞ = derrota.
 */
export function evaluatePerros(topology: BoardTopology, state: GameState): number {
  if (state.status === 'perros_win_acorralado') return 100_000;
  if (state.status === 'yaguarete_win_umbral') return -100_000;

  const yaguarete = state.pieces.find(p => p.type === 'yaguarete' && !p.captured);
  if (!yaguarete) return 100_000;

  const alivePerros = state.pieces.filter(p => p.type === 'perros' && !p.captured);
  const dogCount = alivePerros.length;

  const yaguareteMobility = bfsReachable(topology, state, yaguarete.nodeId, 'yaguarete', 2).size;
  const avgDogDistance = alivePerros.reduce((sum, p) => sum + Math.abs(p.nodeId - yaguarete.nodeId), 0) / (alivePerros.length || 1);
  const compactness = evaluateCompactness(topology, alivePerros.map(p => p.nodeId), yaguarete.nodeId);
  const progressionScore = alivePerros.reduce((sum, p) => {
    const node = topology.getNodes()[p.nodeId];
    return sum + (node ? Math.floor(node.y / 90) : 0);
  }, 0);

  return (
    yaguareteMobility * -50
    + avgDogDistance * 20
    + compactness * 30
    + progressionScore * 15
    + (15 - dogCount) * 80
  );
}

// ──────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────

function countCapturesAvailable(topology: BoardTopology, state: GameState, nodeId: number): number {
  const moves = getValidMoves(topology, state, nodeId);
  let captures = 0;

  for (const edge of topology.getNeighbors(nodeId)) {
    const beyond = topology.getNodeBeyond(nodeId, edge);
    if (beyond !== null && moves.includes(beyond)) {
      const pieceAtMiddle = state.pieces.find((p: Piece) => p.nodeId === edge.to && !p.captured);
      if (pieceAtMiddle?.type === 'perros') {
        captures++;
      }
    }
  }

  return captures;
}

function evaluateCompactness(topology: BoardTopology, nodeIds: number[], centroidNodeId: number): number {
  if (nodeIds.length < 2) return 100;
  const nodes = topology.getNodes();
  const centroid = nodes[centroidNodeId];
  if (!centroid) return 100;
  const avgDist = nodeIds.reduce((sum, id) => {
    const n = nodes[id];
    if (!n) return sum;
    const dx = n.x - centroid.x;
    const dy = n.y - centroid.y;
    return sum + Math.sqrt(dx * dx + dy * dy);
  }, 0) / nodeIds.length;
  return Math.max(0, 50 - avgDist / 10);
}
