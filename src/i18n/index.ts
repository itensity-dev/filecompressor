import { FORMAT_LABEL, type Tool } from '../tools';
import { SITE_NAME } from '../site';
import de from './de';
import en from './en';
import es from './es';
import fr from './fr';
import type { Locale } from './locales';
import pt from './pt';
import ru from './ru';
import type { Dict, Plural } from './types';
import zh from './zh';

export type { Dict, Plural };

const DICTS: Record<Locale, Dict> = { en, ru, es, pt, de, fr, zh };

export const getDict = (locale: Locale): Dict => DICTS[locale];

/** Replaces {name} placeholders; {site} is always available. */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (key in vars) return String(vars[key]);
    if (key === 'site') return SITE_NAME;
    return match;
  });
}

export function plural(locale: string, forms: Plural, n: number): string {
  const category = new Intl.PluralRules(locale).select(n);
  return fmt(forms[category] ?? forms.other, { n });
}

export interface ToolText {
  name: string;
  title: string;
  description: string;
  intro: string;
  card: string;
}

export function toolText(dict: Dict, tool: Tool): ToolText {
  const raw: ToolText =
    tool.template === 'image'
      ? dict.converter
      : tool.template === 'pdf'
        ? dict.toPdf
        : dict.tools[tool.id as keyof Dict['tools']];
  const vars = {
    from: FORMAT_LABEL[tool.from[0]],
    to: tool.to === 'same' ? '' : FORMAT_LABEL[tool.to],
  };
  return {
    name: fmt(raw.name, vars),
    title: fmt(raw.title, vars),
    description: fmt(raw.description, vars),
    intro: fmt(raw.intro, vars),
    card: fmt(raw.card, vars),
  };
}
