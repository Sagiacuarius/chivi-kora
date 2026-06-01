// === Chiví Korá — Domain: Heurística Dual Mejorada ===
// Funciones de evaluación para IA yaguareté (maximiza) y perros (minimiza).
// Ambas devuelven un número: mayor = mejor para el que evalúa.
//
// Mejoras v2 (US-005):
// - Yaguareté: capturas ×1000, control cueva, penalización bordes, distancia a perros
// - Perros: bloqueo de escapes, perros aislados penalizados, control nodos clave,
//   avance coordinado hacia el yaguareté, formación de cerco

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
 *
 * Factores (pesos calibrados empíricamente):
 * 1. Capturas disponibles         × 1000  ← camino directo a la victoria
 * 2. Movilidad (BFS depth 2)      × 40    ← opciones tácticas
 * 3. Proximidad al centro         × 30    ← el centro da más movilidad
 * 4. Proximidad a la cueva        × 25    ← refugio seguro, punto de partida
 * 5. Penalización bordes          × -60   ← menos vecinos = más vulnerable
 * 6. Distancia promedio a perros  × 15    ← perros lejos = más espacio
 * 7. Cantidad de perros vivos     × -100  ← menos perros = más cerca de ganar
 */
export function evaluateYaguarete(topology: BoardTopology, state: GameState): number {
  if (state.status === 'yaguarete_win_umbral') return 100_000;
  if (state.status === 'perros_win_acorralado') return -100_000;

  const yaguarete = state.pieces.find(p => p.type === 'yaguarete' && !p.captured);
  if (!yaguarete) return -100_000;

  const alivePerros = state.pieces.filter(p => p.type === 'perros' && !p.captured);
  const nodes = topology.getNodes();
  const yNode = nodes[yaguarete.nodeId];
  if (!yNode) return 0;

  // 1. Capturas disponibles
  const captures = countCapturesAvailable(topology, state, yaguarete.nodeId);

  // 2. Movilidad (BFS depth=2)
  const mobility = bfsReachable(topology, state, yaguarete.nodeId, 'yaguarete', 2).size;

  // 3. Proximidad al centro (nodo 12)
  const centerNode = nodes[12]!;
  const dxCenter = (centerNode.x - yNode.x) / 80;
  const dyCenter = (centerNode.y - yNode.y) / 80;
  const centerProximity = 8 - Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);

  // 4. Proximidad a la cueva (nodo 27)
  const cuevaNode = nodes[27]!;
  const dxCueva = (cuevaNode.x - yNode.x) / 80;
  const dyCueva = (cuevaNode.y - yNode.y) / 80;
  const cuevaProximity = 8 - Math.sqrt(dxCueva * dxCueva + dyCueva * dyCueva);

  // 5. Penalización por estar en el borde (menos vecinos = más vulnerable)
  const neighborCount = topology.getNeighbors(yaguarete.nodeId).length;
  const edgePenalty = (8 - neighborCount) * 10; // 0 si tiene 8 vecinos, hasta 80 en esquina

  // 6. Distancia euclidiana promedio a perros vivos
  let totalDist = 0;
  for (const p of alivePerros) {
    const pNode = nodes[p.nodeId];
    if (!pNode) continue;
    const dx = pNode.x - yNode.x;
    const dy = pNode.y - yNode.y;
    totalDist += Math.sqrt(dx * dx + dy * dy);
  }
  const avgDogDist = alivePerros.length > 0 ? totalDist / alivePerros.length : 500;

  // 7. Cantidad de perros vivos
  const dogCount = alivePerros.length;

  return (
    captures * 1000
    + mobility * 40
    + centerProximity * 30
    + cuevaProximity * 25
    - edgePenalty * 60
    + avgDogDist * 0.15
    - dogCount * 100
  );
}

// ──────────────────────────────────────────────────────────────
// EVALUACIÓN PERROS (minimiza)
// ──────────────────────────────────────────────────────────────

/**
 * Evalúa qué tan favorable es `state` para los perros.
 * +∞ = victoria inminente para perros, -∞ = derrota.
 *
 * Factores:
 * 1. Reducción de movilidad yaguareté      × -60   ← más acorralado = mejor
 * 2. Compactness (perros juntos)           × 40    ← formación de cerco
 * 3. Avance hacia el yaguareté             × 25    ← presión ofensiva
 * 4. Perros en zona cueva                  × 15    ← bloquean escape
 * 5. Penalización perros aislados          × -30   ← perro solo = vulnerable
 * 6. Cantidad de perros vivos              × 80    ← más perros = más control
 * 7. Control de nodos clave (centro 12, entrada cueva) × 50
 * 8. Distancia entre perros e yaguareté    × -10   ← más cerca = mejor cerco
 */
