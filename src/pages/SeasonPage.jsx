import { useState, useEffect } from 'react'
import { getRaces, getRaceResults } from '../services/api'
import SectionHeading from '../components/SectionHeading'

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
    <div className="page season">
      <SectionHeading eyebrow="Saison 2026" title="Calendrier" />

      <div className="timeline">
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
              className={`timeline-row ${isPast ? 'is-past' : 'is-upcoming'}`}
              onClick={() => handleRaceClick(race, isPast)}
              style={{ cursor: isPast ? 'pointer' : 'default' }}
            >
              <span className="timeline-row__node" />
              <span className="timeline-row__round">R{race.round}</span>
              <span className="timeline-row__name">{race.raceName}</span>
              <span className="timeline-row__date">{dateFormatted}</span>
              <span className={`timeline-row__badge ${isPast ? 'is-past' : 'is-upcoming'}`}>
                {isPast ? 'Terminé' : 'À venir'}
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
