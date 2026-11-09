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

const WHATSAPP_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'

const SERVICE_ICONS = [
  <svg key="disseny" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>,
  <svg key="instal" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>,
  <svg key="encimeres" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 2.5 7.5 12 12l9.5-4.5L12 3z" /><path d="M2.5 12 12 16.5 21.5 12" /><path d="M2.5 16.5 12 21l9.5-4.5" />
  </svg>,
  <svg key="muntatge" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l1-8z" />
  </svg>,
]

const WHY_US_ICONS = [
  <svg key="espai" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3H3v6" /><path d="M15 3h6v6" /><path d="M21 15v6h-6" /><path d="M3 15v6h6" /><path d="M8 12h8" />
  </svg>,
  <svg key="installs" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13l1-8z" />
  </svg>,
  <svg key="materials" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 5 6v5c0 4.8 2.8 8.2 7 10 4.2-1.8 7-5.2 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" />
  </svg>,
  <svg key="net" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4" /><path d="m18.4 5.6-2.8 2.8" /><path d="M22 12h-4" /><path d="m18.4 18.4-2.8-2.8" /><path d="M12 22v-4" /><path d="m5.6 18.4 2.8-2.8" /><path d="M2 12h4" /><path d="m5.6 5.6 2.8 2.8" />
  </svg>,
]

const SERVICE_IMAGES = [
  '/despues.webp',
  '/hero.webp',
  '/despues.webp',
  '/antes.webp',
]

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

