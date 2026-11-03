import type { CSSProperties, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { LANG_LABELS, LANGS, cookiesPath, homePath, legalPath, privacyPath, type Lang } from '../lib/lang'

const BRAND_BLUE = 'var(--color-primary)'

export const LEGAL_STYLES = {
  container: {
    maxWidth: 860,
    margin: '0 auto',
    padding: '120px 24px 80px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: 'var(--color-ink)',
    lineHeight: 1.8,
  },
  h1: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 'clamp(32px, 5vw, 48px)',
    fontWeight: 700,
    color: BRAND_BLUE,
    margin: '0 0 12px',
    lineHeight: 1.15,
  },
  updated: {
    fontSize: 13,
    color: '#6B6258',
    fontStyle: 'italic',
    marginBottom: 36,
  },
  h2: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 'clamp(22px, 3vw, 28px)',
    fontWeight: 700,
    color: BRAND_BLUE,
    margin: '44px 0 14px',
    paddingTop: 8,
    borderTop: '1px solid #E5E5E5',
  },
  p: { fontSize: 15.5, color: '#3A342E', marginBottom: 14 },
  ul: { paddingLeft: 22, marginBottom: 14, fontSize: 15.5, color: '#3A342E' },
  li: { marginBottom: 8 },
  strong: { color: 'var(--color-ink)' },
} as const

const BACK_LABELS: Record<Lang, string> = {
  es: 'Volver al inicio',
  ca: "Torna a l'inici",
}

function HeaderBar({ currentLang, onLanguageChange }: { currentLang: Lang; onLanguageChange: (l: string) => void }) {
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '0 24px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid #EEEEEE' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Link to={homePath(currentLang)} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.svg" alt="FERLO — Reformes i obra nova a Tordera" width={128} height={128} style={{ width: 34, height: 34, objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--color-ink)', lineHeight: 1.1 }}>FERLO</div>
            <div style={{ fontSize: 11, color: 'var(--color-muted)', letterSpacing: '0.08em' }}>TORDERA</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <select
            value={currentLang}
            onChange={e => onLanguageChange(e.target.value)}
            aria-label="Idioma"
            style={{ background: 'transparent', border: 'none', color: BRAND_BLUE, fontWeight: 700, fontSize: 12, fontFamily: "'DM Sans', system-ui, sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase', outline: 'none', cursor: 'pointer', padding: 0, appearance: 'none', WebkitAppearance: 'none' }}
          >
            {LANGS.map(l => (
              <option key={l} value={l} style={{ color: 'var(--color-ink)', textTransform: 'uppercase' }}>{LANG_LABELS[l]}</option>
            ))}
          </select>
          <Link to={homePath(currentLang)} style={{ padding: '8px 18px', backgroundColor: BRAND_BLUE, color: '#FFFFFF', borderRadius: 40, textDecoration: 'none', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
            {BACK_LABELS[currentLang]}
          </Link>
        </div>
      </div>
    </header>
  )
}

function Footer({ currentLang }: { currentLang: Lang }) {
  const { t } = useTranslation()
  const linkStyle: CSSProperties = { fontSize: 12, color: '#6B6258', textDecoration: 'none' }
  return (
    <footer style={{ padding: '60px 24px 40px', backgroundColor: '#F5F5F5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.svg" alt="FERLO — Reformes i obra nova a Tordera" width={128} height={128} style={{ width: 28, height: 28, objectFit: 'contain' }} />
            <span style={{ fontSize: 13, color: '#6B6258' }}>FERLO SL · {t('footer.legal')}</span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link to={legalPath(currentLang)} style={linkStyle}>{t('footer.avis_legal')}</Link>
            <Link to={privacyPath(currentLang)} style={linkStyle}>{t('footer.politica_privacitat')}</Link>
            <Link to={cookiesPath(currentLang)} style={linkStyle}>{t('footer.cookies')}</Link>
            <Link to={homePath(currentLang)} style={linkStyle}>{t('footer.inici')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export interface LegalShellProps {
  currentLang: Lang
  onLanguageChange: (lang: string) => void
  children: ReactNode
}

export default function LegalShell({ currentLang, onLanguageChange, children }: LegalShellProps) {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", backgroundColor: '#FFFFFF', color: 'var(--color-ink)', minHeight: '100vh' }}>
      <HeaderBar currentLang={currentLang} onLanguageChange={onLanguageChange} />
      <div style={LEGAL_STYLES.container as CSSProperties}>{children}</div>
      <Footer currentLang={currentLang} />
    </div>
  )
}
