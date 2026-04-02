import { useState, useEffect } from 'react'
import { getRaces } from '../services/api'

function SeasonPage() {
  const [races, setRaces] = useState([])

  useEffect(() => {
    const fetchRaces = async () => {
      const data = await getRaces()
      setRaces(data.MRData.RaceTable.Races)
    }
    fetchRaces()
  }, [])

return (
  <div className="container mt-4">
    <h2 style={{ color: 'white' }} className="mb-4">Saison 2026</h2>
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
        <div key={race.round} className={`race-card ${isPast ? 'past' : ''}`}>
          <span className="race-round">R{race.round}</span>
          <span className="race-name">{race.raceName}</span>
          <span className="race-date">{dateFormatted}</span>
          <span className={isPast ? 'badge-past' : 'badge-upcoming'}>
            {isPast ? 'Passé' : 'À venir'}
          </span>
        </div>
      )
    })}
  </div>
)
}

export default SeasonPage