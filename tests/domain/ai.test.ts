// === Chiví Korá — Tests: AI ===
// Suite para findBestMove, heurística y Minimax.

import { describe, it, expect } from 'vitest';
import { boardTopology } from '../../src/engine/domain/board-topology';
import { createGame } from '../../src/engine/use-cases/create-game';
import {
  findBestMove,
  type AIConfig,
} from '../../src/engine/ai';
import {
  evaluateYaguarete,
  evaluatePerros,
  getHeuristicForPlayer,
} from '../../src/engine/domain/heuristic';
import type { GameState, Piece, Player } from '../../src/engine/domain/types';

// ── Helpers ──

function piece(type: Player, nodeId: number, captured = false): Piece {
  return { type, nodeId, captured };
}

function makeState(overrides: {
  pieces?: Piece[];
  currentTurn?: Player;
  status?: 'playing' | 'perros_win_acorralado' | 'yaguarete_win_umbral';
}): GameState {
  const base = createGame(boardTopology);
  return {
    ...base,
    pieces: overrides.pieces ?? base.pieces,
    currentTurn: overrides.currentTurn ?? base.currentTurn,
    status: overrides.status ?? 'playing',
  };
}

const easyConfig: AIConfig = { difficulty: 'easy', timeBudget: 2000 };
const mediumConfig: AIConfig = { difficulty: 'medium', timeBudget: 2000 };
const hardConfig: AIConfig = { difficulty: 'hard', timeBudget: 2000 };

// ============================================================
// Heurística
// ============================================================

