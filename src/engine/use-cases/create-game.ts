// === Chiví Korá — Use Case: Crear Partida Nueva ===
// Factory del estado inicial. Depende de BoardTopology para obtener nodos y aristas.

import type { GameState, BoardTopology, Piece } from '../domain/types';

/**
 * Posición inicial verificada con fuentes primarias:
 * - 15 perros ocupan las filas superiores
 * - 1 yaguareté en la cueva
 * - El yaguareté mueve primero
 *
 * [SPIKE] La distribución exacta de los 15 perros en el tablero tradicional
 * requiere validación visual con el tablero real de Lidio Martínez.
 * Por ahora: 3 filas completas (3 × 5 = 15).
 */
export function createGame(topology: BoardTopology): GameState {
  const pieces: Piece[] = [];

  // 15 perros en filas 0, 1, 2 (IDs 0-14)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      pieces.push({
        type: 'perros',
        nodeId: row * 5 + col,
        captured: false,
      });
    }
  }

  // 1 yaguareté en el vértice de la cueva (nodo 27)
  pieces.push({
    type: 'yaguarete',
    nodeId: 27,
    captured: false,
  });

  return {
    nodes: topology.getNodes(),
    edges: topology.getEdges(),
    pieces,
    currentTurn: 'yaguarete',
    status: 'playing',
    moveHistory: [],
  };
}
