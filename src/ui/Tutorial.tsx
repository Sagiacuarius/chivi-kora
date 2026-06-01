// === Chiví Korá — UI: Tutorial ===
// Tutorial interactivo de 7 pasos para aprender las reglas.
// Cada paso muestra el tablero con piezas de ejemplo y nodos highlight.

import { useState } from 'react';
import type { Node, Edge } from '../engine/domain/types';
import { boardTopology } from '../engine/domain/board-topology';

interface TutorialStep {
  title: string;
  text: string;
  nodes: Node[];
  edges: Edge[];
  examplePieces: TutorialPiece[];
  highlightedNodes?: number[];
  highlightedEdgeFrom?: number;
  highlightedEdgeTo?: number;
}

interface TutorialPiece {
  nodeId: number;
  type: 'yaguarete' | 'perros';
  anim?: 'bounce' | 'pulse' | 'capture';
}

const STEPS: TutorialStep[] = [
  // Paso 1: El tablero
  {
    title: 'El tablero',
    text: 'El Chiví Korá se juega en un grafo de 29 nodos: una grilla de 5×5 más una cueva de 4 nodos al pie del tablero. Las líneas muestran las conexiones válidas entre nodos.',
    nodes: boardTopology.getNodes(),
    edges: boardTopology.getEdges(),
    examplePieces: [],
    highlightedNodes: [27],
  },
  // Paso 2: Las piezas
  {
    title: 'Las piezas',
    text: 'El Yaguareté (🐆) empieza en la Cueva (nodo 27). Los Perros (🐕) empiezan en las filas superiores. Son 15 perros contra 1 yaguareté.',
    nodes: boardTopology.getNodes(),
    edges: boardTopology.getEdges(),
    examplePieces: [
      { nodeId: 27, type: 'yaguarete' },
      { nodeId: 0, type: 'perros' },
      { nodeId: 1, type: 'perros' },
      { nodeId: 2, type: 'perros' },
      { nodeId: 3, type: 'perros' },
      { nodeId: 4, type: 'perros' },
      { nodeId: 5, type: 'perros' },
      { nodeId: 6, type: 'perros' },
      { nodeId: 7, type: 'perros' },
      { nodeId: 8, type: 'perros' },
      { nodeId: 9, type: 'perros' },
      { nodeId: 10, type: 'perros' },
      { nodeId: 11, type: 'perros' },
      { nodeId: 12, type: 'perros' },
      { nodeId: 13, type: 'perros' },
      { nodeId: 14, type: 'perros' },
    ],
  },
  // Paso 3: El Yaguareté
  {
    title: 'El Yaguareté se mueve libre',
    text: 'El Yaguareté puede moverse en cualquier dirección: arriba, abajo, lateral o diagonal. Un paso por turno. Tiene hasta 8 movimientos posibles.',
    nodes: boardTopology.getNodes(),
    edges: boardTopology.getEdges(),
    examplePieces: [
      { nodeId: 12, type: 'yaguarete', anim: 'bounce' },
    ],
    highlightedNodes: [7, 13, 17, 11, 16, 6, 8, 18], // los 8 vecinos del centro
  },
  // Paso 4: Movimiento del perro en el centro (REGLAS NUEVAS)
  {
    title: 'Los perros también se mueven libre',
    text: 'Acá ves un perro en el centro del tablero. Puede moverse en las 8 direcciones, igual que el Yaguareté. Los perros ya no están limitados a avanzar solamente.',
    nodes: boardTopology.getNodes(),
    edges: boardTopology.getEdges(),
    examplePieces: [
      { nodeId: 12, type: 'perros', anim: 'bounce' },
    ],
    highlightedNodes: [7, 13, 17, 11, 16, 6, 8, 18], // los 8 vecinos del centro
  },
  // Paso 5: Captura
  {
    title: 'Cómo captura el Yaguareté',
    text: 'El Yaguareté salta sobre un perro adyacente hacia un nodo vacío detrás de él. El perro capturado se retira del tablero.',
    nodes: boardTopology.getNodes(),
    edges: boardTopology.getEdges(),
    examplePieces: [
      { nodeId: 12, type: 'yaguarete' },
      { nodeId: 8, type: 'perros', anim: 'pulse' },
    ],
    highlightedNodes: [4],
    highlightedEdgeFrom: 12,
    highlightedEdgeTo: 4,
  },
  // Paso 6: Victoria de los perros
  {
    title: 'Cómo ganan los perros',
    text: 'Los perros ganan acorralando al Yaguareté. Si el Yaguareté no tiene ningún movimiento válido (ni salto), pierde. Con los perros bien posicionados, incluso con pocos se puede lograr el cerco.',
    nodes: boardTopology.getNodes(),
    edges: boardTopology.getEdges(),
    examplePieces: [
      { nodeId: 0, type: 'yaguarete' },
      { nodeId: 1, type: 'perros' },
      { nodeId: 5, type: 'perros' },
      { nodeId: 6, type: 'perros' },
      { nodeId: 2, type: 'perros' },
      { nodeId: 10, type: 'perros' },
      { nodeId: 12, type: 'perros' },
      { nodeId: 7, type: 'perros' },
      { nodeId: 11, type: 'perros' },
    ],
    highlightedNodes: [0],
  },
  // Paso 7: Victoria del Yaguareté
  {
    title: 'Cómo gana el Yaguareté',
    text: 'El Yaguareté gana capturando perros. Cuando quedan exactamente 6 perros en el tablero, el Yaguareté se libera y gana la partida.',
    nodes: boardTopology.getNodes(),
    edges: boardTopology.getEdges(),
    examplePieces: [
      { nodeId: 12, type: 'yaguarete' },
      ...Array.from({ length: 6 }, (_, i) => ({ nodeId: i, type: 'perros' as const })),
    ],
    highlightedNodes: [12],
  },
];

