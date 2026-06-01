// === Chiví Korá — UI: useGameSetup ===
// Estado del selector de modo de juego.
// Mantiene la configuración elegida antes de iniciar la partida.

import { useState } from 'react';
import type { Player } from '../engine/domain/types';
import type { Difficulty } from '../engine/ai';

export type { Difficulty };

export interface GameSetupConfig {
  playerSide: Player;
  difficulty: Difficulty;
}

export interface UseGameSetupReturn {
  config: GameSetupConfig;
  setPlayerSide: (side: Player) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: () => GameSetupConfig;
}

export function useGameSetup(): UseGameSetupReturn {
  const [config, setConfig] = useState<GameSetupConfig>({
    playerSide: 'yaguarete',
    difficulty: 'easy',
  });

  const setPlayerSide = (playerSide: Player) =>
    setConfig(prev => ({ ...prev, playerSide }));

  const setDifficulty = (difficulty: Difficulty) =>
    setConfig(prev => ({ ...prev, difficulty }));

  const startGame = (): GameSetupConfig => config;

  return { config, setPlayerSide, setDifficulty, startGame };
}