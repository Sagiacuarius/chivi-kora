// === Chiví Korá — Use Case: Validar Movimiento ===
// Orquesta las reglas de dominio para determinar movimientos válidos.

import type { GameState, BoardTopology } from '../domain/types';
import { getValidMoves } from '../domain/game-rules';

/**
 * Dado un estado de juego y un nodo, retorna los destinos válidos para la pieza en ese nodo.
 * Puerto de entrada al motor de reglas.
 */
export function validateMove(
  topology: BoardTopology,
  state: GameState,
  nodeId: number,
): number[] {
  return getValidMoves(topology, state, nodeId);
}
