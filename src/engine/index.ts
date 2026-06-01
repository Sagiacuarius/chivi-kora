// === Chiví Korá — Engine: Barrel Exports ===
// Punto de entrada público del motor de juego.
// Los consumidores (UI, tests) solo importan desde aquí.

// Domain
export type {
  Player,
  Direction,
  Zone,
  GameStatus,
  Node,
  Edge,
  Piece,
  Move,
  GameState,
  BoardTopology,
} from './domain/types';

// Topología concreta del tablero
export { boardTopology } from './domain/board-topology';

// Domain Services (expuestos para testing unitario)
export { getValidMoves, detectCapture, detectVictory, bfsReachable } from './domain/game-rules';

// AI
export type { Difficulty, AIConfig, AIBestMove } from './ai';
export { findBestMove } from './ai';

// Use Cases
export { validateMove } from './use-cases/validate-move';
export { executeMove, MoveError } from './use-cases/execute-move';
export { createGame } from './use-cases/create-game';
