#!/usr/bin/env node
/**
 * Build-time prerender of the <head> for every indexable route.
 *
 * The site is a client-rendered SPA, so `vite build` emits a single index.html
 * whose <head> is shared by every URL. Social crawlers (WhatsApp, Facebook,
 * LinkedIn, X) do not run JS and would always read the same generic copy.
 *
 * This script writes one HTML file per route under dist/seo/ containing the
 * exact meta that <Seo> produces at runtime (lang, title, description,
 * canonical, hreflang, Open Graph, Twitter, JSON-LD and robots). vercel.json
 * rewrites each public URL to its file, so non-JS crawlers get the right
 * metadata while React keeps rendering the app as usual.
 *
* Generated tags carry `data-prerendered="true"`. src/main.tsx removes them
 * right before mounting the app: React 19 hoists the same metadata tags from
 * the component tree, so keeping both would duplicate <title>, description,
 * canonical, hreflang, OG and JSON-LD in the live DOM.
 *
 * Run AFTER `vite build`:  pnpm run build
 *
 * NOTE: the route list comes from src/lib/lang.ts + the locale files, so this
 * script stays in sync with the router and the sitemap automatically.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  LANGS,
  SERVICE_KEYS,
  homePath,
  pathAlternates,
  routePath,
} from '../src/lib/lang.ts'
import { LEGAL_META } from '../src/lib/pageMeta.ts'
import { DEFAULT_OG_IMAGE, OG_LOCALE, SITE_URL, localBusinessSchema } from '../src/lib/seoData.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const OUT_DIR = join(DIST, 'seo')

const LEGAL_ROUTES = ['privacy', 'legal', 'cookies']

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Mirrors the tags rendered by src/components/Seo.tsx. */
function headTags({ lang, path, title, description }) {
  const url = `${SITE_URL}${path}`
  const image = `${SITE_URL}${DEFAULT_OG_IMAGE}`
  const alternatesTags = Object.entries(pathAlternates(path))
    .map(
      ([hreflang, href]) =>
        `    <link data-prerendered="true" rel="alternate" hreflang="${hreflang}" href="${escapeHtml(`${SITE_URL}${href}`)}" />`,
    )
    .join('\n')

  const jsonLd = JSON.stringify(localBusinessSchema(lang))
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')

  return [
    `    <title data-prerendered="true">${escapeHtml(title)}</title>`,
    `    <meta data-prerendered="true" name="description" content="${escapeHtml(description)}" />`,
    '    <meta data-prerendered="true" name="robots" content="index, follow" />',
    `    <link data-prerendered="true" rel="canonical" href="${escapeHtml(url)}" />`,
    alternatesTags,
    `    <meta data-prerendered="true" property="og:locale" content="${OG_LOCALE[lang]}" />`,
    '    <meta data-prerendered="true" property="og:type" content="website" />',
    '    <meta data-prerendered="true" property="og:site_name" content="FERLO SL" />',
    `    <meta data-prerendered="true" property="og:title" content="${escapeHtml(title)}" />`,
    `    <meta data-prerendered="true" property="og:description" content="${escapeHtml(description)}" />`,
    `    <meta data-prerendered="true" property="og:url" content="${escapeHtml(url)}" />`,
    `    <meta data-prerendered="true" property="og:image" content="${escapeHtml(image)}" />`,
    '    <meta data-prerendered="true" name="twitter:card" content="summary_large_image" />',
    `    <meta data-prerendered="true" name="twitter:title" content="${escapeHtml(title)}" />`,
    `    <meta data-prerendered="true" name="twitter:description" content="${escapeHtml(description)}" />`,
    `    <meta data-prerendered="true" name="twitter:image" content="${escapeHtml(image)}" />`,
    `    <script data-prerendered="true" type="application/ld+json">${jsonLd}</script>`,
  ].join('\n')
}

/** Every indexable page: home + service + legal, in both languages. */
function buildPages() {
  const pages = []

  for (const lang of LANGS) {
    const copy = JSON.parse(readFileSync(join(ROOT, 'src', 'locales', `${lang}.json`), 'utf8'))

    pages.push({
      lang,
      path: homePath(lang),
      title: copy.meta_title,
      description: copy.meta_description,
    })

    for (const key of SERVICE_KEYS) {
      pages.push({
        lang,
        path: routePath(lang, key),
        title: copy[key].meta_title,
        description: copy[key].meta_description,
      })
    }

    for (const key of LEGAL_ROUTES) {
      pages.push({ lang, path: routePath(lang, key), ...LEGAL_META[key][lang] })
    }
  }

  return pages
}

/** '/es/serveis/cuines' → 'es-serveis-cuines.html' */
const fileNameFor = (path) => `${path.replace(/^\//, '').replaceAll('/', '-')}.html`

function main() {
  let template
  try {
    template = readFileSync(join(DIST, 'index.html'), 'utf8')
  } catch {
    console.error('✗ prerender-seo: falta dist/index.html — executa `vite build` primer.')
    process.exit(1)
  }

  if (!template.includes('</head>')) {
    console.error('✗ prerender-seo: dist/index.html no té </head>.')
    process.exit(1)
  }

  mkdirSync(OUT_DIR, { recursive: true })

  const pages = buildPages()
  const rewrites = []

  for (const page of pages) {
    const html = template
      .replace(/<html lang="[^"]*"/, `<html lang="${page.lang}"`)
      .replace('</head>', `${headTags(page)}\n  </head>`)

    const fileName = fileNameFor(page.path)
    writeFileSync(join(OUT_DIR, fileName), html)
    rewrites.push({ source: page.path, destination: `/seo/${fileName}` })
  }

  // vercel.json must map every public URL to its prerendered file, before the
  // SPA catch-all rewrite; otherwise the build fails instead of silently
  // shipping a page whose crawler-visible <head> is the generic one.
  const vercel = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'))
  const configured = new Map(
    (vercel.rewrites ?? []).map((rewrite) => [rewrite.source, rewrite.destination]),
  )
  const missing = rewrites.filter((r) => configured.get(r.source) !== r.destination)
  if (missing.length > 0) {
    console.error('\u2717 prerender SEO: vercel.json no apunta a aquests fitxers:')
    for (const r of missing) {
      console.error(`  { "source": "${r.source}", "destination": "${r.destination}" },`)
    }
    process.exit(1)
  }

  console.log(`✓ prerender SEO: ${pages.length} rutes a ${OUT_DIR}`)
}

main()
