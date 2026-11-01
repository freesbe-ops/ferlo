/**
 * Central attribution + conversion tracking.
 *
 * Why this file exists
 * --------------------
 * Previously every WhatsApp click and form submit fired the Google Ads
 * conversion snippet (`AW-…/JRRlCLet…`) unconditionally. That means users who
 * came from Wallapop, organic or direct were still recorded as Google Ads
 * conversions, inflating the numbers (7 conversions vs. 1 real Google lead).
 *
 * What we do now
 * --------------
 *  1. We capture the marketing campaign that brought the visitor (UTM params
 *     or gclid) once, persist it for the whole session (sessionStorage), and
 *     keep using it even after internal SPA navigation drops it from the URL.
 *  2. `whatsapp_click` / `enviar_pressupost` always fire for GA4 reporting and
 *     now carry the real source/medium/campaign + page data.
 *  3. Google Ads only sees a conversion when the session is Google-Ads
 *     attributed (utm_source=google / gclid…). It is exposed in two ways:
 *        - dedicated GA4 events `google_ads_whatsapp_click` /
 *          `google_ads_form_submit` (import these in Google Ads), and
 *        - the native Ads conversion tag, which we now fire only for
 *          Google-Ads traffic.
 *
 * IMPORTANT — pick ONE counting method in Google Ads to avoid double counting
 * (see README section in the summary). `FIRE_DIRECT_ADS_TAG` controls the
 * native tag; the GA4 `google_ads_*` events are harmless unless you mark them
 * as conversions / import them in Google Ads.
 */

export const GA4_MEASUREMENT_ID = 'G-CB6G5KWZS6'
export const ADS_CONVERSION_ID = 'AW-18273495657'
/** Conversion label currently used for BOTH WhatsApp clicks and form submits. */
export const ADS_WA_FORM_LABEL = 'JRRlCLet-eMcEOnUvYlE'

/**
 * When true the native Google Ads tag fires (only for Google-Ads-attributed
 * sessions). If you switch to counting via the GA4 `google_ads_*` events
 * import instead, set this to false to avoid double counting.
 */
export const FIRE_DIRECT_ADS_TAG = true

const STORAGE_KEY = 'ml_session_traffic'
const OWN_HOSTS = ['mantenimentslizana.com', 'www.mantenimentslizana.com', 'localhost', '127.0.0.1']

export interface CampaignParams {
  source: string
  medium: string
  campaign: string
  term: string
  content: string
  gclid: string
  gclsrc: string
  gbraid: string
  wbraid: string
}

export interface Traffic extends CampaignParams {
  /** True when the current session came from a Google Ads click. */
  googleAds: boolean
  page_location: string
  page_referrer: string
}

const CAMPAIGN_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gclsrc',
  'gbraid',
  'wbraid',
] as const

/* ------------------------------- gtag helper ------------------------------- */

// Minimal typed wrapper around the global gtag loaded in index.html.
export function gtag(...args: unknown[]) {
  const fn = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag
  if (typeof fn === 'function') {
    fn(...args)
  }
}

/* --------------------------- campaign parsing/storage ---------------------- */

export function parseCampaignSearch(search: string): CampaignParams {
  const sp = new URLSearchParams(search || '')
  return {
    source: sp.get('utm_source') || '',
    medium: sp.get('utm_medium') || '',
    campaign: sp.get('utm_campaign') || '',
    term: sp.get('utm_term') || '',
    content: sp.get('utm_content') || '',
    gclid: sp.get('gclid') || '',
    gclsrc: sp.get('gclsrc') || '',
    gbraid: sp.get('gbraid') || '',
    wbraid: sp.get('wbraid') || '',
  }
}

/** True if the search string contains any marketing/campaign parameter. */
export function hasCampaignParams(search: string): boolean {
  const sp = new URLSearchParams(search || '')
  return CAMPAIGN_KEYS.some((k) => !!sp.get(k))
}

/**
 * Persist the campaign of the *current URL* for the rest of the session.
 * Called on every route change so a fresh ad click (new UTM/gclid) replaces
 * the previous one, while plain internal navigation keeps the stored value.
 */
export function persistTrafficFromSearch(search: string) {
  if (typeof window === 'undefined') return
  if (!search || !hasCampaignParams(search)) return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ search, ts: Date.now() }))
  } catch {
    /* storage unavailable (private mode) — ignore */
  }
}

function loadStoredSearch(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { search?: string }
    return parsed.search || null
  } catch {
    return null
  }
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function isOwnHost(host: string): boolean {
  return OWN_HOSTS.includes(host)
}

function isGoogleMedium(medium: string): boolean {
  return ['cpc', 'cpm', 'cpv', 'cpa', 'cpp', 'ppc'].includes((medium || '').toLowerCase())
}

