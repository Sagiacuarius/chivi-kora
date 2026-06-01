// === Chiví Korá — UI: GameSetup ===
// Pantalla inicial con estética selva misionera.
// Selectores de bando y dificultad con visuales de madera/vegetación.

import type { Player } from '../engine/domain/types';
import type { Difficulty } from '../engine/ai';
import { CulturalPanel } from './CulturalPanel';
import { useT } from '../i18n/LanguageContext';

interface GameSetupProps {
  playerSide: Player;
  difficulty: Difficulty;
  onPlayerSideChange: (side: Player) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStart: () => void;
}

const CARD_STYLE = {
  background: 'linear-gradient(145deg, rgba(30,25,18,0.9) 0%, rgba(20,15,10,0.95) 100%)',
  border: '1px solid #5c3d1e',
  borderRadius: 12,
  padding: '1.75rem 2.25rem',
  minWidth: 300,
  boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,168,67,0.1)',
};

const LEGEND_STYLE = {
  color: '#d4a843',
  fontFamily: "'Cinzel', serif",
  fontWeight: 700 as const,
  fontSize: '0.8rem',
  letterSpacing: '0.12em',
  padding: '0 0.5rem',
  textTransform: 'uppercase' as const,
};

const OPTION_BASE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  cursor: 'pointer',
  padding: '0.75rem 1rem',
  borderRadius: 8,
  border: '1px solid transparent',
  transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
};

