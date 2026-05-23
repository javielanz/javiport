import en from '../content/ui/strings.en.json';
import es from '../content/ui/strings.es.json';

const STRINGS = { en, es } as const;

export type Lang = 'en' | 'es';
export type Strings = typeof en;

export function getStrings(lang: Lang): Strings {
  return STRINGS[lang] as Strings;
}
