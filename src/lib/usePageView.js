import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { onGtagReady, trackPageViewGA4 } from './utils'

// Track GA4 page views on every route change (path-based routing)
export default function usePageView() {
  const location = useLocation()

  useEffect(() => {
    onGtagReady(() => {
      const path = location.pathname + location.search
      trackPageViewGA4(path)
    })
  }, [location.pathname, location.search])
}
