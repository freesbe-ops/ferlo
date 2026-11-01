import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Seo from './components/Seo'
import { trackFormLead, trackWhatsAppClick } from './lib/tracking'
import { useParams, useNavigate, Link } from 'react-router-dom'
import MobileNav from './components/MobileNav'
import {
  DEFAULT_LANG,
  LANG_LABELS,
  LANGS,
  homePath,
  isLang,
  normalizeLang,
  privacyPath,
  routePath,
  servicePath,
} from './lib/lang'

const SERVICE_ICONS = [
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>,
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
  </svg>,
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l3 3" /><path d="M20 2v6h-6" />
  </svg>,
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
  </svg>,
]

const FOR_WHOM_ICONS = [
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
  </svg>,
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>,
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>,
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
  </svg>,
]

const WHY_US_ICONS = [
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>,
]

const SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=600&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1668120089662-42642838cfef?w=600&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1676210134188-4c05dd172f89?w=600&h=400&fit=crop&auto=format',
]

function CarouselBar({ items }: { items: string[] }) {
  const all = [...items, ...items, ...items]
  const text = all.join(' &nbsp;&nbsp;&nbsp;&mdash;&nbsp;&nbsp;&nbsp; ')

  return (
    <div style={{ borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5', backgroundColor: '#F5F5F5', padding: '20px 0', overflow: 'hidden' }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'scrollCarousel 12s linear infinite' }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#1A1714', letterSpacing: '0.12em', paddingRight: 0 }} dangerouslySetInnerHTML={{ __html: text }} />
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
      // No lang in URL or invalid lang: redirect to /ca (català per defecte)
      navigate(routePath(DEFAULT_LANG, 'home'), { replace: true })
    }
  }, [langParam, i18n, navigate])

  const whatsappBase = 'https://wa.me/34677218303'
  const waHeader = `${whatsappBase}?utm_source=web&utm_medium=whatsapp&utm_campaign=header&utm_content=${currentLang}`
  const waContacte = `${whatsappBase}?utm_source=web&utm_medium=whatsapp&utm_campaign=contacte&utm_content=${currentLang}`
  const waFooter = `${whatsappBase}?utm_source=web&utm_medium=whatsapp&utm_campaign=footer&utm_content=${currentLang}`

  const navLinks = [
    { label: t('nav.serveis'), href: '#serveis', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { label: t('nav.sobre'), href: '#sobre', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg> },
    { label: t('nav.piscines'), href: servicePath(currentLang, 'piscines'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18c2-3 4-4.5 7-4.5S14 15 16.5 18" /><path d="M4 9.5C5.5 8 7.5 7 9.5 7s3.5 1 5 2.5" /><path d="M13 3.5c1.6 1.2 2.8 3 3.5 5" /><path d="M8 5.5c-1.2 1.3-2 3.2-2.2 5.1" /></svg> },
    { label: t('serveis.items.2.title'), href: servicePath(currentLang, 'jardineria'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> },
    { label: t('serveis.items.0.title'), href: servicePath(currentLang, 'manteniment'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
    { label: t('serveis.items.3.title'), href: servicePath(currentLang, 'instalacions'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg> },
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
  // but GA4 always receives the same key across the 4 languages.
  const SERVICE_ANALYTICS_KEYS = ['manteniment', 'piscines', 'jardineria', 'instalacions']
  const analyticsService = (label: string) => {
    const index = SERVICE_ANALYTICS_KEYS.findIndex((_, i) => label === t(`serveis.items.${i}.title`))
    if (index >= 0) return SERVICE_ANALYTICS_KEYS[index]
    return label ? 'altres' : 'general'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1) Track the lead immediately. The conversion must never depend on how
    //    fast (or whether) the external Google Apps Script endpoint answers.
    trackFormLead({ service: analyticsService(formData.servei) })

    // 2) Fire-and-forget POST to the Apps Script endpoint that writes to the
    //    Google Sheet. A hard timeout guarantees the visitor always gets
    //    feedback instead of an endlessly spinning form.
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    try {
      const data = {
        nom: formData.nom,
        telefon: formData.telefon,
        email: formData.email,
        servei: formData.servei,
        tipus: formData.servei,
        poblacio: formData.poblacio,
        missatge: formData.missatge,
        comentaris: formData.missatge,
      }
      await fetch('https://script.google.com/macros/s/AKfycbwjfVhosVKw2o2nOxulbwbvRku7W-squiE8rRBpzzNl7JX__ApvawIgI6mNTQRqIuwi/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      })
    } catch (_) {
      // silently ignore: the request is best-effort and no-cors hides the status
    } finally {
      clearTimeout(timeout)
    }

    setSent(true)
  }

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value)
    localStorage.setItem('i18nextLng', value)
    navigate(`/${value}`, { replace: false })
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", backgroundColor: '#F5F5F5', color: '#1A1714' }}>

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
              <img src="/logo-lizana.webp" alt="Manteniments Lizana - Reparacions a Girona" width={128} height={128} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
              <div className="logo-text">
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: '#1A1714', lineHeight: 1.1 }}>Manteniments</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 12, color: '#5C5348', letterSpacing: '0.08em' }}>LIZANA</div>
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
              <Link key={l.label} to={l.href} title={l.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, padding: '4px 10px', borderRadius: 40, color: '#5C5348', textDecoration: 'none', transition: 'color 0.2s, background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#1A1714'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#5C5348'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                {l.icon}
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{l.label}</span>
              </Link>
            ) : (
              <a key={l.label} href={l.href} title={l.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, padding: '4px 10px', borderRadius: 40, color: '#5C5348', textDecoration: 'none', transition: 'color 0.2s, background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#1A1714'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#5C5348'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                {l.icon}
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{l.label}</span>
              </a>
            ))}
          </nav>

          {/* Mobile Nav - amb desplegable de serveis (liquid glass) */}
          <MobileNav currentLang={currentLang} waHeader={waHeader} isHome />

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="#contacte" style={{ padding: '8px 18px', backgroundColor: '#00326B', color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }} className="hidden-mobile">
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

      {/* HERO - Full width background */}
      <section id="inici" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-start', marginTop: '-60px', paddingTop: '60px' }}>
        {/* Background image - full width */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <img
            src="/hero.webp"
            alt={t('hero.image_alt')}
            fetchPriority="high"
            width={1200}
            height={800}
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
          />
          {/* Dark overlay for readability */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          <div style={{ maxWidth: 600 }}>
            {/* Language selector (just above badge) */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <select
                  value={currentLang}
                  onChange={e => changeLanguage(e.target.value)}
                  aria-label="Idioma / Language / Idioma / Langue"
                  style={{ background: 'transparent', border: 'none', color: '#B0C4DE', fontWeight: 700, textDecoration: 'underline', fontSize: 12, fontFamily: "'DM Sans', system-ui, sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase', outline: 'none', cursor: 'pointer', padding: 0, margin: 0, appearance: 'none', WebkitAppearance: 'none' }}
                >
                  {LANGS.map(l => (
                    <option key={l} value={l} style={{ color: '#1A1714', textTransform: 'uppercase' }}>{LANG_LABELS[l]}</option>
                  ))}
                </select>
                <span style={{ fontSize: 9, color: '#B0C4DE', fontWeight: 700, pointerEvents: 'none', lineHeight: 1 }}>▼</span>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 28, fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', color: '#B0C4DE', textTransform: 'uppercase' }}>
              <span style={{ width: 20, height: 1, backgroundColor: '#FFFFFF', display: 'inline-block' }} />
              {t('hero.badge')}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 8, color: '#FFFFFF' }}>
              {t('hero.title')}
            </h1>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 700, fontStyle: 'italic', lineHeight: 1.1, marginBottom: 28, color: '#FFFFFF' }}>
              {t('hero.subtitle')}
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: '#E0E0E0', maxWidth: 440, marginBottom: 40 }}>
              {t('hero.description')}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 48 }}>
              <a href="#contacte" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', backgroundColor: '#FFFFFF', color: '#1A1714', borderRadius: 40, textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E5E5E5')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}>
                {t('hero.cta')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
              </a>
              <a href="#serveis" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 24px', borderRadius: 40, border: '1px solid rgba(255,255,255,0.4)', color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 400, backgroundColor: 'transparent' }}>
                {t('hero.secondary_cta')}
              </a>
            </div>
            {/* Stars */}
            <a href="https://share.google/MP6A0EmNCzBuHSuTd" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <span style={{ fontSize: 13, color: '#E0E0E0' }}><strong style={{ color: '#FFFFFF' }}>4.9 / 5</strong> · {t('hero.stars_label')}</span>
            </a>
          </div>
        </div>

      </section>

      {/* TRUST BAR - Auto carousel */}
      <CarouselBar items={carouselItems} />

      {/* SERVICES */}
      <section id="serveis" style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 20 }}>{t('serveis.title')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'end' }} className="section-header-grid">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, lineHeight: 1.15, color: '#1A1714', margin: 0 }} dangerouslySetInnerHTML={{ __html: t('serveis.heading') }} />
            <p style={{ fontSize: 16, color: '#5C5348', lineHeight: 1.65, margin: 0 }}>
              {t('serveis.subheading')}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }} className="services-grid">
          {services.map((s, i) => {
            const isManteniment = i === 0 // Manteniment is the first service (index 0)
            const isPiscines = i === 1 // Piscines is the second service (index 1)
            const isJardineria = i === 2 // Jardins is the third service (index 2)
            const isInstalacions = i === 3 // Instal·lacions is the 4th service (index 3)
            const isLinkable = isManteniment || isPiscines || isJardineria || isInstalacions
            const serviceLink = isManteniment
              ? servicePath(currentLang, 'manteniment')
              : isPiscines
                ? servicePath(currentLang, 'piscines')
                : isJardineria
                  ? servicePath(currentLang, 'jardineria')
                  : isInstalacions
                    ? servicePath(currentLang, 'instalacions')
                    : undefined
            const element = (
              <div key={s.title} style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 16, overflow: 'hidden', border: '1px solid #E5E5E5', backgroundColor: '#FAFAFA', transition: 'transform 0.2s, box-shadow 0.2s', cursor: isLinkable ? 'pointer' : 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                <div style={{ position: 'relative', aspectRatio: '16/7', overflow: 'hidden', backgroundColor: '#E5E5E5', flexShrink: 0 }}>
                  <img src={SERVICE_IMAGES[i]} alt={`${s.title} - Manteniments Lizana a Girona`} loading="lazy" decoding="async" width={600} height={400} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.04)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')} />
                  {/* Botó + liquid glass */}
                  <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 5, width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 22, fontWeight: 400, lineHeight: 1, backgroundColor: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)', cursor: 'pointer', userSelect: 'none', pointerEvents: 'none' }}>
                    +
                  </div>
                </div>
                <div style={{ padding: '28px 28px 32px', display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px 12px', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#00326B', minWidth: 0 }}>
                      {SERVICE_ICONS[i]}
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, margin: 0, color: '#1A1714', lineHeight: 1.2 }}>{s.title}</h3>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', padding: '4px 10px', backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: 40, color: '#5C5348', whiteSpace: 'normal', textAlign: 'center' }}>{s.tag}</span>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: '#5A5148', margin: 0, flex: 1 }}>{s.description}</p>
                </div>
              </div>
            )
            return isLinkable ? (
              <Link key={s.title} to={serviceLink!} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', height: '100%' }}>
                {element}
              </Link>
            ) : element
          })}
        </div>
      </section>

      <style>{`
        .section-header-grid { grid-template-columns: 1fr 1fr; }
        .services-grid { grid-template-columns: repeat(2, 1fr); }
        .services-grid > * { min-width: 0; }
        @media (max-width: 768px) {
          .section-header-grid { grid-template-columns: 1fr !important; }
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* FOR WHOM */}
      <section style={{ backgroundColor: '#F5F5F5', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'end' }} className="section-header-grid">
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 20 }}>{t('forwhom.title')}</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, lineHeight: 1.15, color: '#1A1714', margin: 0 }} dangerouslySetInnerHTML={{ __html: t('forwhom.heading') }} />
            </div>
            <p style={{ fontSize: 16, color: '#5C5348', lineHeight: 1.65, margin: 0 }}>
              {t('forwhom.subheading')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="forwhom-grid">
            {forWhom.map((f, i) => (
              <div key={f.title} style={{ padding: '32px 24px', borderRadius: 14, border: '1px solid #E5E5E5', backgroundColor: '#FFFFFF', transition: 'border-color 0.2s, background 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#00326B'; (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFAFA'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E5E5'; (e.currentTarget as HTMLElement).style.backgroundColor = '#FFFFFF'; }}>
                <div style={{ color: '#00326B', marginBottom: 18 }}>{FOR_WHOM_ICONS[i]}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#1A1714', marginBottom: 10, lineHeight: 1.2 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#5C5348', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .forwhom-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 900px) { .forwhom-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 500px) { .forwhom-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* SOBRE NOSALTRES */}
      <section id="sobre" style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="about-grid">
          <div style={{ position: 'relative' }}>
          <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/5', backgroundColor: '#E5E5E5' }}>
            <img
              src="/aleix-manteniments-lizana-2.jpeg"
              alt={t('sobre.image_alt')}
              loading="lazy"
              decoding="async"
              width={640}
              height={842}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ position: 'absolute', top: 32, right: 16, backgroundColor: '#00326B', borderRadius: 12, padding: '20px 24px' }} className="about-badge">
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>{t('sobre.badge_num')}</div>
            <div style={{ fontSize: 12, color: '#B0C4DE', marginTop: 4, lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: t('sobre.badge_years') }} />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 20 }}>{t('sobre.title')}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.2, color: '#1A1714', marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: t('sobre.heading') }} />
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#5A5148', marginBottom: 20 }}>
            {t('sobre.p1')}
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#5A5148', marginBottom: 36 }}>
            {t('sobre.p2')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 40 }}>
            {sobreStats.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#00326B' }}>{s.num}</div>
                <div style={{ fontSize: 12, color: '#5C5348', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <a href="#contacte" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', backgroundColor: '#00326B', color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
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
      <section style={{ backgroundColor: '#F5F5F5', padding: '100px 24px', borderTop: '1px solid #E5E5E5' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 16 }}>{t('whyus.title')}</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 700, color: '#1A1714', lineHeight: 1.2, margin: '0 auto', maxWidth: 540 }} dangerouslySetInnerHTML={{ __html: t('whyus.heading') }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }} className="whyus-grid">
            {whyUs.map((w, i) => (
              <div key={w.title}>
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00326B', marginBottom: 20 }}>
                  {WHY_US_ICONS[i]}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#1A1714', marginBottom: 10, lineHeight: 1.2 }}>{w.title}</h3>
                <p style={{ fontSize: 14, color: '#5C5348', lineHeight: 1.7, margin: 0 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .whyus-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 900px) { .whyus-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 500px) { .whyus-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 16 }}>{t('testimonis.title')}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 700, color: '#1A1714', lineHeight: 1.2, maxWidth: 540 }} dangerouslySetInnerHTML={{ __html: t('testimonis.heading') }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="testimonials-grid">
          {testimonials.map(tItem => (
            <div key={tItem.name} style={{ padding: '28px 28px 32px', borderRadius: 14, border: '1px solid #E5E5E5', backgroundColor: '#FAFAFA' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#00326B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: '#3A3530', margin: '0 0 20px', fontStyle: 'italic' }}>"{tItem.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#00326B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{tItem.name[0]}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1714' }}>{tItem.name}</div>
                  <div style={{ fontSize: 12, color: '#5C5348' }}>{tItem.location}</div>
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
      <section id="contacte" style={{ backgroundColor: '#F5F5F5', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }} className="contact-grid">

            {/* Left */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 20 }}>{t('contacte.title')}</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.2, color: '#1A1714', marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: t('contacte.heading') }} />
              <p style={{ fontSize: 15, color: '#5C5348', lineHeight: 1.7, marginBottom: 48 }}>
                {t('contacte.description')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { icon: '💬', label: t('contacte.whatsapp_label'), val: '677 218 303', sub: t('contacte.whatsapp_sub'), href: waContacte },
                  { icon: '✉️', label: t('contacte.email_label'), val: 'mantenimentlizana@gmail.com', sub: t('contacte.email_sub'), href: 'mailto:mantenimentlizana@gmail.com' },
                ].map(c => (
                  <a key={c.label} href={c.href} style={{ textDecoration: 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }} onClick={() => { if (c.label === 'WhatsApp') trackWhatsApp('contacte') }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, color: '#5C5348', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{c.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1714', marginBottom: 2 }}>{c.val}</div>
                      <div style={{ fontSize: 12, color: '#5C5348' }}>{c.sub}</div>
                    </div>
                  </a>
                ))}

                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11, color: '#5C5348', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{t('contacte.cobertura')}</div>
                  <div style={{ fontSize: 14, color: '#5A5148', lineHeight: 1.6 }}>{t('contacte.cobertura_text')}</div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: 20, padding: '40px 36px', border: '1px solid #E5E5E5' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#1A1714', marginBottom: 12 }}>{t('contacte.form_sent_title')}</h3>
                  <p style={{ fontSize: 15, color: '#5C5348' }}>{t('contacte.form_sent_text')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#1A1714', marginBottom: 28 }}>{t('contacte.form_title')}</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 6 }}>{t('contacte.form_nom')}</label>
                      <input value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} placeholder={t('contacte.form_nom_placeholder')} required
                        style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14, backgroundColor: '#fff', color: '#1A1714', outline: 'none', fontFamily: 'inherit' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#00326B')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E5E5E5')} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 6 }}>{t('contacte.form_telefon')}</label>
                      <input value={formData.telefon} onChange={e => setFormData({ ...formData, telefon: e.target.value })} placeholder={t('contacte.form_telefon_placeholder')} type="tel"
                        style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14, backgroundColor: '#fff', color: '#1A1714', outline: 'none', fontFamily: 'inherit' }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#00326B')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#E5E5E5')} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 6 }}>{t('contacte.form_email')}</label>
                    <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder={t('contacte.form_email_placeholder')} type="email" required
                      style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14, backgroundColor: '#fff', color: '#1A1714', outline: 'none', fontFamily: 'inherit' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#00326B')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#E5E5E5')} />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 6 }}>{t('contacte.form_poblacio')}</label>
                    <input value={formData.poblacio} onChange={e => setFormData({ ...formData, poblacio: e.target.value })} placeholder={t('contacte.form_poblacio_placeholder')}
                      style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14, backgroundColor: '#fff', color: '#1A1714', outline: 'none', fontFamily: 'inherit' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#00326B')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#E5E5E5')} />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 6 }}>{t('contacte.form_servei')}</label>
                    <select value={formData.servei} onChange={e => setFormData({ ...formData, servei: e.target.value })} aria-label={t('contacte.form_servei')}
                      style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14, backgroundColor: '#fff', color: formData.servei ? '#1A1714' : '#6B6258', outline: 'none', fontFamily: 'inherit', appearance: 'none' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#00326B')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#E5E5E5')}>
                      <option value="">{t('contacte.form_servei_placeholder')}</option>
                      <option>{t('serveis.items.0.title')}</option>
                      <option>{t('serveis.items.1.title')}</option>
                      <option>{t('serveis.items.2.title')}</option>
                      <option>{t('serveis.items.3.title')}</option>
                      <option>{t('contacte.form_altres')}</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 6 }}>{t('contacte.form_missatge')}</label>
                    <textarea value={formData.missatge} onChange={e => setFormData({ ...formData, missatge: e.target.value })} rows={4}
                      placeholder={t('contacte.form_missatge_placeholder')}
                      style={{ width: '100%', padding: '11px 14px', border: '1px solid #E5E5E5', borderRadius: 8, fontSize: 14, backgroundColor: '#fff', color: '#1A1714', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#00326B')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#E5E5E5')} />
                  </div>

                  <button type="submit" style={{ width: '100%', padding: '14px', backgroundColor: '#00326B', color: '#FFFFFF', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#00244D')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#00326B')}>
                    {t('contacte.form_submit')}
                  </button>
                  <p style={{ fontSize: 12, color: '#6B6258', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
                    {t('contacte.form_response')}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-grid { grid-template-columns: 1fr 1.4fr; }
        @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* FOOTER - Floating pill style */}
      <footer style={{ padding: '60px 24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: 28, padding: '48px 48px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #EEEEEE' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }} className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <img src="/logo-lizana.webp" alt="Manteniments Lizana - Reparacions a Girona" width={128} height={128} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, color: '#1A1714', lineHeight: 1.1 }}>Manteniments Lizana</div>
                  <div style={{ fontSize: 11, color: '#5C5348', letterSpacing: '0.08em' }}>{t('footer.tagline')}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#5C5348', lineHeight: 1.7, maxWidth: 280 }}>
                {t('footer.description')}
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <a href="https://www.facebook.com/p/Manteniments-Lizana-61590819927805/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1877F2', fontSize: 14, textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/manteniments_lizana" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="igGradApp" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#833AB4"/><stop offset="50%" stopColor="#FD1D1D"/><stop offset="100%" stopColor="#F77737"/></linearGradient></defs><path fill="url(#igGradApp)" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
                <a href={waFooter} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', fontSize: 14, textDecoration: 'none' }} onClick={() => trackWhatsApp('footer')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.serveis_title')}</div>
              {[
                { label: t('serveis.items.0.title'), href: servicePath(currentLang, 'manteniment') },
                { label: t('serveis.items.1.title'), href: servicePath(currentLang, 'piscines') },
                { label: t('serveis.items.2.title'), href: servicePath(currentLang, 'jardineria') },
                { label: t('serveis.items.3.title'), href: servicePath(currentLang, 'instalacions') },
              ].map(s => (
                <Link key={s.label} to={s.href} style={{ display: 'block', fontSize: 13, color: '#5C5348', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#00326B')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#5C5348')}>{s.label}</Link>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.empresa_title')}</div>
              <a href="#inici" style={{ display: 'block', fontSize: 13, color: '#5C5348', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00326B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5C5348')}>{t('footer.inici')}</a>
              <a href="#sobre" style={{ display: 'block', fontSize: 13, color: '#5C5348', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00326B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5C5348')}>{t('nav.sobre')}</a>
              <a href="#sobre" style={{ display: 'block', fontSize: 13, color: '#5C5348', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00326B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5C5348')}>{t('footer.testimonis')}</a>
              <a href="#contacte" style={{ display: 'block', fontSize: 13, color: '#5C5348', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00326B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5C5348')}>{t('nav.contacte')}</a>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.contacte_title')}</div>
              <div style={{ fontSize: 13, color: '#5C5348', lineHeight: 1.8 }}>
                <div>💬 <a href={waFooter} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 500 }} onClick={() => trackWhatsApp('footer')}>677 218 303</a></div>
                <div>✉️ <a href="mailto:mantenimentlizana@gmail.com" style={{ color: '#00326B', textDecoration: 'none', fontWeight: 500 }}>mantenimentlizana@gmail.com</a></div>                <div style={{ marginTop: 8 }}>{t('footer.zona')}</div>
                <div style={{ fontSize: 12, color: '#6B6258', marginTop: 4 }}>{t('footer.horari')}</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <a href="https://www.sprintops.es" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#6B6258', textDecoration: 'none' }}>{t('footer.legal')}</a>
            <div style={{ display: 'flex', gap: 24 }}>
              <a href="#" style={{ fontSize: 12, color: '#6B6258', textDecoration: 'none' }}>{t('footer.avis_legal')}</a>
              <Link to={privacyPath(currentLang)} style={{ fontSize: 12, color: '#6B6258', textDecoration: 'none' }}>{t('footer.politica_privacitat')}</Link>
              <a href="#" style={{ fontSize: 12, color: '#6B6258', textDecoration: 'none' }}>{t('footer.cookies')}</a>
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