import { Helmet } from 'react-helmet-async'
import { LANGS, ROUTES, type Lang } from '../lib/lang'

/* ------------------------------------------------------------------ */
/*  Single source of truth for SEO (canonical, hreflang, meta, JSON-LD)*/
/* ------------------------------------------------------------------ */

export const SITE_URL = 'https://construccionesferlo.com'
export const DEFAULT_LANG: Lang = 'es'

/* NAP + business data — MUST stay consistent with Google Business Profile */
export const BUSINESS_NAP = {
  name: 'FERLO SL',
  telephone: '+34692586863',
  email: 'reformasferlo@outlook.es',
  street: 'Calle Ramon Llull, 1 - P. 3 Pta. 2',
  locality: 'Tordera',
  postalCode: '08490',
  region: 'Barcelona',
  country: 'ES',
  // Tordera (41°42′00″N 2°43′00″E approx.)
  geo: { latitude: 41.6994, longitude: 2.7189 },
} as const

/** Official profiles, used for `sameAs` (helps the Google knowledge panel). */
const SOCIAL_PROFILES: string[] = [
  // Omple quan tinguis FB / IG / Google Business:
  // 'https://www.facebook.com/ferlo',
  // 'https://www.instagram.com/ferlo',
]

const BUSINESS_DESCRIPTION: Record<Lang, string> = {
  es: 'Empresa de reformas integrales, cocinas, baños, alicatados y pladur en Tordera, La Selva, Blanes, Lloret de Mar, Malgrat de Mar y alrededores. Presupuesto gratis.',
  ca: 'Empresa de reformes integrals, cuines, banys, enrajolats i pladur a Tordera, La Selva, Blanes, Lloret de Mar, Malgrat de Mar i rodalies. Pressupost gratuït.',
}

const SERVICE_AREAS: Array<{ name: string; type?: 'City' | 'Place' }> = [
  { name: 'Tordera', type: 'City' },
  { name: 'Blanes', type: 'City' },
  { name: 'Lloret de Mar', type: 'City' },
  { name: 'Malgrat de Mar', type: 'City' },
  { name: 'Palafolls', type: 'City' },
  { name: 'Pineda de Mar', type: 'City' },
  { name: 'Santa Susanna', type: 'City' },
  { name: 'Fogars de la Selva', type: 'City' },
  { name: 'Hostalric', type: 'City' },
  { name: 'La Selva', type: 'City' },
  { name: 'Maresme', type: 'City' },
]

const OPENING_HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
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
  es: 'es_ES',
  ca: 'ca_ES',
}

/** Resolves ca/es/x-default absolute URLs from a canonical path like `/es/servicios/cocinas`. */
export function hreflangUrls(path: string): Record<string, string> {
  const clean = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  const lang = (clean[0] || DEFAULT_LANG) as Lang
  const rest = clean.slice(1).join('/')

  // Home page
  if (rest === '') {
    const out: Record<string, string> = {}
    for (const l of LANGS) out[l] = `${SITE_URL}/${l}`
    out['x-default'] = `${SITE_URL}/${DEFAULT_LANG}`
    return out
  }

  // Look up in the shared route map
  for (const map of Object.values(ROUTES)) {
    if (map[lang] === rest) {
      const out: Record<string, string> = {}
      for (const l of LANGS) out[l] = `${SITE_URL}/${l}/${map[l]}`
      out['x-default'] = `${SITE_URL}/${DEFAULT_LANG}/${map[DEFAULT_LANG]}`
      return out
    }
  }

  return {}
}

export interface SeoProps {
  lang: Lang
  /** Canonical path of THIS page (no trailing slash), e.g. '/es/servicios/cocinas' */
  path: string
  title: string
  description: string
  /** Path or absolute URL of the social image (defaults to /hero.webp) */
  image?: string
  /** Optional hreflang overrides (absolute URLs). */
  alternates?: Record<string, string>
  /** Emit `noindex, follow` — only safe for pages that must stay out of the index (404). */
  noindex?: boolean
}

export default function Seo({ lang, path, title, description, image, alternates, noindex }: SeoProps) {
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const imageAbs = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image}`
    : `${SITE_URL}/hero.webp`

  const allAlternates = alternates ?? hreflangUrls(path)

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness', 'GeneralContractor'],
    '@id': `${SITE_URL}/#localbusiness`,
    name: BUSINESS_NAP.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: [`${SITE_URL}/hero.webp`],
    description: BUSINESS_DESCRIPTION[lang],
    telephone: BUSINESS_NAP.telephone,
    email: BUSINESS_NAP.email,
    priceRange: '€€',
    sameAs: SOCIAL_PROFILES,
    knowsLanguage: [...LANGS],
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_NAP.street,
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
      {noindex && <meta name="robots" content="noindex, follow" />}

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