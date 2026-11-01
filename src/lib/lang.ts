export const DEFAULT_LANG: Lang = 'es';
export const LANGS = ['es', 'ca'] as const;
export type Lang = typeof LANGS[number];

export const LANG_LABELS: Record<Lang, string> = {
  es: 'ES',
  ca: 'CAT',
};

export const ROUTES = {
  reformes: { es: 'servicios/reformas-integrales', ca: 'serveis/reformes-integrals' },
  cuines:   { es: 'servicios/cocinas',             ca: 'serveis/cuines' },
  banys:    { es: 'servicios/banos',               ca: 'serveis/banys' },
  obraNova: { es: 'servicios/obra-nueva',          ca: 'serveis/obra-nova' },
  privacy:  { es: 'politica-de-privacidad',        ca: 'politica-de-privacitat' },
  legal:    { es: 'aviso-legal',                   ca: 'avis-legal' },
  cookies:  { es: 'politica-de-cookies',           ca: 'politica-de-cookies' },
} as const;

export type RouteKey = keyof typeof ROUTES;