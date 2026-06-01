// === Chiví Korá — Domain: Reglas de Juego ===
// Domain Services puros. Sin estado, sin side effects, sin dependencias de frameworks.
// Cada función recibe el BoardTopology como dependencia (DIP).

import type { GameState, Piece, Player, GameStatus, BoardTopology } from './types';

// ============================================================
// REGLAS DE MOVIMIENTO
// ============================================================

/**
 * Retorna los nodos destino válidos para la pieza en `nodeId`.
 * Depende de BoardTopology (inyectado), no de la implementación concreta del grafo.
 */
export function getValidMoves(
  topology: BoardTopology,
  state: GameState,
  nodeId: number,
): number[] {
  const piece = state.pieces.find(p => p.nodeId === nodeId && !p.captured);
  if (!piece || piece.type !== state.currentTurn || state.status !== 'playing') {
    return [];
  }

  return piece.type === 'perros'
    ? getPerroMoves(topology, state, nodeId)
    : getYaguareteMoves(topology, state, nodeId);
}

/** Movimientos válidos para un perro: cualquier dirección, un paso, a nodo vacío. */
function getPerroMoves(topology: BoardTopology, state: GameState, nodeId: number): number[] {
  const targets: number[] = [];

  for (const edge of topology.getNeighbors(nodeId)) {
    if (!isOccupied(state, edge.to)) {
      targets.push(edge.to);
    }
  }

  return targets;
}

/** Movimientos válidos para el yaguareté: omnidireccional + captura por salto. */
function getYaguareteMoves(topology: BoardTopology, state: GameState, nodeId: number): number[] {
  const targets: number[] = [];

  for (const edge of topology.getNeighbors(nodeId)) {
    if (!isOccupied(state, edge.to)) {
      // Movimiento normal a nodo vacío
      targets.push(edge.to);
    } else if (getPieceAt(state, edge.to)?.type === 'perros') {
      // ¿Puede saltar sobre este perro?
      const beyondNode = topology.getNodeBeyond(nodeId, edge);
      if (beyondNode !== null && !isOccupied(state, beyondNode)) {
        targets.push(beyondNode);
      }
    }
  }

  return targets;
}

// ============================================================
// REGLAS DE CAPTURA
// ============================================================

/**
 * Si el movimiento del yaguareté es una captura, retorna el nodeId del perro capturado.
 * Retorna null si no es captura.
 */
export function detectCapture(
  topology: BoardTopology,
  state: GameState,
  fromNode: number,
  toNode: number,
): number | null {
  for (const edge of topology.getNeighbors(fromNode)) {
    const beyondNode = topology.getNodeBeyond(fromNode, edge);
    if (beyondNode === toNode) {
      const middlePiece = getPieceAt(state, edge.to);
      if (middlePiece && middlePiece.type === 'perros' && !middlePiece.captured) {
        return edge.to;
      }
    }
  }
  return null;
}

// ============================================================
// BFS DE ALCANZABILIDAD
// ============================================================

/**
 * BFS desde `startNode` que retorna todos los nodos alcanzables
 * por la pieza del turno actual, respetando las reglas de movimiento.
 *
 * @param pieceType Tipificación explícita de la pieza a analizar
 *   (necesario porque el BFS crea estados virtuales y debe mover la pieza correcta).
 * @param maxDepth Profundidad máxima de exploración.
 *   - 1 = solo movimientos inmediatos (para detectVictory).
 *   - Infinity = todos los nodos alcanzables en N pasos (para heurística de movilidad US-004).
 *
 * [US-002] Implementado con BFS explícito según requerimiento de US-003.
 */
export function bfsReachable(
  topology: BoardTopology,
  state: GameState,
  startNode: number,
  pieceType: Player,
  maxDepth: number = Infinity,
): Set<number> {
  const visited = new Set<number>();
  const queue: Array<[number, number]> = [[startNode, 0]];
  visited.add(startNode);

  while (queue.length > 0) {
    const [current, depth] = queue.shift()!;
    if (depth >= maxDepth) continue;

    // Estado virtual donde la pieza activa está en `current`
    // (necesario para profundidad > 1: simula que la pieza ya se movió)
    const virtualState = relocateActivePiece(state, current, pieceType);
    const moves = getValidMoves(topology, virtualState, current);

    for (const target of moves) {
      if (!visited.has(target)) {
        visited.add(target);
        queue.push([target, depth + 1]);
      }
    }
  }

  return visited;
}

/** Crea un GameState temporal donde la pieza activa se reubica en `nodeId`.
 *  Busca por nodeId (robusto a clones de estado). */
function relocateActivePiece(state: GameState, nodeId: number, pieceType: Player): GameState {
  const piece = state.pieces.find(p => p.type === pieceType && !p.captured);
  if (!piece || piece.nodeId === nodeId) return state;

  const newPieces = state.pieces.map(p =>
    p.type === pieceType && p.nodeId === piece.nodeId && !p.captured
      ? { ...p, nodeId }
      : { ...p },
  );
  return { ...state, pieces: newPieces };
}

// ============================================================
// REGLAS DE VICTORIA
// ============================================================

/**
 * Evalúa si la partida terminó después de un movimiento.
 * `nextTurn` es quién movería a continuación.
 *
 * [US-003] Usa BFS (maxDepth=1) para detectar acorralamiento.
 */
export function detectVictory(
  topology: BoardTopology,
  state: GameState,
  nextTurn: Player,
): GameStatus {
  // Umbral de 6 perros: si quedan ≤ 6, gana el yaguareté
  const alivePerros = state.pieces.filter(p => p.type === 'perros' && !p.captured).length;
  if (alivePerros <= 6) {
    return 'yaguarete_win_umbral';
  }

  // Acorralamiento: generar TODOS los movimientos posibles del bando que juega.
  // Si la lista está vacía → no puede moverse ni saltar → el oponente gana.
  const activePieces = state.pieces.filter(
    p => p.type === nextTurn && !p.captured,
  );
  const hasAnyMove = activePieces.some(p => {
    const moves = getValidMoves(topology, state, p.nodeId);
    return moves.length > 0;
  });

  if (!hasAnyMove) {
    return nextTurn === 'yaguarete' ? 'perros_win_acorralado' : 'yaguarete_win_umbral';
  }

  return 'playing';
}

// ============================================================
// HELPERS
// ============================================================

function isOccupied(state: GameState, nodeId: number): boolean {
  return state.pieces.some(p => p.nodeId === nodeId && !p.captured);
}

function getPieceAt(state: GameState, nodeId: number): Piece | undefined {
  return state.pieces.find(p => p.nodeId === nodeId && !p.captured);
}
