import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Analytics (GA4) helpers for hash-based routing ---
export function onGtagReady(callback, { timeoutMs = 5000, intervalMs = 200 } = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    callback();
    return;
  }
  const start = Date.now();
  const interval = setInterval(() => {
    if (typeof window.gtag === 'function') {
      clearInterval(interval);
      callback();
    } else if (Date.now() - start > timeoutMs) {
      clearInterval(interval);
    }
  }, intervalMs);
}

export function trackPageViewGA4(urlPath) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  const path = urlPath || (window.location.pathname + window.location.search + window.location.hash);
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: path,
  });
}

export function initHashPageviewTracking() {
  if (typeof window === 'undefined') return;
  // Send initial pageview once gtag is ready
  onGtagReady(() => trackPageViewGA4());
  // Track subsequent hash changes
  window.addEventListener('hashchange', () => {
    trackPageViewGA4();
  });
}
