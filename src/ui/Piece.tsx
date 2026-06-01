// === Chiví Korá — UI: Piece ===
// Piezas: emoji 🐆/🐕 con borde circular.
// Anillos de selección y destino válido se mantienen como SVG.
// Animaciones CSS para selección y captura.

import type { Piece as PieceType } from '../engine/domain/types';

interface PieceProps {
  piece: PieceType;
  x: number;
  y: number;
  selected?: boolean;
  isValidTarget?: boolean;
  onClick?: () => void;
}

interface StyleConfig {
  fill: string;
  stroke: string;
  glowColor: string;
  shadowColor: string;
  radius: number;
}

const PIECE_STYLE: Record<string, StyleConfig> = {
  yaguarete: {
    fill: '#e8941a',
    stroke: '#8b5a08',
    glowColor: 'rgba(232,148,26,0.6)',
    shadowColor: 'rgba(139,90,8,0.5)',
    radius: 16,
  },
  perros: {
    fill: '#d8d0c8',
    stroke: '#a09080',
    glowColor: 'rgba(216,208,200,0.5)',
    shadowColor: 'rgba(0,0,0,0.4)',
    radius: 12,
  },
};

// ── Componente principal ───────────────────────────────────────────────────

export function Piece({
  piece,
  x,
  y,
  selected = false,
  isValidTarget = false,
  onClick,
}: PieceProps) {
  if (piece.captured) return null;

  const style = PIECE_STYLE[piece.type]!;
  const r = style.radius;
  const cursor = onClick ? 'pointer' : 'default';

  return (
    <g
      onClick={onClick}
      style={{ cursor, transition: 'transform 0.3s ease' }}
      role="button"
      aria-label={
        piece.type === 'yaguarete' ? `Yaguareté en nodo ${piece.nodeId}` : `Perro en nodo ${piece.nodeId}`
      }
    >
      {/* Sombra */}
      <ellipse
        cx={x + 2}
        cy={y + r + 2}
        rx={r * 0.85}
        ry={r * 0.25}
        fill={style.shadowColor}
        opacity={0.6}
      />

      {/* Anillo de selección */}
      {selected && (
        <>
          <circle
            cx={x} cy={y} r={r + 7}
            fill="none" stroke="#d4a843" strokeWidth={2.5} opacity={0.9}
            style={{ animation: 'pulseGlow 1.5s ease-in-out infinite' }}
          />
          <circle
            cx={x} cy={y} r={r + 4}
            fill="none" stroke="#f0c040" strokeWidth={1} opacity={0.4}
          />
        </>
      )}

      {/* Indicador de destino válido */}
      {isValidTarget && !selected && (
        <circle
          cx={x} cy={y} r={r + 4}
          fill="rgba(212,168,67,0.2)" stroke="#d4a843" strokeWidth={1.5}
          strokeDasharray="4 2"
          style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
        />
      )}

      {/* Pieza: emoji con borde */}
      <circle cx={x} cy={y} r={r} fill={style.fill} stroke={style.stroke} strokeWidth={1.5} />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={r * 1.5}
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {piece.type === 'yaguarete' ? '🐆' : '🐕'}
      </text>
    </g>
  );
}