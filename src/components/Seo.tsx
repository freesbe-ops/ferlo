import { Helmet } from 'react-helmet-async'
import { pathAlternates, type Lang } from '../lib/lang'
import { BUSINESS_NAP, DEFAULT_OG_IMAGE, OG_LOCALE, SITE_URL, localBusinessSchema } from '../lib/seoData'

/* ------------------------------------------------------------------ */
/*  Per-route <head>: canonical, hreflang, meta, OG and JSON-LD.       */
/*  Business data lives in src/lib/seoData.ts, shared with the         */
/*  build-time prerender script (scripts/prerender-seo.mjs).           */
/* ------------------------------------------------------------------ */

export interface SeoProps {
  lang: Lang
  /** Canonical path of THIS page (no trailing slash), e.g. '/es/servicios/cocinas' */
  path: string
  title: string
  description: string
  /** Path or absolute URL of the social image (defaults to /og-image.jpg) */
  image?: string
  /** Optional hreflang overrides (relative paths or absolute URLs). */
  alternates?: Record<string, string>
  /** Emit `noindex, follow` — only safe for pages that must stay out of the index (404). */
  noindex?: boolean
}

const toAbsolute = (href: string): string => (href.startsWith('http') ? href : `${SITE_URL}${href}`)

export default function Seo({ lang, path, title, description, image, alternates, noindex }: SeoProps) {
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const imageAbs = image ? toAbsolute(image) : `${SITE_URL}${DEFAULT_OG_IMAGE}`

  const allAlternates = Object.fromEntries(
    Object.entries(alternates ?? pathAlternates(path)).map(([hreflang, href]) => [
      hreflang,
      toAbsolute(href),
    ]),
  )

  const jsonLd = JSON.stringify(localBusinessSchema(lang))
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
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
