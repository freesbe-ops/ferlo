import React, { Suspense, lazy, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import App from './App'
import { useUtmParams } from './hooks/useUtmParams'
import { trackPageView } from './lib/tracking'
import { DEFAULT_LANG, canonicalPath, isLang, pathSegments, routePath } from './lib/lang'
import './i18n'
import './index.css'

const Piscines = lazy(() => import('./pages/Piscines'))
const Jardineria = lazy(() => import('./pages/Jardineria'))
const Manteniment = lazy(() => import('./pages/Manteniment'))
const Instalacions = lazy(() => import('./pages/Instalacions'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))

function ScrollManager() {
  const location = useLocation()
  const prevPathname = useRef(location.pathname)

  // Scroll a l'element amb hash.
  // ORDRE IMPORTANT: aquest effect ha d'anar ABANS del de pathname, perquè
  // necessita llegir prevPathname abans que s'actualitzi a l'altre effect.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      const element = document.getElementById(id)
      if (element) {
        // Si venim d'una altra pàgina (ex: de /ca/serveis/piscines a /ca#sobre),
        // esperem que el component es munti abans de fer scroll.
        // Si és la mateixa pàgina amb un hash nou, actuem immediatament.
        const isNewPage = prevPathname.current !== location.pathname
        const delay = isNewPage ? 250 : 0
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, delay)
      }
    }
  }, [location.hash, location.pathname])

  // Quan canvia la ruta, actualitza el ref i torna a top si no hi ha hash.
  useEffect(() => {
    if (location.pathname !== prevPathname.current) {
      prevPathname.current = location.pathname
      if (!location.hash) {
        window.scrollTo(0, 0)
      }
    }
  }, [location.pathname, location.hash])

  return null
}

// Ruta desconeguda (URL antiga / esborrada): en comptes de deixar una pàgina en
// blanc (soft-404), redirigim a la home de l'idioma detectat a la URL.
function CatchAllRedirect() {
  const location = useLocation()
  const [firstSegment] = pathSegments(location.pathname)
  const lang = isLang(firstSegment) ? firstSegment : DEFAULT_LANG
  return <Navigate to={routePath(lang, 'home')} replace />
}

// Canonicalitza les URLs localitzades: cada idioma té els seus slugs
// (/ca/serveis/jardineria, /fr/services/jardins...), de manera que qualsevol
// variant retorna a la forma canònica abans que es renderitzi cap pàgina.
function AppRoutes() {
  const location = useLocation()
  const canonical = canonicalPath(location.pathname)

  if (canonical && canonical !== location.pathname) {
    return <Navigate to={`${canonical}${location.search}`} replace />
  }

  return (
    <Suspense fallback={<div>Carregant...</div>}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:lang" element={<App />} />

        {/* Serveis — slugs compartits a CA/ES/EN i slugs francesos a FR */}
        <Route path="/:lang/serveis/piscines" element={<Piscines />} />
        <Route path="/:lang/serveis/jardineria" element={<Jardineria />} />
        <Route path="/:lang/serveis/manteniment" element={<Manteniment />} />
        <Route path="/:lang/serveis/instalacions" element={<Instalacions />} />
        <Route path="/:lang/services/piscines" element={<Piscines />} />
        <Route path="/:lang/services/jardins" element={<Jardineria />} />
        <Route path="/:lang/services/maintenance" element={<Manteniment />} />
        <Route path="/:lang/services/installations" element={<Instalacions />} />

        {/* Privacitat — un slug per idioma */}
        <Route path="/:lang/politica-de-privacitat" element={<PrivacyPolicy />} />
        <Route path="/:lang/politica-de-privacidad" element={<PrivacyPolicy />} />
        <Route path="/:lang/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/:lang/politique-de-confidentialite" element={<PrivacyPolicy />} />

        <Route path="*" element={<CatchAllRedirect />} />
      </Routes>
    </Suspense>
  )
}

// SPA analytics: keeps the session UTM in sync with the URL and sends GA4
// page_view on client-side route changes (the initial load is already tracked
// automatically by gtag.js loaded in index.html).
function AnalyticsSync() {
  const location = useLocation()
  const isFirstRender = useRef(true)

  useUtmParams()

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    trackPageView(location.pathname + location.search)
  }, [location.pathname, location.search])

  return null
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ScrollManager />
        <AnalyticsSync />
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)