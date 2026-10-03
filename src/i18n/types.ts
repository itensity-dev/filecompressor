import type en from './en';

/** Plural forms keyed by Intl.PluralRules category; `other` is required. */
export type Plural = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

/** Shape every locale dictionary must implement (taken from the English source). */
export type Dict = typeof en;
