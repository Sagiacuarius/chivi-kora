// === Chiví Korá — Use Case: Ejecutar Movimiento ===
// Orquesta validación, captura, transición de estado y detección de victoria.
// Retorna el nuevo estado + metadata del movimiento para los adaptadores.

import type { GameState, BoardTopology, Player, Move } from '../domain/types';
import { validateMove } from './validate-move';
import { detectCapture, detectVictory } from '../domain/game-rules';

/** Resultado de ejecutar un movimiento — permite a los adaptadores
 *  saber qué pasó sin consultar el estado internamente. */
export interface MoveResult {
  readonly newState: GameState;
  readonly wasCapture: boolean;
  readonly capturedNodeId: number | null;
}

export class MoveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MoveError';
  }
}

/**
 * Ejecuta un movimiento y retorna el NUEVO estado de juego (inmutable)
 * junto con metadata sobre si hubo captura.
 * Lanza MoveError si el movimiento es ilegal.
 */
export function executeMove(
  topology: BoardTopology,
  state: GameState,
  fromNode: number,
  toNode: number,
): MoveResult {
  // Validar
  const validTargets = validateMove(topology, state, fromNode);
  if (!validTargets.includes(toNode)) {
    throw new MoveError(`Movimiento ilegal: ${fromNode} → ${toNode}`);
  }

  // Clonar piezas (inmutabilidad)
  const newPieces = state.pieces.map(p => ({ ...p }));

  // Mover la pieza
  const movingPiece = newPieces.find(p => p.nodeId === fromNode && !p.captured);
  if (!movingPiece) throw new MoveError(`Pieza no encontrada en nodo ${fromNode}`);

  // ¿Es captura?
  const capturedNodeId = detectCapture(topology, state, fromNode, toNode);
  const wasCapture = capturedNodeId !== null;
  if (wasCapture) {
    const captured = newPieces.find(p => p.nodeId === capturedNodeId && !p.captured);
    if (captured) captured.captured = true;
  }

  movingPiece.nodeId = toNode;

  // Alternar turno
  const nextTurn: Player = state.currentTurn === 'yaguarete' ? 'perros' : 'yaguarete';

  // Construir movimiento para historial
  const move: Move = {
    pieceType: movingPiece.type,
    fromNode,
    toNode,
    captureNodeId: capturedNodeId ?? undefined,
  };

  // Detectar victoria
  const newStatus = detectVictory(topology, { ...state, pieces: newPieces, currentTurn: nextTurn }, nextTurn);
  return {
    newState: {
      ...state,
      pieces: newPieces,
      currentTurn: nextTurn,
      status: newStatus,
      moveHistory: [...state.moveHistory, move],
    },
    wasCapture,
    capturedNodeId,
  };
}