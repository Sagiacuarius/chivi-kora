// === Chiví Korá — UI: MoveHistory ===
// Panel inferior con historial de movimientos de la partida.
// Notación simple: "Y: (2,3) → (3,3)" / "P: (4,5) captura en (4,4)"

import { useEffect, useRef } from 'react';
import type { Move } from '../engine/domain/types';
import { useT } from '../i18n/LanguageContext';

interface MoveHistoryProps {
  moves: Move[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  const t = useT();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último movimiento
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [moves.length]);

  if (moves.length === 0) return null;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }}
    >
      <h3
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.7rem',
          color: '#6a5a48',
          margin: 0,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          paddingBottom: '0.25rem',
          borderBottom: '1px solid #3d2b1a',
        }}
      >
        {t('historial_n_moves').replace('{n}', String(moves.length))}
      </h3>

      <div
        style={{
          maxHeight: 140,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.15rem',
          paddingRight: '0.25rem',
        }}
      >
        {moves.map((move, i) => {
          const isYaguarete = move.pieceType === 'yaguarete';
          const isCapture = move.captureNodeId !== undefined;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.5rem',
                padding: '0.2rem 0.4rem',
                borderRadius: 4,
                background: isCapture ? 'rgba(180,50,50,0.08)' : 'transparent',
                animation: 'fadeSlideIn 0.25s ease-out',
              }}
            >
              {/* Número de turno */}
              <span
                style={{
                  fontSize: '0.65rem',
                  color: '#5c4a32',
                  minWidth: '1.5rem',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                }}
              >
                {Math.floor(i / 2) + 1}.
              </span>

              {/* Indicador de turno */}
              <span style={{ fontSize: '0.75rem' }}>
                {isYaguarete ? '🟠' : '🟤'}
              </span>

              {/* Movimiento */}
              <span
                style={{
                  fontSize: '0.8rem',
                  color: isCapture ? '#c06060' : '#a09080',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: isCapture ? 600 : 400,
                }}
              >
                {isCapture
                  ? t('captura_en_nodo').replace('{n}', String(move.toNode))
                  : `${move.fromNode} → ${move.toNode}`}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}