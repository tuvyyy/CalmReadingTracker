// src/i18n/LangContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Lang } from './translations';
import { translations } from './translations';

const STORAGE_KEY = 'toeic_lang';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Returns the translation string for a given section + key */
  t: <
    S extends keyof typeof translations,
    K extends keyof (typeof translations)[S]
  >(section: S, key: K) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'en' ? 'en' : 'vi';
    } catch {
      return 'vi';
    }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* noop */ }
  };

  // t() helper – returns the string for the current language
  const t = <
    S extends keyof typeof translations,
    K extends keyof (typeof translations)[S]
  >(section: S, key: K): string => {
    const entry = translations[section][key] as { vi: string; en: string };
    return entry[lang];
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
