import { useState, useEffect } from 'react'
import { getRaces, getRaceResults } from '../services/api'

function SeasonPage() {
  const [races, setRaces] = useState([])
  const [selectedRace, setSelectedRace] = useState(null)
  const [raceResults, setRaceResults] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)

  useEffect(() => {
    const fetchRaces = async () => {
      const data = await getRaces()
      setRaces(data.MRData.RaceTable.Races)
    }
    fetchRaces()
  }, [])

  const handleRaceClick = async (race, isPast) => {
    if (!isPast) return
    setSelectedRace(race)
    setLoadingResults(true)
    const data = await getRaceResults(race.round)
    setRaceResults(data.MRData.RaceTable.Races[0].Results)
    setLoadingResults(false)
  }

  return (
    <div className="container mt-4">
      <h2 className="title-gradient text-center mb-4">Saison 2026 — Top 3</h2>

      {races.map((race) => {
        const today = new Date()
        const raceDate = new Date(race.date)
        const isPast = raceDate < today
        const dateFormatted = raceDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })

        return (
          <div
            key={race.round}
            className={`race-card ${isPast ? 'past' : ''}`}
            onClick={() => handleRaceClick(race, isPast)}
            style={{ cursor: isPast ? 'pointer' : 'default' }}
          >
            <span className="race-round">R{race.round}</span>
            <span className="race-name">{race.raceName}</span>
            <span className="race-date">{dateFormatted}</span>
            <span className={isPast ? 'badge-past' : 'badge-upcoming'}>
              {isPast ? 'Passé' : 'À venir'}
            </span>
          </div>
        )
      })}

      {selectedRace && (
        <div className="modal-overlay" onClick={() => setSelectedRace(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedRace(null)}>✕</button>
            <h3>{selectedRace.raceName}</h3>
            <p style={{ color: '#8B9AB0', marginBottom: '1rem' }}>
              {selectedRace.Circuit.circuitName}
            </p>

            {loadingResults ? (
              <p style={{ color: '#8B9AB0' }}>Chargement...</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ color: '#E8002D', padding: '8px', textAlign: 'left' }}>Pos</th>
                    <th style={{ color: '#E8002D', padding: '8px', textAlign: 'left' }}>Pilote</th>
                    <th style={{ color: '#E8002D', padding: '8px', textAlign: 'left' }}>Écurie</th>
                    <th style={{ color: '#E8002D', padding: '8px', textAlign: 'left' }}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {raceResults.slice(0, 10).map((result) => (
                    <tr key={result.Driver.driverId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ color: '#ffffff', padding: '8px' }}>P{result.position}</td>
                      <td style={{ color: '#ffffff', padding: '8px' }}>
                        {result.Driver.givenName[0]}. {result.Driver.familyName}
                      </td>
                      <td style={{ color: '#8B9AB0', padding: '8px' }}>{result.Constructor.name}</td>
                      <td style={{ color: '#8B9AB0', padding: '8px' }}>{result.points}</td>
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