function optionStyle(active: boolean, accentColor: string): React.CSSProperties {
  return {
    ...OPTION_BASE,
    background: active ? `rgba(${hexToRgb(accentColor)}, 0.12)` : 'transparent',
    border: `1px solid ${active ? accentColor : 'transparent'}`,
    boxShadow: active ? `0 0 12px rgba(${hexToRgb(accentColor)}, 0.15)` : 'none',
  };
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

const RADIO_STYLE = { width: 20, height: 20, accentColor: '#d4a843', cursor: 'pointer' };

export function GameSetup({
  playerSide,
  difficulty,
  onPlayerSideChange,
  onDifficultyChange,
  onStart,
}: GameSetupProps) {
  const t = useT();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '2rem',
        padding: '2rem 1rem',
      }}
    >
      {/* ── Título ── */}
      <header style={{ textAlign: 'center', animation: 'fadeSlideIn 0.5s ease-out' }}>
        {/* Ornamento superior */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '0.5rem',
          }}
        >
          <svg width="40" height="2" viewBox="0 0 40 2">
            <line x1="0" y1="1" x2="40" y2="1" stroke="#5c3d1e" strokeWidth="1" />
          </svg>
          <span style={{ color: '#6b4c2a', fontSize: '4.8rem' }}>🐆</span>
          <svg width="40" height="2" viewBox="0 0 40 2">
            <line x1="0" y1="1" x2="40" y2="1" stroke="#5c3d1e" strokeWidth="1" />
          </svg>
        </div>

        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '3rem',
            color: '#d4a843',
            margin: 0,
            letterSpacing: '0.08em',
            textShadow: '0 3px 12px rgba(0,0,0,0.6), 0 0 30px rgba(212,168,67,0.2)',
            lineHeight: 1.1,
          }}
        >
          Chiví Korá
        </h1>

        <p
          style={{
            color: '#7a6a58',
            marginTop: '0.5rem',
            fontSize: '1.35rem',
            fontStyle: 'italic',
            letterSpacing: '0.03em',
          }}
        >
          {t('game_setup_subtitle')}
        </p>

        {/* Ornamento inferior */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '0.75rem',
          }}
        >
          <span style={{ color: '#5c3d1e', fontSize: '0.7rem' }}>◆</span>
          <span style={{ color: '#5c3d1e', fontSize: '0.7rem' }}>◆</span>
          <span style={{ color: '#5c3d1e', fontSize: '0.7rem' }}>◆</span>
        </div>
      </header>

      {/* ── Selector de bando ── */}
      <CulturalPanel />
      <fieldset
        style={{
          ...CARD_STYLE,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          animation: 'fadeSlideIn 0.5s ease-out 0.1s both',
        }}
      >
        <legend style={LEGEND_STYLE}>{t('jugas_como')}</legend>

        <label style={optionStyle(playerSide === 'yaguarete', '#d4820a')}>
          <input
            type="radio"
            name="playerSide"
            value="yaguarete"
            checked={playerSide === 'yaguarete'}
            onChange={() => onPlayerSideChange('yaguarete')}
            style={RADIO_STYLE}
          />
          {/* Ícono de yaguareté */}
          <span style={{ fontSize: '1.5rem' }}>🐆</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 600, color: '#d4a843' }}>
            {t('yaguarete_label')}
          </span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.75rem',
              color: '#7a6a58',
              fontStyle: 'italic',
            }}
          >
            {t('atacas')}
          </span>
        </label>

        <label style={optionStyle(playerSide === 'perros', '#8b7355')}>
          <input
            type="radio"
            name="playerSide"
            value="perros"
            checked={playerSide === 'perros'}
            onChange={() => onPlayerSideChange('perros')}
            style={RADIO_STYLE}
          />
          {/* Ícono de perro */}
          <span style={{ fontSize: '1.5rem' }}>🐕</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 600, color: '#c0a080' }}>
            {t('perros_label')}
          </span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.75rem',
              color: '#7a6a58',
              fontStyle: 'italic',
            }}
          >
            {t('defendes')}
          </span>
        </label>
      </fieldset>

      {/* ── Selector de dificultad ── */}
      <fieldset
        style={{
          ...CARD_STYLE,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
          animation: 'fadeSlideIn 0.5s ease-out 0.2s both',
        }}
      >
        <legend style={LEGEND_STYLE}>{t('dificultad')}</legend>

        <label style={optionStyle(difficulty === 'easy', '#4a7c59')}>
          <input
            type="radio"
            name="difficulty"
            value="easy"
            checked={difficulty === 'easy'}
            onChange={() => onDifficultyChange('easy')}
            style={{ ...RADIO_STYLE, accentColor: '#4a7c59' }}
          />
          <span style={{ fontSize: '1.4rem' }}>🌱</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 600, color: '#7aaa8a' }}>{t('facil')}</span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.75rem',
              color: '#7a6a58',
              fontStyle: 'italic',
            }}
          >
            {t('profundidad_n').replace('{n}', '3')}
          </span>
        </label>

        <label style={optionStyle(difficulty === 'hard', '#c04040')}>
          <input
            type="radio"
            name="difficulty"
            value="hard"
            checked={difficulty === 'hard'}
            onChange={() => onDifficultyChange('hard')}
            style={{ ...RADIO_STYLE, accentColor: '#c04040' }}
          />
          <span style={{ fontSize: '1.4rem' }}>🔥</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 600, color: '#c06060' }}>{t('dificil')}</span>
          <span
            style={{
              marginLeft: 'auto',
              fontSize: '0.75rem',
              color: '#7a6a58',
              fontStyle: 'italic',
            }}
          >
            {t('profundidad_n').replace('{n}', '5')}
          </span>
        </label>
      </fieldset>

      {/* ── Botón iniciar ── */}
      <button
        onClick={onStart}
        style={{
          padding: '1rem 3.5rem',
          background: 'linear-gradient(145deg, #8b5a1a 0%, #d4820a 50%, #8b5a1a 100%)',
          backgroundSize: '200% 100%',
          color: '#fff',
          border: '1px solid #c08020',
          borderRadius: 10,
          cursor: 'pointer',
          fontFamily: "'Cinzel', serif",
          fontSize: '1.1rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          boxShadow: '0 6px 20px rgba(212,130,10,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
          transition: 'background-position 0.3s, transform 0.15s, box-shadow 0.15s',
          animation: 'fadeSlideIn 0.5s ease-out 0.3s both',
          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
        onMouseEnter={e => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.backgroundPosition = '100% 0';
          btn.style.transform = 'translateY(-2px)';
          btn.style.boxShadow = '0 8px 28px rgba(212,130,10,0.55), inset 0 1px 0 rgba(255,255,255,0.15)';
        }}
        onMouseLeave={e => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.backgroundPosition = '0% 0';
          btn.style.transform = 'translateY(0)';
          btn.style.boxShadow = '0 6px 20px rgba(212,130,10,0.4), inset 0 1px 0 rgba(255,255,255,0.15)';
        }}
      >
        {t('empezar_partida')}
      </button>
    </div>
  );
};