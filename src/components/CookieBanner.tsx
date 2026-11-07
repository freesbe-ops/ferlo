import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { cookiesPath, isLang, normalizeLang, pathSegments } from '../lib/lang'

const CONSENT_KEY = 'ferlo_cookie_consent'
const TITLE_ID = 'ckb-title'

type Consent = 'all' | 'necessary'

function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY)
    return raw === 'all' || raw === 'necessary' ? raw : null
  } catch {
    return null
  }
}

function applyConsent(consent: Consent) {
  const w = window as Window & { gtag?: (...args: unknown[]) => void }
  const value = consent === 'all' ? 'granted' : 'denied'
  w.gtag?.('consent', 'update', {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  })
}

export default function CookieBanner() {
  const { i18n } = useTranslation()
  const location = useLocation()
  // null = storage not read yet, false = no decision (show banner), true = decided
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)
  const firstButtonRef = useRef<HTMLButtonElement>(null)

  // The language comes from the URL, not from i18n: the service landings and the
  // legal pages never call changeLanguage, so i18n.language can still be the
  // previous page's language.
  const [firstSegment] = pathSegments(location.pathname)
  const lang = isLang(firstSegment) ? firstSegment : normalizeLang(i18n.language)
  const t = i18n.getFixedT(lang)

  useEffect(() => {
    const stored = readConsent()
    // Consent Mode defaults to "denied" in index.html, so a returning visitor
    // who accepted must have it re-applied on every page load.
    if (stored) applyConsent(stored)
    setHasConsent(stored !== null)
  }, [])

  useEffect(() => {
    if (hasConsent === false) firstButtonRef.current?.focus()
  }, [hasConsent])

  const decide = (consent: Consent) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, consent)
    } catch {
      /* storage unavailable (private mode): the choice still applies to this visit */
    }
    applyConsent(consent)
    setHasConsent(true)
    // GA4 needs a fresh load to start collecting with the granted consent.
    if (consent === 'all') window.location.reload()
  }

  if (hasConsent !== false) return null

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={TITLE_ID} className="ckb-bar">
      <div className="ckb-inner">
        <div className="ckb-text">
          <div id={TITLE_ID} className="ckb-title">
            {t('cookies.banner.title')}
          </div>
          <p className="ckb-desc">
            {t('cookies.banner.text')}{' '}
            <Link to={cookiesPath(lang)} className="ckb-link">
              {t('cookies.banner.policy_link')}
            </Link>
          </p>
        </div>
        <div className="ckb-actions">
          <button ref={firstButtonRef} type="button" className="ckb-btn ckb-btn--ghost" onClick={() => decide('necessary')}>
            {t('cookies.banner.only_necessary')}
          </button>
          <button type="button" className="ckb-btn ckb-btn--primary" onClick={() => decide('all')}>
            {t('cookies.banner.accept_all')}
          </button>
        </div>
      </div>
      <style>{`
        .ckb-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          /* Above the mobile header, which index.css turns into a floating
             bottom bar with z-index 100. */
          z-index: 1000;
          background-color: #FFFFFF;
          border-top: 1px solid var(--color-border);
          box-shadow: 0 -4px 24px rgba(10,10,10,0.08);
          font-family: var(--font-sans);
        }
        .ckb-inner {
          max-width: 1248px;
          margin: 0 auto;
          padding: 22px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .ckb-text { flex: 1 1 auto; }
        .ckb-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-ink);
          margin: 0 0 6px;
        }
        .ckb-desc {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-muted);
        }
        .ckb-link {
          color: var(--color-primary);
          text-decoration: underline;
          font-weight: 600;
        }
        .ckb-actions {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
        }
        .ckb-btn {
          border-radius: 9999px;
          padding: 11px 22px;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          white-space: nowrap;
        }
        .ckb-btn--ghost {
          background-color: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-ink);
        }
        .ckb-btn--primary {
          background-color: var(--color-ink);
          border: 1px solid var(--color-ink);
          color: #FFFFFF;
        }
        @media (max-width: 640px) {
          .ckb-inner {
            flex-direction: column;
            align-items: stretch;
            padding: 18px 20px;
            gap: 16px;
          }
          .ckb-actions { flex-direction: column; }
          .ckb-btn { width: 100%; }
        }
      `}</style>
    </div>
  )
}
