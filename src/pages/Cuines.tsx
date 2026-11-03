import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MobileNav from '../components/MobileNav'
import Seo from '../components/Seo'
import { trackWhatsAppClick } from '../lib/tracking'
import {
  DEFAULT_LANG,
  LANG_LABELS,
  LANGS,
  cookiesPath,
  isLang,
  legalPath,
  normalizeLang,
  privacyPath,
  servicePath,
  type Lang,
} from '../lib/lang'

const HERO_IMAGES: Record<Lang, string> = {
  es: '/hero.webp',
  ca: '/hero.webp',
}

const BREAK_IMAGES: Record<Lang, string> = {
  es: '/hero.webp',
  ca: '/hero.webp',
}

const GALLERY_IMAGES: Record<Lang, string> = {
  es: '/despues.webp',
  ca: '/despues.webp',
}

function CarouselBar({ items }: { items: string[] }) {
  const all = [...items, ...items, ...items]
  const text = all.join(' &nbsp;&nbsp;&nbsp;&mdash;&nbsp;&nbsp;&nbsp; ')

  return (
    <div style={{ borderTop: '1px solid rgba(2,54,117,0.1)', borderBottom: '1px solid rgba(2,54,117,0.1)', backgroundColor: 'var(--color-cream)', padding: '20px 0', overflow: 'hidden' }}>
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

const SEASON_EMOJIS = ['🌷', '☀️', '🍂', '❄️']

export default function Cuines() {
  const { t, i18n } = useTranslation()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const navigate = useNavigate()
  const [activeService, setActiveService] = useState(0)
  const [activeSeason, setActiveSeason] = useState(0)

  const urlLang = isLang(langParam) ? langParam : null
  const currentLang = urlLang ?? normalizeLang(i18n.language)

  useEffect(() => {
    if (isLang(langParam)) {
      if (i18n.language !== langParam) {
        i18n.changeLanguage(langParam)
      }
      localStorage.setItem('i18nextLng', langParam)
    } else {
      navigate(servicePath(DEFAULT_LANG, 'cuines'), { replace: true })
    }
  }, [langParam, navigate, i18n])

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value)
    localStorage.setItem('i18nextLng', value)
    navigate(servicePath(normalizeLang(value), 'cuines'), { replace: false })
  }

  const whatsappBase = 'https://wa.me/34692586863'
  const waHeader = `${whatsappBase}?utm_source=web&utm_medium=whatsapp&utm_campaign=cuines&utm_content=${currentLang}`
  const waFooter = `${whatsappBase}?utm_source=web&utm_medium=whatsapp&utm_campaign=cuines&utm_content=${currentLang}`

  const trackWhatsApp = (label: string) => trackWhatsAppClick(label)

  const navLinks = [
    { label: t('nav.serveis'), href: `/${currentLang}/#serveis`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { label: t('nav.sobre'), href: `/${currentLang}/#sobre`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg> },
    { label: t('serveis.items.0.title'), href: servicePath(currentLang, 'reformes'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
    { label: t('serveis.items.1.title'), href: servicePath(currentLang, 'cuines'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="9" rx="2"/><path d="M1.5 13.5h1.5M21 13.5h1.5"/><path d="M8 6.5c0-.9.7-1.3.7-2.2M12 6.5c0-.9.7-1.3.7-2.2M16 6.5c0-.9.7-1.3.7-2.2"/></svg> },
    { label: t('serveis.items.2.title'), href: servicePath(currentLang, 'banys'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.7l5.4 5.4a7.64 7.64 0 1 1-10.8 0z"/><path d="M9 13a3 3 0 0 0 3 3"/></svg> },
    { label: t('serveis.items.3.title'), href: servicePath(currentLang, 'obraNova'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h20"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9.5 21v-6h5v6"/><path d="M9.5 10h5"/></svg> },
    { label: 'WhatsApp', href: waHeader, external: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
  ]

  const services = t('cuines.services.items', { returnObjects: true }) as Array<{ title: string; description: string; img: string; icon: string }>
  const benefits = t('cuines.benefits.items', { returnObjects: true }) as Array<{ title: string; desc: string }>
  const seasons = t('cuines.seasons.items', { returnObjects: true }) as Array<{ season: string; tasks: string[] }>
  const testimonials = t('cuines.testimonials.items', { returnObjects: true }) as Array<{ name: string; location: string; text: string }>
  const carouselItems = t('cuines.carousel', { returnObjects: true }) as string[]

  const accent = '#847261'
  const accentDark = '#6B5D4F'

  return (
    <div style={{ fontFamily: "var(--font-sans)", backgroundColor: 'var(--color-cream)', color: 'var(--color-ink)' }}>
      <Seo
        lang={currentLang}
        path={servicePath(currentLang, 'cuines')}
        title={t('cuines.meta_title')}
        description={t('cuines.meta_description')}
      />

      {/* HEADER - unificat blau FERLO */}
      <header style={{ position: 'sticky', top: 20, zIndex: 50, padding: '0 24px' }}>
        <div style={{ width: 'fit-content', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 100, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, height: 60, boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,0.3)' }}>
          <Link to={`/${currentLang}`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/logo.svg" alt="FERLO — Reformes i obra nova a Tordera" width={128} height={128} style={{ width: 34, height: 34, objectFit: 'contain' }} />
              <div className="logo-text">
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 15, color: '#0A0A0A', lineHeight: 1.1 }}>FERLO</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: 12, color: '#65615D', letterSpacing: '0.08em' }}>TORDERA</div>
              </div>
            </div>
          </Link>

          <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="hidden-mobile">
            {navLinks.map((link) => link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.label}
                onClick={() => { if (link.label === 'WhatsApp') trackWhatsApp('header') }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, padding: '4px 10px', borderRadius: 40, color: '#25D366', textDecoration: 'none', transition: 'color 0.2s, background 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1BA94F'; e.currentTarget.style.backgroundColor = 'rgba(37,211,102,0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#25D366'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {link.icon}
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{link.label}</span>
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                title={link.label}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, padding: '4px 10px', borderRadius: 40, color: '#65615D', textDecoration: 'none', transition: 'color 0.2s, background 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#0A0A0A'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#65615D'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {link.icon}
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Nav - amb desplegable de serveis (liquid glass) */}
          <MobileNav currentLang={currentLang} waHeader={waHeader} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to={`/${currentLang}#contacte`} style={{ padding: '8px 18px', backgroundColor: '#0A0A0A', color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }} className="hidden-mobile" onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#847261' }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0A0A0A' }}>
              {t('nav.pressupost_cta')}
            </Link>
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

      {/* HERO */}
      <section id="inici" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-start', marginTop: '-60px', paddingTop: '60px' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src={HERO_IMAGES[currentLang] || HERO_IMAGES.ca} alt={t('cuines.hero.image_alt')} fetchPriority="high" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(43,94,50,0.3) 0%, rgba(43,94,50,0.72) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ marginBottom: 4 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <select
                  value={currentLang}
                  onChange={(e) => changeLanguage(e.target.value)}
                  aria-label="Idioma / Language / Idioma / Langue"
                  style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontWeight: 700, textDecoration: 'underline', fontSize: 12, fontFamily: "var(--font-sans)", letterSpacing: '0.12em', textTransform: 'uppercase', outline: 'none', cursor: 'pointer', padding: 0, margin: 0, appearance: 'none', WebkitAppearance: 'none' }}
                >
                  {LANGS.map(l => (
                    <option key={l} value={l} style={{ color: 'var(--color-ink)', textTransform: 'uppercase' }}>{LANG_LABELS[l]}</option>
                  ))}
                </select>
                <span style={{ fontSize: 9, color: '#C8E6C9', fontWeight: 700, pointerEvents: 'none', lineHeight: 1 }}>▼</span>
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 28, fontSize: 12, fontWeight: 500, letterSpacing: '0.12em', color: '#C8E6C9', textTransform: 'uppercase' }}>
              <span style={{ width: 20, height: 1, backgroundColor: '#FFFFFF', display: 'inline-block' }} />
              {t('cuines.hero.badge')}
            </div>

            <h1 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 8, color: '#FFFFFF' }}>
              {t('cuines.hero.title')}
            </h1>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, fontStyle: 'italic', lineHeight: 1.15, marginBottom: 24, color: '#A5D6A7' }}>
              {t('cuines.hero.subtitle')}
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: '#E8F5E9', maxWidth: 460, marginBottom: 40 }}>
              {t('cuines.hero.description')}
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 48 }}>
              <a href="#contacte" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', backgroundColor: accent, color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accentDark)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = accent)}>
                {t('cuines.hero.cta')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
              </a>
              <a href="#serveis" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 24px', borderRadius: 40, border: '1px solid rgba(255,255,255,0.4)', color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 400, backgroundColor: 'transparent' }}>
                {t('cuines.hero.secondary_cta')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <CarouselBar items={carouselItems} />

      {/* SERVEIS - tabs interactives */}
      <section id="serveis" style={{ padding: '96px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="services-grid">
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: accent, textTransform: 'uppercase', marginBottom: 16 }}>{t('cuines.services.title')}</div>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.15, color: 'var(--color-ink)', letterSpacing: '-0.02em', marginBottom: 24 }} dangerouslySetInnerHTML={{ __html: t('cuines.services.heading') }} />
            <p style={{ fontSize: 16, color: 'var(--color-muted)', lineHeight: 1.7, maxWidth: 360, marginBottom: 40 }}>
              {t('cuines.services.subheading')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {services.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => setActiveService(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 18px',
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    background: activeService === i ? accent : '#FFFFFF',
                    color: activeService === i ? '#FFFFFF' : 'var(--color-ink)',
                    boxShadow: activeService === i ? '0 8px 24px rgba(58,125,68,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: activeService === i ? 600 : 500, letterSpacing: '0.01em' }}>{s.title}</span>
                  {activeService === i && <span style={{ marginLeft: 'auto', fontSize: 12 }}>→</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            {services.map((s, i) => (
              <div key={s.title} style={{ display: activeService === i ? 'block' : 'none' }}>
                <div style={{ borderRadius: 16, overflow: 'hidden', backgroundColor: 'var(--color-warm)', marginBottom: 24 }}>
                  <img src={s.img} alt={s.title} style={{ width: '100%', height: 340, objectFit: 'cover', display: 'block' }} />
                </div>
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 28, fontWeight: 700, color: 'var(--color-ink)', marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 16, color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: 24 }}>{s.description}</p>
                <Link to={`/${currentLang}/#contacte`} style={{
                  display: 'inline-block',
                  padding: '11px 26px',
                  borderRadius: 999,
                  background: accent,
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = accentDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = accent)}
                >
                  {t('cuines.hero.cta')} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .services-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .services-grid > div:first-child { position: static !important; }
        }
      `}</style>

      {/* FULL-WIDTH IMAGE BREAK */}
      <div style={{ height: 480, overflow: 'hidden', position: 'relative' }}>
        <img src={BREAK_IMAGES[currentLang] || BREAK_IMAGES.ca} alt={t('cuines.break_alt')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(43,94,50,0.45)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
          <div>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(22px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF', fontStyle: 'italic', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              "Un jardí ben cuidat és la millor presentació de casa."
            </p>
            <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>FERLO</p>
          </div>
        </div>
      </div>

      {/* PER QUÈ NOSALTRES */}
      <section style={{ padding: '96px 24px', backgroundColor: 'var(--color-warm)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="why-grid">
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: accent, textTransform: 'uppercase', marginBottom: 16 }}>{t('cuines.benefits.title')}</div>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(30px, 3.5vw, 48px)', fontWeight: 700, lineHeight: 1.1, color: 'var(--color-ink)', letterSpacing: '-0.02em', marginBottom: 32 }} dangerouslySetInnerHTML={{ __html: t('cuines.benefits.heading') }} />
              <p style={{ fontSize: 16, color: 'var(--color-muted)', lineHeight: 1.7, maxWidth: 420, marginBottom: 32 }}>{t('cuines.benefits.subheading')}</p>
              <img src={GALLERY_IMAGES[currentLang] || GALLERY_IMAGES.ca} alt={t('cuines.gallery_alt')} style={{ width: '100%', borderRadius: 14, objectFit: 'cover', height: 340 }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {benefits.map((r, i) => (
                <div key={r.title} style={{
                  padding: '28px 0',
                  borderBottom: i < benefits.length - 1 ? '1px solid rgba(58,125,68,0.12)' : 'none',
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr',
                  gap: 20,
                }}>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 700, color: accent, letterSpacing: '0.06em', paddingTop: 4 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 6, letterSpacing: '-0.01em' }}>{r.title}</h3>
                    <p style={{ fontSize: 15, color: 'var(--color-muted)', lineHeight: 1.65 }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .why-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
      `}</style>

      {/* CLAVES DEL PROYECTO */}
      <section style={{ padding: '96px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: accent, textTransform: 'uppercase', marginBottom: 16 }}>{t('cuines.seasons.title')}</div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em' }} dangerouslySetInnerHTML={{ __html: t('cuines.seasons.heading') }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="seasons-grid">
          {seasons.map((s, i) => {
            const isActive = i === activeSeason
            return (
              <button
                key={s.season}
                onClick={() => setActiveSeason(i)}
                style={{
                  padding: '32px 24px',
                  borderRadius: 14,
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  background: isActive ? accentDark : '#FFFFFF',
                  border: isActive ? 'none' : '1px solid rgba(58,125,68,0.15)',
                  boxShadow: isActive ? '0 10px 30px rgba(43,94,50,0.25)' : 'none',
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(58,125,68,0.06)'; e.currentTarget.style.borderColor = 'rgba(58,125,68,0.35)'; } }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.borderColor = 'rgba(58,125,68,0.15)'; } }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 24, lineHeight: 1 }}>{isActive ? SEASON_EMOJIS[i] : '🌱'}</span>
                  <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, fontStyle: 'italic', color: isActive ? '#FFFFFF' : accent, margin: 0 }}>{s.season}</h3>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {s.tasks.map((task) => (
                    <li key={task} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: isActive ? 'rgba(255,255,255,0.85)' : 'var(--color-muted)', lineHeight: 1.4 }}>
                      <span style={{ color: isActive ? '#A5D6A7' : accent, marginTop: 1, flexShrink: 0 }}>—</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .seasons-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .seasons-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* TESTIMONIS */}
      <section style={{ padding: '96px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: accent, textTransform: 'uppercase', marginBottom: 16 }}>{t('cuines.testimonials.title')}</div>
            <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: '-0.02em' }} dangerouslySetInnerHTML={{ __html: t('cuines.testimonials.heading') }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="testimonials-grid">
            {testimonials.map((item) => (
              <div key={item.name} style={{ padding: '28px 28px 32px', borderRadius: 14, border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={accent}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  ))}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--color-ink)', margin: '0 0 20px', fontStyle: 'italic' }}>"{item.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{item.name[0]}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{item.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .testimonials-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) { .testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 600px) { .testimonials-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* CTA */}
      <section id="contacte" style={{ backgroundColor: 'var(--color-cream)', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 28, padding: '72px 32px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: accent, textTransform: 'uppercase', marginBottom: 16 }}>{t('cuines.cta.title')}</div>
          <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.2, margin: '0 auto 20px', maxWidth: 760 }}>
            {t('cuines.cta.text')}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href={waFooter} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={() => trackWhatsApp('cta_final')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 40, backgroundColor: '#25D366', color: '#FFFFFF', textDecoration: 'none', fontWeight: 600, boxShadow: '0 10px 24px rgba(37, 211, 102, 0.25)' }}>
              {t('cuines.cta.button')}
            </a>
            <Link to={`/${currentLang}/#contacte`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 40, border: '1px solid var(--color-border)', backgroundColor: '#FFFFFF', color: 'var(--color-ink)', textDecoration: 'none', fontWeight: 600 }}>
              {t('cuines.cta.secondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER - unificat */}
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
              <p style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.7, maxWidth: 280 }}>{t('footer.description')}</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <a href={waFooter} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={() => trackWhatsApp('footer')} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', fontSize: 14, textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </a>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.serveis_title')}</div>
              {[
                { label: t('serveis.items.0.title'), href: servicePath(currentLang, 'reformes') },
                { label: t('serveis.items.1.title'), href: servicePath(currentLang, 'cuines') },
                { label: t('serveis.items.2.title'), href: servicePath(currentLang, 'banys') },
                { label: t('serveis.items.3.title'), href: servicePath(currentLang, 'obraNova') },
              ].map((service) => (
                <Link key={service.label} to={service.href} style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}>{service.label}</Link>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.empresa_title')}</div>
              <Link to={`/${currentLang}`} style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}>{t('footer.inici')}</Link>
              <Link to={`/${currentLang}/#sobre`} style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}>{t('nav.sobre')}</Link>
              <Link to={`/${currentLang}/#contacte`} style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}>{t('nav.contacte')}</Link>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.contacte_title')}</div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.8 }}>
                <div>💬 <a href={waFooter} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={() => trackWhatsApp('footer')} style={{ color: '#25D366', textDecoration: 'none', fontWeight: 500 }}>692 586 863</a></div>
                <div>✉️ <a href="mailto:info@ferlo.es" style={{ color: accent, textDecoration: 'none', fontWeight: 500 }}>info@ferlo.es</a></div>
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