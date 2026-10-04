// Statut d'une course, partagé par HomePage, SeasonPage et GPCard

export const RACE_STATUS = {
  UPCOMING: 'upcoming',
  PENDING: 'pending',
  FINISHED: 'finished',
}

export const RACE_STATUS_LABELS = {
  [RACE_STATUS.UPCOMING]: 'À venir',
  [RACE_STATUS.PENDING]: 'Résultats en attente',
  [RACE_STATUS.FINISHED]: 'Terminé',
}

// Heure de départ : Jolpica fournit date ("2026-10-04") et time en UTC ("07:00:00Z").
// Sans heure, on retombe sur minuit UTC.
export const getRaceStart = (race) => new Date(`${race.date}T${race.time ?? '00:00:00Z'}`)

// lastResults : { season, round } de la dernière course avec résultats publiés (/current/last/results).
// null si inconnu (appel en échec) : le statut est alors calculé sur la date seule.
export const getRaceStatus = (race, lastResults, now = new Date()) => {
  if (getRaceStart(race) > now) return RACE_STATUS.UPCOMING
  if (!lastResults) return RACE_STATUS.FINISHED
  // Saison plus ancienne que celle des derniers résultats : forcément terminée
  if (Number(race.season) < Number(lastResults.season)) return RACE_STATUS.FINISHED
  // Saison plus récente (ex. début 2027 avec les résultats d'Abu Dhabi 2026) : aucun résultat pour cette course
  if (Number(race.season) > Number(lastResults.season)) return RACE_STATUS.PENDING
  if (Number(race.round) <= Number(lastResults.round)) return RACE_STATUS.FINISHED
  return RACE_STATUS.PENDING
}
