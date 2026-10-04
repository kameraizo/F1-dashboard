import { useState, useEffect } from 'react'
import { getCurrentSeason } from '../services/api'

// Saison renvoyée par l'API ("2026"), null tant qu'elle n'est pas connue.
// En cas d'échec, les pages affichent déjà leur propre message d'erreur : on reste sur null.
export function useSeason() {
  const [season, setSeason] = useState(null)

  useEffect(() => {
    let active = true
    getCurrentSeason()
      .then(value => { if (active) setSeason(value) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return season
}
