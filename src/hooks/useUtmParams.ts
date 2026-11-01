import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { getTraffic, persistTrafficFromSearch, type Traffic } from '../lib/tracking'

/**
 * Returns the traffic attribution for the current session and keeps it in sync
 * with the URL.
 *
 * - On mount (and on every route change that carries fresh UTM/gclid params) it
 *   persists the campaign to sessionStorage, so it survives internal SPA
 *   navigation (language changes, going from /ca to /ca/serveis/piscines…)
 *   where react-router drops the query string.
 * - `traffic` contains source/medium/campaign/term/content, gclid, a
 *   `googleAds` boolean, plus page_location and page_referrer.
 */
export function useUtmParams(): Traffic {
  const location = useLocation()

  // Persist any campaign params present in the URL (first landing or a new ad
  // click). Internal navigation without params keeps the stored value.
  useEffect(() => {
    persistTrafficFromSearch(location.search)
  }, [location.search])

  return useMemo(() => getTraffic(), [location.search])
}
