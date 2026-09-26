import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Clear any stale Service Workers and outdated PWA caches to ensure live UI loads cleanly
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  }).catch(() => {});
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    }).catch(() => {});
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

