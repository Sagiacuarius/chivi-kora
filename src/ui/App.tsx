// === Chiví Korá — UI: App ===
// Componente raíz. Orchestrates: Tutorial → GameSetup → Board → useAI.
// Fases: setup | playing | ended

import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameSetup, type Difficulty } from './useGameSetup';
import { useGame } from './useGame';
import { useAI } from './useAI';
import { GameSetup } from './GameSetup';
import { Board } from './Board';
import { Piece } from './Piece';
import type { GameStatus, Player } from '../engine/domain/types';
import { GameOver } from './GameOver';
import { MoveHistory } from './MoveHistory';
import { Tutorial } from './Tutorial';
import { useSound } from './useSound';
import type { AIBestMove } from '../engine/ai';
import { boardTopology } from '../engine/domain/board-topology';
import { useT } from '../i18n/LanguageContext';
import { LanguageSelector } from '../i18n/LanguageSelector';

type GamePhase = 'setup' | 'playing' | 'ended';

const TURN_ICON: Record<Player, string> = {
  yaguarete: '🐆',
  perros: '🐕',
};

export function App() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const { config, setPlayerSide, setDifficulty, startGame } = useGameSetup();
  const { state, lastMoveResult, validMoves, selectPiece, makeMove, reset, error } = useGame();
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [playerSide, setPlayerSideLocal] = useState<Player>('yaguarete');
  const [difficulty, setDifficultyLocal] = useState<Difficulty>('easy');
  const [showTutorial, setShowTutorial] = useState(true);

  const t = useT();

  // ── Sonido ──────────────────────────────────────────────
  const { muted, setMuted, playMove, playCapture, playVictoryYaguarete, playVictoryPerros } = useSound();
  // Ref para detectar transición a estado de victoria
  const prevStatusRef = useRef<GameStatus>('playing');

  // ── Reproducir sonido según resultado del último movimiento ──
  useEffect(() => {
    if (lastMoveResult === null) return;
    if (lastMoveResult.wasCapture) {
      playCapture();
    } else {
      playMove();
    }
  }, [lastMoveResult, playCapture, playMove]);

  // ── Sonido de victoria ─────────────────────────────────
  useEffect(() => {
    if (state.status !== 'playing' && prevStatusRef.current === 'playing') {
      if (state.status === 'yaguarete_win_umbral') {
        playVictoryYaguarete();
      } else if (state.status === 'perros_win_acorralado') {
        playVictoryPerros();
      }
    }
    prevStatusRef.current = state.status;
  }, [state.status, playVictoryYaguarete, playVictoryPerros]);

  // ── IA: reacciona al turno ─────────────────────────────
  const handleAIMove = useCallback(
    (move: AIBestMove) => {
      // El sonido se dispara via lastMoveResult en el useEffect de sonido
      makeMove(move.fromNode, move.toNode);
    },
    [makeMove],
  );

  const { isThinking, triggerAI } = useAI(handleAIMove);

  const prevTurnRef = useRef<Player | null>(null);
  useEffect(() => {
    if (phase !== 'playing') return;
    if (state.status !== 'playing') return;
    if (prevTurnRef.current === state.currentTurn) return;
    prevTurnRef.current = state.currentTurn;

    if (state.currentTurn !== playerSide) {
      triggerAI(boardTopology, state, difficulty);
    }
  }, [state.currentTurn, state.status, phase, playerSide, difficulty, triggerAI]);

  // ── Setup ──────────────────────────────────────────────

  const handleStart = () => {
    const cfg = startGame();
    setPlayerSideLocal(cfg.playerSide);
    setDifficultyLocal(cfg.difficulty);
    setSelectedNode(null);
    prevTurnRef.current = null;
    prevStatusRef.current = 'playing';
    reset();
    setPhase('playing');
  };

  // ── Playing ─────────────────────────────────────────────

  const handleNodeClick = useCallback(
    (nodeId: number) => {
      if (state.status !== 'playing') return;
      if (isThinking) return;

      if (selectedNode !== null && validMoves.includes(nodeId)) {
        makeMove(selectedNode, nodeId);
        setSelectedNode(null);
        return;
      }

      const piece = state.pieces.find(p => p.nodeId === nodeId && !p.captured);
      if (piece && piece.type === state.currentTurn) {
        if (piece.type !== playerSide) return;
        selectPiece(nodeId);
        setSelectedNode(nodeId);
      } else {
        setSelectedNode(null);
        selectPiece(-1);
      }
    },
    [state, isThinking, selectedNode, validMoves, makeMove, playerSide, selectPiece],
  );

  const handleNewGame = () => {
    setPhase('setup');
    setSelectedNode(null);
    prevTurnRef.current = null;
    prevStatusRef.current = 'playing';
  };

  const handlePlayAgain = () => {
    setSelectedNode(null);
    prevTurnRef.current = null;
    prevStatusRef.current = 'playing';
    reset();
    setPhase('setup');
  };

  // ── Render ─────────────────────────────────────────────

  if (phase === 'setup') {
    if (showTutorial) {
      return (
        <Tutorial
          onComplete={() => setShowTutorial(false)}
          onSkip={() => setShowTutorial(false)}
        />
      );
    }
    return (
      <GameSetup
        playerSide={config.playerSide}
        difficulty={config.difficulty}
        onPlayerSideChange={setPlayerSide}
        onDifficultyChange={setDifficulty}
        onStart={handleStart}
      />
    );
  }

  const isEnded = state.status !== 'playing';
  const turnIcon = TURN_ICON[state.currentTurn];

  return (
    <>
      <LanguageSelector />
      {/* Pantalla de resultado */}
      {isEnded && (
        <GameOver
          status={state.status}
          onPlayAgain={handlePlayAgain}
          onChangeMode={handleNewGame}
        />
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.875rem',
          animation: 'fadeSlideIn 0.4s ease-out',
        }}
      >
      {/* ── Barra de estado ── */}
      <header style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.75rem',
            color: '#d4a843',
            margin: 0,
            letterSpacing: '0.06em',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          Chiví Korá
        </h1>

        {isEnded ? (
          <div style={{ marginTop: '0.5rem' }}>
            <p
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 700,
                color: state.status === 'yaguarete_win_umbral' ? '#d4a843' : '#c8c0a0',
                textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}
            >
              {t(state.status === 'yaguarete_win_umbral' ? 'gano_yaguarete' : 'ganaron_perros')}
            </p>
            <p
              style={{
                margin: '0.25rem 0 0',
                fontSize: '0.875rem',
                color: '#a09080',
                fontStyle: 'italic',
              }}
            >
              {t(state.status === 'yaguarete_win_umbral' ? 'umbral_alcanzado' : 'yaguarete_acorralado')}
            </p>
          </div>
        ) : (
          <p
            style={{
              margin: '0.5rem 0 0',
              fontSize: '1rem',
              color: '#a09080',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            {isThinking ? (
              <span
                style={{
                  color: '#d4a843',
                  fontStyle: 'italic',
                  animation: 'thinkingPulse 1.2s ease-in-out infinite',
                }}
              >
                {t('ia_pensando')}
              </span>
            ) : (
              <>
                <span style={{ fontSize: '1.2rem' }}>{turnIcon}</span>
                <span>
                  {state.currentTurn === 'yaguarete' ? t('turno_yaguarete') : t('turno_perros')}
                </span>
              </>
            )}
            {/* Botón mute */}
            <button
              onClick={() => setMuted(m => !m)}
              title={muted ? t('activar_sonidos') : t('silenciar')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                padding: '0 0.25rem',
                opacity: 0.7,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'; }}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          </p>
        )}
      </header>

      {/* ── Tablero ── */}
      <Board nodes={state.nodes} edges={state.edges}>
        {state.pieces.map(piece => {
          if (piece.captured) return null;
          const node = state.nodes[piece.nodeId];
          if (!node) return null;
          return (
            <Piece
              key={`${piece.type}-${piece.nodeId}`}
              piece={piece}
              x={node.x}
              y={node.y}
              selected={selectedNode === piece.nodeId}
              isValidTarget={validMoves.includes(piece.nodeId)}
              onClick={() => handleNodeClick(piece.nodeId)}
            />
          );
        })}

        {/* Indicadores de destino válido en nodos vacíos */}
        {validMoves
          .filter(nodeId => !state.pieces.some(p => p.nodeId === nodeId && !p.captured))
          .map(nodeId => {
            const node = state.nodes[nodeId];
            if (!node) return null;
            return (
              <circle
                key={`target-${nodeId}`}
                cx={node.x}
                cy={node.y}
                r={9}
                fill="rgba(212,168,67,0.2)"
                stroke="#d4a843"
                strokeWidth={1.5}
                strokeDasharray="4 2"
                style={{
                  cursor: isThinking ? 'not-allowed' : 'pointer',
                  animation: 'pulseGlow 2s ease-in-out infinite',
                }}
                onClick={() => handleNodeClick(nodeId)}
              />
            );
          })}
      </Board>

      {/* ── Indicadores de piezas capturadas ── */}
      {(() => {
        const capturedPerros = state.pieces.filter(p => p.type === 'perros' && p.captured);
        const capturedYaguarete = state.pieces.filter(p => p.type === 'yaguarete' && p.captured);
        if (capturedPerros.length === 0 && capturedYaguarete.length === 0) return null;
        return (
          <div
            style={{
              display: 'flex',
              gap: '2rem',
              fontSize: '0.8rem',
              color: '#7a6a58',
            }}
          >
            {capturedPerros.length > 0 && (
              <span>{t('perros_restantes').replace('{n}', String(15 - capturedPerros.length))}</span>
            )}
            {capturedYaguarete.length > 0 && (
              <span>{t('yaguarete_capturado')}</span>
            )}
          </div>
        );
      })()}

      {/* ── Error ── */}
      {error && (
        <p style={{ color: '#c04040', fontSize: '0.875rem', margin: 0 }}>{error}</p>
      )}

      {/* ── Historial de movimientos ── */}
      {!isEnded && <MoveHistory moves={state.moveHistory} />}

      {/* ── Botones (ocultos si hay pantalla de resultado) ── */}
      {!isEnded && (
        <button
          onClick={handleNewGame}
          style={{
            padding: '0.5rem 1.5rem',
            background: 'transparent',
            color: '#7a6a58',
            border: '1px solid #3d2b1a',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: "'Nunito', sans-serif",
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#5c3d1e';
            (e.currentTarget as HTMLButtonElement).style.color = '#a09080';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#3d2b1a';
            (e.currentTarget as HTMLButtonElement).style.color = '#7a6a58';
          }}
        >
          {t('nueva_partida')}
        </button>
      )}
    </div>
    </>
  );
}