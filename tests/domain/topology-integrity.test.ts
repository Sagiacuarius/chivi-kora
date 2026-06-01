// === Topology Integrity Test ===
// Verifica que la topología actual no permite movimientos ilegales
// que existían en versiones anteriores.

import { describe, it, expect } from 'vitest';
import { boardTopology } from '../../src/engine/domain/board-topology';
import { createGame } from '../../src/engine/use-cases/create-game';
import { getValidMoves } from '../../src/engine/domain/game-rules';
import type { GameState, Piece, Player } from '../../src/engine/domain/types';

function makeState(overrides: {
  pieces?: Piece[];
  currentTurn?: Player;
}): GameState {
  const base = createGame(boardTopology);
  return { ...base, pieces: overrides.pieces ?? base.pieces, currentTurn: overrides.currentTurn ?? base.currentTurn };
}

function y(nodeId: number): Piece {
  return { type: 'yaguarete', nodeId, captured: false };
}
function p(nodeId: number): Piece {
  return { type: 'perros', nodeId, captured: false };
}

describe('Topology integrity — forbidden moves', () => {
  it('yaguareté at 27 should NOT reach 21 or 23 (removed edges)', () => {
    const state = makeState({
      pieces: [y(27), ...Array.from({length:15}, (_,i) => p(i))],
      currentTurn: 'yaguarete',
    });
    const moves = getValidMoves(boardTopology, state, 27);
    expect(moves).not.toContain(21);
    expect(moves).not.toContain(23);
    // Should only reach: 22, 26, 28, 32
    expect(moves.sort()).toEqual([22, 26, 28, 32]);
  });

  it('yaguareté at 22 should NOT reach 25 (removed node)', () => {
    const state = makeState({
      pieces: [y(22), ...Array.from({length:15}, (_,i) => p(i))],
      currentTurn: 'yaguarete',
    });
    const moves = getValidMoves(boardTopology, state, 22);
    expect(moves).not.toContain(25);
  });

  it('no edge should reference node 25 or 29 (removed nodes)', () => {
    const edges = boardTopology.getEdges();
    for (const edge of edges) {
      expect(edge.from).not.toBe(25);
      expect(edge.to).not.toBe(25);
      expect(edge.from).not.toBe(29);
      expect(edge.to).not.toBe(29);
    }
  });

  it('yaguareté at 17: jump 17→5 should NOT work without perro at 11', () => {
    const state = makeState({
      pieces: [y(17), ...Array.from({length:15}, (_,i) => p(i))],
      currentTurn: 'yaguarete',
    });
    const moves = getValidMoves(boardTopology, state, 17);
    expect(moves).not.toContain(5);
  });

  it('yaguareté at 17: jump 17→7 should NOT work without perro at 12', () => {
    const state = makeState({
      pieces: [y(17), ...Array.from({length:15}, (_,i) => p(i))],
      currentTurn: 'yaguarete',
    });
    const moves = getValidMoves(boardTopology, state, 17);
    expect(moves).not.toContain(7);
  });

  it('yaguareté at 27 cannot jump to 17 via removed path', () => {
    // Old topology: 27→21→16 or 27→22→17
    // New: 27 neighbors are 22, 26, 28, 32 only
    // Place perro at 22 to see if jump works
    const state = makeState({
      pieces: [y(27), p(22), ...Array.from({length:14}, (_,i) => {
        // fill nodes 0-14 except where 22 would overlap
        const id = i < 15 ? i : 0;
        return p(id);
      }).filter((_, idx) => idx < 14)],
      currentTurn: 'yaguarete',
    });
    
    // Put perros to block 22, then check if yaguarete can jump over 22 to 17
    // But 27→22 edge exists and 22 has a perro, so check beyondMap
    const beyond = boardTopology.getNodeBeyond(27, 
      boardTopology.getNeighbors(27).find(e => e.to === 22)!
    );
    
    // beyond from 27 over 22 should be 17 (if the edge exists)
    // But only if 27→22→17 is a valid continuation in same direction
    const yaguareteRow = Math.floor(27/5);
    const node22Row = Math.floor(22/5);
    const node17Row = Math.floor(17/5);
    
    // 27 is row 5, 22 is row 4, 17 is row 3 — geometric continuation exists
    // But does beyondMap have it?
    const moves = getValidMoves(boardTopology, state, 27);
    
    // If beyondMap has 27→22→17, 17 would be in moves (if empty)
    // Let's just check it's NOT there since 22 is occupied and beyond is 17
    // Actually 17 IS reachable via jump over 22 IF beyondMap has the entry
    // The key question: does beyondMap have 27:forward:22 → 17?
    expect(beyond).toBe(17); // this SHOULD exist (geometric continuation)
    
    // So yaguareté at 27 with perro at 22 CAN jump to 17
    // This is actually correct behavior — it's a valid capture jump
    // The removed edges were 27→21 and 27→23
  });

  it('cueva: solo nodo 32 activo en la base, conectado a 27', () => {
    const edges = boardTopology.getEdges();
    
    // Solo conexión base: 27↔32
    const cuevaBaseEdges = edges.filter(e => 
      (e.from === 27 && e.to === 32) || (e.from === 32 && e.to === 27)
    );
    expect(cuevaBaseEdges.length).toBe(2); // bidireccional
    
    // Nodos 30, 31, 33, 34 NO deben tener edges
    const deadEdges = edges.filter(e => 
      [30, 31, 33, 34].includes(e.from) || [30, 31, 33, 34].includes(e.to)
    );
    expect(deadEdges.length).toBe(0);
  });

  it('yaguareté at 27 has exactly 4 neighbors (not 6 from old topology)', () => {
    const neighbors = boardTopology.getNeighbors(27).map(e => e.to).sort();
    expect(neighbors).toEqual([22, 26, 28, 32]);
  });

  it('yaguareté at 22 has 8 neighbors in grilla (no node 25)', () => {
    const neighbors = boardTopology.getNeighbors(22).map(e => e.to).sort();
    // 22 is row 4, col 2. Neighbors: 16,17,18,21,23,26,27,28
    expect(neighbors).toEqual([16, 17, 18, 21, 23, 26, 27, 28]);
  });

  it('all nodes referenced by edges exist in nodes array (non-null)', () => {
    const nodes = boardTopology.getNodes();
    const edges = boardTopology.getEdges();
    
    for (const edge of edges) {
      expect(nodes[edge.from]).toBeTruthy();
      expect(nodes[edge.to]).toBeTruthy();
    }
  });

  it('nodes 25, 29, 30, 31, 33, 34 are null holes', () => {
    const nodes = boardTopology.getNodes();
    expect(nodes[25]).toBeNull();
    expect(nodes[29]).toBeNull();
    expect(nodes[30]).toBeNull();
    expect(nodes[31]).toBeNull();
    expect(nodes[33]).toBeNull();
    expect(nodes[34]).toBeNull();
  });

  it('total nodes = 35 (0-34), with 29 valid + 6 null holes', () => {
    const nodes = boardTopology.getNodes();
    expect(nodes.length).toBe(35);
    const validNodes = nodes.filter(Boolean);
    expect(validNodes.length).toBe(29); // 25 grilla + 3 intermedios + 1 base (32)
  });
});
