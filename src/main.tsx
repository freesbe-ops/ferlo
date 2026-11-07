import React, { Suspense, lazy, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import App from './App'
import CookieBanner from './components/CookieBanner'
import { useUtmParams } from './hooks/useUtmParams'
import { trackPageView } from './lib/tracking'
import { DEFAULT_LANG, ROUTES, canonicalPath, homePath, isLang, pathSegments } from './lib/lang'
import './i18n'
import './index.css'

const Reformes = lazy(() => import('./pages/Reformes'))
const Cuines = lazy(() => import('./pages/Cuines'))
const Banys = lazy(() => import('./pages/Banys'))
const ObraNova = lazy(() => import('./pages/ObraNova'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Legal = lazy(() => import('./pages/Legal'))
const Cookies = lazy(() => import('./pages/Cookies'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
        // Si venim d'una altra pàgina (ex: de /ca/serveis/reformes a /ca#sobre),
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
  return <Navigate to={homePath(lang)} replace />
}

// Canonicalitza les URLs localitzades: cada idioma té els seus propis slugs
// (/es/servicios/cocinas, /ca/serveis/cuines), de manera que qualsevol variant
// (majúscules, barra final, slug d'un altre idioma) retorna a la forma canònica
// abans que es renderitzi cap pàgina.
function AppRoutes() {
  const location = useLocation()
  const canonical = canonicalPath(location.pathname)

  if (canonical && canonical !== location.pathname) {
    return <Navigate to={`${canonical}${location.search}`} replace />
  }

  return (
    <Suspense fallback={<div>Carregant...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to={homePath(DEFAULT_LANG)} replace />} />
        <Route path="/:lang" element={<App />} />

        {/* Serveis: un slug diferent per idioma */}
        <Route path={`/:lang/${ROUTES.reformes.es}`} element={<Reformes />} />
        <Route path={`/:lang/${ROUTES.reformes.ca}`} element={<Reformes />} />
        <Route path={`/:lang/${ROUTES.cuines.es}`} element={<Cuines />} />
        <Route path={`/:lang/${ROUTES.cuines.ca}`} element={<Cuines />} />
        <Route path={`/:lang/${ROUTES.banys.es}`} element={<Banys />} />
        <Route path={`/:lang/${ROUTES.banys.ca}`} element={<Banys />} />
        <Route path={`/:lang/${ROUTES.obraNova.es}`} element={<ObraNova />} />
        <Route path={`/:lang/${ROUTES.obraNova.ca}`} element={<ObraNova />} />

        {/* Pàgines legals */}
        <Route path={`/:lang/${ROUTES.privacy.es}`} element={<PrivacyPolicy />} />
        <Route path={`/:lang/${ROUTES.privacy.ca}`} element={<PrivacyPolicy />} />
        <Route path={`/:lang/${ROUTES.legal.es}`} element={<Legal />} />
        <Route path={`/:lang/${ROUTES.legal.ca}`} element={<Legal />} />
        <Route path={`/:lang/${ROUTES.cookies.es}`} element={<Cookies />} />
        <Route path={`/:lang/${ROUTES.cookies.ca}`} element={<Cookies />} />

        {/* 404 explícit + qualsevol altra ruta localitzada desconeguda */}
        <Route path="/:lang/404" element={<NotFound />} />
        <Route path="/:lang/*" element={<NotFound />} />
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
        <CookieBanner />
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)