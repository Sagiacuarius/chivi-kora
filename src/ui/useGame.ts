// === Chiví Korá — UI: Hook useGame ===
// Adaptador entre el engine (TypeScript puro) y React state.
// Sigue Clean Architecture: el engine no sabe que React existe.

import { useCallback, useState } from 'react';
import type { GameState } from '../engine/domain/types';
import { boardTopology } from '../engine/domain/board-topology';
import { createGame } from '../engine/use-cases/create-game';
import { executeMove, MoveError } from '../engine/use-cases/execute-move';
import { getValidMoves } from '../engine/domain/game-rules';

export interface MoveResult {
  wasCapture: boolean;
  capturedNodeId: number | null;
}

export interface UseGameReturn {
  state: GameState;
  /** Último resultado del movimiento ejecutado (null si no hubo movimiento aún). */
  lastMoveResult: MoveResult | null;
  /** Movimientos válidos para la pieza seleccionada (o [] si ninguna). */
  validMoves: number[];
  /** Seleccionar una pieza (nodeId). Retorna sus movimientos válidos. */
  selectPiece: (nodeId: number) => number[];
  /** Ejecutar un movimiento: fromNode → toNode. Actualiza lastMoveResult. */
  makeMove: (fromNode: number, toNode: number) => void;
  /** Reiniciar partida. */
  reset: () => void;
  /** Error del último movimiento (o null). */
  error: string | null;
}

export function useGame(): UseGameReturn {
  const [state, setState] = useState<GameState>(() => createGame(boardTopology));
  const [validMoves, setValidMoves] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastMoveResult, setLastMoveResult] = useState<MoveResult | null>(null);

  const selectPiece = useCallback(
    (nodeId: number): number[] => {
      const moves = getValidMoves(boardTopology, state, nodeId);
      setValidMoves(moves);
      setError(null);
      return moves;
    },
    [state],
  );

  const makeMove = useCallback(
    (fromNode: number, toNode: number) => {
      try {
        const result = executeMove(boardTopology, state, fromNode, toNode);
        setState(result.newState);
        setLastMoveResult({ wasCapture: result.wasCapture, capturedNodeId: result.capturedNodeId });
        setValidMoves([]);
        setError(null);
      } catch (e) {
        setError(e instanceof MoveError ? e.message : 'Error desconocido');
        setValidMoves([]);
        setLastMoveResult(null);
      }
    },
    [state],
  );

  const reset = useCallback(() => {
    setState(createGame(boardTopology));
    setValidMoves([]);
    setError(null);
    setLastMoveResult(null);
  }, []);

  return { state, lastMoveResult, validMoves, selectPiece, makeMove, reset, error };
}