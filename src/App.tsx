import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from './components/Seo'
import { getTraffic, trackFormLead, trackWhatsAppClick } from './lib/tracking'
import { useParams, useNavigate, Link } from 'react-router-dom'
import MobileNav from './components/MobileNav'
import {
  DEFAULT_LANG,
  LANG_LABELS,
  LANGS,
  SERVICE_KEYS,
  homePath,
  isLang,
  normalizeLang,
  cookiesPath,
  legalPath,
  privacyPath,
  servicePath,
} from './lib/lang'

// Order matches `serveis.items`: reformes, cuines, banys
const SERVICE_ICONS = [
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>,
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="10" width="18" height="9" rx="2" />
    <path d="M1.5 13.5h1.5M21 13.5h1.5" />
    <path d="M8 6.5c0-.9.7-1.3.7-2.2M12 6.5c0-.9.7-1.3.7-2.2M16 6.5c0-.9.7-1.3.7-2.2" />
  </svg>,
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.7l5.4 5.4a7.64 7.64 0 1 1-10.8 0z" />
    <path d="M9 13a3 3 0 0 0 3 3" />
  </svg>,
]

const FOR_WHOM_ICONS = [
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
  </svg>,
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2"/><path d="M16 7l3 3"/><path d="M19 4l3 3"/>
  </svg>,
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,17 9,11 13,15 21,7"/><polyline points="15,7 21,7 21,13"/>
  </svg>,
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M3 10h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-6h6v6"/>
  </svg>,
]

const WHY_US_ICONS = [
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3h14a1 1 0 0 1 1 1v17l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1z"/><path d="M9 8h6M9 12h6M9 16h3"/>
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/><path d="M17 4a4 4 0 0 1 0 7.75"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,11 11.5,13.5 16,9"/>
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>,
]

const SERVICE_IMAGES = [
  '/hero.webp',
  '/despues.webp',
  '/antes.webp',
]

const LEAD_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbxI5llz39CkCAhf3GcKGl5WkCXAuBtvesn-srXs-27yfHhiz4tSYa9KWR_B63F3Es7q/exec'

/**
 * Posts a lead to the Apps Script web app that feeds the "Leads FERLO" sheet.
 *
 * `text/plain` makes it a CORS "simple request" (no preflight), so the browser
 * exposes the response and a real HTTP failure surfaces as an error. Only when
 * the response stays opaque (a CORS misconfiguration) do we retry with
 * `no-cors` and treat a resolved request as success.
 */
async function postLead(payload: Record<string, string>, signal: AbortSignal) {
  let response: Response
  try {
    response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal,
    })
  } catch (err) {
    if (signal.aborted) throw err
    await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal,
    })
    return
  }

  if (!response.ok) throw new Error(`Lead endpoint responded ${response.status}`)
}