export function evaluatePerros(topology: BoardTopology, state: GameState): number {
  if (state.status === 'perros_win_acorralado') return 100_000;
  if (state.status === 'yaguarete_win_umbral') return -100_000;

  const yaguarete = state.pieces.find(p => p.type === 'yaguarete' && !p.captured);
  if (!yaguarete) return 100_000;

  const alivePerros = state.pieces.filter(p => p.type === 'perros' && !p.captured);
  const nodes = topology.getNodes();
  const yNode = nodes[yaguarete.nodeId];
  if (!yNode) return 0;

  const dogCount = alivePerros.length;
  const dogNodeIds = alivePerros.map(p => p.nodeId);

  // 1. Reducción de movilidad del yaguareté (BFS depth=2)
  const yaguareteMobility = bfsReachable(topology, state, yaguarete.nodeId, 'yaguarete', 2).size;

  // 2. Compactness: qué tan juntos están los perros entre sí
  const compactness = evaluateCompactness(topology, dogNodeIds);

  // 3. Avance hacia el yaguareté: perros más abajo (y mayor) están más cerca de la cueva
  let advanceScore = 0;
  for (const p of alivePerros) {
    const pNode = nodes[p.nodeId];
    if (!pNode) continue;
    // Distancia euclidiana al yaguareté (menor = mejor)
    const dx = pNode.x - yNode.x;
    const dy = pNode.y - yNode.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Premiar cercanía: 100 - dist/2, mínimo 0
    advanceScore += Math.max(0, 100 - dist / 2);
  }
  advanceScore = alivePerros.length > 0 ? advanceScore / alivePerros.length : 0;

  // 4. Perros en zona cueva (nodos 26, 27, 28, 32): bloquean escape
  const cuevaNodes = new Set([26, 27, 28, 32]);
  let cuevaControl = 0;
  for (const nodeId of dogNodeIds) {
    if (cuevaNodes.has(nodeId)) cuevaControl++;
    // También premiar perros adyacentes a la cueva
    for (const edge of topology.getNeighbors(nodeId)) {
      if (cuevaNodes.has(edge.to)) cuevaControl += 0.5;
    }
  }

  // 5. Penalización perros aislados: perro sin vecinos perro adyacentes
  let isolatedCount = 0;
  for (const nodeId of dogNodeIds) {
    let hasDogNeighbor = false;
    for (const edge of topology.getNeighbors(nodeId)) {
      if (dogNodeIds.includes(edge.to)) {
        hasDogNeighbor = true;
        break;
      }
    }
    if (!hasDogNeighbor) isolatedCount++;
  }

  // 6. Perros perdidos (capturados) es malo → penaliza
  const lostDogs = 15 - dogCount;

  // 7. Control de nodos clave: centro (12) y entradas a cueva (22→22 es la conexión grilla-cueva)
  const keyNodes = [6, 7, 8, 12, 16, 17, 18, 22]; // anillo interior + conexión cueva
  let keyNodeControl = 0;
  for (const nodeId of dogNodeIds) {
    if (keyNodes.includes(nodeId)) keyNodeControl++;
  }

  // 8. Distancia promedio entre perros e yaguareté
  let totalDist = 0;
  for (const p of alivePerros) {
    const pNode = nodes[p.nodeId];
    if (!pNode) continue;
    const dx = pNode.x - yNode.x;
    const dy = pNode.y - yNode.y;
    totalDist += Math.sqrt(dx * dx + dy * dy);
  }
  const avgDogDist = alivePerros.length > 0 ? totalDist / alivePerros.length : 0;

  return (
    yaguareteMobility * -60
    + compactness * 40
    + advanceScore * 25
    + cuevaControl * 15
    - isolatedCount * 30
    - lostDogs * 80
    + keyNodeControl * 50
    - avgDogDist * 10
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

/**
 * Evalúa qué tan compactos están los perros entre sí.
 * Calcula la distancia promedio entre todos los pares de perros.
 * Menor distancia = más compactos = mejor cerco.
 */
function evaluateCompactness(topology: BoardTopology, nodeIds: number[]): number {
  if (nodeIds.length < 2) return 50; // un solo perro no puede ser compacto

  const nodes = topology.getNodes();
  let totalDist = 0;
  let pairs = 0;

  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 1; j < nodeIds.length; j++) {
      const a = nodes[nodeIds[i]!];
      const b = nodes[nodeIds[j]!];
      if (!a || !b) continue;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      totalDist += Math.sqrt(dx * dx + dy * dy);
      pairs++;
    }
  }

  if (pairs === 0) return 50;
  const avgDist = totalDist / pairs;
  // 100 = perfectamente compactos, 0 = muy dispersos
  return Math.max(0, 100 - avgDist / 5);
}
