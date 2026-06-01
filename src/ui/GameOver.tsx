// === Chiví Korá — UI: GameOver ===
// Pantalla de resultado con animaciones temáticas.
// Dos variantes: victoria de perros (acorralamiento) / victoria del yaguareté.

import type { GameStatus } from '../engine/domain/types';

interface GameOverProps {
  status: GameStatus;
  onPlayAgain: () => void;
  onChangeMode: () => void;
}

export function GameOver({ status, onPlayAgain, onChangeMode }: GameOverProps) {
  const isYaguareteWins = status === 'yaguarete_win_umbral';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '2rem',
        animation: 'fadeSlideIn 0.5s ease-out',
      }}
    >
      {/* Overlay oscuro */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,15,10,0.85)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Contenido */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          maxWidth: 420,
          textAlign: 'center',
        }}
      >
        {/* Animación del resultado */}
        <div style={{ position: 'relative', width: 160, height: 160 }}>
          <svg
            viewBox="0 0 160 160"
            style={{ width: 160, height: 160, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))' }}
          >
            {/* Círculo de fondo animado */}
            <circle
              cx={80}
              cy={80}
              r={70}
              fill="none"
              stroke={isYaguareteWins ? '#d4820a' : '#7a5c3a'}
              strokeWidth={2}
              opacity={0.3}
              style={{
                animation: 'pulseGlow 2s ease-in-out infinite',
                transformOrigin: '80px 80px',
              }}
            />
            <circle
              cx={80}
              cy={80}
              r={55}
              fill={isYaguareteWins ? 'rgba(212,130,10,0.1)' : 'rgba(122,92,58,0.1)'}
              stroke={isYaguareteWins ? '#d4820a' : '#7a5c3a'}
              strokeWidth={1}
              opacity={0.5}
            />

            {/* Ícono principal animado */}
            {isYaguareteWins ? <YaguareteFreeIcon /> : <PerrosAcercandoseIcon />}
          </svg>
        </div>

        {/* Título */}
        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '2rem',
            color: isYaguareteWins ? '#d4a843' : '#c0a080',
            margin: 0,
            textShadow: isYaguareteWins
              ? '0 0 30px rgba(212,168,67,0.5), 0 3px 8px rgba(0,0,0,0.5)'
              : '0 3px 8px rgba(0,0,0,0.5)',
            letterSpacing: '0.06em',
            animation: isYaguareteWins ? 'fadeSlideIn 0.6s ease-out 0.2s both' : undefined,
          }}
        >
          {isYaguareteWins ? '¡Ganó el Yaguareté!' : '¡Ganaron los Perros!'}
        </h2>

        {/* Subtítulo explicativo */}
        <p
          style={{
            fontSize: '1rem',
            color: '#a09080',
            margin: 0,
            fontStyle: 'italic',
            lineHeight: 1.6,
            animation: 'fadeSlideIn 0.6s ease-out 0.3s both',
          }}
        >
          {isYaguareteWins
            ? 'El Yaguareté se libera. Con solo 6 perros en el tablero, el jaguar recupera su dominio de la selva.'
            : 'Los perros han acorralado al Yaguareté. Sin movimientos disponibles, el jaguar queda atrapado en la selva.'}
        </p>

        {/* Ornamento */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#5c3d1e',
            animation: 'fadeSlideIn 0.6s ease-out 0.4s both',
          }}
        >
          <svg width="30" height="2" viewBox="0 0 30 2">
            <line x1="0" y1="1" x2="30" y2="1" stroke="#5c3d1e" strokeWidth="1" />
          </svg>
          <span style={{ fontSize: '0.7rem' }}>◆</span>
          <svg width="30" height="2" viewBox="0 0 30 2">
            <line x1="0" y1="1" x2="30" y2="1" stroke="#5c3d1e" strokeWidth="1" />
          </svg>
        </div>

        {/* Texto cultural */}
        <p
          style={{
            fontSize: '0.8rem',
            color: '#6a5a48',
            margin: 0,
            maxWidth: 340,
            lineHeight: 1.7,
            animation: 'fadeSlideIn 0.6s ease-out 0.45s both',
          }}
        >
          {isYaguareteWins
            ? 'En la cosmovisión mbya guaraní, el Yaguareté representa la fuerza vital de la selva. Cuando escapa del cerco, la comunidad renueva su vínculo con la naturaleza.'
            : 'Acorralar al Yaguareté es parte del juego. Los perros, guardianes de la oscuridad según la tradición, cumplen su misión de proteger el espacio comunitario.'}
        </p>

        {/* Botones */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '0.5rem',
            animation: 'fadeSlideIn 0.6s ease-out 0.5s both',
          }}
        >
          <button
            onClick={onPlayAgain}
            style={{
              padding: '0.875rem 2.5rem',
              background: 'linear-gradient(145deg, #8b5a1a 0%, #d4820a 100%)',
              color: '#fff',
              border: '1px solid #c08020',
              borderRadius: 10,
              cursor: 'pointer',
              fontFamily: "'Cinzel', serif",
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              boxShadow: '0 6px 20px rgba(212,130,10,0.4)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 8px 28px rgba(212,130,10,0.55)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                '0 6px 20px rgba(212,130,10,0.4)';
            }}
          >
            Jugar de nuevo
          </button>

          <button
            onClick={onChangeMode}
            style={{
              padding: '0.875rem 1.75rem',
              background: 'transparent',
              color: '#a09080',
              border: '1px solid #5c3d1e',
              borderRadius: 10,
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              fontSize: '1rem',
              fontWeight: 600,
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#8b5a2b';
              (e.currentTarget as HTMLButtonElement).style.color = '#c0a080';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#5c3d1e';
              (e.currentTarget as HTMLButtonElement).style.color = '#a09080';
            }}
          >
            Cambiar modo
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Íconos animados ───────────────────────────────────────