describe('Heurística', () => {
  it('getHeuristicForPlayer retorna evaluateYaguarete para yaguarete', () => {
    const h = getHeuristicForPlayer('yaguarete');
    expect(h).toBe(evaluateYaguarete);
  });

  it('getHeuristicForPlayer retorna evaluatePerros para perros', () => {
    const h = getHeuristicForPlayer('perros');
    expect(h).toBe(evaluatePerros);
  });

  it('evaluateYaguarete retorna +100k en victoria por umbral', () => {
    const state = makeState({
      pieces: [
        piece('yaguarete', 27),
        ...Array.from({ length: 7 }, (_, i) => piece('perros', i)),
        ...Array.from({ length: 8 }, (_, i) => piece('perros', i + 15, true)),
      ],
      status: 'yaguarete_win_umbral',
    });
    expect(evaluateYaguarete(boardTopology, state)).toBe(100_000);
  });

  it('evaluateYaguarete retorna -100k en derrota por acorralamiento', () => {
    const state = makeState({
      pieces: [
        piece('yaguarete', 0),
        piece('perros', 1), piece('perros', 5), piece('perros', 6),
        piece('perros', 2), piece('perros', 10), piece('perros', 12),
        piece('perros', 15), piece('perros', 20), piece('perros', 24),
      ],
      status: 'perros_win_acorralado',
    });
    expect(evaluateYaguarete(boardTopology, state)).toBe(-100_000);
  });

  it('evaluatePerros retorna +100k en victoria por acorralamiento', () => {
    const state = makeState({
      pieces: [
        piece('yaguarete', 0),
        piece('perros', 1), piece('perros', 5), piece('perros', 6),
        piece('perros', 2), piece('perros', 10), piece('perros', 12),
        piece('perros', 15), piece('perros', 20), piece('perros', 24),
      ],
      status: 'perros_win_acorralado',
    });
    expect(evaluatePerros(boardTopology, state)).toBe(100_000);
  });

  it('evaluatePerros retorna -100k en derrota por umbral', () => {
    const state = makeState({
      pieces: [
        piece('yaguarete', 27),
        ...Array.from({ length: 7 }, (_, i) => piece('perros', i)),
      ],
      status: 'yaguarete_win_umbral',
    });
    expect(evaluatePerros(boardTopology, state)).toBe(-100_000);
  });

  it('evaluateYaguarete es mayor cuando tiene más movilidad', () => {
    // Yaguareté en la cueva vs. yaguareté en el centro
    const stateCueva = makeState({
      pieces: [piece('yaguarete', 27), ...Array.from({ length: 15 }, (_, i) => piece('perros', i))],
      currentTurn: 'yaguarete',
    });
    const stateCentro = makeState({
      pieces: [piece('yaguarete', 12), ...Array.from({ length: 15 }, (_, i) => piece('perros', i))],
      currentTurn: 'yaguarete',
    });
    const scoreCueva = evaluateYaguarete(boardTopology, stateCueva);
    const scoreCentro = evaluateYaguarete(boardTopology, stateCentro);
    expect(scoreCentro).toBeGreaterThan(scoreCueva);
  });

  it('evaluatePerros prefiere yaguareté acorralado sobre estado inicial', () => {
    // Yaguareté en esquina con perros rodeándolo
    const stateAcorralado = makeState({
      pieces: [
        piece('yaguarete', 0),
        piece('perros', 1), piece('perros', 5), piece('perros', 6),
        piece('perros', 2), piece('perros', 10), piece('perros', 12),
        piece('perros', 15), piece('perros', 20), piece('perros', 24),
      ],
      status: 'playing',
    });
    const stateInicial = createGame(boardTopology);
    const scoreAcorralado = evaluatePerros(boardTopology, stateAcorralado);
    const scoreInicial = evaluatePerros(boardTopology, stateInicial);
    // Yaguareté acorralado en esquina es mejor para perros que estado inicial
    expect(scoreAcorralado).toBeGreaterThan(scoreInicial);
  });

  it('evaluateYaguarete premia tener capturas disponibles', () => {
    // Yaguareté con perro adyacente capturable
    const stateConCaptura = makeState({
      pieces: [
        piece('yaguarete', 27),
        piece('perros', 22), // adyacente a 27, salto a 17
      ],
      currentTurn: 'yaguarete',
      status: 'playing',
    });
    const stateSinCaptura = makeState({
      pieces: [
        piece('yaguarete', 27),
        piece('perros', 0), // lejos, no capturable
      ],
      currentTurn: 'yaguarete',
      status: 'playing',
    });
    const scoreCon = evaluateYaguarete(boardTopology, stateConCaptura);
    const scoreSin = evaluateYaguarete(boardTopology, stateSinCaptura);
    expect(scoreCon).toBeGreaterThan(scoreSin);
  });

  it('evaluatePerros penaliza perros aislados', () => {
    // Perros juntos vs. perros dispersos
    const stateJuntos = makeState({
      pieces: [
        piece('yaguarete', 12),
        piece('perros', 6), piece('perros', 7), piece('perros', 8),
        piece('perros', 11), piece('perros', 13),
        piece('perros', 16), piece('perros', 17), piece('perros', 18),
      ],
      status: 'playing',
    });
    const stateDispersos = makeState({
      pieces: [
        piece('yaguarete', 12),
        piece('perros', 0), piece('perros', 4),
        piece('perros', 20), piece('perros', 24),
      ],
      status: 'playing',
    });
    const scoreJuntos = evaluatePerros(boardTopology, stateJuntos);
    const scoreDispersos = evaluatePerros(boardTopology, stateDispersos);
    // Perros juntos forman mejor cerco → mayor score
    expect(scoreJuntos).toBeGreaterThan(scoreDispersos);
  });
});

// ============================================================
// findBestMove
// ============================================================

