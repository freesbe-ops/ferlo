import { Helmet } from 'react-helmet-async'
import { LANGS, DEFAULT_LANG, alternatesForPath, type Lang } from '../lib/lang'

/* ------------------------------------------------------------------ */
/*  Single source of truth for SEO (canonical, hreflang, meta, JSON-LD)*/
/* ------------------------------------------------------------------ */

export const SITE_URL = 'https://mantenimentslizana.com'

// Re-exported so every page keeps a single import source for languages.
export { LANGS, DEFAULT_LANG }
export type { Lang }

/* NAP + business data — MUST stay consistent with Google Business Profile */
export const BUSINESS_NAP = {
  name: 'Manteniments Lizana',
  telephone: '+34677218303',
  email: 'mantenimentlizana@gmail.com',
  locality: 'Maçanet de la Selva',
  postalCode: '17412',
  region: 'Girona',
  country: 'ES',
  // Town-centre coordinates of Maçanet de la Selva (41°46′46″N 2°44′0″E)
  geo: { latitude: 41.7794, longitude: 2.7333 },
} as const

/** Official profiles, used for `sameAs` (helps the Google knowledge panel). */
const SOCIAL_PROFILES = [
  'https://www.facebook.com/p/Manteniments-Lizana-61590819927805/',
  'https://www.instagram.com/manteniments_lizana',
  'https://share.google/MP6A0EmNCzBuHSuTd',
]

const BUSINESS_DESCRIPTION: Record<Lang, string> = {
  ca: 'Servei professional de manteniment general, piscines, jardineria i instal·lacions a Girona, la Selva, la Costa Brava i el Maresme.',
  es: 'Servicio profesional de mantenimiento general, piscinas, jardinería e instalaciones en Girona, la Selva, la Costa Brava y el Maresme.',
  en: 'Professional general maintenance, pool, gardening and installation services in Girona, La Selva, Costa Brava and Maresme.',
  fr: 'Service professionnel de maintenance générale, piscines, jardinage et installations à Girona, La Selva, Costa Brava et Maresme.',
}

const SERVICE_AREAS: Array<{ name: string; type?: 'City' | 'Place' }> = [
  { name: 'Girona', type: 'City' },
  { name: 'La Selva', type: 'City' },
  { name: 'Costa Brava' },
  { name: 'Baix Empordà', type: 'City' },
  { name: 'Gironès', type: 'City' },
  { name: 'Maresme' },
]

// Must match the hours shown on the site (contact + footer): Mon–Fri 7:30–19:00,
// Sat 9:00–13:00. Keep in sync with the Google Business Profile.
const OPENING_HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '07:30',
    closes: '19:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Saturday'],
    opens: '09:00',
    closes: '13:00',
  },
]

const OG_LOCALE: Record<Lang, string> = {
  ca: 'ca_ES',
  es: 'es_ES',
  en: 'en_US',
  fr: 'fr_FR',
}

/** Replaces the language segment of a canonical path (e.g. /ca/serveis/x -> /es/serveis/x). */
export function localizePath(path: string, lang: Lang): string {
  const segments = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  if (segments.length > 0 && (LANGS as readonly string[]).includes(segments[0])) {
    segments[0] = lang
  } else {
    segments.unshift(lang)
  }
  return `/${segments.join('/')}`
}

/**
 * hreflang alternates (absolute URLs) for a canonical page path.
 * Uses the shared route map so localised French slugs are resolved correctly
 * (/ca/serveis/jardineria <-> /fr/services/jardins) and only routes that really
 * exist in a language are listed (there is no English privacy page).
 */
export function hreflangUrls(path: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(alternatesForPath(path)).map(([hreflang, href]) => [
      hreflang,
      href.startsWith('http') ? href : `${SITE_URL}${href}`,
    ]),
  )
}

export interface SeoProps {
  lang: Lang
  /** Canonical path of THIS page (no trailing slash), e.g. '/ca/serveis/piscines' */
  path: string
  title: string
  description: string
  /** Path or absolute URL of the social image (defaults to /hero.webp) */
  image?: string
  /**
   * Optional hreflang overrides (absolute URLs). When omitted the alternates are
   * derived from the shared route map, which already knows every localised slug.
   */
  alternates?: Record<string, string>
}

export default function Seo({ lang, path, title, description, image, alternates }: SeoProps) {
  const url = `${SITE_URL}${path}`
  const imageAbs = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image}`
    : `${SITE_URL}/hero.webp`

  // Explicit alternates fully control the list; otherwise the ca/es/en/fr/x-default
  // set is derived from the canonical path through the shared route map.
  const allAlternates: Record<string, string> = alternates ? { ...alternates } : hreflangUrls(path)

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': `${SITE_URL}/#localbusiness`,
    name: BUSINESS_NAP.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo-lizana.webp`,
    image: [`${SITE_URL}/logo-lizana.webp`, `${SITE_URL}/hero.webp`],
    description: BUSINESS_DESCRIPTION[lang],
    telephone: BUSINESS_NAP.telephone,
    email: BUSINESS_NAP.email,
    priceRange: '€€',
    sameAs: SOCIAL_PROFILES,
    knowsLanguage: ['ca', 'es', 'en', 'fr'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS_NAP.locality,
      postalCode: BUSINESS_NAP.postalCode,
      addressRegion: BUSINESS_NAP.region,
      addressCountry: BUSINESS_NAP.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_NAP.geo.latitude,
      longitude: BUSINESS_NAP.geo.longitude,
    },
    openingHoursSpecification: OPENING_HOURS,
    areaServed: SERVICE_AREAS.map((a) => ({ '@type': a.type ?? 'Place', name: a.name })),
  }

  // Keep the inline JSON safe inside an HTML <script> element.
  const jsonLd = JSON.stringify(localBusiness)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {Object.entries(allAlternates).map(([hreflang, href]) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}

      <meta property="og:locale" content={OG_LOCALE[lang]} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={BUSINESS_NAP.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageAbs} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageAbs} />

      <script type="application/ld+json">{jsonLd}</script>
    </Helmet>
  )
}
