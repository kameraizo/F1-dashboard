import { useState, useEffect } from 'react'
import { getRaces, getRaceResults, getLastRaceResults, getApiErrorMessage } from '../services/api'
import SectionHeading from '../components/SectionHeading'
import ApiError from '../components/ApiError'
import { useSeason } from '../hooks/useSeason'
import { getRaceStatus, RACE_STATUS, RACE_STATUS_LABELS } from '../utils/raceStatus'

function SeasonPage() {
  const season = useSeason()
  const [races, setRaces] = useState([])
  const [lastResults, setLastResults] = useState(null)
  const [error, setError] = useState(null)
  const [selectedRace, setSelectedRace] = useState(null)
  const [raceResults, setRaceResults] = useState([])
  const [resultsError, setResultsError] = useState(null)
  const [loadingResults, setLoadingResults] = useState(false)

  useEffect(() => {
    const fetchRaces = async () => {
      // Chargés ensemble pour ne pas afficher un statut provisoire faux
      const [racesRes, lastRes] = await Promise.allSettled([getRaces(), getLastRaceResults()])
      if (racesRes.status === 'rejected') {
        setError(getApiErrorMessage(racesRes.reason))
        return
      }
      // Si /current/last échoue, lastResults reste null : statuts calculés sur la date seule
      if (lastRes.status === 'fulfilled') {
        const raceTable = lastRes.value.MRData.RaceTable
        setLastResults(raceTable.Races[0] ?? { season: raceTable.season, round: '0' })
      }
      setRaces(racesRes.value.MRData.RaceTable.Races)
    }
    fetchRaces()
  }, [])

  const handleRaceClick = async (race, status) => {
    if (status === RACE_STATUS.UPCOMING) return
    setSelectedRace(race)
    setResultsError(null)
    setLoadingResults(true)
    try {
      const data = await getRaceResults(race.round)
      // L'API renvoie une liste vide tant que les résultats ne sont pas publiés
      setRaceResults(data.MRData.RaceTable.Races[0]?.Results ?? [])
    } catch (err) {
      setRaceResults([])
      setResultsError(getApiErrorMessage(err))
    } finally {
      setLoadingResults(false)
    }
  }

  return (
    <div className="page season">
      <SectionHeading eyebrow={season ? `Saison ${season}` : 'Saison'} title="Calendrier" />

      {error && <ApiError message={error} />}

      <div className="timeline">
        {races.map((race) => {
          const raceDate = new Date(race.date)
          const status = getRaceStatus(race, lastResults)
          const isClickable = status !== RACE_STATUS.UPCOMING
          const dateFormatted = raceDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })

          return (
            <div
              key={race.round}
              className={`timeline-row is-${status}`}
              onClick={() => handleRaceClick(race, status)}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
              <span className="timeline-row__node" />
              <span className="timeline-row__round">R{race.round}</span>
              <span className="timeline-row__name">{race.raceName}</span>
              <span className="timeline-row__date">{dateFormatted}</span>
              <span className={`timeline-row__badge is-${status}`}>
                {RACE_STATUS_LABELS[status]}
              </span>
            </div>
          )
        })}
      </div>

      {selectedRace && (
        <div className="modal-overlay" onClick={() => setSelectedRace(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedRace(null)}>✕</button>
            <h3>{selectedRace.raceName}</h3>
            <p style={{ marginBottom: '1rem' }}>
              {selectedRace.Circuit.circuitName}
            </p>

            {loadingResults ? (
              <p>Chargement...</p>
            ) : resultsError ? (
              <ApiError message={resultsError} />
            ) : raceResults.length === 0 ? (
              <p>Résultats pas encore disponibles</p>
            ) : (
              <table style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Pos</th>
                    <th style={{ textAlign: 'left' }}>Pilote</th>
                    <th style={{ textAlign: 'left' }}>Écurie</th>
                    <th style={{ textAlign: 'left' }}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {raceResults.slice(0, 10).map((result) => (
                    <tr key={result.Driver.driverId}>
                      <td style={{ color: '#ffffff' }}>P{result.position}</td>
                      <td style={{ color: '#ffffff' }}>
                        {result.Driver.givenName[0]}. {result.Driver.familyName}
                      </td>
                      <td>{result.Constructor.name}</td>
                      <td>{result.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SeasonPage