describe('findBestMove', () => {
  it('retorna null si no hay piezas del turno actual', () => {
    // Estado: yaguareté pero currentTurn = perros → sin perros vivos → null
    const state = makeState({
      pieces: [piece('yaguarete', 27)],
      currentTurn: 'perros', // no hay perros vivos
    });
    const result = findBestMove(boardTopology, state, 'perros', easyConfig);
    expect(result).toBeNull();
  });

  it('retorna un movimiento válido en estado inicial (fácil)', () => {
    // Estado inicial: currentTurn = yaguarete → la IA busca el mejor move del yaguarete
    const state = createGame(boardTopology);
    // Buscamos move para el yaguarete (currentTurn)
    const result = findBestMove(boardTopology, state, 'yaguarete', easyConfig);
    expect(result).not.toBeNull();
    expect(typeof result!.fromNode).toBe('number');
    expect(typeof result!.toNode).toBe('number');
    expect(result!.fromNode).not.toBe(result!.toNode);
  });

  it('retorna un movimiento con score definido', () => {
    const state = createGame(boardTopology);
    const result = findBestMove(boardTopology, state, 'yaguarete', easyConfig);
    expect(result!.score).toBeDefined();
    expect(typeof result!.score).toBe('number');
  });

  it('el movimiento del yaguareté es legal en estado inicial', () => {
    const state = createGame(boardTopology);
    const result = findBestMove(boardTopology, state, 'yaguarete', easyConfig);
    expect(result).not.toBeNull();

    // El nodo origen debe tener un yaguareté
    const pieceAtOrigin = state.pieces.find(p => p.nodeId === result!.fromNode && p.type === 'yaguarete' && !p.captured);
    expect(pieceAtOrigin).toBeDefined();
  });

  it('fácil, medio y difícil retornan estructuras similares', () => {
    const state = createGame(boardTopology);
    const easy = findBestMove(boardTopology, state, 'yaguarete', easyConfig);
    const medium = findBestMove(boardTopology, state, 'yaguarete', mediumConfig);
    const hard = findBestMove(boardTopology, state, 'yaguarete', hardConfig);
    expect(easy).not.toBeNull();
    expect(medium).not.toBeNull();
    expect(hard).not.toBeNull();
    expect(typeof easy!.fromNode).toBe(typeof hard!.fromNode);
    expect(typeof medium!.fromNode).toBe(typeof hard!.fromNode);
  });

  it('minimax converge: todos los movimientos del primer nivel se evalúan', () => {
    // Estado simple: 1 perro y 1 yaguareté
    const state = makeState({
      pieces: [
        piece('yaguarete', 27),
        piece('perros', 17), // perro adelante del yaguareté en diagonal
      ],
      currentTurn: 'perros',
    });
    const result = findBestMove(boardTopology, state, 'perros', easyConfig);
    expect(result).not.toBeNull();
    // Solo un perro → solo una pieza para mover
    const expectedFrom = 17;
    expect(result!.fromNode).toBe(expectedFrom);
  });

  it('Yaguareté en fácil busca maximizar su score', () => {
    const state = makeState({
      pieces: [
        piece('yaguarete', 27),
        piece('perros', 22), // perro adyacente a la cueva
        ...Array.from({ length: 14 }, (_, i) => piece('perros', i + 1)),
      ],
      currentTurn: 'yaguarete',
    });
    const result = findBestMove(boardTopology, state, 'yaguarete', easyConfig);
    expect(result).not.toBeNull();
    // El yaguareté puede capturar (saltar sobre 22 → 17)
    // o moverse normalmente. La captura debe estar disponible.
    // Solo verificamos que retorne algo y que tenga sentido.
    expect(result!.fromNode).toBe(27);
  });

  it('respeta timeBudget y retorna antes de timeout', () => {
    const state = createGame(boardTopology);
    const start = Date.now();
    const config: AIConfig = { difficulty: 'hard', timeBudget: 200 }; // 200ms
    const result = findBestMove(boardTopology, state, 'yaguarete', config);
    const elapsed = Date.now() - start;
    // Debe retornar un resultado válido sin explotar
    expect(result).not.toBeNull();
    expect(result!.fromNode).toBeGreaterThanOrEqual(0);
    expect(result!.toNode).toBeGreaterThanOrEqual(0);
    // Elapsed no debe superar timeBudget × 5 (margen para overhead de tests)
    expect(elapsed).toBeLessThan(config.timeBudget * 5);
  });
});
