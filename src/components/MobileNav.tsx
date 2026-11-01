import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { trackWhatsAppClick } from '../lib/tracking'
import { servicePath, type Lang } from '../lib/lang'

const SERVICES_ICONS = [
  <svg key="inst" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z" />
  </svg>,
  <svg key="pool" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 18c2-3 4-4.5 7-4.5S14 15 16.5 18" /><path d="M4 9.5C5.5 8 7.5 7 9.5 7s3.5 1 5 2.5" /><path d="M13 3.5c1.6 1.2 2.8 3 3.5 5" />
  </svg>,
  <svg key="garden" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>,
  <svg key="main" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>,
]

interface MobileNavProps {
  currentLang: Lang
  waHeader: string
  isHome?: boolean
}

export default function MobileNav({ currentLang, waHeader, isHome = false }: MobileNavProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Tanca el desplegable en tocar fora
  useEffect(() => {
    const handleClose = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClose)
    document.addEventListener('touchstart', handleClose, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleClose)
      document.removeEventListener('touchstart', handleClose)
    }
  }, [])

  const prefix = isHome ? '' : `/${currentLang}`

  const services = [
    { label: t('serveis.items.0.title'), href: servicePath(currentLang, 'manteniment'), icon: SERVICES_ICONS[3] },
    { label: t('serveis.items.1.title'), href: servicePath(currentLang, 'piscines'), icon: SERVICES_ICONS[1] },
    { label: t('serveis.items.2.title'), href: servicePath(currentLang, 'jardineria'), icon: SERVICES_ICONS[2] },
    { label: t('serveis.items.3.title'), href: servicePath(currentLang, 'instalacions'), icon: SERVICES_ICONS[0] },
  ]

  const navItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    padding: '4px 8px',
    borderRadius: 40,
    color: '#7A6F65',
    textDecoration: 'none',
    transition: 'color 0.2s, background 0.2s',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 9,
    fontWeight: 500,
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
    lineHeight: 1.4,
    WebkitTapHighlightColor: 'transparent',
    flex: 1,
  }

  const navLabelStyle: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 500,
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
    lineHeight: 1.4,
  }

  const hoverPop = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = '#1A1714'
    e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'
  }
  const hoverPopOut = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.color = '#7A6F65'
    e.currentTarget.style.backgroundColor = 'transparent'
  }

  return (
    <div ref={rootRef} className="show-mobile" style={{ display: 'none', position: 'relative', flex: 1 }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', width: '100%', padding: '4px 0' }}>
        {/* SERVEIS — obre el desplegable */}
        <button
          aria-expanded={open}
          aria-haspopup="true"
          onClick={() => setOpen((v: boolean) => !v)}
          style={{ ...navItemStyle, color: open ? '#00326B' : '#7A6F65' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          <span style={navLabelStyle}>{t('nav.serveis')}</span>
        </button>

        {/* SOBRE */}
        <Link
          to={`${prefix}/#sobre`}
          style={navItemStyle}
          onMouseEnter={hoverPop}
          onMouseLeave={hoverPopOut}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
          <span style={navLabelStyle}>{t('nav.sobre')}</span>
        </Link>

        {/* PRESSUPOST */}
        <Link
          to={`${prefix}/#contacte`}
          style={{ ...navItemStyle, color: '#00326B' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#00326B'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#00326B'; e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          <span style={{ ...navLabelStyle, color: '#00326B' }}>{t('nav.pressupost')}</span>
        </Link>

        {/* WHATSAPP — opció més a la dreta */}
        <a
          href={waHeader}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...navItemStyle, color: '#25D366' }}
          onClick={() => trackWhatsAppClick('header_mobile')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" stroke="none">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span style={{ ...navLabelStyle, color: '#25D366' }}>WhatsApp</span>
        </a>
      </nav>

      {/* DESPLEGABLE SERVEIS — liquid glass */}
      {open && (
          <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 2px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            animation: 'mobileServicesDropUp 0.22s ease-out',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            padding: '8px',
            backgroundColor: 'rgba(255,255,255,0.78)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.55)',
            borderRadius: 18,
            boxShadow: '0 16px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.05)',
            minWidth: 205,
          }}>
            {services.map((s) => (
              <Link
                key={s.label}
                to={s.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 12,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                  WebkitTapHighlightColor: 'transparent',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,50,107,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(0,50,107,0.08)', color: '#00326B', flexShrink: 0 }}>
                  {s.icon}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1714', letterSpacing: '0.01em' }}>{s.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9A8F86" strokeWidth="2.5" style={{ marginLeft: 'auto', flexShrink: 0 }}><polyline points="9,6 15,12 9,18"/></svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes mobileServicesDropUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}