function YaguareteFreeIcon() {
  return (
    <g>
      {/* Onda de побег (escape) */}
      <circle cx="80" cy="80" r="40" fill="rgba(212,130,10,0.08)">
        <animate attributeName="r" from="30" to="60" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="80" cy="80" r="40" fill="none" stroke="#d4820a" strokeWidth="1" opacity="0.3">
        <animate attributeName="r" from="30" to="60" dur="2s" begin="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.5" to="0" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </circle>

      {/* Yaguareté */}
      <g transform="translate(80,80)">
        {/* Cuerpo */}
        <ellipse cx="0" cy="5" rx="18" ry="15" fill="#d4820a" stroke="#8b5a08" strokeWidth="1.5">
          <animate attributeName="ry" values="15;16;15" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
        {/* Cabeza */}
        <circle cx="0" cy="-10" r="10" fill="#d4820a" stroke="#8b5a08" strokeWidth="1.5" />
        {/* Orejas */}
        <polygon points="-8,-18 -11,-26 -4,-20" fill="#d4820a" stroke="#8b5a08" strokeWidth="1" />
        <polygon points="8,-18 11,-26 4,-20" fill="#d4820a" stroke="#8b5a08" strokeWidth="1" />
        {/* Manchas */}
        <circle cx="-7"  cy="2"  r="3" fill="#8b5a08" opacity="0.7" />
        <circle cx="6"   cy="5"  r="2.5" fill="#8b5a08" opacity="0.6" />
        <circle cx="-2"  cy="10" r="2" fill="#8b5a08" opacity="0.5" />
        {/* Ojos */}
        <ellipse cx="-4" cy="-12" rx="2.5" ry="3" fill="#2a1a08" />
        <ellipse cx="4"  cy="-12" rx="2.5" ry="3" fill="#2a1a08" />
        <circle  cx="-3.5" cy="-12.5" r="1" fill="#e8c060" />
        <circle  cx="4.5"  cy="-12.5" r="1" fill="#e8c060" />
        {/* Nariz */}
        <ellipse cx="0" cy="-7" rx="2.5" ry="1.8" fill="#2a1a08" />
        {/* Movimiento de alegría */}
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-4; 0,0"
          dur="1.2s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
        />
      </g>
    </g>
  );
}

function PerrosAcercandoseIcon() {
  return (
    <g>
      {/* Círculo de cerco */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <g key={i} transform={`rotate(${angle} 80 80)`}>
          {/* Perro en el perímetro */}
          <g transform="translate(80, 25)">
            <ellipse cx="0" cy="0" rx="8" ry="6" fill="#7a5c3a" stroke="#4a3520" strokeWidth="1" />
            <circle  cx="0" cy="-5" r="4" fill="#7a5c3a" stroke="#4a3520" strokeWidth="1" />
            <ellipse cx="-3.5" cy="-7" rx="1.5" ry="2.5" fill="#4a3520" transform="rotate(-15)" />
            <ellipse cx="3.5"  cy="-7" rx="1.5" ry="2.5" fill="#4a3520" transform="rotate(15)" />
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0,2; 0,0"
              dur={`${1.5 + i * 0.2}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </g>
          {/* Línea de conexión al centro */}
          <line x1="80" y1="30" x2="80" y2="60" stroke="#5c3d1e" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2" />
        </g>
      ))}

      {/* Yaguareté acorralado en el centro */}
      <g transform="translate(80,80)">
        {/* Aura de confinement */}
        <circle cx="0" cy="0" r="22" fill="rgba(90,60,30,0.2)" stroke="#5c3d1e" strokeWidth="1" strokeDasharray="3 2" opacity="0.6">
          <animate attributeName="r" values="22;24;22" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Yaguareté pequeño (acorralado) */}
        <ellipse cx="0" cy="3" rx="12" ry="10" fill="#8b5a08" stroke="#5c3d1a" strokeWidth="1" opacity="0.8" />
        <circle  cx="0" cy="-7" r="7" fill="#8b5a08" stroke="#5c3d1a" strokeWidth="1" opacity="0.8" />
        <polygon points="-5,-12 -7,-17 -2,-13" fill="#8b5a08" stroke="#5c3d1a" strokeWidth="0.8" opacity="0.8" />
        <polygon points="5,-12 7,-17 2,-13"  fill="#8b5a08" stroke="#5c3d1a" strokeWidth="0.8" opacity="0.8" />
        {/* Ojos (mirando alrededor, atrapado) */}
        <ellipse cx="-2.5" cy="-8" rx="1.5" ry="2" fill="#2a1a08" opacity="0.8" />
        <ellipse cx="2.5"  cy="-8" rx="1.5" ry="2" fill="#2a1a08" opacity="0.8" />
        <circle  cx="-2" cy="-8.3" r="0.6" fill="#a07030" opacity="0.8" />
        <circle  cx="3"  cy="-8.3" r="0.6" fill="#a07030" opacity="0.8" />
        {/* Temblor de ansiedad */}
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-2;2;-2"
          dur="0.8s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
        />
      </g>
    </g>
  );
}