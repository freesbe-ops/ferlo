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
  cookiesPath,
  isLang,
  legalPath,
  normalizeLang,
  privacyPath,
  servicePath,
} from '../lib/lang'

const HERO_IMG = '/hero.webp'

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

export default function Banys() {
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
      navigate(servicePath(DEFAULT_LANG, 'banys'), { replace: true })
    }
  }, [langParam, navigate, i18n])

  const changeLanguage = (value: string) => {
    i18n.changeLanguage(value)
    localStorage.setItem('i18nextLng', value)
    navigate(servicePath(normalizeLang(value), 'banys'), { replace: false })
  }

  const whatsappBase = 'https://wa.me/34692586863'
  const waHeader = `${whatsappBase}?utm_source=web&utm_medium=whatsapp&utm_campaign=banys&utm_content=${currentLang}`
  const waFooter = `${whatsappBase}?utm_source=web&utm_medium=whatsapp&utm_campaign=banys&utm_content=${currentLang}`

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

  const services = t('banys.services.items', { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>
  const whyItems = t('banys.why.items', { returnObjects: true }) as Array<{ title: string; desc: string }>
  const testimonials = t('banys.testimonials.items', { returnObjects: true }) as Array<{ text: string; name: string; location: string }>
  const carouselItems = t('banys.carousel', { returnObjects: true }) as string[]

  const brandBlue = '#00326B'
  const brandDark = '#00245A'
  const muted = '#5C5348'

  const beforeAfterPresent = false // Abans i Després s'ha mogut a Reformes

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", backgroundColor: '#F5F5F5', color: '#1A1714' }}>
      <Seo
        lang={currentLang}
        path={servicePath(currentLang, 'banys')}
        title={t('banys.meta_title')}
        description={t('banys.meta_description')}
      />

      {/* HEADER - unificat */}
      <header style={{ position: 'sticky', top: 20, zIndex: 50, padding: '0 24px' }}>
        <div style={{ width: 'fit-content', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 100, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, height: 60, boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)', border: '1px solid rgba(255,255,255,0.3)' }}>
          <Link to={`/${currentLang}`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/logo.webp" alt="FERLO - Reformes i obra nova" width={128} height={128} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
              <div className="logo-text">
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: '#1A1714', lineHeight: 1.1 }}>FERLO</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 12, color: '#5C5348', letterSpacing: '0.08em' }}>TORDERA</div>
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
            <Link to={`/${currentLang}#contacte`} style={{ padding: '8px 18px', backgroundColor: brandBlue, color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }} className="hidden-mobile">
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

      {/* HERO - Figma design adaptat */}
      <section id="inici" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', marginTop: '-60px', background: '#0D1F35' }}>
        <img
          src={HERO_IMG}
          alt={t('banys.hero.image_alt')}
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
              {t('banys.hero.badge')}
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, marginBottom: 24 }}>
              {t('banys.hero.title')}{' '}
              <em style={{ fontStyle: 'italic' }}>{t('banys.hero.subtitle')}</em>
            </h1>

            {/* Description */}
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.82)', maxWidth: 540, marginBottom: 40 }}>
              {t('banys.hero.description')}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#contacte" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', backgroundColor: brandBlue, color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,50,107,0.5)', transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = brandDark)}
                onMouseLeave={(e) => (e.currentTarget.style.background = brandBlue)}>
                {t('banys.hero.cta')}
              </a>
              <a href="#serveis" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 40, border: '1.5px solid rgba(255,255,255,0.6)', color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'background 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                {t('banys.hero.secondary_cta')}
              </a>
            </div>

            {/* Floating badge */}
            <div style={{ position: 'absolute', bottom: 24, right: 24, zIndex: 1, background: '#FFFFFF', borderRadius: 16, padding: '16px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', textAlign: 'center', display: 'none' }} className="hero-badge">
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: brandBlue, marginBottom: 2, textTransform: 'uppercase' }}>{t('banys.hero.badge_title')}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#1A1714' }}>{t('banys.hero.badge_sub')}</div>
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
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: brandBlue, textTransform: 'uppercase', marginBottom: 16 }}>{t('banys.services.title')}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, lineHeight: 1.15, color: '#1A1714', marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: t('banys.services.heading') }} />
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.7 }}>{t('banys.services.subheading')}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="mant-services-grid">
          {services.map((s) => (
            <div key={s.title} style={{ borderRadius: 16, padding: '28px', display: 'flex', flexDirection: 'column', gap: 16, background: '#FFFFFF', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', transition: 'box-shadow 0.3s, transform 0.3s', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,50,107,0.14)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: '#1A1714', lineHeight: 1.2, margin: 0 }}>{s.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: muted, margin: 0, flex: 1 }}>{s.desc}</p>
              <a href="#contacte" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: brandBlue, textDecoration: 'none' }}>
                {t('banys.services.link')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .mant-services-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 900px) { .mant-services-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 560px) { .mant-services-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ABANS I DESPRÉS - s'ha mogut a la pàgina de Reformes */}
      {beforeAfterPresent && null}

      {/* PER QUÈ NOSALTRES */}
      <section id="sobre" style={{ padding: '96px 24px', background: '#FFFFFF', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }} className="mant-why-grid">
          {/* Left - sticky */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: brandBlue, textTransform: 'uppercase', marginBottom: 16 }}>{t('banys.why.title')}</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px, 3.5vw, 44px)', fontWeight: 700, lineHeight: 1.15, color: '#1A1714', marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: t('banys.why.heading') }} />
            <p style={{ fontSize: 16, color: muted, lineHeight: 1.7, maxWidth: 440, marginBottom: 32 }}>{t('banys.why.subheading')}</p>
            <a href="#contacte" style={{ display: 'inline-block', padding: '14px 28px', backgroundColor: brandBlue, color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              {t('banys.why.cta')}
            </a>
          </div>

          {/* Right - items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {whyItems.map((w, i) => (
              <div key={w.title} style={{ display: 'flex', gap: 20, padding: '24px', borderRadius: 16, background: '#F5F5F5', border: '1px solid transparent', transition: 'background 0.2s, border-color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,50,107,0.15)'; e.currentTarget.style.background = '#EFF6FF' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#F5F5F5' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: brandBlue, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
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
          .mant-why-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .mant-why-grid > div:first-child { position: static !important; }
        }
      `}</style>

      {/* TESTIMONIS */}
      <section style={{ padding: '96px 24px', background: '#F5F5F5', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: brandBlue, textTransform: 'uppercase', marginBottom: 16 }}>{t('banys.testimonials.title')}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, color: '#1A1714', letterSpacing: '-0.02em', margin: 0 }} dangerouslySetInnerHTML={{ __html: t('banys.testimonials.heading') }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="mant-testimonials-grid">
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
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: brandBlue, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{item.name[0]}</div>
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
        .mant-testimonials-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 900px) { .mant-testimonials-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .mant-testimonials-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* CTA FINAL */}
      <section id="contacte" style={{ padding: '112px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: brandBlue }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 20 }}>{t('banys.cta.title')}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, margin: '0 auto 24px' }}>
            {t('banys.cta.text')}
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', marginBottom: 40 }}>
            {t('banys.cta.description')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <a href={waFooter} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={() => trackWhatsApp('cta_final')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 40, backgroundColor: '#25D366', color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'background 0.2s', boxShadow: '0 10px 24px rgba(37, 211, 102, 0.25)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp: 692 586 863
            </a>
            <Link to={`/${currentLang}/#contacte`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 40, border: '1.5px solid rgba(255,255,255,0.6)', color: '#FFFFFF', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              {t('banys.cta.button')}
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
                <img src="/logo.webp" alt="FERLO - Reformes i obra nova" width={128} height={128} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, color: '#1A1714', lineHeight: 1.1 }}>FERLO</div>
                  <div style={{ fontSize: 11, color: '#5C5348', letterSpacing: '0.08em' }}>{t('footer.tagline')}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#5C5348', lineHeight: 1.7, maxWidth: 280, margin: 0 }}>{t('footer.description')}</p>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <a href={waFooter} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={() => trackWhatsApp('footer')} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textDecoration: 'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#5C5348', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.serveis_title')}</div>
              {[
                { label: t('serveis.items.0.title'), href: servicePath(currentLang, 'reformes') },
                { label: t('serveis.items.1.title'), href: servicePath(currentLang, 'cuines') },
                { label: t('serveis.items.2.title'), href: servicePath(currentLang, 'banys') },
                { label: t('serveis.items.3.title'), href: servicePath(currentLang, 'obraNova') },
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
                <div>💬 <a href={waFooter} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" onClick={() => trackWhatsApp('footer')} style={{ color: '#25D366', textDecoration: 'none', fontWeight: 500 }}>692 586 863</a></div>
                <div>✉️ <a href="mailto:info@ferlo.es" style={{ color: brandBlue, textDecoration: 'none', fontWeight: 500 }}>info@ferlo.es</a></div>
                <div style={{ marginTop: 8 }}>{t('footer.zona')}</div>
                <div style={{ fontSize: 12, color: '#6B6258', marginTop: 4 }}>{t('footer.horari')}</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <a href="https://www.sprintops.es" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#6B6258', textDecoration: 'none' }}>{t('footer.legal')}</a>
            <div style={{ display: 'flex', gap: 24 }}>
              <Link to={legalPath(currentLang)} style={{ fontSize: 12, color: '#6B6258', textDecoration: 'none' }}>{t('footer.avis_legal')}</Link>
              <Link to={privacyPath(currentLang)} style={{ fontSize: 12, color: '#6B6258', textDecoration: 'none' }}>{t('footer.politica_privacitat')}</Link>
              <Link to={cookiesPath(currentLang)} style={{ fontSize: 12, color: '#6B6258', textDecoration: 'none' }}>{t('footer.cookies')}</Link>
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