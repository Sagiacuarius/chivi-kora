// === Chiví Korá — i18n: Language Context ===
// React Context para idioma actual + hook useT().

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type Lang, type TranslationKey, translations } from './translations';

// ── Context ────────────────────────────────────────────────────────────

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const Ctx = createContext<LanguageCtx | null>(null);

// ── Provider ────────────────────────────────────────────────────────────

const STORAGE_KEY = 'chivi-kora-lang';

function detectLang(): Lang {
  try {
    return (localStorage.getItem(STORAGE_KEY) as Lang) ?? 'es';
  } catch {
    return 'es';
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* noop */ }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[key]?.[lang] ?? key,
    [lang],
  );

  return (
    <Ctx.Provider value={{ lang, setLang, t }}>
      {children}
    </Ctx.Provider>
  );
}

// ── Hooks ───────────────────────────────────────────────────────────────

export function useLang(): LanguageCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be inside LanguageProvider');
  return ctx;
}

/** Shorthand: solo la función de traducción */
export function useT(): (key: TranslationKey) => string {
  return useLang().t;
}
