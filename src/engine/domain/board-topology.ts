// === Chiví Korá — Domain: Topología del Tablero ===
// Implementación concreta del tablero Chiví Korá: grilla alquerque 5×5 + cueva simplificada.
// Implementa BoardTopology para que los use cases no dependan de esta estructura específica.

import type { Node, Edge, BoardTopology, Direction } from './types';

// ============================================================
// DATOS PUROS: definición declarativa del tablero
// ============================================================

const COLS = 5;
const ROWS = 5;
const SPACING = 90;

/** Construye los nodos: 25 grilla + cueva (26-28 intermedios + 32 base central). */
function buildNodes(): Node[] {
  const nodes: Node[] = [];
  let id = 0;

  // Grilla 5×5 (ids 0-24)
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      nodes.push({ id: id++, x: col * SPACING, y: row * SPACING, zone: 'main' });
    }
  }

  // id 25 no se usa (hueco intencional)
  nodes.push(null!);

  // Cueva — nivel intermedio (y = 5*SPACING = 450)
  nodes.push({ id: 26, x: 1 * SPACING, y: 5 * SPACING, zone: 'cueva' });
  nodes.push({ id: 27, x: 2 * SPACING, y: 5 * SPACING, zone: 'cueva' });
  nodes.push({ id: 28, x: 3 * SPACING, y: 5 * SPACING, zone: 'cueva' });

  // id 29 no se usa (hueco intencional)
  nodes.push(null!);

  // Cueva — base: solo nodo 32 activo, 30/31/33/34 desactivados
  nodes.push(null!); // 30
  nodes.push(null!); // 31
  nodes.push({ id: 32, x: 2 * SPACING, y: 6 * SPACING, zone: 'cueva' });
  nodes.push(null!); // 33
  nodes.push(null!); // 34

  return nodes;
}

/** Determina si una arista diagonal pertenece al patrón alquerque.
 *  Misma lógica que shouldRenderDiagonal en Board.tsx.
 *  Celdas (row+col) par → diagonal ↘, impar → diagonal ↗. */
function isValidAlquerqueDiagonal(fromId: number, toId: number): boolean {
  const fromRow = Math.floor(fromId / COLS);
  const fromCol = fromId % COLS;
  const toRow = Math.floor(toId / COLS);
  const toCol = toId % COLS;

  // Solo filtrar diagonales (cambio de fila Y columna)
  if (fromRow === toRow || fromCol === toCol) return true;

  // Normalizar: from siempre arriba (menor row)
  const topRow = fromRow < toRow ? fromRow : toRow;
  const topCol = fromRow < toRow ? fromCol : toCol;
  const botCol = fromRow < toRow ? toCol : fromCol;

  // ↘ (top-left → bottom-right): celda en (topRow, topCol)
  if (topCol < botCol) {
    return (topRow + topCol) % 2 === 0;
  }
  // ↗ (top-right → bottom-left): celda en (topRow, botCol)
  return (topRow + botCol) % 2 !== 0;
}

/** Determina la dirección de una arista según las filas. */
function resolveDirection(fromRow: number, toRow: number, _fromCol: number, _toCol: number): Direction {
  if (fromRow === toRow) return 'lateral';
  return toRow > fromRow ? 'forward' : 'backward';
}

function nodeId(row: number, col: number): number {
  return row * COLS + col;
}

/** Construye las aristas con sus direcciones. */
function buildEdges(): Edge[] {
  const edges: Edge[] = [];

  // Helper para aristas bidireccionales entre cualquier par de ids
  const link = (a: number, b: number, dir: Direction): void => {
    edges.push({ from: a, to: b, direction: dir });
    edges.push({ from: b, to: a, direction: dir === 'forward' ? 'backward' : dir === 'backward' ? 'forward' : 'lateral' });
  };

  const add = (fromRow: number, fromCol: number, toRow: number, toCol: number): void => {
    const dir = resolveDirection(fromRow, toRow, fromCol, toCol);
    edges.push({
      from: nodeId(fromRow, fromCol),
      to: nodeId(toRow, toCol),
      direction: dir,
    });
  };

  // Horizontales
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 1; c++) {
      add(r, c, r, c + 1);
      add(r, c + 1, r, c);
    }

  // Verticales
  for (let r = 0; r < ROWS - 1; r++)
    for (let c = 0; c < COLS; c++) {
      add(r, c, r + 1, c);
      add(r + 1, c, r, c);
    }

  // Diagonales (alquerque) — solo en celdas del patrón ajedrez
  for (let r = 0; r < ROWS - 1; r++)
    for (let c = 0; c < COLS - 1; c++) {
      // ↘ (r,c) → (r+1,c+1): existe si (r+c) es par
      const a = nodeId(r, c);
      const b = nodeId(r + 1, c + 1);
      if (isValidAlquerqueDiagonal(a, b)) {
        add(r, c, r + 1, c + 1);
        add(r + 1, c + 1, r, c);
      }
      // ↗ (r,c+1) → (r+1,c): existe si (r+c) es impar
      const c2 = nodeId(r, c + 1);
      const d = nodeId(r + 1, c);
      if (isValidAlquerqueDiagonal(c2, d)) {
        add(r, c + 1, r + 1, c);
        add(r + 1, c, r, c + 1);
      }
    }

  // ── Cueva simplificada ──
  // Grilla → intermedios
  link(22, 26, 'forward');
  link(22, 27, 'forward');
  link(22, 28, 'forward');

  // Centro → base central (único nodo base activo: 32)
  link(27, 32, 'forward');

  // Interior horizontal
  link(26, 27, 'lateral');
  link(27, 28, 'lateral');

  return edges;
}

// ============================================================
// SINGLETON: los datos se calculan una vez y son inmutables
// ============================================================

const NODES: Node[] = buildNodes();
const EDGES: Edge[] = buildEdges();

/** Mapa de adyacencia: nodeId → aristas salientes. */
const adjacencyMap: Map<number, Edge[]> = new Map();
for (const edge of EDGES) {
  const list = adjacencyMap.get(edge.from) ?? [];
  list.push(edge);
  adjacencyMap.set(edge.from, list);
}

/** Mapa para detectar el nodo "más allá" en una dirección (útil para capturas).
 *  Clave: `${fromNode}:${direction}:${toNode}`, Valor: el nodo más allá de `toNode`.
 *  Usa dirección geométrica (mismo vector dx,dy) para garantizar línea recta. */
const beyondMap: Map<string, number> = new Map();
for (const edge of EDGES) {
  const fromNode = NODES[edge.from]!;
  const toNode = NODES[edge.to]!;
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;

  const continuation = adjacencyMap
    .get(edge.to)
    ?.find(e => {
      if (e.to === edge.from) return false;
      const nextNode = NODES[e.to]!;
      return (nextNode.x - toNode.x === dx) && (nextNode.y - toNode.y === dy);
    });
  if (continuation) {
    beyondMap.set(`${edge.from}:${edge.direction}:${edge.to}`, continuation.to);
  }
}

// ============================================================
// IMPLEMENTACIÓN DEL PUERTO BoardTopology
// ============================================================

export const boardTopology: BoardTopology = {
  getNodes: () => NODES,
  getEdges: () => EDGES,

  getNeighbors(nodeId: number): Edge[] {
    return adjacencyMap.get(nodeId) ?? [];
  },

  getNodeBeyond(fromNodeId: number, edge: Edge): number | null {
    return beyondMap.get(`${fromNodeId}:${edge.direction}:${edge.to}`) ?? null;
  },
};
