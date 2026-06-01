// === Chiví Korá — i18n: Language Selector ===
// Dropdown discreto ES/EN, posición fija arriba a la derecha.

import { useLang } from './LanguageContext';
import type { Lang } from './translations';

const LABELS: Record<Lang, string> = {
  es: 'ES',
  en: 'EN',
};

export function LanguageSelector() {
  const { lang, setLang } = useLang();

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 1000,
      }}
    >
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        aria-label="Idioma / Language"
        style={{
          background: 'rgba(20,15,8,0.85)',
          color: '#c8a050',
          border: '1px solid rgba(200,160,80,0.3)',
          borderRadius: 6,
          padding: '4px 8px',
          fontSize: '0.85rem',
          fontFamily: "'Nunito', sans-serif",
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          outline: 'none',
        }}
      >
        <option value="es">{LABELS.es}</option>
        <option value="en">{LABELS.en}</option>
      </select>
    </div>
  );
}