/**
 * Current traffic attribution for this session.
 * - A URL that still carries campaign params is always authoritative (a fresh
 *   ad click or a tagged landing page).
 * - Otherwise the value persisted at landing is used (survives SPA navigation).
 * - With no campaign at all we fall back to the HTTP referrer (e.g. Wallapop),
 *   and finally to direct/none.
 */
export function getTraffic(): Traffic {
  if (typeof window === 'undefined') {
    return emptyTraffic()
  }
  const current = window.location.search || ''
  const effective = hasCampaignParams(current) ? current : loadStoredSearch() || current
  const c = parseCampaignSearch(effective)

  let source = c.source
  let medium = c.medium
  if (!source) {
    const refHost = hostOf(window.document.referrer || '')
    if (refHost && !isOwnHost(refHost)) {
      source = refHost
      medium = 'referral'
    } else {
      source = 'direct'
      medium = 'none'
    }
  } else if (!medium) {
    medium = 'none'
  }

  const googleAds =
    !!(c.gclid || c.gclsrc || c.gbraid || c.wbraid) ||
    (/google/i.test(source) && isGoogleMedium(medium))

  // Google Ads auto-tagging (gclid / gbraid / wbraid) comes with no utm_source,
  // so without this the click would be reported as direct/none. Label it as
  // google/cpc so the custom params in GA4 match the real campaign source.
  if (googleAds && !c.source) {
    source = 'google'
    medium = 'cpc'
  }

  return {
    source,
    medium,
    campaign: c.campaign,
    term: c.term,
    content: c.content,
    gclid: c.gclid,
    gclsrc: c.gclsrc,
    gbraid: c.gbraid,
    wbraid: c.wbraid,
    googleAds,
    page_location: window.location.href,
    page_referrer: window.document.referrer || '',
  }
}

function emptyTraffic(): Traffic {
  return {
    source: 'direct',
    medium: 'none',
    campaign: '',
    term: '',
    content: '',
    gclid: '',
    gclsrc: '',
    gbraid: '',
    wbraid: '',
    googleAds: false,
    page_location: '',
    page_referrer: '',
  }
}

/* ------------------------------ event builders ----------------------------- */

function eventParams(t: Traffic, category: string, label: string) {
  const params: Record<string, string | number | boolean | undefined> = {
    event_category: category,
    event_label: label,
    source: t.source,
    medium: t.medium,
    campaign: t.campaign,
    term: t.term,
    content: t.content,
    gclid: t.gclid || undefined,
    gclsrc: t.gclsrc || undefined,
    gbraid: t.gbraid || undefined,
    wbraid: t.wbraid || undefined,
    page_location: t.page_location,
    page_referrer: t.page_referrer,
    google_ads_attributed: t.googleAds,
  }
  // Drop empties so GA4 doesn't fill the table with blank params.
  return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== undefined))
}

function fireGoogleAdsConversion() {
  if (!FIRE_DIRECT_ADS_TAG) return
  gtag('event', 'conversion', {
    send_to: `${ADS_CONVERSION_ID}/${ADS_WA_FORM_LABEL}`,
  })
}

/* --------------------------------- API ------------------------------------- */

/**
 * Call this from EVERY WhatsApp button/CTA.
 * label = where the click happened (header, header_mobile, hero, cta_final,
 * footer, contacte…).
 */
export function trackWhatsAppClick(label = 'header', value?: number) {
  const t = getTraffic()
  const params = eventParams(t, 'WhatsApp', label)
  if (typeof value === 'number') params.value = value

  // 1) GA4 analytics event — ALL traffic (organic, direct, Wallapop, ads…).
  gtag('event', 'whatsapp_click', params)

  // 2) Google Ads — only when this session really came from an ad.
  if (t.googleAds) {
    gtag('event', 'google_ads_whatsapp_click', { ...params, google_ads_attributed: true })
    fireGoogleAdsConversion()
  }
}

/**
 * Contact form lead. Keep the historic GA4 event name (`enviar_pressupost`)
 * for continuity and add a Google-only counterpart.
 */
export function trackFormLead({ service = 'General' }: { service?: string } = {}) {
  const t = getTraffic()
  const params = eventParams(t, 'Formulari', service || 'General')

  gtag('event', 'enviar_pressupost', params)

  if (t.googleAds) {
    gtag('event', 'google_ads_form_submit', { ...params, google_ads_attributed: true })
    fireGoogleAdsConversion()
  }
}

/** For a future tel: / click-to-call link (same attribution rules as WA). */
export function trackCallClick(label = 'phone') {
  const t = getTraffic()
  const params = eventParams(t, 'Telefon', label)

  gtag('event', 'call_click', params)

  if (t.googleAds) {
    gtag('event', 'google_ads_call_click', { ...params, google_ads_attributed: true })
  }
}

/** Send a GA4 page_view for client-side (SPA) route changes. */
export function trackPageView(path: string) {
  if (typeof window === 'undefined') return
  gtag('event', 'page_view', {
    page_location: window.location.origin + path,
    page_path: path,
    page_title: window.document.title,
  })
}
