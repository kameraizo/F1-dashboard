import { useState, useEffect } from 'react'
import { getSeasonCalendar } from '../services/api'
import { getRaceStatus, RACE_STATUS } from '../utils/raceStatus'

// Saison renvoyée par l'API et avancement du calendrier.
// - season : "2026", null tant qu'elle n'est pas connue
// - round : dernière manche démarrée (même règle que getRaceStatus), null avant la première course
// - totalRounds : nombre de manches au calendrier
// En cas d'échec, les pages affichent déjà leur propre message d'erreur : tout reste à null.
export function useSeason() {
  const [calendar, setCalendar] = useState(null)

  useEffect(() => {
    let active = true
    getSeasonCalendar()
      .then(value => { if (active) setCalendar(value) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  if (!calendar) return { season: null, round: null, totalRounds: null }

  const startedRaces = calendar.Races.filter(race => getRaceStatus(race) !== RACE_STATUS.UPCOMING)
  return {
    season: calendar.season,
    round: startedRaces.at(-1)?.round ?? null,
    totalRounds: calendar.Races.length,
  }
}
