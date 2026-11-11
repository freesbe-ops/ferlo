/* ------------------------------------------------------------------ */
/*  Business + SEO data shared by <Seo> (client) and the build-time    */
/*  prerender script (scripts/prerender-seo.mjs).                      */
/* ------------------------------------------------------------------ */

import type { Lang } from './lang.ts'
import { LANGS } from './lang.ts'
import { IMAGES } from './images.ts'

export const SITE_URL = 'https://construccionesferlo.com'

/** Default social image (1200×630 JPG) used by Open Graph / Twitter. */
export const DEFAULT_OG_IMAGE = IMAGES.ogHome

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
export const SOCIAL_PROFILES: string[] = [
  // Omple quan tinguis FB / IG / Google Business:
  // 'https://www.facebook.com/ferlo',
  // 'https://www.instagram.com/ferlo',
]

export const BUSINESS_DESCRIPTION: Record<Lang, string> = {
  es: 'Empresa de reformas integrales, cocinas, baños, alicatados y pladur en Tordera, La Selva, Blanes, Lloret de Mar, Malgrat de Mar y alrededores. Presupuesto gratis.',
  ca: 'Empresa de reformes integrals, cuines, banys, enrajolats i pladur a Tordera, La Selva, Blanes, Lloret de Mar, Malgrat de Mar i rodalies. Pressupost gratuït.',
}

export const SERVICE_AREAS: Array<{ name: string; type?: 'City' | 'Place' }> = [
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

export const OPENING_HOURS = [
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

export const OG_LOCALE: Record<Lang, string> = {
  es: 'es_ES',
  ca: 'ca_ES',
}

/** LocalBusiness JSON-LD embedded by every page. */
export function localBusinessSchema(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness', 'GeneralContractor'],
    '@id': `${SITE_URL}/#localbusiness`,
    name: BUSINESS_NAP.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
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
}
