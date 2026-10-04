import { useSyncExternalStore } from 'react'

// Installation de l'app (PWA). Mode renvoyé par useInstallPrompt :
// - 'prompt'    Chrome/Edge : beforeinstallprompt reçu, la vraie fenêtre d'installation est disponible
// - 'ios'       Safari iOS : pas d'API, on affiche les instructions "Partager → Sur l'écran d'accueil"
// - 'in-app'    navigateur intégré (Instagram, Facebook) : on invite à ouvrir le site dans le navigateur
// - 'installed' déjà installée (display-mode: standalone ou appinstalled)
// - 'none'      navigateur sans support (Firefox desktop…) ou critères d'installation non remplis
//
// Simulation en dev : http://localhost:5173/?install=prompt | ios | in-app | installed | none
// (beforeinstallprompt ne se déclenche pas en dev : pas de service worker hors build)

const simulated = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('install') : null

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

// Navigateurs intégrés aux applis Instagram / Facebook (iOS et Android) : installation impossible
const isInAppBrowser = () => /instagram|fban|fbav|fb_iab/i.test(window.navigator.userAgent)

// iPhone / iPad (iPadOS se présente comme un Mac tactile), uniquement Safari :
// les autres navigateurs iOS ont un autre parcours
const isIosSafari = () => {
  const ua = window.navigator.userAgent
  const isIos = /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && window.navigator.maxTouchPoints > 1)
  return isIos && /safari/i.test(ua) && !/crios|fxios|edgios|opios/i.test(ua)
}

// Fausse invite pour ?install=prompt : confirm() remplace la fenêtre du navigateur
const createSimulatedPrompt = () => {
  let resolveChoice
  return {
    userChoice: new Promise(resolve => { resolveChoice = resolve }),
    prompt: async () => {
      const accepted = window.confirm("[simulation] Installer F1 Dashboard ?")
      resolveChoice({ outcome: accepted ? 'accepted' : 'dismissed' })
      if (accepted) window.dispatchEvent(new Event('appinstalled'))
    },
  }
}

let deferredPrompt = simulated === 'prompt' ? createSimulatedPrompt() : null
let installed = simulated ? simulated === 'installed' : isStandalone()
const listeners = new Set()
const notify = () => listeners.forEach(listener => listener())

// Écouteurs posés au chargement du module : beforeinstallprompt peut arriver avant le premier rendu
if (!simulated || simulated === 'prompt') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event
    notify()
  })
}
window.addEventListener('appinstalled', () => {
  installed = true
  deferredPrompt = null
  notify()
})
window.matchMedia('(display-mode: standalone)').addEventListener('change', (event) => {
  if (event.matches) {
    installed = true
    notify()
  }
})

const getMode = () => {
  if (installed) return 'installed'
  if (deferredPrompt) return 'prompt'
  if (simulated) return ['ios', 'in-app'].includes(simulated) ? simulated : 'none'
  if (isInAppBrowser()) return 'in-app'
  return isIosSafari() ? 'ios' : 'none'
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Ouvre la vraie fenêtre d'installation (une invite ne sert qu'une fois)
export const promptInstall = async () => {
  const prompt = deferredPrompt
  if (!prompt) return null
  await prompt.prompt()
  const { outcome } = await prompt.userChoice
  deferredPrompt = null
  notify()
  return outcome
}

export function useInstallPrompt() {
  return useSyncExternalStore(subscribe, getMode, getMode)
}