function CarouselBar({ items }: { items: string[] }) {
  const all = [...items, ...items, ...items]
  const text = all.join(' &nbsp;&nbsp;&nbsp;&mdash;&nbsp;&nbsp;&nbsp; ')

  return (
    <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream)', padding: '20px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'scrollCarousel 12s linear infinite' }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-ink)', letterSpacing: '0.12em', paddingRight: 0 }} dangerouslySetInnerHTML={{ __html: text }} />
      </div>
      <style>{`
        @keyframes scrollCarousel {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

export default function App() {
  const { t, i18n } = useTranslation()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ nom: '', telefon: '', email: '', poblacio: '', servei: '', missatge: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const urlLang = isLang(langParam) ? langParam : null
  const currentLang = urlLang ?? normalizeLang(i18n.language)

  // Sync language from URL param
  useEffect(() => {
    if (isLang(langParam)) {
      if (i18n.language !== langParam) {
        i18n.changeLanguage(langParam)
      }
      localStorage.setItem('i18nextLng', langParam)
    } else {
      // No lang in URL or invalid lang: redirect to the default locale
      navigate(homePath(DEFAULT_LANG), { replace: true })
    }
  }, [langParam, i18n, navigate])

  const whatsappBase = 'https://wa.me/34692586863'
  const waHeader = `${whatsappBase}?utm_source=web&utm_medium=whatsapp&utm_campaign=header&utm_content=${currentLang}`
  const waContacte = `${whatsappBase}?utm_source=web&utm_medium=whatsapp&utm_campaign=contacte&utm_content=${currentLang}`
  const waFooter = `${whatsappBase}?utm_source=web&utm_medium=whatsapp&utm_campaign=footer&utm_content=${currentLang}`

  const navLinks = [
    { label: t('nav.serveis'), href: '#serveis', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { label: t('nav.sobre'), href: '#sobre', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg> },
    { label: t('serveis.items.0.title'), href: servicePath(currentLang, 'reformes'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
    { label: t('serveis.items.1.title'), href: servicePath(currentLang, 'cuines'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="9" rx="2"/><path d="M1.5 13.5h1.5M21 13.5h1.5"/><path d="M8 6.5c0-.9.7-1.3.7-2.2M12 6.5c0-.9.7-1.3.7-2.2M16 6.5c0-.9.7-1.3.7-2.2"/></svg> },
    { label: t('serveis.items.2.title'), href: servicePath(currentLang, 'banys'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.7l5.4 5.4a7.64 7.64 0 1 1-10.8 0z"/><path d="M9 13a3 3 0 0 0 3 3"/></svg> },
    { label: 'WhatsApp', href: waHeader, external: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
  ]

  const services = t('serveis.items', { returnObjects: true }) as Array<{ title: string; description: string; tag: string }>
  const forWhom = t('forwhom.items', { returnObjects: true }) as Array<{ title: string; desc: string }>
  const testimonials = t('testimonis.items', { returnObjects: true }) as Array<{ name: string; location: string; text: string }>
  const whyUs = t('whyus.items', { returnObjects: true }) as Array<{ title: string; desc: string }>
  const carouselItems = t('carousel', { returnObjects: true }) as string[]
  const sobreStats = t('sobre.stats', { returnObjects: true }) as Array<{ num: string; label: string }>

  const trackWhatsApp = (label: string) => {
    trackWhatsAppClick(label)
  }

  // Stable, language-independent service label for analytics. The value posted
  // to the Google Sheet is untouched (it stays the label the visitor picked),
  // but GA4 always receives the same key across the 2 languages.
  const SERVICE_ANALYTICS_KEYS = ['reformes', 'cuines', 'banys']
  const analyticsService = (label: string) => {
    const index = SERVICE_ANALYTICS_KEYS.findIndex((_, i) => label === t(`serveis.items.${i}.title`))
    if (index >= 0) return SERVICE_ANALYTICS_KEYS[index]
    return label ? 'altres' : 'general'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot: only bots fill a field no human can see. They get the same
    // success message but nothing is sent, so no row and no email are created.
    const honeypot = honeypotRef.current?.value || ''
    if (honeypot) {
      setSent(true)
      return
    }

    // 1) Track the lead immediately. The conversion must never depend on how
    //    fast (or whether) the external Google Apps Script endpoint answers.
    trackFormLead({ service: analyticsService(formData.servei) })

    // 2) POST to the Apps Script endpoint that appends the row to the
    //    "Leads FERLO" sheet. The sheet has no "població" column, so the town
    //    the visitor typed is prepended to the message instead of being lost.
    const poblacio = formData.poblacio.trim()
    const missatge = poblacio
      ? `${t('contacte.form_poblacio')}: ${poblacio}${formData.missatge ? `\n\n${formData.missatge}` : ''}`
      : formData.missatge
    const traffic = getTraffic()
    const data = {
      servei: formData.servei,
      nom: formData.nom,
      telefon: formData.telefon,
      email: formData.email,
      missatge,
      source: traffic.source,
      medium: traffic.medium,
      campaign: traffic.campaign,
      gclid: traffic.gclid,
      page_location: traffic.page_location,
      website: honeypot,
    }

    setError(null)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    try {
      await postLead(data, controller.signal)
      setSent(true)
    } catch {
      // Abort (timeout) or network failure: keep the form so the visitor can
      // retry, and show the WhatsApp fallback.
      setError(t('contacte.form_error'))
    } finally {
      clearTimeout(timeout)
    }
  }

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value)
    localStorage.setItem('i18nextLng', value)
    navigate(`/${value}`, { replace: false })
  }

  return (
    <div style={{ fontFamily: "var(--font-sans)", backgroundColor: 'var(--color-cream)', color: 'var(--color-ink)' }}>

      <Seo
        lang={currentLang}
        path={homePath(currentLang)}
        title={t('meta_title')}
        description={t('meta_description')}
        image="/hero.webp"
      />

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 20, zIndex: 50, padding: '0 24px' }}>
        <div style={{ width: 'fit-content', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 100, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, height: 60, boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,0.3)' }}>
          {/* Logo */}
          <a href="#inici" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/logo.svg" alt="FERLO — Reformes i obra nova a Tordera" width={128} height={128} style={{ width: 34, height: 34, objectFit: 'contain' }} />
              <div className="logo-text">
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 15, color: '#0A0A0A', lineHeight: 1.1 }}>FERLO</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: 12, color: '#65615D', letterSpacing: '0.08em' }}>TORDERA</div>
              </div>
            </div>
          </a>

          {/* Desktop Nav - Icons with labels */}
          <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="hidden-mobile">
            {navLinks.map(l => l.external ? (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" title={l.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, padding: '4px 10px', borderRadius: 40, color: '#25D366', textDecoration: 'none', transition: 'color 0.2s, background 0.2s' }}
                onClick={() => { if (l.label === 'WhatsApp') trackWhatsApp('header') }}
                onMouseEnter={e => { e.currentTarget.style.color = '#1BA94F'; e.currentTarget.style.backgroundColor = 'rgba(37,211,102,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#25D366'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                {l.icon}
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{l.label}</span>
              </a>
            ) : l.href.startsWith('/') ? (
              <Link key={l.label} to={l.href} title={l.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, padding: '4px 10px', borderRadius: 40, color: '#65615D', textDecoration: 'none', transition: 'color 0.2s, background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#0A0A0A'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#65615D'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                {l.icon}
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{l.label}</span>
              </Link>
            ) : (
              <a key={l.label} href={l.href} title={l.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, padding: '4px 10px', borderRadius: 40, color: '#65615D', textDecoration: 'none', transition: 'color 0.2s, background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#0A0A0A'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#65615D'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                {l.icon}
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{l.label}</span>
              </a>
            ))}
          </nav>

          {/* Mobile Nav - amb desplegable de serveis (liquid glass) */}
          <MobileNav currentLang={currentLang} waHeader={waHeader} isHome />

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="#contacte" style={{ padding: '8px 18px', backgroundColor: '#0A0A0A', color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }} className="hidden-mobile" onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#847261' }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0A0A0A' }}>
              {t('nav.pressupost_cta')}
            </a>
          </div>
        </div>
      </header>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .logo-text { display: none !important; }
          header > div { gap: 0 !important; width: 100% !important; justify-content: space-between !important; padding: 0 16px !important; }
          nav.show-mobile { flex: 1; justify-content: center !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .logo-text { display: block !important; }
        }
      `}</style>

      {/* HERO - Split layout (port de Figma Make) */}
      <section id="inici" className="hero">
        <div className="hero-outer">
          <div className="hero-grid">
            <div className="hero-copy">
              {/* Language selector (únic selector d'idioma de la home) */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 28 }}>
                <select
                  value={currentLang}
                  onChange={e => changeLanguage(e.target.value)}
                  aria-label="Idioma / Language / Idioma / Langue"
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-muted)', fontWeight: 700, textDecoration: 'underline', fontSize: 12, fontFamily: "var(--font-sans)", letterSpacing: '0.12em', textTransform: 'uppercase', outline: 'none', cursor: 'pointer', padding: 0, margin: 0, appearance: 'none', WebkitAppearance: 'none' }}
                >
                  {LANGS.map(l => (
                    <option key={l} value={l} style={{ color: 'var(--color-ink)', textTransform: 'uppercase' }}>{LANG_LABELS[l]}</option>
                  ))}
                </select>
                <span style={{ fontSize: 9, color: 'var(--color-muted)', fontWeight: 700, pointerEvents: 'none', lineHeight: 1 }}>▼</span>
              </div>

              <span className="hero-eyebrow">{t('hero.badge')}</span>

              <h1>
                {t('hero.title')}{' '}
                <span className="hl">{t('hero.subtitle').split(' ')[0]}</span>{' '}
                {t('hero.subtitle').split(' ').slice(1).join(' ')}
              </h1>

              <p>{t('hero.description')}</p>

              <div className="hero-actions">
                <a href="#contacte" style={{ minHeight: 52, padding: '0 25px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 999, fontSize: 14, fontWeight: 600, color: '#FFFFFF', background: 'var(--color-ink)', boxShadow: '0 8px 20px rgba(0,0,0,0.12)', textDecoration: 'none', transition: 'transform 0.2s, background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-primary-dark)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-ink)')}>
                  {t('hero.cta')}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M14 7l5 5-5 5"/></svg>
                </a>
                <a href="#serveis" style={{ minHeight: 52, padding: '0 25px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 999, fontSize: 14, fontWeight: 600, border: '1px solid rgba(10,10,10,0.22)', background: 'transparent', color: 'var(--color-ink)', textDecoration: 'none', transition: 'border 0.2s, color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary-dark)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(10,10,10,0.22)'; e.currentTarget.style.color = 'var(--color-ink)'; }}>
                  {t('hero.secondary_cta')}
                </a>
              </div>

              <div className="hero-note">
                <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6"/></svg></span>
                {t('hero.note')}
              </div>
            </div>

            <div className="hero-visual">
              <img
                src="/hero.webp"
                alt={t('hero.image_alt')}
                fetchPriority="high"
                width={1200}
                height={800}
                decoding="async"
              />
              <div className="hero-project-badge">
                <span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 5 6v5c0 4.8 2.8 8.2 7 10 4.2-1.8 7-5.2 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg></span>
                <div><small>{t('hero.badge_sub')}</small><strong>{t('hero.badge_title')}</strong></div>
              </div>
              <div className="hero-stamp"><strong>+10</strong><span>{t('hero.stamp_label')}</span></div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        .hero { position: relative; display: flex; align-items: center; min-height: 82vh; padding: 104px 0 72px; overflow: hidden; }
        .hero-outer { width: 100%; }
        .hero-grid { position: relative; z-index: 1; width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 72px; align-items: center; }
        .hero-copy .hero-eyebrow { display: block; color: var(--color-primary); font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 28px; }
        .hero-copy h1 { font-family: 'Montserrat', sans-serif; font-size: clamp(40px, 5vw, 64px); font-weight: 700; line-height: 1.05; margin: 0; color: var(--color-ink); }
        .hero-copy h1 .hl { position: relative; color: var(--color-primary); white-space: nowrap; }
        .hero-copy h1 .hl::after { content: ''; position: absolute; left: 1%; right: 0; bottom: 3px; height: 8px; z-index: -1; border-radius: 99px; background: rgba(132,114,97,0.2); transform: rotate(-1deg); }
        .hero-copy p { max-width: 600px; margin: 28px 0 0; font-size: 19px; line-height: 1.7; color: var(--color-muted); }
        .hero-actions { display: flex; gap: 12px; margin-top: 36px; flex-wrap: wrap; }
        .hero-note { display: flex; align-items: center; gap: 9px; margin-top: 20px; color: var(--color-muted); font-size: 13px; }
        .hero-note span { display: grid; place-items: center; width: 24px; height: 24px; color: #fff; background: var(--color-primary); border-radius: 50%; flex-shrink: 0; }
        .hero-visual { position: relative; height: 650px; }
        .hero-visual > img { width: 100%; height: 100%; object-fit: cover; border-radius: 180px 16px 16px 16px; filter: saturate(0.78) sepia(0.05); display: block; }
        .hero-visual::after { content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: 180px 16px 16px 16px; background: linear-gradient(180deg, transparent 65%, rgba(50,36,25,0.16)); }
        .hero-project-badge { position: absolute; z-index: 2; left: -38px; bottom: 48px; display: flex; gap: 13px; align-items: center; padding: 14px 20px 14px 14px; border-radius: 16px; background: rgba(247,244,241,0.82); border: 1px solid rgba(255,255,255,0.65); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: var(--shadow-md); }
        .hero-project-badge > span { width: 44px; height: 44px; display: grid; place-items: center; color: #fff; background: var(--color-primary); border-radius: 50%; flex-shrink: 0; }
        .hero-project-badge div { display: flex; flex-direction: column; }
        .hero-project-badge small { color: var(--color-muted); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; }
        .hero-project-badge strong { margin-top: 4px; font-size: 14px; color: var(--color-ink); }
        .hero-stamp { position: absolute; z-index: 3; right: -25px; top: 42px; width: 120px; height: 120px; display: grid; place-content: center; text-align: center; color: #fff; border-radius: 50%; background: var(--color-primary); box-shadow: var(--shadow-md); transform: rotate(7deg); }
        .hero-stamp strong { font-size: 29px; line-height: 1; }
        .hero-stamp span { margin-top: 5px; font-size: 9px; line-height: 1.3; letter-spacing: 0.08em; text-transform: uppercase; max-width: 90px; }
        @media (max-width: 900px) {
          .hero { min-height: 0; padding: 104px 0 56px; }
          .hero-grid { grid-template-columns: 1fr; gap: 44px; }
          .hero-copy .hero-eyebrow { margin-bottom: 20px; }
          .hero-copy p { margin-top: 20px; font-size: 16px; }
          .hero-actions { flex-direction: column; }
          .hero-actions a { width: 100%; }
          .hero-note { justify-content: center; }
          .hero-visual { width: 100%; height: 430px; }
          .hero-visual > img, .hero-visual::after { border-radius: 72px 14px 14px 14px; }
          .hero-stamp { right: -6px; top: -25px; width: 96px; height: 96px; }
          .hero-stamp strong { font-size: 24px; }
          .hero-project-badge { left: 12px; right: 12px; bottom: 14px; }
        }
      `}</style>

      {/* TRUST BAR - Auto carousel */}
      <CarouselBar items={carouselItems} />

      {/* SERVICES */}
      <section id="serveis" className="svc-section">
        <div className="svc-container">
          <div className="svc-head">
            <span className="svc-eyebrow">{t('serveis.title')}</span>
            <h2 className="svc-title">{t('serveis.heading')}</h2>
            <p className="svc-body">{t('serveis.subheading')}</p>
          </div>
          <div className="svc-grid">
            {services.map((s, i) => (
              <Link key={s.title} to={servicePath(currentLang, SERVICE_KEYS[i])} className="svc-card">
                <div className="svc-image">
                  <img src={SERVICE_IMAGES[i]} alt={`${s.title} — FERLO`} loading="lazy" decoding="async" width={600} height={400} />
                </div>
                <div className="svc-content">
                  <span className="svc-icon">{SERVICE_ICONS[i]}</span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </div>
                <svg className="svc-card-arrow" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M14 7l5 5-5 5" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <style>{`
        .svc-section { padding: 120px 0; background: var(--color-cream); }
        .svc-container { width: min(1248px, calc(100% - 64px)); margin: 0 auto; }
        .svc-head { display: grid; grid-template-columns: 0.8fr 1.35fr 1fr; align-items: end; gap: 40px; margin-bottom: 56px; }
        .svc-eyebrow { display: block; color: var(--color-primary-dark); font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; align-self: start; padding-top: 10px; }
        .svc-title { font-family: 'Montserrat', sans-serif; font-size: clamp(34px, 3.3vw, 48px); font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; margin: 0; color: var(--color-ink); }
        .svc-body { margin: 0; color: var(--color-muted); font-size: 16px; line-height: 1.65; }
        .svc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .svc-card { position: relative; display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--color-border); border-radius: 16px; background: #fff; color: inherit; text-decoration: none; transition: transform 0.3s, box-shadow 0.3s; }
        .svc-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .svc-card-arrow { position: absolute; top: 20px; right: 20px; color: var(--color-primary); opacity: 0.55; transition: opacity 0.2s, transform 0.2s; }
        .svc-card:hover .svc-card-arrow { opacity: 1; transform: translateX(3px); }
        .svc-image { position: relative; height: 350px; overflow: hidden; flex-shrink: 0; }
        .svc-image img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.75) sepia(0.06); transition: transform 0.6s; display: block; }
        .svc-card:hover .svc-image img { transform: scale(1.025); }
        .svc-content { position: relative; padding: 32px; display: flex; flex-direction: column; flex: 1; }
        .svc-icon { position: absolute; right: 28px; top: -27px; width: 54px; height: 54px; display: grid; place-items: center; color: #fff; border-radius: 50%; background: var(--color-primary); }
        .svc-content h3 { font-family: 'Montserrat', sans-serif; font-size: 24px; font-weight: 700; line-height: 1.2; letter-spacing: -0.025em; margin: 0; color: var(--color-ink); }
        .svc-content p { max-width: 480px; min-height: 54px; margin: 12px 0 0; color: var(--color-muted); font-size: 15px; line-height: 1.6; flex: 1; }
        @media (max-width: 900px) {
          .svc-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .svc-section { padding: 64px 0; }
          .svc-container { width: calc(100% - 40px); }
          .svc-head { display: block; margin-bottom: 34px; }
          .svc-eyebrow { margin-bottom: 16px; padding: 0; }
          .svc-body { margin-top: 18px; }
          .svc-image { height: 250px; }
          .svc-content { padding: 26px 24px; }
          .svc-content p { min-height: 0; }
        }
      `}</style>

      {/* FOR WHOM */}
      <section className="fw-section">
        <div className="fw-container">
          <div className="fw-head">
            <span className="fw-eyebrow">{t('forwhom.title')}</span>
            <h2 className="fw-title" dangerouslySetInnerHTML={{ __html: t('forwhom.heading') }} />
            <p className="fw-body">{t('forwhom.subheading')}</p>
          </div>
          <div className="fw-grid">
            {forWhom.map((f, i) => (
              <article key={f.title} className="fw-card">
                <span className="fw-icon">{FOR_WHOM_ICONS[i]}</span>
                <div className="fw-text">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .fw-section { padding: 120px 0; background: var(--color-warm); }
        .fw-container { width: min(1248px, calc(100% - 64px)); margin: 0 auto; }
        .fw-head { display: grid; grid-template-columns: 0.8fr 1.35fr 1fr; align-items: end; gap: 40px; margin-bottom: 56px; }
        .fw-eyebrow { display: block; align-self: start; padding-top: 10px; color: var(--color-primary-dark); font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .fw-title { margin: 0; font-family: 'Montserrat', sans-serif; font-size: clamp(34px, 3.3vw, 48px); font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; color: var(--color-ink); }
        .fw-body { margin: 0; color: var(--color-muted); font-size: 16px; line-height: 1.65; }
        .fw-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .fw-card { display: flex; align-items: flex-start; gap: 20px; min-width: 0; padding: 28px; border: 1px solid var(--color-border); border-radius: 16px; background: #fff; box-shadow: 0 10px 30px rgba(20, 15, 10, 0.05); transition: transform 0.3s, box-shadow 0.3s, border-color 0.3s; }
        .fw-card:hover { transform: translateY(-2px); border-color: var(--color-primary); box-shadow: var(--shadow-md); }
        .fw-icon { flex-shrink: 0; width: 54px; height: 54px; display: grid; place-items: center; color: #fff; border-radius: 50%; background: var(--color-primary); }
        .fw-text { min-width: 0; }
        .fw-text h3 { margin: 0; font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; line-height: 1.25; letter-spacing: -0.02em; color: var(--color-ink); }
        .fw-text p { margin: 8px 0 0; color: var(--color-muted); font-size: 14px; line-height: 1.65; }
        @media (max-width: 768px) {
          .fw-section { padding: 64px 0; }
          .fw-container { width: calc(100% - 40px); }
          .fw-head { display: block; margin-bottom: 34px; }
          .fw-eyebrow { margin-bottom: 16px; padding: 0; }
          .fw-body { margin-top: 18px; }
          .fw-grid { grid-template-columns: 1fr; }
          .fw-card { padding: 24px; gap: 16px; }
        }
      `}</style>

      {/* SOBRE NOSALTRES */}
      <section id="sobre" style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="about-grid">
          <div style={{ position: 'relative' }}>
          <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/5', backgroundColor: 'var(--color-border)' }}>
            <img
              src="/hero.webp"
              alt={t('sobre.image_alt')}
              loading="lazy"
              decoding="async"
              width={640}
              height={842}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ position: 'absolute', top: 32, right: 16, backgroundColor: 'var(--color-primary)', borderRadius: 12, padding: '20px 24px' }} className="about-badge">
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 36, fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>{t('sobre.badge_num')}</div>
            <div style={{ fontSize: 12, color: '#FFFFFF', marginTop: 4, lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: t('sobre.badge_years') }} />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 20 }}>{t('sobre.title')}</div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-ink)', marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: t('sobre.heading') }} />
          <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-muted)', marginBottom: 20 }}>
            {t('sobre.p1')}
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--color-muted)', marginBottom: 36 }}>
            {t('sobre.p2')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 40 }}>
            {sobreStats.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 28, fontWeight: 700, color: 'var(--color-primary)' }}>{s.num}</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <a href="#contacte" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            {t('sobre.cta')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
          </a>
        </div>
      </section>

      <style>{`
        .about-grid { grid-template-columns: 1fr 1fr; }
        .about-badge { display: block; }
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-badge { display: none !important; }
        }
      `}</style>

      {/* WHY US */}
      <section className="wy-section">
        <div className="wy-container">
          <div className="wy-head">
            <span className="wy-eyebrow">{t('whyus.title')}</span>
            <h2 className="wy-title" dangerouslySetInnerHTML={{ __html: t('whyus.heading') }} />
          </div>
          <div className="wy-grid">
            {whyUs.map((w, i) => (
              <article key={w.title} className="wy-item">
                <span className="wy-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="wy-icon">{WHY_US_ICONS[i]}</span>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .wy-section { --wy-accent: color-mix(in srgb, var(--color-primary-light) 92%, #fff); padding: 120px 0; background: var(--color-ink); color: var(--color-cream); }
        .wy-container { width: min(1248px, calc(100% - 64px)); margin: 0 auto; }
        .wy-head { display: grid; grid-template-columns: 0.8fr 1.35fr 1fr; align-items: end; gap: 40px; margin-bottom: 56px; }
        .wy-eyebrow { display: block; align-self: start; padding-top: 10px; color: var(--wy-accent); font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .wy-title { margin: 0; font-family: 'Montserrat', sans-serif; font-size: clamp(34px, 3.3vw, 48px); font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; color: var(--color-cream); }
        .wy-title em { font-style: normal; color: var(--wy-accent); }
        .wy-grid { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid rgba(255, 255, 255, 0.15); }
        .wy-item { position: relative; min-width: 0; min-height: 280px; padding: 40px 30px 12px 0; border-right: 1px solid rgba(255, 255, 255, 0.15); }
        .wy-item:not(:first-child) { padding-left: 30px; }
        .wy-item:last-child { border-right: 0; }
        .wy-index { position: absolute; top: 24px; right: 24px; color: rgba(255, 255, 255, 0.46); font-size: 12px; font-weight: 600; letter-spacing: 0.06em; }
        .wy-icon { display: grid; place-items: center; width: 54px; height: 54px; margin-bottom: 38px; color: #fff; border-radius: 50%; background: var(--color-primary); }
        .wy-item h3 { margin: 0; font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; line-height: 1.3; letter-spacing: -0.02em; color: var(--color-cream); }
        .wy-item p { margin: 12px 0 0; color: rgba(255, 255, 255, 0.62); font-size: 14px; line-height: 1.65; }
        @media (max-width: 900px) {
          .wy-section { padding: 96px 0; }
          .wy-container { width: calc(100% - 40px); }
          .wy-head { display: block; margin-bottom: 34px; }
          .wy-eyebrow { margin-bottom: 16px; padding: 0; }
          .wy-grid { grid-template-columns: repeat(2, 1fr); }
          .wy-item { min-height: 0; padding: 32px 24px 32px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.15); }
          .wy-item:nth-child(2n) { padding: 32px 0 32px 24px; border-right: 0; }
          .wy-item:nth-child(2n+1) { padding-left: 0; }
          .wy-item:nth-child(2n) .wy-index { right: 0; }
          .wy-icon { margin-bottom: 26px; }
        }
        @media (max-width: 500px) {
          .wy-section { padding: 64px 0; }
          .wy-grid { grid-template-columns: 1fr; }
          .wy-item,
          .wy-item:nth-child(2n),
          .wy-item:nth-child(2n+1) { padding: 30px 0; border-right: 0; }
          .wy-item:last-child { border-bottom: 0; }
          .wy-title { font-size: 30px; }
          .wy-icon { margin-bottom: 22px; }
        }
      `}</style>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 16 }}>{t('testimonis.title')}</div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.2, maxWidth: 540 }} dangerouslySetInnerHTML={{ __html: t('testimonis.heading') }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="testimonials-grid">
          {testimonials.map(tItem => (
            <div key={tItem.name} style={{ padding: '28px 28px 32px', borderRadius: 14, border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#847261"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--color-ink)', margin: '0 0 20px', fontStyle: 'italic' }}>"{tItem.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{tItem.name[0]}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{tItem.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{tItem.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .testimonials-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) { .testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .testimonials-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* CONTACT */}
      <section id="contacte" className="ct-section">
        <div className="ct-container">
          <div className="ct-grid">
            {/* Left: copy + direct actions */}
            <div className="ct-copy">
              <span className="ct-eyebrow">{t('contacte.title')}</span>
              <h2 className="ct-title" dangerouslySetInnerHTML={{ __html: t('contacte.heading') }} />
              <p className="ct-lead">{t('contacte.description')}</p>

              <div className="ct-actions">
                <a href="tel:+34692586863" className="ct-btn ct-btn--primary">
                  {t('contacte.form_title')}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>
                </a>
                <a href={waContacte} target="_blank" rel="noopener noreferrer" className="ct-btn ct-btn--wa" onClick={() => trackWhatsApp('contacte')}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {t('contacte.whatsapp_label')}
                </a>
                <span className="ct-hint">{t('contacte.whatsapp_sub')}</span>
              </div>

              <div className="ct-meta">
                <div>
                  <div className="ct-meta-label">{t('contacte.email_label')}</div>
                  <a className="ct-meta-value" href="mailto:reformasferlo@outlook.es">reformasferlo@outlook.es</a>
                  <div className="ct-meta-sub">{t('contacte.email_sub')}</div>
                </div>
                <div>
                  <div className="ct-meta-label">{t('contacte.cobertura')}</div>
                  <div className="ct-meta-sub">{t('contacte.cobertura_text')}</div>
                </div>
              </div>
            </div>

            {/* Right: form card */}
            <div className="ct-card">
              {sent ? (
                <div className="ct-sent">
                  <div className="ct-sent-icon">✅</div>
                  <h3 className="ct-sent-title">{t('contacte.form_sent_title')}</h3>
                  <p className="ct-sent-text">{t('contacte.form_sent_text')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div role="alert" style={{ backgroundColor: '#FEF3F2', border: '1px solid #FDA29B', color: '#B42318', borderRadius: 8, padding: '12px 14px', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
                      {error}
                    </div>
                  )}
                  <div className="ct-hp" aria-hidden="true">
                    <label htmlFor="ct-website">No rellenar</label>
                    <input ref={honeypotRef} id="ct-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                  <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 28 }}>{t('contacte.form_title')}</h3>

                  <div className="ct-field-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{t('contacte.form_nom')}</label>
                  <input value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} placeholder={t('contacte.form_nom_placeholder')} required
                    style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14, backgroundColor: '#fff', color: 'var(--color-ink)', outline: 'none', fontFamily: 'inherit' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{t('contacte.form_telefon')}</label>
                  <input value={formData.telefon} onChange={e => setFormData({ ...formData, telefon: e.target.value })} placeholder={t('contacte.form_telefon_placeholder')} type="tel"
                    style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14, backgroundColor: '#fff', color: 'var(--color-ink)', outline: 'none', fontFamily: 'inherit' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{t('contacte.form_email')}</label>
                <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder={t('contacte.form_email_placeholder')} type="email" required
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14, backgroundColor: '#fff', color: 'var(--color-ink)', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{t('contacte.form_poblacio')}</label>
                <input value={formData.poblacio} onChange={e => setFormData({ ...formData, poblacio: e.target.value })} placeholder={t('contacte.form_poblacio_placeholder')}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14, backgroundColor: '#fff', color: 'var(--color-ink)', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{t('contacte.form_servei')}</label>
                <select value={formData.servei} onChange={e => setFormData({ ...formData, servei: e.target.value })} aria-label={t('contacte.form_servei')}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14, backgroundColor: '#fff', color: formData.servei ? 'var(--color-ink)' : 'var(--color-muted)', outline: 'none', fontFamily: 'inherit', appearance: 'none' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                  <option value="">{t('contacte.form_servei_placeholder')}</option>
                  <option>{t('serveis.items.0.title')}</option>
                  <option>{t('serveis.items.1.title')}</option>
                  <option>{t('serveis.items.2.title')}</option>
                  <option>{t('contacte.form_altres')}</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{t('contacte.form_missatge')}</label>
                <textarea value={formData.missatge} onChange={e => setFormData({ ...formData, missatge: e.target.value })} rows={4}
                  placeholder={t('contacte.form_missatge_placeholder')}
                  style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14, backgroundColor: '#fff', color: 'var(--color-ink)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: 'var(--color-primary)', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}>
                {t('contacte.form_submit')}
              </button>
              <p style={{ fontSize: 12, color: 'var(--color-muted)', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
                {t('contacte.form_response')}
              </p>
            </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .ct-section { --ct-accent: var(--color-primary-light); padding: 112px 0; background: var(--color-ink); color: var(--color-cream); }
        .ct-container { width: min(1248px, calc(100% - 64px)); margin: 0 auto; }
        .ct-grid { display: grid; grid-template-columns: 1fr 1.02fr; gap: 72px; align-items: start; }
        .ct-eyebrow { display: block; margin-bottom: 26px; color: var(--ct-accent); font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .ct-title { margin: 0; font-family: 'Montserrat', sans-serif; font-size: clamp(34px, 3.3vw, 48px); font-weight: 700; line-height: 1.08; letter-spacing: -0.025em; color: var(--color-cream); }
        .ct-title em { font-style: normal; color: var(--ct-accent); }
        .ct-lead { margin: 22px 0 0; max-width: 46ch; color: rgba(255, 255, 255, 0.76); font-size: 16px; line-height: 1.7; }
        .ct-actions { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; margin-top: 36px; }
        .ct-btn { min-height: 52px; padding: 0 26px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; border-radius: 999px; font-size: 14px; font-weight: 600; text-decoration: none; transition: transform 0.2s, background 0.2s, border-color 0.2s; }
        .ct-btn:hover { transform: translateY(-1px); }
        .ct-btn--primary { background: var(--color-cream); color: var(--color-ink); }
        .ct-btn--primary:hover { background: #ffffff; }
        .ct-btn--wa { border: 1px solid rgba(255, 255, 255, 0.28); color: var(--color-cream); }
        .ct-btn--wa:hover { border-color: rgba(255, 255, 255, 0.6); }
        .ct-hint { margin-top: 2px; color: rgba(255, 255, 255, 0.68); font-size: 12px; }
        .ct-meta { display: grid; gap: 24px; margin-top: 44px; padding-top: 32px; border-top: 1px solid rgba(255, 255, 255, 0.15); }
        .ct-meta-label { margin-bottom: 6px; color: var(--ct-accent); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
        .ct-meta-value { display: inline-block; color: var(--color-cream); font-size: 15px; font-weight: 600; text-decoration: none; }
        .ct-meta-value:hover { color: var(--ct-accent); }
        .ct-meta-sub { margin-top: 4px; color: rgba(255, 255, 255, 0.68); font-size: 13px; line-height: 1.65; }
        .ct-card { padding: 40px 36px; border: 1px solid var(--color-border); border-radius: 20px; background: #ffffff; }
        .ct-sent { padding: 40px 0; text-align: center; }
        .ct-sent-icon { margin-bottom: 16px; font-size: 48px; }
        .ct-sent-title { margin: 0 0 12px; font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 700; color: var(--color-ink); }
        .ct-sent-text { font-size: 15px; color: var(--color-muted); }
        .ct-hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
        @media (max-width: 1024px) {
          .ct-section { padding: 96px 0; }
          .ct-grid { grid-template-columns: 1fr; gap: 48px; }
        }
        @media (max-width: 640px) {
          .ct-section { padding: 72px 0; }
          .ct-container { width: calc(100% - 40px); }
          .ct-title { font-size: 30px; }
          .ct-btn { width: 100%; }
          .ct-meta { margin-top: 32px; padding-top: 26px; }
          .ct-card { padding: 28px 22px; border-radius: 16px; }
        }
        @media (max-width: 520px) {
          .ct-field-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* FOOTER - Floating pill style */}
      <footer style={{ padding: '60px 24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: 28, padding: '48px 48px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)', border: '1px solid var(--color-warm)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }} className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <img src="/logo.svg" alt="FERLO — Reformes i obra nova a Tordera" width={128} height={128} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                <div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--color-ink)', lineHeight: 1.1 }}>FERLO</div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', letterSpacing: '0.08em' }}>{t('footer.tagline')}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.7, maxWidth: 280 }}>
                {t('footer.description')}
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <a href={waFooter} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', fontSize: 14, textDecoration: 'none' }} onClick={() => trackWhatsApp('footer')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.serveis_title')}</div>
              {[
                { label: t('serveis.items.0.title'), href: servicePath(currentLang, 'reformes') },
                { label: t('serveis.items.1.title'), href: servicePath(currentLang, 'cuines') },
                { label: t('serveis.items.2.title'), href: servicePath(currentLang, 'banys') },
              ].map(s => (
                <Link key={s.label} to={s.href} style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>{s.label}</Link>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.empresa_title')}</div>
              <a href="#inici" style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>{t('footer.inici')}</a>
              <a href="#sobre" style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>{t('nav.sobre')}</a>
              <a href="#sobre" style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>{t('footer.testimonis')}</a>
              <a href="#contacte" style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>{t('nav.contacte')}</a>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.contacte_title')}</div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.8 }}>
                <div>💬 <a href={waFooter} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 500 }} onClick={() => trackWhatsApp('footer')}>692 586 863</a></div>
                <div>✉️ <a href="mailto:reformasferlo@outlook.es" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>reformasferlo@outlook.es</a></div>
                <div style={{ marginTop: 8 }}>{t('footer.zona')}</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{t('footer.horari')}</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <a href="https://www.sprintops.es" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--color-muted)', textDecoration: 'none' }}>{t('footer.legal')}</a>
            <div style={{ display: 'flex', gap: 24 }}>
              <Link to={legalPath(currentLang)} style={{ fontSize: 12, color: 'var(--color-muted)', textDecoration: 'none' }}>{t('footer.avis_legal')}</Link>
              <Link to={privacyPath(currentLang)} style={{ fontSize: 12, color: 'var(--color-muted)', textDecoration: 'none' }}>{t('footer.politica_privacitat')}</Link>
              <Link to={cookiesPath(currentLang)} style={{ fontSize: 12, color: 'var(--color-muted)', textDecoration: 'none' }}>{t('footer.cookies')}</Link>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 500px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>

    </div>
  )
}