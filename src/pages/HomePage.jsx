import { useState, useEffect } from "react"
import { getDriverStandings, getResults, getRaces } from "../services/api"
import DriverCard from "../components/DriverCard"
import GPCard from "../components/GPCard"

const teamColors = {
  mclaren:      '#FF8000',
  red_bull:     '#3671C6',
  mercedes:     '#27F4D2',
  ferrari:      '#E8002D',
  williams:     '#64C4FF',
  aston_martin: '#358C75',
  alpine:       '#FF87BC',
  haas:         '#B6BABD',
  rb:           '#6692FF',
  sauber:       '#52E252',
  audi:         '#BB0000',
  cadillac:     '#C0C0C0',
}

function HomePage() {
  const [drivers, setDrivers] = useState([])
  const [results, setResults] = useState([])
  const [races, setRaces] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)

  const lastRace = results[results.length - 1]
  const nextRace = races.find(race => new Date(race.date) > new Date())

  useEffect(() => {
    getDriverStandings()
      .then(data => {
        setDrivers(data.MRData.StandingsTable.StandingsLists[0].DriverStandings)
      })

    getResults()
      .then(data => {
        setResults(data.MRData.RaceTable.Races)
      })

    getRaces()
      .then(data => {
        setRaces(data.MRData.RaceTable.Races)
      })
  }, [])

  return (
    <div className="container py-4">

      <h2 className="title-gradient text-center mb-4">Championnat 2026 — Top 3</h2>
      <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
        {drivers.slice(0, 3).map((standing) => (
          <DriverCard
            key={standing.Driver.driverId}
            standing={standing}
            onClick={() => setSelectedDriver(standing)}
          />
        ))}
      </div>

      <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mt-5 align-items-center">
        {lastRace && <GPCard race={lastRace} label="Dernier GP" />}
        {lastRace && nextRace && (
          <div style={{ color: '#E8002D', fontSize: '2rem', fontWeight: '700' }}>→</div>
        )}
        {nextRace && <GPCard race={nextRace} label="Prochain GP" />}
      </div>

      <h2 className="title-gradient text-center mb-4 mt-5">
  Top 3 — {lastRace?.raceName}
</h2>
      <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
        {lastRace?.Results?.slice(0, 3).map((result) => (
          <DriverCard
            key={result.Driver.driverId}
            standing={result}
            onClick={() => setSelectedDriver(result)}
          />
        ))}
      </div>

      {selectedDriver && (
        <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDriver(null)}>✕</button>
            <div style={{
              color: teamColors[selectedDriver.Constructors?.[0]?.constructorId || selectedDriver.Constructor?.constructorId] || '#fff',
              fontSize: '48px',
              fontWeight: '700'
            }}>
              {selectedDriver.Driver.permanentNumber}
            </div>
            <h3>{selectedDriver.Driver.givenName} {selectedDriver.Driver.familyName}</h3>
            <p>{selectedDriver.Constructors?.[0]?.name || selectedDriver.Constructor?.name}</p>
            <p>{selectedDriver.Driver.nationality}</p>
            <p>{selectedDriver.points} pts — {selectedDriver.wins} victoires</p>
            <p>Né le {selectedDriver.Driver.dateOfBirth}</p>
            <p>P{selectedDriver.position} au championnat</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default HomePage