// === Chiví Korá — Domain: Tipos ===
// Entidades y Value Objects del dominio. Sin dependencias externas.

// ── Value Objects ──

export type Player = 'yaguarete' | 'perros';

export type Direction = 'forward' | 'backward' | 'lateral';

export type Zone = 'main' | 'cueva';

export type GameStatus =
  | 'playing'
  | 'perros_win_acorralado'
  | 'yaguarete_win_umbral';

// ── Entidades ──

/** Intersección del tablero donde se ubican las piezas. */
export interface Node {
  id: number;
  x: number;
  y: number;
  zone: Zone;
}

/** Conexión dirigida entre dos nodos. La dirección es relativa al tablero:
 *  forward  = hacia el yaguareté (abajo)
 *  backward = hacia los perros (arriba)
 *  lateral  = misma fila */
export interface Edge {
  from: number;
  to: number;
  direction: Direction;
}

/** Pieza del juego. */
export interface Piece {
  type: Player;
  nodeId: number;
  captured: boolean;
}

/** Value Object inmutable que registra un movimiento. */
export interface Move {
  pieceType: Player;
  fromNode: number;
  toNode: number;
  captureNodeId?: number;
}

// ── Aggregate Root ──

/** Estado completo del juego. Aggregate root del bounded context GameEngine. */
export interface GameState {
  nodes: Node[];
  edges: Edge[];
  pieces: Piece[];
  currentTurn: Player;
  status: GameStatus;
  moveHistory: Move[];
}

// ── Puerto (interfaz para inversión de dependencias) ──

/** Abstracción de la topología del tablero.
 *  Permite cambiar la implementación (grafo, matriz, etc.) sin tocar los use cases. */
export interface BoardTopology {
  getNodes(): Node[];
  getEdges(): Edge[];
  /** Vecinos salientes desde un nodo. */
  getNeighbors(nodeId: number): Edge[];
  /** Nodo alcanzable en línea recta después de atravesar una arista (para capturas). */
  getNodeBeyond(fromNodeId: number, edge: Edge): number | null;
}
