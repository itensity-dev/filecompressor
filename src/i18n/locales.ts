export const LOCALES = ['en', 'ru', 'es', 'pt', 'de', 'fr', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_INFO: Record<Locale, { name: string; hreflang: string; og: string }> = {
  en: { name: 'English', hreflang: 'en', og: 'en_US' },
  ru: { name: 'Русский', hreflang: 'ru', og: 'ru_RU' },
  es: { name: 'Español', hreflang: 'es', og: 'es_ES' },
  pt: { name: 'Português', hreflang: 'pt', og: 'pt_BR' },
  de: { name: 'Deutsch', hreflang: 'de', og: 'de_DE' },
  fr: { name: 'Français', hreflang: 'fr', og: 'fr_FR' },
  zh: { name: '简体中文', hreflang: 'zh-CN', og: 'zh_CN' },
};

export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale);

/** '/compress-pdf' for English, '/ru/compress-pdf' for Russian; '' = home. */
export function localePath(locale: Locale, page = ''): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  if (!page) return prefix || '/';
  return `${prefix}/${page}`;
}

/** Static paths for Astro's [...lang] rest parameter. */
export const langParams = () =>
  LOCALES.map((locale) => ({
    lang: locale === DEFAULT_LOCALE ? undefined : locale,
    locale,
  }));