function SeasonsSection({ items }: { items: Array<{ season: string; tasks: string[] }> }) {
  const { t } = useTranslation()

  return (
    <section className="landing-seasons-section">
      <div className="landing-container">
        <div className="landing-head landing-head--2col">
          <span className="landing-eyebrow">{t('cuines.seasons.title')}</span>
          <h2 className="landing-title" dangerouslySetInnerHTML={{ __html: t('cuines.seasons.heading') }} />
        </div>

        <div className="landing-seasons-grid">
          {items.map((item, index) => (
            <article key={item.season} className="landing-season">
              <span className="landing-season-num">{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.season}</h3>
              <ul>
                {item.tasks.map((task) => (
                  <li key={task}>
                    <span className="landing-season-check" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                    </span>
                    {task}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Cuines() {
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
    { label: t('nav.serveis'), href: '#serveis', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
    { label: t('nav.sobre'), href: `/${currentLang}/#sobre`, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg> },
    { label: t('serveis.items.0.title'), href: servicePath(currentLang, 'reformes'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
    { label: t('serveis.items.1.title'), href: servicePath(currentLang, 'cuines'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="9" rx="2"/><path d="M1.5 13.5h1.5M21 13.5h1.5"/><path d="M8 6.5c0-.9.7-1.3.7-2.2M12 6.5c0-.9.7-1.3.7-2.2M16 6.5c0-.9.7-1.3.7-2.2"/></svg> },
    { label: t('serveis.items.2.title'), href: servicePath(currentLang, 'banys'), icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.7l5.4 5.4a7.64 7.64 0 1 1-10.8 0z"/><path d="M9 13a3 3 0 0 0 3 3"/></svg> },
    { label: 'WhatsApp', href: waHeader, external: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" stroke="none"><path d={WHATSAPP_PATH}/></svg> },
  ]

  const services = t('cuines.services.items', { returnObjects: true }) as Array<{ title: string; description: string }>
  const benefits = t('cuines.benefits.items', { returnObjects: true }) as Array<{ title: string; description: string }>
  const testimonials = t('cuines.testimonials.items', { returnObjects: true }) as Array<{ name: string; location: string; text: string }>
  const carouselItems = t('cuines.carousel', { returnObjects: true }) as string[]
  const seasons = t('cuines.seasons.items', { returnObjects: true }) as Array<{ season: string; tasks: string[] }>

  return (
    <div style={{ fontFamily: "var(--font-sans)", backgroundColor: 'var(--color-cream)', color: 'var(--color-ink)' }}>
      <Seo
        lang={currentLang}
        path={servicePath(currentLang, 'cuines')}
        title={t('cuines.meta_title')}
        description={t('cuines.meta_description')}
      />

      <header style={{ position: 'sticky', top: 20, zIndex: 50, padding: '0 24px' }}>
        <div style={{ width: 'fit-content', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: 100, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, height: 60, boxShadow: '0 4px 24px rgba(10,10,10,0.06), 0 1px 4px rgba(10,10,10,0.04)', border: '1px solid rgba(255,255,255,0.3)' }}>
          <Link to={`/${currentLang}`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/logo.svg" alt="FERLO — Reformes i obra nova a Tordera" width={128} height={128} style={{ width: 34, height: 34, objectFit: 'contain' }} />
              <div className="logo-text">
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--color-ink)', lineHeight: 1.1 }}>FERLO</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, fontSize: 12, color: 'var(--color-muted)', letterSpacing: '0.08em' }}>TORDERA</div>
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
            ) : link.href.startsWith('/') ? (
              <Link
                key={link.label}
                to={link.href}
                title={link.label}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, padding: '4px 10px', borderRadius: 40, color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 0.2s, background 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-ink)'; e.currentTarget.style.backgroundColor = 'rgba(10,10,10,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {link.icon}
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{link.label}</span>
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                title={link.label}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, padding: '4px 10px', borderRadius: 40, color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 0.2s, background 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-ink)'; e.currentTarget.style.backgroundColor = 'rgba(10,10,10,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {link.icon}
                <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Mobile Nav - amb desplegable de serveis (liquid glass) */}
          <MobileNav currentLang={currentLang} waHeader={waHeader} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to={`/${currentLang}#contacte`} style={{ padding: '8px 18px', backgroundColor: 'var(--color-ink)', color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }} className="hidden-mobile"
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-ink)' }}
            >
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

      {/* HERO — Split (C.1) */}
      <section id="inici" className="landing-hero">
        <div className="landing-hero-outer">
          <div className="landing-hero-grid">
            <div className="landing-hero-copy">
              <div className="landing-lang">
                <select
                  value={currentLang}
                  onChange={(e) => changeLanguage(e.target.value)}
                  aria-label="Idioma / Language / Idioma / Langue"
                  className="landing-lang-select"
                >
                  {LANGS.map((l) => (
                    <option key={l} value={l} style={{ color: 'var(--color-ink)', textTransform: 'uppercase' }}>{LANG_LABELS[l]}</option>
                  ))}
                </select>
                <span className="landing-lang-caret" aria-hidden="true">▼</span>
              </div>

              <span className="landing-hero-eyebrow">{t('cuines.hero.badge')}</span>

              <h1 className="landing-hero-title">
                {t('cuines.hero.title')}{' '}
                <em>{t('cuines.hero.subtitle')}</em>
              </h1>

              <p className="landing-hero-lead">{t('cuines.hero.description')}</p>

              <div className="landing-hero-actions">
                <a href="#contacte" className="landing-btn landing-btn--primary">
                  {t('cuines.hero.cta')}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M14 7l5 5-5 5" />
                  </svg>
                </a>
                <a href="#serveis" className="landing-btn landing-btn--ghost">
                  {t('cuines.hero.secondary_cta')}
                </a>
              </div>

              <div className="landing-hero-note">
                <span aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                </span>
                {t('cuines.hero.reviews')}
              </div>
            </div>

            <div className="landing-hero-visual">
              <img
                src="/hero.webp"
                alt={t('cuines.hero.image_alt')}
                fetchPriority="high"
                width={1200}
                height={800}
                decoding="async"
              />
              <div className="landing-hero-badge">
                <span aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3 5 6v5c0 4.8 2.8 8.2 7 10 4.2-1.8 7-5.2 7-10V6l-7-3Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                <div>
                  <small>{t('cuines.hero.badge_sub')}</small>
                  <strong>{t('cuines.hero.badge_title')}</strong>
                </div>
              </div>
              <div className="landing-hero-stamp">
                <strong>+10</strong>
                <span>{t('hero.stamp_label')}</span>
              </div>
              <a
                href={waHeader}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                onClick={() => trackWhatsApp('hero')}
                className="landing-hero-wa"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="#25D366" stroke="none" aria-hidden="true">
                  <path d={WHATSAPP_PATH} />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .landing-hero { padding: 104px 0 72px; }
        .landing-hero-outer { width: 100%; }
        .landing-hero-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 72px; align-items: center; width: min(1248px, calc(100% - 64px)); margin: 0 auto; }
        .landing-lang { display: inline-flex; align-items: center; gap: 4px; margin-bottom: 28px; }
        .landing-lang-select { background: transparent; border: none; color: var(--color-muted); font-weight: 700; text-decoration: underline; font-size: 12px; font-family: var(--font-sans); letter-spacing: 0.12em; text-transform: uppercase; outline: none; cursor: pointer; padding: 0; margin: 0; appearance: none; -webkit-appearance: none; }
        .landing-lang-caret { font-size: 9px; color: var(--color-muted); font-weight: 700; pointer-events: none; line-height: 1; }
        .landing-hero-eyebrow { display: block; color: var(--color-primary); font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 28px; }
        .landing-hero-title { font-family: 'Montserrat', sans-serif; font-size: clamp(40px, 5vw, 64px); font-weight: 700; line-height: 1.05; margin: 0; color: var(--color-ink); }
        .landing-hero-title em { font-style: italic; color: var(--color-primary-light); }
        .landing-hero-lead { max-width: 600px; margin: 28px 0 0; font-size: 19px; line-height: 1.7; color: var(--color-muted); }
        .landing-hero-actions { display: flex; gap: 12px; margin-top: 36px; flex-wrap: wrap; }
        .landing-hero-note { display: flex; align-items: center; gap: 9px; margin-top: 20px; color: var(--color-muted); font-size: 13px; }
        .landing-hero-note span { display: grid; place-items: center; width: 24px; height: 24px; color: #FFFFFF; background: var(--color-primary); border-radius: 50%; flex-shrink: 0; }
        .landing-hero-visual { position: relative; height: 650px; }
        .landing-hero-visual > img { width: 100%; height: 100%; object-fit: cover; border-radius: 180px 16px 16px 16px; filter: saturate(0.78) sepia(0.05); display: block; }
        .landing-hero-visual::after { content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: 180px 16px 16px 16px; background: linear-gradient(180deg, transparent 70%, rgba(10,10,10,0.14)); }
        .landing-hero-badge { position: absolute; z-index: 2; left: -38px; bottom: 48px; display: flex; gap: 13px; align-items: center; padding: 14px 20px 14px 14px; border-radius: 16px; background: rgba(247,244,241,0.82); border: 1px solid rgba(255,255,255,0.65); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: var(--shadow-md); }
        .landing-hero-badge > span { width: 44px; height: 44px; display: grid; place-items: center; color: #FFFFFF; background: var(--color-primary); border-radius: 50%; flex-shrink: 0; }
        .landing-hero-badge div { display: flex; flex-direction: column; }
        .landing-hero-badge small { color: var(--color-muted); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; }
        .landing-hero-badge strong { margin-top: 4px; font-size: 14px; color: var(--color-ink); }
        .landing-hero-stamp { position: absolute; z-index: 3; right: -25px; top: 42px; width: 120px; height: 120px; display: grid; place-content: center; text-align: center; color: #FFFFFF; border-radius: 50%; background: var(--color-primary); box-shadow: var(--shadow-md); transform: rotate(7deg); }
        .landing-hero-stamp strong { font-size: 29px; line-height: 1; }
        .landing-hero-stamp span { margin-top: 5px; font-size: 9px; line-height: 1.3; letter-spacing: 0.08em; text-transform: uppercase; max-width: 90px; }
        .landing-hero-wa { position: absolute; z-index: 4; right: 18px; bottom: 18px; width: 64px; height: 64px; display: grid; place-items: center; border-radius: 50%; background: var(--color-cream); border: 1px solid var(--color-border); box-shadow: var(--shadow-md); transition: transform 0.2s; }
        .landing-hero-wa:hover { transform: translateY(-2px); }
        .landing-btn { min-height: 52px; padding: 0 25px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; border-radius: 999px; font-size: 14px; font-weight: 600; text-decoration: none; transition: transform 0.2s, background 0.2s, border-color 0.2s, color 0.2s; }
        .landing-btn:hover { transform: translateY(-1px); }
        .landing-btn--primary { background: var(--color-ink); color: #FFFFFF; box-shadow: 0 8px 20px rgba(10,10,10,0.12); }
        .landing-btn--primary:hover { background: var(--color-primary-dark); }
        .landing-btn--ghost { border: 1px solid rgba(10,10,10,0.22); color: var(--color-ink); }
        .landing-btn--ghost:hover { border-color: var(--color-primary); color: var(--color-primary-dark); }
        .landing-btn--cream { background: var(--color-cream); color: var(--color-ink); }
        .landing-btn--cream:hover { background: #FFFFFF; }
        .landing-btn--wa { border: 1px solid rgba(255,255,255,0.28); color: var(--color-cream); }
        .landing-btn--wa:hover { border-color: rgba(255,255,255,0.6); }
        @media (max-width: 900px) {
          .landing-hero { padding: 96px 0 56px; }
          .landing-hero-grid { grid-template-columns: 1fr; gap: 44px; width: calc(100% - 40px); }
          .landing-hero-eyebrow { margin-bottom: 20px; }
          .landing-hero-lead { margin-top: 20px; font-size: 16px; }
          .landing-hero-actions { flex-direction: column; }
          .landing-hero-actions .landing-btn { width: 100%; }
          .landing-hero-note { justify-content: center; }
          .landing-hero-visual { width: 100%; height: 430px; }
          .landing-hero-visual > img, .landing-hero-visual::after { border-radius: 72px 14px 14px 14px; }
          .landing-hero-stamp { right: -6px; top: -25px; width: 96px; height: 96px; }
          .landing-hero-stamp strong { font-size: 24px; }
          .landing-hero-badge { left: 12px; right: 12px; bottom: 14px; }
          .landing-hero-wa { right: 12px; bottom: 92px; width: 54px; height: 54px; }
        }
      `}</style>

      <CarouselBar items={carouselItems} />

      {/* SERVEIS (C.2) */}
      <section id="serveis" className="landing-svc-section">
        <div className="landing-container">
          <div className="landing-head">
            <span className="landing-eyebrow">{t('cuines.services.title')}</span>
            <h2 className="landing-title" dangerouslySetInnerHTML={{ __html: t('cuines.services.heading') }} />
            <p className="landing-body">{t('cuines.services.subheading')}</p>
          </div>

          <div className="landing-svc-grid">
            {services.map((service, index) => (
              <article key={service.title} className="landing-svc-card">
                <div className="landing-svc-image">
                  <img src={SERVICE_IMAGES[index]} alt={`${service.title} — FERLO`} loading="lazy" decoding="async" width={600} height={400} />
                </div>
                <div className="landing-svc-content">
                  <span className="landing-svc-icon">{SERVICE_ICONS[index]}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .landing-container { width: min(1248px, calc(100% - 64px)); margin: 0 auto; }
        .landing-head { display: grid; grid-template-columns: 0.8fr 1.35fr 1fr; align-items: end; gap: 40px; margin-bottom: 56px; }
        .landing-eyebrow { display: block; align-self: start; padding-top: 10px; color: var(--color-primary-dark); font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
        .landing-title { margin: 0; font-family: 'Montserrat', sans-serif; font-size: clamp(34px, 3.3vw, 48px); font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; color: var(--color-ink); }
        .landing-title em { font-style: normal; color: var(--color-primary-light); }
        .landing-body { margin: 0; color: var(--color-muted); font-size: 16px; line-height: 1.65; }
        .landing-svc-section { padding: 120px 0; background: var(--color-cream); }
        .landing-svc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .landing-svc-card { display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--color-border); border-radius: 16px; background: #FFFFFF; color: inherit; text-decoration: none; transition: transform 0.3s, box-shadow 0.3s; }
        .landing-svc-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .landing-svc-image { position: relative; height: 350px; overflow: hidden; flex-shrink: 0; }
        .landing-svc-image img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.75) sepia(0.06); transition: transform 0.6s; display: block; }
        .landing-svc-card:hover .landing-svc-image img { transform: scale(1.025); }
        .landing-svc-content { position: relative; padding: 32px; display: flex; flex-direction: column; flex: 1; }
        .landing-svc-icon { position: absolute; right: 28px; top: -27px; width: 54px; height: 54px; display: grid; place-items: center; color: #FFFFFF; border-radius: 50%; background: var(--color-primary); }
        .landing-svc-content h3 { margin: 0; font-family: 'Montserrat', sans-serif; font-size: 24px; font-weight: 700; line-height: 1.2; letter-spacing: -0.025em; color: var(--color-ink); }
        .landing-svc-content p { max-width: 480px; min-height: 54px; margin: 12px 0 0; color: var(--color-muted); font-size: 15px; line-height: 1.6; flex: 1; }
        @media (max-width: 768px) {
          .landing-svc-section { padding: 64px 0; }
          .landing-container { width: calc(100% - 40px); }
          .landing-head { display: block; margin-bottom: 34px; }
          .landing-eyebrow { margin-bottom: 16px; padding: 0; }
          .landing-body { margin-top: 18px; }
          .landing-svc-grid { grid-template-columns: 1fr; }
          .landing-svc-image { height: 250px; }
          .landing-svc-content { padding: 26px 24px; }
          .landing-svc-content p { min-height: 0; }
        }
      `}</style>

      {/* CLAUS DEL PROJECTE */}
      <SeasonsSection items={seasons} />

      <style>{`
        .landing-seasons-section { padding: 120px 0; background: var(--color-warm); }
        .landing-head--2col { grid-template-columns: 0.8fr 1.35fr; margin-bottom: 48px; }
        .landing-seasons-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .landing-season { position: relative; padding: 30px 26px 32px; border: 1px solid var(--color-border); border-radius: 16px; background: #FFFFFF; transition: transform 0.3s, box-shadow 0.3s; }
        .landing-season:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .landing-season-num { position: absolute; top: 24px; right: 24px; color: var(--color-primary-light); font-size: 12px; font-weight: 600; letter-spacing: 0.06em; }
        .landing-season h3 { margin: 0; font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; line-height: 1.3; letter-spacing: -0.02em; color: var(--color-ink); }
        .landing-season ul { display: grid; gap: 10px; margin: 20px 0 0; padding: 0; list-style: none; }
        .landing-season li { display: flex; align-items: flex-start; gap: 10px; color: var(--color-muted); font-size: 14px; line-height: 1.55; }
        .landing-season-check { display: grid; place-items: center; flex-shrink: 0; width: 18px; height: 18px; margin-top: 1px; color: var(--color-primary-light); }
        @media (max-width: 900px) {
          .landing-seasons-section { padding: 96px 0; }
          .landing-seasons-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .landing-head--2col { margin-bottom: 34px; }
        }
        @media (max-width: 500px) {
          .landing-seasons-section { padding: 64px 0; }
          .landing-seasons-grid { grid-template-columns: 1fr; }
          .landing-season { padding: 26px 22px 28px; }
        }
      `}</style>

      {/* PER QUÈ NOSALTRES (C.4 ink) */}
      <section className="landing-benefits">
        <div className="landing-container">
          <div className="landing-head landing-head--ink">
            <span className="landing-eyebrow">{t('cuines.benefits.title')}</span>
            <h2 className="landing-title" dangerouslySetInnerHTML={{ __html: t('cuines.benefits.heading') }} />
            <p className="landing-body">{t('cuines.benefits.subheading')}</p>
          </div>

          <div className="landing-benefits-grid">
            {benefits.map((benefit, index) => (
              <article key={benefit.title} className="landing-benefit">
                <span className="landing-benefit-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="landing-benefit-icon">{WHY_US_ICONS[index]}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .landing-benefits { padding: 120px 0; background: var(--color-ink); color: var(--color-cream); }
        .landing-head--ink .landing-eyebrow { color: var(--color-primary-light); }
        .landing-head--ink .landing-title { color: var(--color-cream); }
        .landing-head--ink .landing-body { color: rgba(255,255,255,0.62); }
        .landing-benefits-grid { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid rgba(255,255,255,0.15); }
        .landing-benefit { position: relative; min-width: 0; min-height: 280px; padding: 40px 30px 12px 0; border-right: 1px solid rgba(255,255,255,0.15); }
        .landing-benefit:not(:first-child) { padding-left: 30px; }
        .landing-benefit:last-child { border-right: 0; }
        .landing-benefit-index { position: absolute; top: 24px; right: 24px; color: rgba(255,255,255,0.46); font-size: 12px; font-weight: 600; letter-spacing: 0.06em; }
        .landing-benefit-icon { display: grid; place-items: center; width: 54px; height: 54px; margin-bottom: 38px; color: #FFFFFF; border-radius: 50%; background: var(--color-primary); }
        .landing-benefit h3 { margin: 0; font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; line-height: 1.3; letter-spacing: -0.02em; color: var(--color-cream); }
        .landing-benefit p { margin: 12px 0 0; color: rgba(255,255,255,0.62); font-size: 14px; line-height: 1.65; }
        @media (max-width: 900px) {
          .landing-benefits { padding: 96px 0; }
          .landing-benefits-grid { grid-template-columns: repeat(2, 1fr); }
          .landing-benefit { min-height: 0; padding: 32px 24px 32px 0; border-bottom: 1px solid rgba(255,255,255,0.15); }
          .landing-benefit:nth-child(2n) { padding: 32px 0 32px 24px; border-right: 0; }
          .landing-benefit:nth-child(2n+1) { padding-left: 0; }
          .landing-benefit:nth-child(2n) .landing-benefit-index { right: 0; }
          .landing-benefit-icon { margin-bottom: 26px; }
        }
        @media (max-width: 500px) {
          .landing-benefits { padding: 64px 0; }
          .landing-benefits-grid { grid-template-columns: 1fr; }
          .landing-benefit,
          .landing-benefit:nth-child(2n),
          .landing-benefit:nth-child(2n+1) { padding: 30px 0; border-right: 0; }
          .landing-benefit:last-child { border-bottom: 0; }
          .landing-title { font-size: 30px; }
          .landing-benefit-icon { margin-bottom: 22px; }
        }
      `}</style>

      {/* TESTIMONIS */}
      <section className="landing-tst-section">
        <div className="landing-container">
          <div className="landing-tst-head">
            <span className="landing-eyebrow">{t('cuines.testimonials.title')}</span>
            <h2 className="landing-title" dangerouslySetInnerHTML={{ __html: t('cuines.testimonials.heading') }} />
          </div>

          <div className="landing-tst-grid">
            {testimonials.map((item) => (
              <article key={item.name} className="landing-tst-card">
                <div className="landing-tst-stars" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="landing-tst-text">"{item.text}"</p>
                <div className="landing-tst-author">
                  <span className="landing-tst-avatar" aria-hidden="true">{item.name[0]}</span>
                  <div>
                    <div className="landing-tst-name">{item.name}</div>
                    <div className="landing-tst-location">{item.location}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .landing-tst-section { padding: 112px 0; background: var(--color-cream); }
        .landing-tst-head { margin-bottom: 56px; }
        .landing-tst-head .landing-eyebrow { padding: 0; margin-bottom: 16px; }
        .landing-tst-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .landing-tst-card { display: flex; flex-direction: column; padding: 28px 28px 32px; border-radius: 14px; border: 1px solid var(--color-border); background: #FFFFFF; transition: transform 0.3s, box-shadow 0.3s; }
        .landing-tst-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .landing-tst-stars { display: flex; gap: 2px; margin-bottom: 16px; color: var(--color-primary); }
        .landing-tst-text { margin: 0 0 20px; font-size: 14px; line-height: 1.75; color: var(--color-ink); font-style: italic; flex: 1; }
        .landing-tst-author { display: flex; align-items: center; gap: 10px; }
        .landing-tst-avatar { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: var(--color-primary); color: #FFFFFF; font-size: 13px; font-weight: 600; flex-shrink: 0; }
        .landing-tst-name { font-size: 13px; font-weight: 600; color: var(--color-ink); }
        .landing-tst-location { font-size: 12px; color: var(--color-muted); }
        @media (max-width: 900px) {
          .landing-tst-section { padding: 96px 0; }
          .landing-tst-grid { grid-template-columns: 1fr; gap: 16px; }
          .landing-tst-head { margin-bottom: 34px; }
        }
        @media (max-width: 500px) {
          .landing-tst-section { padding: 64px 0; }
          .landing-tst-card { padding: 24px 22px 28px; }
        }
      `}</style>

      {/* CTA FINAL (C.6 split) */}
      <section id="contacte" className="landing-cta">
        <div className="landing-container">
          <div className="landing-cta-grid">
            <div>
              <span className="landing-eyebrow">{t('cuines.cta.title')}</span>
              <h2 className="landing-cta-title">{t('cuines.cta.text')}</h2>
            </div>

            <div className="landing-cta-actions">
              <Link to={`/${currentLang}#contacte`} className="landing-btn landing-btn--cream">
                {t('cuines.cta.button')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M14 7l5 5-5 5" />
                </svg>
              </Link>
              <a
                href={waFooter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('cuines_cta')}
                className="landing-btn landing-btn--wa"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                  <path d={WHATSAPP_PATH} />
                </svg>
                {t('contacte.whatsapp_label')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .landing-cta { padding: 112px 0; background: var(--color-ink); color: var(--color-cream); }
        .landing-cta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
        .landing-cta .landing-eyebrow { padding: 0; margin-bottom: 26px; color: var(--color-primary-light); }
        .landing-cta-title { margin: 0; font-family: 'Montserrat', sans-serif; font-size: clamp(34px, 3.3vw, 48px); font-weight: 700; line-height: 1.08; letter-spacing: -0.025em; color: var(--color-cream); }
        .landing-cta-title em { font-style: normal; color: var(--color-primary-light); }
        .landing-cta-actions { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
        @media (max-width: 900px) {
          .landing-cta { padding: 96px 0; }
          .landing-cta-grid { grid-template-columns: 1fr; gap: 36px; }
        }
        @media (max-width: 500px) {
          .landing-cta { padding: 64px 0; }
          .landing-cta-actions { width: 100%; }
          .landing-cta-actions .landing-btn { width: 100%; }
        }
      `}</style>

      <footer style={{ padding: '60px 24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: 28, padding: '48px 48px 28px', boxShadow: '0 4px 24px rgba(10,10,10,0.06), 0 1px 4px rgba(10,10,10,0.04)', border: '1px solid var(--color-warm)' }}>
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d={WHATSAPP_PATH} /></svg>
                </a>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: 20 }}>{t('footer.serveis_title')}</div>
              {[
                { label: t('serveis.items.0.title'), href: servicePath(currentLang, 'reformes') },
                { label: t('serveis.items.1.title'), href: servicePath(currentLang, 'cuines') },
                { label: t('serveis.items.2.title'), href: servicePath(currentLang, 'banys') },
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
                <div>💬 <a href={waFooter} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp: 692 586 863" onClick={() => trackWhatsApp('footer')} style={{ color: '#25D366', textDecoration: 'none', fontWeight: 500 }}>692 586 863</a></div>
                <div>✉️ <a href="mailto:info@ferlo.es" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>info@ferlo.es</a></div>
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
