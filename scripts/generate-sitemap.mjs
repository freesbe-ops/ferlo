#!/usr/bin/env node
/**
 * Generates /sitemap.xml (build-time) with every real, indexable page:
 *   - language homepages  (/es, /ca)
 *   - service pages       (/es/servicios/{reformas-integrales,cocinas,banos}
 *                          and /ca/serveis/{reformes-integrals,cuines,banys})
 *   - legal pages         (privacy, aviso legal, cookies) in both languages
 *
 * The 404 page is intentionally excluded (it is `noindex, follow`).
 *
 * Each URL includes <lastmod>, <changefreq>, <priority> and <xhtml:link
 * rel="alternate" hreflang> pointing to every language variant.
 *
 * Run BEFORE `vite build`: it writes into public/ so Vite copies it to dist/.
 *   pnpm run build  →  node scripts/generate-sitemap.mjs && vite build
 *
 * NOTE: the route/slug table below MUST stay in sync with src/lib/lang.ts.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DOMAIN = 'https://construccionesferlo.com'
const LANGUAGES = ['es', 'ca']
const DEFAULT_LANGUAGE = 'es'

/** Localised URL segments per route (mirrors ROUTES in src/lib/lang.ts). */
const ROUTES = [
  {
    key: 'home',
    segments: { es: [], ca: [] },
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    key: 'reformes',
    segments: {
      es: ['servicios', 'reformas-integrales'],
      ca: ['serveis', 'reformes-integrals'],
    },
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    key: 'cuines',
    segments: { es: ['servicios', 'cocinas'], ca: ['serveis', 'cuines'] },
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    key: 'banys',
    segments: { es: ['servicios', 'banos'], ca: ['serveis', 'banys'] },
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    key: 'privacy',
    segments: {
      es: ['politica-de-privacidad'],
      ca: ['politica-de-privacitat'],
    },
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    key: 'legal',
    segments: { es: ['aviso-legal'], ca: ['avis-legal'] },
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    key: 'cookies',
    segments: {
      es: ['politica-de-cookies'],
      ca: ['politica-de-cookies'],
    },
    changefreq: 'yearly',
    priority: '0.3',
  },
]

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const abs = (path) => `${DOMAIN}${path}`
// Regenerated on every build so <lastmod> always reflects the deploy date.
const LAST_MOD = new Date().toISOString().slice(0, 10)

/** Localised path of a route in a given language. */
function routePath(route, lang) {
  return `/${lang}${route.segments[lang].map((segment) => `/${segment}`).join('')}`
}

/** Build the entry list with alternates (hreflang) per canonical URL. */
function buildEntries() {
  const entries = []

  for (const route of ROUTES) {
    const alternates = Object.fromEntries(
      LANGUAGES.map((lang) => [lang, abs(routePath(route, lang))]),
    )

    for (const lang of LANGUAGES) {
      entries.push({
        path: routePath(route, lang),
        lastmod: LAST_MOD,
        changefreq: route.changefreq,
        priority: route.priority,
        alternates,
      })
    }
  }

  return entries
}

function urlElement(e) {
  const alternates = Object.entries({
    'x-default': e.alternates[DEFAULT_LANGUAGE] ?? Object.values(e.alternates)[0],
    ...e.alternates,
  })
    .map(
      ([hreflang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${xml(hreflang)}" href="${xml(href)}" />`,
    )
    .join('\n')

  return [
    '  <url>',
    `    <loc>${xml(abs(e.path))}</loc>`,
    `    <lastmod>${e.lastmod}</lastmod>`,
    `    <changefreq>${e.changefreq}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    alternates,
    '  </url>',
  ].join('\n')
}

const entries = buildEntries()
const output = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  entries.map(urlElement).join('\n'),
  '</urlset>',
  '',
].join('\n')

const target = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml')
mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, output)

console.log(`✓ sitemap.xml generat a ${target} (${entries.length} URLs)`)
