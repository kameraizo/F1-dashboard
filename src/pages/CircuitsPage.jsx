import { useState, useEffect } from "react"
import { getRaces } from "../services/api"

const countryFlags = {
  Australia: 'au',
  China: 'cn',
  Japan: 'jp',
  Bahrain: 'bh',
  'Saudi Arabia': 'sa',
  USA: 'us',
  Italy: 'it',
  Monaco: 'mc',
  Spain: 'es',
  Canada: 'ca',
  Austria: 'at',
  'United Kingdom': 'gb',
  Belgium: 'be',
  Hungary: 'hu',
  Netherlands: 'nl',
  Azerbaijan: 'az',
  Singapore: 'sg',
  Mexico: 'mx',
  Brazil: 'br',
  'United Arab Emirates': 'ae',
  Qatar: 'qa',
  'Las Vegas': 'us',
}

function CircuitsPage() {
  const [races, setRaces] = useState([])
  const [selectedRace, setSelectedRace] = useState(null)

  useEffect(() => {
    const fetchRaces = async () => {
      const data = await getRaces()
      setRaces(data.MRData.RaceTable.Races)
    }
    fetchRaces()
  }, [])

  return (
    <div className="container mt-4">
      <h2 style={{ color: 'white' }} className="mb-4">Circuits 2026</h2>

      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {races.map((race) => {
          const country = race.Circuit.Location.country
          const flagCode = countryFlags[country] || 'un'

          return (
            <div key={race.round} className="circuit-card" onClick={() => setSelectedRace(race)}>
              <img
                src={`https://flagcdn.com/w80/${flagCode}.png`}
                alt={country}
                className="circuit-flag"
              />
              <div className="circuit-name">{race.Circuit.circuitName}</div>
              <div className="circuit-country">{country}</div>
              <div className="circuit-date">{race.date}</div>
            </div>
          )
        })}
      </div>

      {selectedRace && (
        <div className="modal-overlay" onClick={() => setSelectedRace(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedRace(null)}>✕</button>
            <img
              src={`https://flagcdn.com/w80/${countryFlags[selectedRace.Circuit.Location.country] || 'un'}.png`}
              alt={selectedRace.Circuit.Location.country}
              className="circuit-flag mb-3"
            />
            <h3>{selectedRace.raceName}</h3>
            <p>{selectedRace.Circuit.circuitName}</p>
            <p>{selectedRace.Circuit.Location.locality}, {selectedRace.Circuit.Location.country}</p>
            <p>Round {selectedRace.round}</p>
            <p>{selectedRace.date}</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default CircuitsPage