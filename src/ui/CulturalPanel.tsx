// === Chiví Korá — UI: CulturalPanel ===
// Panel desplegable con contexto cultural mbya guaraní.
// Sin menciones a personas — solo contexto histórico y simbólico.

import { useState } from 'react';
import { useT } from '../i18n/LanguageContext';

interface CulturalPanelProps {
  compact?: boolean;
}

const PANEL_STYLE = {
  background: 'linear-gradient(145deg, rgba(20,15,10,0.95) 0%, rgba(15,10,7,0.97) 100%)',
  border: '1px solid #3d2b1a',
  borderRadius: 10,
  overflow: 'hidden',
  width: '100%',
  maxWidth: 420,
};

const HEADER_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75rem 1.25rem',
  cursor: 'pointer',
  userSelect: 'none' as const,
};

const TITLE_STYLE = {
  fontFamily: "'Cinzel', serif",
  fontSize: '1.4rem',
  color: '#8b7355',
  letterSpacing: '0.08em',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const CONTENT_STYLE = {
  padding: '0.5rem 1.25rem 1rem',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.75rem',
};

const SECTION_TITLE_STYLE = {
  fontFamily: "'Cinzel', serif",
  fontSize: '0.75rem',
  color: '#d4a843',
  letterSpacing: '0.06em',
  marginBottom: '0.25rem',
};

const TEXT_STYLE = {
  fontSize: '0.85rem',
  color: '#a09080',
  lineHeight: 1.6,
};

const DIVIDER_STYLE = {
  border: 'none',
  borderTop: '1px solid #3d2b1a',
  margin: '0.25rem 0',
};

export function CulturalPanel({ compact = false }: CulturalPanelProps) {
  const [open, setOpen] = useState(false);
  const t = useT();

  return (
    <div style={PANEL_STYLE}>
      {/* Header clickeable */}
      <div
        style={HEADER_STYLE}
        onClick={() => setOpen(o => !o)}
        role="button"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(o => !o)}
      >
        <span style={TITLE_STYLE}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#8b7355" strokeWidth="1.2" />
            <text x="7" y="10.5" textAnchor="middle" fontSize="8" fill="#8b7355" fontFamily="serif">i</text>
          </svg>
          {t('sobre_el_juego')}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            flexShrink: 0,
          }}
        >
          <path d="M2 4 L6 8 L10 4" stroke="#5c3d1e" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Contenido expandido */}
      {open && (
        <div style={CONTENT_STYLE}>
          <div>
            <p style={{ ...TEXT_STYLE, margin: 0 }}>
              {t('cultural_intro')}
            </p>
          </div>

          <hr style={DIVIDER_STYLE} />

          <div>
            <p style={SECTION_TITLE_STYLE}>{t('cultural_yaguarete_titulo')}</p>
            <p style={{ ...TEXT_STYLE, margin: 0 }}>
              {t('cultural_yaguarete_texto')}
            </p>
          </div>

          <div>
            <p style={SECTION_TITLE_STYLE}>{t('cultural_perros_titulo')}</p>
            <p style={{ ...TEXT_STYLE, margin: 0 }}>
              {t('cultural_perros_texto')}
            </p>
          </div>

          <div>
            <p style={SECTION_TITLE_STYLE}>{t('cultural_significado_titulo')}</p>
            <p style={{ ...TEXT_STYLE, margin: 0 }}>
              {t('cultural_significado_texto')}
            </p>
          </div>

          {!compact && (
            <>
              <hr style={DIVIDER_STYLE} />
              <p style={{ ...TEXT_STYLE, fontSize: '0.75rem', fontStyle: 'italic', margin: 0, color: '#6a5a48' }}>
                {t('cultural_footer')}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}