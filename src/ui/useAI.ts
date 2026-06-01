// === Chiví Korá — UI: useAI ===
// Hook que escucha cambios de turno y ejecuta la IA automáticamente.
// No bloquea el thread: usa requestAnimationFrame + setTimeout para dar
// sensación de "pensando" antes de mover.

import { useEffect, useRef, useState } from 'react';
import type { GameState, BoardTopology } from '../engine/domain/types';
import type { AIConfig, AIBestMove, Difficulty } from '../engine/ai';
import { findBestMove } from '../engine/ai';

export interface UseAIReturn {
  isThinking: boolean;
  lastMove: AIBestMove | null;
  /** Fuerza el cálculo de la IA para el estado actual (juega por state.currentTurn). */
  triggerAI: (topology: BoardTopology, state: GameState, difficulty: Difficulty) => void;
}

export function useAI(onAIMove: (move: AIBestMove) => void): UseAIReturn {
  const [isThinking, setIsThinking] = useState(false);
  const [lastMove, setLastMove] = useState<AIBestMove | null>(null);
  const onAIMoveRef = useRef(onAIMove);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mantener ref actualizado sin re-render
  onAIMoveRef.current = onAIMove;

  const triggerAI = (
    topology: BoardTopology,
    state: GameState,
    difficulty: Difficulty,
  ) => {
    // Limpiar timeout previo si existe
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsThinking(true);

    // Simular "tiempo de pensamiento" (300-800ms) para UX,
    // luego ejecutar findBestMove que puede tardar hasta 2s.
    timeoutRef.current = setTimeout(() => {
      const config: AIConfig = { difficulty, timeBudget: 2000 };
      const move = findBestMove(topology, state, state.currentTurn, config);

      if (move !== null) {
        setLastMove(move);
        onAIMoveRef.current(move);
      }

      setIsThinking(false);
    }, 300 + Math.random() * 500);
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isThinking, lastMove, triggerAI };
}