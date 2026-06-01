// === Chiví Korá — UI: Tutorial ===
// Tutorial interactivo de 7 pasos para aprender las reglas.
// Cada paso muestra el tablero con piezas de ejemplo y nodos highlight.

import { useState } from 'react';
import type { Node, Edge } from '../engine/domain/types';
import { boardTopology } from '../engine/domain/board-topology';
import { useT } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/translations';

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
    title: 'tutorial_paso1_titulo',
    text: 'tutorial_paso1_texto',
    nodes: boardTopology.getNodes(),
    edges: boardTopology.getEdges(),
    examplePieces: [],
    highlightedNodes: [27],
  },
  // Paso 2: Las piezas
  {
    title: 'tutorial_paso2_titulo',
    text: 'tutorial_paso2_texto',
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
    title: 'tutorial_paso3_titulo',
    text: 'tutorial_paso3_texto',
    nodes: boardTopology.getNodes(),
    edges: boardTopology.getEdges(),
    examplePieces: [
      { nodeId: 12, type: 'yaguarete', anim: 'bounce' },
    ],
    highlightedNodes: [7, 13, 17, 11, 16, 6, 8, 18], // los 8 vecinos del centro
  },
  // Paso 4: Movimiento del perro en el centro (REGLAS NUEVAS)
  {
    title: 'tutorial_paso4_titulo',
    text: 'tutorial_paso4_texto',
    nodes: boardTopology.getNodes(),
    edges: boardTopology.getEdges(),
    examplePieces: [
      { nodeId: 12, type: 'perros', anim: 'bounce' },
    ],
    highlightedNodes: [7, 13, 17, 11, 16, 6, 8, 18], // los 8 vecinos del centro
  },
  // Paso 5: Captura
  {
    title: 'tutorial_paso5_titulo',
    text: 'tutorial_paso5_texto',
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
    title: 'tutorial_paso6_titulo',
    text: 'tutorial_paso6_texto',
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
    title: 'tutorial_paso7_titulo',
    text: 'tutorial_paso7_texto',
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
  const t = useT();
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
        const color = isYaguarete ? '#e8941a' : '#5a4030';
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
            {/* Pieza: silueta SVG */}
            <g transform={`translate(${node.x},${node.y}) scale(${(r / 10).toFixed(3)})`}>
              {isYaguarete ? (
                <>
                  <ellipse cx={-1} cy={1} rx={7} ry={4} fill={color} />
                  <circle cx={7} cy={-2} r={3} fill={color} />
                  <polygon points="5,-5 6.5,-8 8,-4.5" fill={color} />
                  <polygon points="7.5,-4.5 8.5,-7 10,-4" fill={color} />
                  <ellipse cx={10} cy={-1.5} rx={2} ry={1.3} fill={color} />
                  <circle cx={8} cy={-3} r={0.5} fill="#1a0a00" />
                  <path d="M-8,0 Q-13,-3 -12,-7" stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" />
                  <rect x={-5.5} y={4.5} width={1.5} height={4} rx={0.6} fill={color} />
                  <rect x={-1.5} y={4.5} width={1.5} height={4} rx={0.6} fill={color} />
                  <rect x={3} y={4.5} width={1.5} height={3.5} rx={0.6} fill={color} />
                  <rect x={5.5} y={4.5} width={1.5} height={3.5} rx={0.6} fill={color} />
                  <circle cx={-3} cy={1.5} r={0.9} fill="#c07010" opacity={0.6} />
                  <circle cx={1} cy={2.5} r={0.8} fill="#c07010" opacity={0.6} />
                  <circle cx={5} cy={0} r={0.9} fill="#c07010" opacity={0.6} />
                </>
              ) : (
                <>
                  <ellipse cx={0} cy={1} rx={6} ry={3.5} fill={color} />
                  <ellipse cx={7} cy={-1.5} rx={3} ry={2.5} fill={color} />
                  <ellipse cx={10} cy={-1} rx={2.2} ry={1.8} fill={color} />
                  <ellipse cx={5.5} cy={-4.5} rx={1.5} ry={3} fill={color} transform="rotate(-12,5.5,-4.5)" />
                  <circle cx={11.5} cy={-1.5} r={0.6} fill="#1a0a00" />
                  <circle cx={8} cy={-2.5} r={0.5} fill="#1a0a00" />
                  <path d="M-6,0 Q-10,-2 -9,-5" stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" />
                  <rect x={-4} y={4} width={1.4} height={3.5} rx={0.6} fill={color} />
                  <rect x={-0.3} y={4} width={1.4} height={3.5} rx={0.6} fill={color} />
                  <rect x={3.5} y={4} width={1.4} height={3} rx={0.6} fill={color} />
                  <rect x={6} y={4} width={1.4} height={3} rx={0.6} fill={color} />
                </>
              )}
            </g>
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
          {t('cueva')}
        </text>
      )}
    </svg>
  );
}

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [step, setStep] = useState(0);
  const t = useT();
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
        {t(current.title as TranslationKey)}
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
        {t(current.text as TranslationKey)}
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
          ← {t('anterior')}
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
          {t('saltar')}
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
          {isLast ? t('jugar_ahora') : t('siguiente') + ' →'}
        </button>
      </div>
    </div>
  );
}