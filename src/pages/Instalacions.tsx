import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MobileNav from '../components/MobileNav'
import Seo from '../components/Seo'
import { trackWhatsAppClick } from '../lib/tracking'
import {
  DEFAULT_LANG,
  LANG_LABELS,
  LANGS,
  isLang,
  normalizeLang,
  privacyPath,
  servicePath,
} from '../lib/lang'

const HERO_IMG = 'https://images.unsplash.com/photo-1738130892621-ea936f363089?w=1600&h=900&fit=crop&auto=format'

function CarouselBar({ items, dark = false }: { items: string[]; dark?: boolean }) {
  const all = [...items, ...items, ...items]
  const text = all.join(' &nbsp;&nbsp;&nbsp;&mdash;&nbsp;&nbsp;&nbsp; ')

  return (
    <div style={{
      borderTop: dark ? 'none' : '1px solid #E5E5E5',
      borderBottom: dark ? 'none' : '1px solid #E5E5E5',
      backgroundColor: dark ? '#00326B' : '#F5F5F5',
      padding: '20px 0',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'scrollCarousel 12s linear infinite' }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: dark ? '#FFFFFF' : '#1A1714', letterSpacing: '0.12em', paddingRight: 0 }} dangerouslySetInnerHTML={{ __html: text }} />
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

export default function Instalacions() {
  const { t, i18n } = useTranslation()
  const { lang: langParam } = useParams<{ lang?: string }>()
  const navigate = useNavigate()

  const urlLang = isLang(langParam) ? langParam : null
  const currentLang = urlLang ?? normalizeLang(i18n.language)

  useEffect(() => {
    if (isLang(langParam)) {
      if (i18n.language !== langParam) {
        i18n.changeLanguage(langParam)
      }
      localStorage.setItem('i18nextLng', langParam)
    } else {
      navigate(servicePath(DEFAULT_LANG, 'instalacions'), { replace: true })
    }
  }, [langParam, navigate, i18n])

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value)
    localStorage.setItem('i18nextLng', value)
    navigate(servicePath(normalizeLang(value), 'instalacions'), { replace: false })
  }

  const whatsappBase = 'https://wa.me/34677218303'
  const waHeader = `${whatsappBase}?utm_source=web&utm_medium=whatsapp&utm_campaign=instalacions&utm_content=${currentLang}`
  const waFooter = `${whatsappBase}?utm_source=web&utm_medium=whatsapp&utm_campaign=instalacions&utm_content=${currentLang}`

  const trackWhatsApp = (label: string) => trackWhatsAppClick(label)

  const navLinks = [
    { label: t('nav.serveis'), href: `/${currentLang}/#serveis`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { label: t('nav.sobre'), href: `/${currentLang}/#sobre`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg> },
    { label: t('nav.piscines'), href: servicePath(currentLang, 'piscines'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18c2-3 4-4.5 7-4.5S14 15 16.5 18" /><path d="M4 9.5C5.5 8 7.5 7 9.5 7s3.5 1 5 2.5" /><path d="M13 3.5c1.6 1.2 2.8 3 3.5 5" /><path d="M8 5.5c-1.2 1.3-2 3.2-2.2 5.1" /></svg> },
    { label: t('serveis.items.2.title'), href: servicePath(currentLang, 'jardineria'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> },
    { label: t('serveis.items.0.title'), href: servicePath(currentLang, 'manteniment'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
    { label: t('serveis.items.3.title'), href: servicePath(currentLang, 'instalacions'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg> },
    { label: 'WhatsApp', href: waHeader, external: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
  ]

  const services = t('instalacions.services.items', { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>
  const includes = t('instalacions.includes.items', { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>
  const projects = t('instalacions.projects.items', { returnObjects: true }) as Array<{ title: string; desc: string; img: string }>
  const whyItems = t('instalacions.why.items', { returnObjects: true }) as Array<{ title: string; desc: string }>
  const testimonials = t('instalacions.testimonials.items', { returnObjects: true }) as Array<{ text: string; name: string; location: string }>
  const carouselItems = t('instalacions.carousel', { returnObjects: true }) as string[]

  const lizanaBlue = '#00326B'
  const lizanaDark = '#00245A'
  const muted = '#5C5348'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", backgroundColor: '#F5F5F5', color: '#1A1714' }}>
      <Seo
        lang={currentLang}
        path={servicePath(currentLang, 'instalacions')}
        title={t('instalacions.meta_title')}
        description={t('instalacions.meta_description')}
      />

      {/* HEADER - unificat */}
      <header style={{ position: 'sticky', top: 20, zIndex: 50, padding: '0 24px' }}>
        <div style={{ width: 'fit-content', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 100, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, height: 60, boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,0.3)' }}>
          <Link to={`/${currentLang}`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/logo-lizana.webp" alt="Manteniments Lizana - Reparacions a Girona" width={128} height={128} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
              <div className="logo-text">
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: '#1A1714', lineHeight: 1.1 }}>Manteniments</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 12, color: '#5C5348', letterSpacing: '0.08em' }}>LIZANA</div>
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
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, padding: '4px 10px', borderRadius: 40, color: '#5C5348', textDecoration: 'none', transition: 'color 0.2s, background 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1A1714'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#5C5348'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {link.icon}
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Nav - amb desplegable de serveis */}
          <MobileNav currentLang={currentLang} waHeader={waHeader} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to={`/${currentLang}#contacte`} style={{ padding: '8px 18px', backgroundColor: lizanaBlue, color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }} className="hidden-mobile">
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
      <section id="inici" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', marginTop: '-60px', background: '#0D1F35' }}>
        <img
          src={HERO_IMG}
          alt={t('instalacions.hero.image_alt')}
          fetchPriority="high"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,50,107,0.88) 0%, rgba(0,50,107,0.3) 50%, transparent 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '144px 24px 96px', width: '100%' }}>
          <div style={{ maxWidth: 700 }}>
            {/* Language selector */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <select
                  value={currentLang}
                  onChange={(e) => changeLanguage(e.target.value)}
                  aria-label="Idioma / Language / Idioma / Langue"
                  style={{ background: 'transparent', border: 'none', color: '#B0C4DE', fontWeight: 700, textDecoration: 'underline', fontSize: 12, fontFamily: "'DM Sans', system-ui, sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase', outline: 'none', cursor: 'pointer', padding: 0, margin: 0, appearance: 'none', WebkitAppearance: 'none' }}
                >
                  {LANGS.map(l => (
                    <option key={l} value={l} style={{ color: '#1A1714', textTransform: 'uppercase' }}>{LANG_LABELS[l]}</option>
                  ))}
                </select>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 700, pointerEvents: 'none', lineHeight: 1 }}>▼</span>
              </div>
            </div>

            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 40, padding: '6px 16px', marginBottom: 24, fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#FFFFFF', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60D394', display: 'inline-block' }} />
              {t('instalacions.hero.badge')}
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, marginBottom: 24 }}>
              {t('instalacions.hero.title')}{' '}
              <em style={{ fontStyle: 'italic' }}>{t('instalacions.hero.subtitle')}</em>
            </h1>

            {/* Description */}
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.82)', maxWidth: 540, marginBottom: 40 }}>
              {t('instalacions.hero.description')}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#contacte" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', backgroundColor: lizanaBlue, color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,50,107,0.5)', transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = lizanaDark)}
                onMouseLeave={(e) => (e.currentTarget.style.background = lizanaBlue)}>
                {t('instalacions.hero.cta')}
              </a>
              <a href="#serveis" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 40, border: '1.5px solid rgba(255,255,255,0.6)', color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                {t('instalacions.hero.secondary_cta')}
              </a>
            </div>

            {/* Floating badge */}
            <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 1, background: '#FFFFFF', borderRadius: 16, padding: '16px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', textAlign: 'center', display: 'none' }} className="hero-badge">
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: lizanaBlue, marginBottom: 2, textTransform: 'uppercase' }}>{t('instalacions.hero.badge_title')}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#1A1714' }}>{t('instalacions.hero.badge_sub')}</div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-badge { display: none !important; }
        }
      `}</style>

      {/* TRUST MARQUEE - blau */}
      <CarouselBar items={carouselItems} dark />

      {/* SERVEIS */}
      <section id="serveis" style={{ padding: '96px 24px', background: '#F5F5F5', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56, maxWidth: 640 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: lizanaBlue, textTransform: 'uppercase', marginBottom: 16 }}>{t('instalacions.services.title')}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.15, color: '#1A1714', marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: t('instalacions.services.heading') }} />
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.7 }}>{t('instalacions.services.subheading')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="inst-services-grid">
          {services.map((s) => (
            <div key={s.title} style={{ borderRadius: 16, padding: '28px', display: 'flex', flexDirection: 'column', gap: 16, background: '#FFFFFF', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', transition: 'box-shadow 0.3s, transform 0.3s', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,50,107,0.14)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: '#1A1714', lineHeight: 1.2, margin: 0 }}>{s.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: muted, margin: 0, flex: 1 }}>{s.desc}</p>
              <a href="#contacte" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: lizanaBlue, textDecoration: 'none' }}>
                {t('instalacions.services.link')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .inst-services-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 900px) { .inst-services-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .inst-services-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* QUÈ INCLOU */}
      <section style={{ padding: '96px 24px', background: '#FFFFFF', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: lizanaBlue, textTransform: 'uppercase', marginBottom: 16 }}>{t('instalacions.includes.title')}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.15, color: '#1A1714', marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: t('instalacions.includes.heading') }} />
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>{t('instalacions.includes.subheading')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="inst-includes-grid">
          {includes.map((item, i) => (
            <div key={item.title} style={{ borderRadius: 16, padding: '28px 24px', background: '#F5F5F5', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: lizanaBlue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                {item.icon}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: lizanaBlue, textTransform: 'uppercase' }}>
                {t('instalacions.includes.pas')} {String(i + 1).padStart(2, '0')}
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: '#1A1714', lineHeight: 1.25, margin: 0 }}>{item.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: muted, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .inst-includes-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 900px) { .inst-includes-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .inst-includes-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* TIPUS DE PROJECTES */}
      <section style={{ padding: '96px 24px', background: '#F5F5F5', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: lizanaBlue, textTransform: 'uppercase', marginBottom: 16 }}>{t('instalacions.projects.title')}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.15, color: '#1A1714', marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: t('instalacions.projects.heading') }} />
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.7, maxWidth: 480 }}>{t('instalacions.projects.subheading')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="inst-projects-grid">
          {projects.map((p) => (
            <div key={p.title} style={{ borderRadius: 16, overflow: 'hidden', background: '#FFFFFF', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', transition: 'box-shadow 0.3s, transform 0.3s' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,50,107,0.14)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ position: 'relative', height: 200, backgroundColor: '#00326B' }}>
                <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,50,107,0.5) 0%, transparent 60%)' }} />
              </div>
              <div style={{ padding: '24px 24px 28px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: '#1A1714', lineHeight: 1.2, margin: '0 0 10px' }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: muted, margin: 0 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .inst-projects-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) { .inst-projects-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .inst-projects-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* PER QUÈ NOSALTRES */}
      <section id="sobre" style={{ padding: '96px 24px', background: '#FFFFFF', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }} className="inst-why-grid">
          {/* Left - sticky */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: lizanaBlue, textTransform: 'uppercase', marginBottom: 16 }}>{t('instalacions.why.title')}</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.15, color: '#1A1714', marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: t('instalacions.why.heading') }} />
            <p style={{ fontSize: 16, color: muted, lineHeight: 1.7, maxWidth: 440, marginBottom: 32 }}>{t('instalacions.why.subheading')}</p>
            <a href="#contacte" style={{ display: 'inline-block', padding: '14px 28px', backgroundColor: lizanaBlue, color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              {t('instalacions.why.cta')}
            </a>
          </div>

          {/* Right - items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {whyItems.map((w, i) => (
              <div key={w.title} style={{ display: 'flex', gap: 20, padding: '24px', borderRadius: 16, background: '#F5F5F5', border: '1px solid transparent', transition: 'background 0.2s, border-color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,50,107,0.15)'; e.currentTarget.style.background = '#EFF6FF' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#F5F5F5' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: lizanaBlue, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, color: '#1A1714', marginBottom: 8, lineHeight: 1.2 }}>{w.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: muted, margin: 0 }}>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .inst-why-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .inst-why-grid > div:first-child { position: static !important; }
        }
      `}</style>

      {/* TESTIMONIS */}
      <section style={{ padding: '96px 24px', background: '#F5F5F5', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: lizanaBlue, textTransform: 'uppercase', marginBottom: 16 }}>{t('instalacions.testimonials.title')}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: '#1A1714', letterSpacing: '-0.02em', margin: 0 }} dangerouslySetInnerHTML={{ __html: t('instalacions.testimonials.heading') }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="inst-testimonials-grid">
          {testimonials.map((item) => (
            <div key={item.name} style={{ padding: '32px', borderRadius: 16, background: '#FFFFFF', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 20, transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,50,107,0.12)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5].map(i => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ))}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: '#374151', margin: 0, flex: 1 }}>"{item.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8, borderTop: '1px solid #E5E5E5' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: lizanaBlue, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{item.name[0]}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1714' }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{item.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .inst-testimonials-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) { .inst-testimonials-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .inst-testimonials-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* CTA FINAL */}
      <section id="contacte" style={{ padding: '112px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: lizanaBlue }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 20 }}>{t('instalacions.cta.title')}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, margin: '0 auto 24px' }}>
            {t('instalacions.cta.text')}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', marginBottom: 40 }}>
            {t('instalacions.cta.description')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href={waFooter} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={() => trackWhatsApp('cta_final')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 40, backgroundColor: '#25D366', color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'background 0.2s', boxShadow: '0 10px 24px rgba(37, 211, 102, 0.25)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp: 677 218 303
            </a>
            <Link to={`/${currentLang}/#contacte`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 40, border: '1.5px solid rgba(255,255,255,0.6)', color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              {t('instalacions.cta.button')}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER - unificat */}
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
              <p style={{ fontSize: 13, color: '#5C5348', lineHeight: 1.7, maxWidth: 280, margin: 0 }}>{t('footer.description')}</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <a href="https://www.facebook.com/p/Manteniments-Lizana-61590819927805/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/manteniments_lizana" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="igGradInst" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#833AB4"/><stop offset="50%" stopColor="#FD1D1D"/><stop offset="100%" stopColor="#F77737"/></linearGradient></defs><path fill="url(#igGradInst)" d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
                <a href={waFooter} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={() => trackWhatsApp('footer')} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textDecoration: 'none' }}>
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
              ].map((service) => (
                <Link key={service.label} to={service.href} style={{ display: 'block', fontSize: 13, color: '#5C5348', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}>{service.label}</Link>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.empresa_title')}</div>
              <Link to={`/${currentLang}`} style={{ display: 'block', fontSize: 13, color: '#5C5348', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}>{t('footer.inici')}</Link>
              <Link to={`/${currentLang}/#sobre`} style={{ display: 'block', fontSize: 13, color: '#5C5348', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}>{t('nav.sobre')}</Link>
              <Link to={`/${currentLang}/#contacte`} style={{ display: 'block', fontSize: 13, color: '#5C5348', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}>{t('nav.contacte')}</Link>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.contacte_title')}</div>
              <div style={{ fontSize: 13, color: '#5C5348', lineHeight: 1.8 }}>
                <div>💬 <a href={waFooter} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={() => trackWhatsApp('footer')} style={{ color: '#25D366', textDecoration: 'none', fontWeight: 500 }}>677 218 303</a></div>
                <div>✉️ <a href="mailto:mantenimentlizana@gmail.com" style={{ color: lizanaBlue, textDecoration: 'none', fontWeight: 500 }}>mantenimentlizana@gmail.com</a></div>
                <div style={{ marginTop: 8 }}>{t('footer.zona')}</div>
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