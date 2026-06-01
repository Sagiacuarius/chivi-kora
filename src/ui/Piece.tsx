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
    fill: '#5a4030',
    stroke: '#3a2515',
    glowColor: 'rgba(90,64,48,0.5)',
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

      {/* Pieza: silueta SVG (consistente cross-platform) */}
      <g transform={`translate(${x},${y}) scale(${(r / 10).toFixed(3)})`}>
        {piece.type === 'yaguarete' ? (
          <>
            <ellipse cx={-1} cy={1} rx={7} ry={4} fill={style.fill} />
            <circle cx={7} cy={-2} r={3} fill={style.fill} />
            <polygon points="5,-5 6.5,-8 8,-4.5" fill={style.fill} />
            <polygon points="7.5,-4.5 8.5,-7 10,-4" fill={style.fill} />
            <ellipse cx={10} cy={-1.5} rx={2} ry={1.3} fill={style.fill} />
            <circle cx={8} cy={-3} r={0.5} fill="#1a0a00" />
            <path d="M-8,0 Q-13,-3 -12,-7" stroke={style.fill} strokeWidth={1.8} fill="none" strokeLinecap="round" />
            <rect x={-5.5} y={4.5} width={1.5} height={4} rx={0.6} fill={style.fill} />
            <rect x={-1.5} y={4.5} width={1.5} height={4} rx={0.6} fill={style.fill} />
            <rect x={3} y={4.5} width={1.5} height={3.5} rx={0.6} fill={style.fill} />
            <rect x={5.5} y={4.5} width={1.5} height={3.5} rx={0.6} fill={style.fill} />
            <circle cx={-3} cy={1.5} r={0.9} fill="#c07010" opacity={0.6} />
            <circle cx={1} cy={2.5} r={0.8} fill="#c07010" opacity={0.6} />
            <circle cx={5} cy={0} r={0.9} fill="#c07010" opacity={0.6} />
          </>
        ) : (
          <>
            <ellipse cx={0} cy={1} rx={6} ry={3.5} fill={style.fill} />
            <ellipse cx={7} cy={-1.5} rx={3} ry={2.5} fill={style.fill} />
            <ellipse cx={10} cy={-1} rx={2.2} ry={1.8} fill={style.fill} />
            <ellipse cx={5.5} cy={-4.5} rx={1.5} ry={3} fill={style.fill} transform="rotate(-12,5.5,-4.5)" />
            <circle cx={11.5} cy={-1.5} r={0.6} fill="#1a0a00" />
            <circle cx={8} cy={-2.5} r={0.5} fill="#1a0a00" />
            <path d="M-6,0 Q-10,-2 -9,-5" stroke={style.fill} strokeWidth={1.5} fill="none" strokeLinecap="round" />
            <rect x={-4} y={4} width={1.4} height={3.5} rx={0.6} fill={style.fill} />
            <rect x={-0.3} y={4} width={1.4} height={3.5} rx={0.6} fill={style.fill} />
            <rect x={3.5} y={4} width={1.4} height={3} rx={0.6} fill={style.fill} />
            <rect x={6} y={4} width={1.4} height={3} rx={0.6} fill={style.fill} />
          </>
        )}
      </g>
    </g>
  );
}