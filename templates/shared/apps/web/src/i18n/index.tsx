import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { en, type MessageKey, type Messages } from './en.ts';
import { ms } from './ms.ts';

export const locales = { en, ms } as const satisfies Record<string, Messages>;
export type Locale = keyof typeof locales;
export const defaultLocale: Locale = 'en';
export const localeNames: Record<Locale, string> = { en: 'English', ms: 'Bahasa Melayu' };

type Params = Record<string, string | number>;

/** Message keys that come in `.one` / `.other` pairs, for counts. */
type PluralBase = MessageKey extends infer K ? (K extends `${infer B}.one` ? B : never) : never;

export function translate(locale: Locale, key: MessageKey, params?: Params): string {
  const template = locales[locale][key];
  return params
    ? template.replace(/\{(\w+)\}/g, (m, name: string) => String(params[name] ?? m))
    : template;
}

export function translateCount(locale: Locale, key: PluralBase, count: number): string {
  const form = new Intl.PluralRules(locale).select(count) === 'one' ? 'one' : 'other';
  return translate(locale, `${key}.${form}` as MessageKey, { count });
}

interface I18n {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Typed message lookup: an unknown key is a type error. */
  t: (key: MessageKey, params?: Params) => string;
  /** Picks `<key>.one` or `<key>.other` for `count` (Intl.PluralRules) and fills {count}. */
  tCount: (key: PluralBase, count: number) => string;
}

const I18nContext = createContext<I18n | null>(null);
const STORAGE_KEY = 'kitapp.locale';

function initialLocale(): Locale {
  const saved = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
  return saved && saved in locales ? (saved as Locale) : defaultLocale;
}

export function I18nProvider({
  children,
  locale: fixed,
}: {
  children: ReactNode;
  locale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(fixed ?? initialLocale);
  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);
  const value = useMemo<I18n>(
    () => ({
      locale,
      setLocale,
      t: (key, params) => translate(locale, key, params),
      tCount: (key, count) => translateCount(locale, key, count),
    }),
    [locale, setLocale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