const SPACING = 90;

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

// SVG minimizado del tablero para el tutorial
function TutorialBoard({
  nodes,
  edges,
  examplePieces,
  highlightedNodes = [],
  highlightedEdgeFrom,
  highlightedEdgeTo,
}: {
  nodes: Node[];
  edges: Edge[];
  examplePieces: TutorialPiece[];
  highlightedNodes?: number[];
  highlightedEdgeFrom?: number;
  highlightedEdgeTo?: number;
}) {
  const nodesMap = new Map(nodes.filter(Boolean).map(n => [n.id, n]));

  // Patrón de ajedrez para diagonales (misma lógica que Board.tsx)
  const visibleEdges = edges.filter(e => {
    if (e.from >= 25 || e.to >= 25) return true; // cueva siempre visible
    const COLS = 5;
    const fromRow = Math.floor(e.from / COLS), fromCol = e.from % COLS;
    const toRow = Math.floor(e.to / COLS), toCol = e.to % COLS;
    if (fromRow === toRow || fromCol === toCol) return true;
    const [tr, tc, _br, bc] = fromRow < toRow
      ? [fromRow, fromCol, toRow, toCol]
      : [toRow, toCol, fromRow, fromCol];
    return tc < bc ? (tr + tc) % 2 === 0 : (tr + bc) % 2 !== 0;
  });

  return (
    <svg
      viewBox={`${-20} ${-20} ${4 * SPACING + 40} ${6 * SPACING + 40}`}
      style={{ width: '100%', maxWidth: 480, height: 'auto', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))' }}
    >
      {/* Fondo del tablero: encierra el grafo con 20px padding */}
      <rect
        x={-20} y={-20}
        width={4 * SPACING + 40}
        height={6 * SPACING + 40}
        fill="#2d1f12"
        rx={10}
      />

      {/* ── Cueva decorativa ── */}
      <polygon
        points={`${2*SPACING},${4*SPACING} ${1*SPACING},${5*SPACING} ${0},${6*SPACING} ${2*SPACING},${6*SPACING} ${4*SPACING},${6*SPACING} ${3*SPACING},${5*SPACING}`}
        fill="rgba(140,35,25,0.12)"
        stroke="#8b5a2b"
        strokeWidth={1.5}
      />

      {/* Aristas */}
      {visibleEdges.map((edge, i) => {
        const from = nodesMap.get(edge.from);
        const to = nodesMap.get(edge.to);
        if (!from || !to) return null;
        const isHighlighted = highlightedEdgeFrom === edge.from && highlightedEdgeTo === edge.to;
        return (
          <line
            key={i}
            x1={from.x} y1={from.y}
            x2={to.x} y2={to.y}
            stroke={isHighlighted ? '#d4a843' : '#4a3520'}
            strokeWidth={isHighlighted ? 3.5 : 1.5}
            opacity={isHighlighted ? 1 : 0.5}
            strokeLinecap="round"
          />
        );
      })}

      {/* Nodos */}
      {nodes.filter(Boolean).map(node => {
        const isHighlighted = highlightedNodes.includes(node.id);
        const isCueva = node.zone === 'cueva';
        return (
          <g key={node.id}>
            {isHighlighted && (
              <circle
                cx={node.x} cy={node.y}
                r={14}
                fill="none"
                stroke="#d4a843"
                strokeWidth={2.5}
                opacity={0.8}
                style={{ animation: 'tutorialPulse 1.5s ease-in-out infinite' }}
              />
            )}
            <circle
              cx={node.x} cy={node.y}
              r={isCueva ? 9 : 6}
              fill={isCueva ? '#3d2b1a' : '#3d2b1a'}
              stroke={isCueva ? '#d4a843' : '#5c3d1e'}
              strokeWidth={1.5}
            />
          </g>
        );
      })}

      {/* Piezas de ejemplo */}
      {examplePieces.map((piece, i) => {
        const node = nodesMap.get(piece.nodeId);
        if (!node) return null;
        const isYaguarete = piece.type === 'yaguarete';
        const color = isYaguarete ? '#e8941a' : '#6b5b4f';
        const r = isYaguarete ? 16 : 12; // mismo que Piece.tsx
        const animClass = piece.anim === 'bounce' ? 'tutorialBounce' :
                         piece.anim === 'pulse' ? 'tutorialPulse' : '';
        return (
          <g key={i} className={animClass} style={{ transformOrigin: `${node.x}px ${node.y}px` }}>
            {/* Sombra */}
            <ellipse
              cx={node.x + 2} cy={node.y + r + 2}
              rx={r * 0.85} ry={r * 0.25}
              fill="rgba(0,0,0,0.3)"
            />
            {/* Pieza */}
            <circle
              cx={node.x} cy={node.y}
              r={r}
              fill={color}
              stroke={isYaguarete ? '#c07010' : '#4a3520'}
              strokeWidth={1.5}
            />
            {/* Ícono */}
            <text
              x={node.x} y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={r * 1.5}
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {isYaguarete ? '🐆' : '🐕'}
            </text>
          </g>
        );
      })}

      {/* Cueva label */}
      {nodes.find(n => n?.zone === 'cueva') && (
        <text
          x={2 * SPACING}
          y={5 * SPACING + 30}
          textAnchor="middle"
          fill="rgba(212,168,67,0.5)"
          fontSize="7"
          fontFamily="'Nunito', sans-serif"
          fontStyle="italic"
        >
          Cueva
        </text>
      )}
    </svg>
  );
}

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step]!;
  const isLast = step === STEPS.length - 1;
  const progress = (step + 1) / STEPS.length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,8,5,0.92)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        gap: '1.25rem',
        zIndex: 200,
        animation: 'fadeSlideIn 0.35s ease-out',
      }}
    >
      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div
          style={{
            height: 3,
            background: '#3d2b1a',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, #d4820a, #d4a843)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <p style={{ textAlign: 'center', color: '#6a5a48', fontSize: '0.75rem', margin: '0.4rem 0 0' }}>
          {step + 1} de {STEPS.length}
        </p>
      </div>

      {/* Título del paso */}
      <h2
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '1.5rem',
          color: '#d4a843',
          margin: 0,
          letterSpacing: '0.05em',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          textAlign: 'center',
        }}
      >
        {current.title}
      </h2>

      {/* Tablero con ejemplo */}
      <div
        style={{
          background: 'rgba(20,15,10,0.8)',
          border: '1px solid #3d2b1a',
          borderRadius: 12,
          padding: '1rem',
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <TutorialBoard
          nodes={current.nodes}
          edges={current.edges}
          examplePieces={current.examplePieces}
          highlightedNodes={current.highlightedNodes}
          highlightedEdgeFrom={current.highlightedEdgeFrom}
          highlightedEdgeTo={current.highlightedEdgeTo}
        />
      </div>

      {/* Texto explicativo */}
      <p
        style={{
          color: '#a09080',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          textAlign: 'center',
          margin: 0,
          maxWidth: 480,
        }}
      >
        {current.text}
      </p>

      {/* Navegación */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          width: '100%',
          maxWidth: 400,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Anterior */}
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            padding: '0.6rem 1.5rem',
            background: 'transparent',
            color: step === 0 ? '#4a3a28' : '#7a6a58',
            border: '1px solid #3d2b1a',
            borderRadius: 8,
            cursor: step === 0 ? 'not-allowed' : 'pointer',
            fontFamily: "'Nunito', sans-serif",
            fontSize: '0.9rem',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          ← Anterior
        </button>

        {/* Saltar */}
        <button
          onClick={onSkip}
          style={{
            padding: '0.6rem 1.5rem',
            background: 'transparent',
            color: '#5c3d1e',
            border: '1px solid #3d2b1a',
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif",
            fontSize: '0.9rem',
          }}
        >
          Saltar
        </button>

        {/* Siguiente / Jugar */}
        <button
          onClick={isLast ? onComplete : () => setStep(s => s + 1)}
          style={{
            padding: '0.6rem 1.5rem',
            background: 'linear-gradient(145deg, #8b5a1a, #d4820a)',
            color: '#fff',
            border: '1px solid #c08020',
            borderRadius: 8,
            cursor: 'pointer',
            fontFamily: "'Cinzel', serif",
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            boxShadow: '0 4px 12px rgba(212,130,10,0.3)',
          }}
        >
          {isLast ? 'Jugar ahora' : 'Siguiente →'}
        </button>
      </div>
    </div>
  );
}