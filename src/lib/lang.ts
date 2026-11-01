/* ------------------------------------------------------------------ */
/*  Single source of truth for languages and localised URL routes.    */
/*  Used by Seo.tsx, the router, every page and the sitemap script.    */
/* ------------------------------------------------------------------ */

export const LANGS = ['ca', 'es', 'en', 'fr'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'ca'

/** Short codes shown in the language selector (kept uppercase). */
export const LANG_LABELS: Record<Lang, string> = {
  ca: 'CAT',
  es: 'ES',
  en: 'ENG',
  fr: 'FRA',
}

/** Routes shared by every language. */
export type RouteKey =
  | 'home'
  | 'piscines'
  | 'jardineria'
  | 'manteniment'
  | 'instalacions'
  | 'privacy'

export const SERVICE_KEYS = [
  'piscines',
  'jardineria',
  'manteniment',
  'instalacions',
] as const
export type ServiceKey = (typeof SERVICE_KEYS)[number]

/**
 * Localised URL segments per route.
 * CA / ES / EN keep the original slugs (already indexed) — only French uses
 * readable French slugs:
 *   /fr/services/piscines   /fr/services/jardins
 *   /fr/services/maintenance  /fr/services/installations
 */
export const ROUTE_SEGMENTS: Record<RouteKey, Record<Lang, string[]>> = {
  home: { ca: [], es: [], en: [], fr: [] },
  piscines: {
    ca: ['serveis', 'piscines'],
    es: ['serveis', 'piscines'],
    en: ['serveis', 'piscines'],
    fr: ['services', 'piscines'],
  },
  jardineria: {
    ca: ['serveis', 'jardineria'],
    es: ['serveis', 'jardineria'],
    en: ['serveis', 'jardineria'],
    fr: ['services', 'jardins'],
  },
  manteniment: {
    ca: ['serveis', 'manteniment'],
    es: ['serveis', 'manteniment'],
    en: ['serveis', 'manteniment'],
    fr: ['services', 'maintenance'],
  },
  instalacions: {
    ca: ['serveis', 'instalacions'],
    es: ['serveis', 'instalacions'],
    en: ['serveis', 'instalacions'],
    fr: ['services', 'installations'],
  },
  privacy: {
    ca: ['politica-de-privacitat'],
    es: ['politica-de-privacidad'],
    en: ['privacy-policy'],
    fr: ['politique-de-confidentialite'],
  },
}

/**
 * Languages in which each route is really published. Drives hreflang alternates,
 * the canonical set and the sitemap.
 */
export const ROUTE_LANGS: Record<RouteKey, readonly Lang[]> = {
  home: LANGS,
  piscines: LANGS,
  jardineria: LANGS,
  manteniment: LANGS,
  instalacions: LANGS,
  privacy: LANGS,
}

export const ALL_ROUTES: readonly RouteKey[] = [
  'home',
  'piscines',
  'jardineria',
  'manteniment',
  'instalacions',
  'privacy',
]

/** Localised page paths. Only home/services/privacy are public pages. */
export const HOME_PATHS: Record<Lang, string> = { ca: '/ca', es: '/es', en: '/en', fr: '/fr' }

export function isLang(value: string | undefined | null): value is Lang {
  return !!value && (LANGS as readonly string[]).includes(value)
}

/** 'ca-ES' | 'fr-FR' | 'en-GB' | 'en' → 'ca' | 'fr' | 'en' (falls back to CA). */
export function normalizeLang(value: string | undefined | null): Lang {
  if (!value) return DEFAULT_LANG
  const base = value.toLowerCase().split('-')[0]
  return isLang(base) ? base : DEFAULT_LANG
}

/** Localised path of a route, e.g. routePath('fr', 'jardineria') → /fr/services/jardins */
export function routePath(lang: Lang, route: RouteKey): string {
  const suffix = ROUTE_SEGMENTS[route][lang].map((segment) => `/${segment}`).join('')
  return `/${lang}${suffix}`
}

export const homePath = (lang: Lang): string => HOME_PATHS[lang]
export const servicePath = (lang: Lang, key: ServiceKey): string => routePath(lang, key)
export const privacyPath = (lang: Lang): string => routePath(lang, 'privacy')

/** Absolute-URL builder used for canonical / hreflang tags. */
export const absoluteUrl = (siteUrl: string, path: string): string =>
  `${siteUrl}${path === '/' ? '' : path}`

/**
 * Reverse lookup: localised path segments → route key.
 * Matching is done position by position across every language variant, so mixed
 * or legacy URLs (e.g. /ca/serveis/jardins, /fr/serveis/piscines) still resolve
 * to the right page and get canonicalised.
 */
export function matchRoute(segments: string[]): RouteKey | null {
  for (const route of ALL_ROUTES) {
    const candidates = LANGS.map((lang) => ROUTE_SEGMENTS[route][lang])
    if (!candidates.some((candidate) => candidate.length === segments.length)) continue
    const matches = segments.every((segment, i) =>
      candidates.some((candidate) => candidate[i] === segment),
    )
    if (matches) return route
  }
  return null
}

/** Splits a pathname into clean segments (no leading/trailing slashes). */
export function pathSegments(pathname: string): string[] {
  return pathname.split('/').filter(Boolean)
}

/**
 * Canonical path of the current location, or null when the URL is unknown.
 * Used by the router to 1:1 map every localised variant to its canonical form.
 */
export function canonicalPath(pathname: string): string | null {
  const segments = pathSegments(pathname)
  if (segments.length === 0) return null
  if (!isLang(segments[0])) return null
  const lang = segments[0]
  const route = segments.length === 1 ? 'home' : matchRoute(segments.slice(1))
  if (!route) return null
  return routePath(lang, route)
}

/**
 * hreflang / canonical alternate paths for a route, in every language where the
 * route is published, plus `x-default` (Catalan).
 */
export function routeAlternates(route: RouteKey): Record<string, string> {
  const alternates: Record<string, string> = {}
  for (const lang of ROUTE_LANGS[route]) alternates[lang] = routePath(lang, route)
  alternates['x-default'] = routePath(DEFAULT_LANG, route)
  return alternates
}

/**
 * Alternates for an arbitrary canonical path (any language variant).
 * Falls back to a plain language-segment swap when the route is unknown.
 */
export function alternatesForPath(pathname: string): Record<string, string> {
  const segments = pathSegments(pathname)
  const route = isLang(segments[0])
    ? segments.length === 1
      ? 'home'
      : matchRoute(segments.slice(1))
    : null

  if (route) return routeAlternates(route)

  const rest = segments.slice(isLang(segments[0]) ? 1 : 0)
  const swap: Record<string, string> = {}
  for (const lang of LANGS) swap[lang] = `/${[lang, ...rest].join('/')}`
  swap['x-default'] = `/${[DEFAULT_LANG, ...rest].join('/')}`
  return swap
}
