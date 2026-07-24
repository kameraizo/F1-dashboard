import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/main.scss'
import App from './App.jsx'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onOfflineReady() {
    console.info('F1 Dashboard est disponible hors ligne.')
  },
  onRegisterError(error) {
    console.error('Echec de l\'enregistrement du service worker', error)
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)