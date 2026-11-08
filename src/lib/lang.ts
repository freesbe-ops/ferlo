/* ------------------------------------------------------------------ */
/*  Single source of truth for languages and localised URL routes.    */
/*  Used by Seo.tsx, the router, every page and the sitemap script.    */
/* ------------------------------------------------------------------ */

export const LANGS = ['es', 'ca'] as const;
export type Lang = typeof LANGS[number];
export const DEFAULT_LANG: Lang = 'es';

/** Short codes shown in the language selector (kept uppercase). */
export const LANG_LABELS: Record<Lang, string> = {
  es: 'ES',
  ca: 'CAT',
};

/** Localised URL segments per route (without the leading language segment). */
export const ROUTES = {
  reformes: { es: 'servicios/reformas-integrales', ca: 'serveis/reformes-integrals' },
  cuines:   { es: 'servicios/cocinas',             ca: 'serveis/cuines' },
  banys:    { es: 'servicios/banos',               ca: 'serveis/banys' },
  privacy:  { es: 'politica-de-privacidad',        ca: 'politica-de-privacitat' },
  legal:    { es: 'aviso-legal',                   ca: 'avis-legal' },
  cookies:  { es: 'politica-de-cookies',           ca: 'politica-de-cookies' },
} as const;

export type RouteKey = keyof typeof ROUTES;

/** The three service landing pages, in the order they are shown on the site. */
export const SERVICE_KEYS = ['reformes', 'cuines', 'banys'] as const;
export type ServiceKey = typeof SERVICE_KEYS[number];

export function isLang(value: string | undefined | null): value is Lang {
  return !!value && (LANGS as readonly string[]).includes(value);
}

/** 'es-ES' | 'ca-AD' | 'es' → 'es' | 'ca' (falls back to the default language). */
export function normalizeLang(value: string | undefined | null): Lang {
  if (!value) return DEFAULT_LANG;
  const base = value.toLowerCase().split('-')[0];
  return isLang(base) ? base : DEFAULT_LANG;
}

/** Splits a pathname into clean segments (no leading/trailing slashes). */
export function pathSegments(pathname: string): string[] {
  return pathname.split('/').filter(Boolean);
}

/** Localised path of a route, e.g. routePath('ca', 'cuines') → /ca/serveis/cuines */
export function routePath(lang: Lang, route: RouteKey): string {
  return `/${lang}/${ROUTES[route][lang]}`;
}

export const homePath = (lang: Lang): string => `/${lang}`;
export const servicePath = (lang: Lang, key: ServiceKey): string => routePath(lang, key);
export const privacyPath = (lang: Lang): string => routePath(lang, 'privacy');
export const legalPath = (lang: Lang): string => routePath(lang, 'legal');
export const cookiesPath = (lang: Lang): string => routePath(lang, 'cookies');
export const notFoundPath = (lang: Lang): string => `/${lang}/404`;

/** Absolute-URL builder used for canonical / hreflang tags. */
export const absoluteUrl = (siteUrl: string, path: string): string =>
  `${siteUrl}${path === '/' ? '' : path}`;

/**
 * Reverse lookup: localised path segments → route key.
 * Comparison is done position by position across every language variant, so
 * legacy or mixed URLs still resolve to the right page and get canonicalised.
 */
export function matchRoute(segments: string[]): RouteKey | null {
  for (const route of Object.keys(ROUTES) as RouteKey[]) {
    const candidates = LANGS.map((lang) => ROUTES[route][lang].split('/'));
    if (!candidates.some((candidate) => candidate.length === segments.length)) continue;
    const matches = segments.every((segment, i) =>
      candidates.some((candidate) => candidate[i] === segment),
    );
    if (matches) return route;
  }
  return null;
}

/**
 * Canonical path of the current location, or null when the URL is unknown.
 * Used by the router to 1:1 map every localised variant to its canonical form.
 */
export function canonicalPath(pathname: string): string | null {
  const segments = pathSegments(pathname);
  if (segments.length === 0) return null;

  const [lang, ...rest] = segments;
  if (!isLang(lang)) return null;
  if (rest.length === 0) return homePath(lang);

  const route = matchRoute(rest);
  return route ? routePath(lang, route) : null;
}

/** hreflang / canonical alternates for a published route, plus `x-default`. */
export function routeAlternates(route: RouteKey): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const lang of LANGS) alternates[lang] = routePath(lang, route);
  alternates['x-default'] = routePath(DEFAULT_LANG, route);
  return alternates;
}
