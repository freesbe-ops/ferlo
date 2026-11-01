#!/usr/bin/env node
/**
 * Generates /sitemap.xml (build-time) with every real, indexable page:
 *   - language homepages  (/ca, /es, /en, /fr)
 *   - service pages       (/<lang>/serveis/{piscines,jardineria,manteniment,instalacions}
 *                          plus the localised French slugs /fr/services/{...})
 *   - privacy pages       (/ca/politica-de-privacitat, /es/politica-de-privacidad,
 *                          /en/privacy-policy, /fr/politique-de-confidentialite)
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

const DOMAIN = 'https://mantenimentslizana.com'
const LANGUAGES = ['ca', 'es', 'en', 'fr']
const DEFAULT_LANGUAGE = 'ca'

/** Localised URL segments per route (mirrors ROUTE_SEGMENTS in src/lib/lang.ts). */
const ROUTES = [
  {
    key: 'home',
    langs: LANGUAGES,
    segments: { ca: [], es: [], en: [], fr: [] },
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    key: 'piscines',
    langs: LANGUAGES,
    segments: {
      ca: ['serveis', 'piscines'],
      es: ['serveis', 'piscines'],
      en: ['serveis', 'piscines'],
      fr: ['services', 'piscines'],
    },
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    key: 'jardineria',
    langs: LANGUAGES,
    segments: {
      ca: ['serveis', 'jardineria'],
      es: ['serveis', 'jardineria'],
      en: ['serveis', 'jardineria'],
      fr: ['services', 'jardins'],
    },
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    key: 'manteniment',
    langs: LANGUAGES,
    segments: {
      ca: ['serveis', 'manteniment'],
      es: ['serveis', 'manteniment'],
      en: ['serveis', 'manteniment'],
      fr: ['services', 'maintenance'],
    },
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    key: 'instalacions',
    langs: LANGUAGES,
    segments: {
      ca: ['serveis', 'instalacions'],
      es: ['serveis', 'instalacions'],
      en: ['serveis', 'instalacions'],
      fr: ['services', 'installations'],
    },
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    // Privacy has its own localised slug in every language.
    key: 'privacy',
    langs: LANGUAGES,
    segments: {
      ca: ['politica-de-privacitat'],
      es: ['politica-de-privacidad'],
      en: ['privacy-policy'],
      fr: ['politique-de-confidentialite'],
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
    // Only the languages where the route really exists are advertised.
    const alternates = Object.fromEntries(
      route.langs.map((lang) => [lang, abs(routePath(route, lang))]),
    )

    for (const lang of route.langs) {
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
