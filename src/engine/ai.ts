// === Chiví Korá — AI: Minimax con Poda Alfa-Beta ===
// Motor de IA determinístico, 0 tokens, sin dependencias externas.
// Corre en Web Worker para no bloquear el thread principal.

import type { GameState, BoardTopology, Player, Move, Piece } from './domain/types';
import { getValidMoves, detectCapture, detectVictory } from './domain/game-rules';
import { getHeuristicForPlayer } from './domain/heuristic';

// ──────────────────────────────────────────────────────────────
// TIPOS PÚBLICOS
// ──────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface AIConfig {
  difficulty: Difficulty;
  /** Milliseconds budget. Hard límite: 2000ms. */
  timeBudget: number;
}

export interface AIBestMove {
  fromNode: number;
  toNode: number;
  score: number;
  depth: number;
}

// ──────────────────────────────────────────────────────────────
// CONSTANTES
// ──────────────────────────────────────────────────────────────

const DEPTH_MAP: Record<Difficulty, number> = {
  easy: 3,
  medium: 5,
  hard: 7,
};

// ──────────────────────────────────────────────────────────────
// ENTRY POINT
// ──────────────────────────────────────────────────────────────

/**
 * Calcula el mejor movimiento para el jugador actual (`state.currentTurn`).
 * Usa Minimax con poda alfa-beta, profundidad según dificultad.
 * Retorna null si no hay movimientos válidos.
 *
 * `aiPlayer` se usa solo para saber si estamos maximizando o minimizando.
 * El movimiento siempre se genera para `state.currentTurn`.
 */
export function findBestMove(
  topology: BoardTopology,
  state: GameState,
  aiPlayer: Player,
  config: AIConfig,
): AIBestMove | null {
  const depth = DEPTH_MAP[config.difficulty];
  const isMaximizing = aiPlayer === 'yaguarete';
  const currentPlayer = state.currentTurn;

  const pieces = state.pieces.filter((p: Piece) => p.type === currentPlayer && !p.captured);
  if (pieces.length === 0) return null;

  const startTime = Date.now();

  let bestScore = isMaximizing ? -Infinity : Infinity;
  let bestMove: AIBestMove | null = null;

  // Generar todos los movimientos posibles del jugador ACTUAL
  const allMoves = generateAllMoves(topology, state, currentPlayer);

  if (allMoves.length === 0) return null;

  for (const move of allMoves) {
    // Verificar timeout
    if (Date.now() - startTime > config.timeBudget) break;

    const nextState = simulateMove(topology, state, move);
    const score = minimax(
      topology,
      nextState,
      depth - 1,
      -Infinity,
      Infinity,
      !isMaximizing,
      aiPlayer,
      startTime,
      config.timeBudget,
    );

    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = { fromNode: move.fromNode, toNode: move.toNode, score, depth };
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = { fromNode: move.fromNode, toNode: move.toNode, score, depth };
      }
    }
  }

  return bestMove;
}

// ──────────────────────────────────────────────────────────────
// MINIMAX CON PODA ALFA-BETA (RECURSIVO)
// ──────────────────────────────────────────────────────────────

/**
 * Algoritmo Minimax con poda alfa-beta.
 * - `maximizing` = true → maximiza el score del jugador `aiPlayer`
 * - `maximizing` = false → minimiza (el opuesto)
 * - Score > 0 = favorable para aiPlayer
 * - Score < 0 = favorable para el oponente
 */
function minimax(
  topology: BoardTopology,
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  aiPlayer: Player,
  startTime: number,
  timeBudget: number,
): number {
  // ── Cutoffs ──

  if (Date.now() - startTime > timeBudget) return 0; // timeout → retorno neutral

  const status = state.status;
  if (status === 'yaguarete_win_umbral') {
    return aiPlayer === 'yaguarete' ? 100_000 + depth : -100_000 - depth;
  }
  if (status === 'perros_win_acorralado') {
    return aiPlayer === 'perros' ? 100_000 + depth : -100_000 - depth;
  }

  if (depth === 0) {
    return evaluateState(topology, state, aiPlayer);
  }

  const currentPlayer: Player = state.currentTurn;
  const moves = generateAllMoves(topology, state, currentPlayer);

  if (moves.length === 0) {
    // Sin movimientos → quien debería mover pierde
    return currentPlayer === aiPlayer ? -100_000 : 100_000;
  }

  if (maximizing) {
    let value = -Infinity;
    for (const move of moves) {
      const next = simulateMove(topology, state, move);
      value = Math.max(value, minimax(topology, next, depth - 1, alpha, beta, false, aiPlayer, startTime, timeBudget));
      alpha = Math.max(alpha, value);
      if (beta <= alpha) break; // poda beta
    }
    return value;
  } else {
    let value = Infinity;
    for (const move of moves) {
      const next = simulateMove(topology, state, move);
      value = Math.min(value, minimax(topology, next, depth - 1, alpha, beta, true, aiPlayer, startTime, timeBudget));
      beta = Math.min(beta, value);
      if (beta <= alpha) break; // poda alfa
    }
    return value;
  }
}

// ──────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────

/** Genera todos los movimientos legales de `player` en `state`. */
function generateAllMoves(topology: BoardTopology, state: GameState, player: Player): Move[] {
  const moves: Move[] = [];
  const pieces = state.pieces.filter((p: Piece) => p.type === player && !p.captured);

  for (const piece of pieces) {
    const targets = getValidMoves(topology, state, piece.nodeId);
    if (targets.length === 0) continue;
    for (const toNode of targets) {
      moves.push({ pieceType: player, fromNode: piece.nodeId, toNode });
    }
  }

  return moves;
}

/** Evalúa el estado con la heurística del aiPlayer. */
function evaluateState(topology: BoardTopology, state: GameState, aiPlayer: Player): number {
  const heuristic = getHeuristicForPlayer(aiPlayer);
  return heuristic(topology, state);
}

/**
 * Simula un movimiento y retorna el nuevo estado (inmutable, sin mutar el original).
 */
function simulateMove(topology: BoardTopology, state: GameState, move: Move): GameState {
  const newPieces = state.pieces.map((p: Piece) => ({ ...p }));

  const moving = newPieces.find((p: Piece) => p.nodeId === move.fromNode && !p.captured);
  if (!moving) return state;

  // ¿Es captura?
  const captureNodeId = detectCapture(topology, state, move.fromNode, move.toNode);
  if (captureNodeId !== null) {
    const captured = newPieces.find((p: Piece) => p.nodeId === captureNodeId && !p.captured);
    if (captured) captured.captured = true;
  }

  moving.nodeId = move.toNode;

  const nextTurn: Player = state.currentTurn === 'yaguarete' ? 'perros' : 'yaguarete';
  const newStatus = detectVictory(topology, { ...state, pieces: newPieces, currentTurn: nextTurn }, nextTurn);

  return {
    ...state,
    pieces: newPieces,
    currentTurn: nextTurn,
    status: newStatus,
    moveHistory: [...state.moveHistory, move],
  };
}
