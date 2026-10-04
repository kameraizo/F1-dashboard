import { useState, useEffect, Fragment } from "react"
import { getDriverStandings, getLastRaceResults, getRaces, getApiErrorMessage } from "../services/api"
import ApiError from "../components/ApiError"
import DriverCard from "../components/DriverCard"
import GPCard from "../components/GPCard"
import SectionHeading from "../components/SectionHeading"
import CircuitAmbient from "../components/CircuitAmbient"
import CountUp from "../components/CountUp"
import { getRaceStatus, RACE_STATUS } from "../utils/raceStatus"

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

const PODIUM_ORDER = [1, 0, 2]

function Podium({ standings, onSelect }) {
  return (
    <div className="podium">
      {PODIUM_ORDER.map((idx) => {
        const standing = standings[idx]
        const place = idx + 1
        if (!standing) {
          return <div key={`empty-${idx}`} className={`podium-slot podium-slot--p${place} is-empty`} />
        }
        return (
          <div key={standing.Driver.driverId} className={`podium-slot podium-slot--p${place}`}>
            <DriverCard standing={standing} variant="podium" onClick={() => onSelect(standing)} />
            <div className="podium-riser">
              <span className="podium-riser__place">P{place}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function HomePage() {
  const [drivers, setDrivers] = useState([])
  const [results, setResults] = useState([])
  const [races, setRaces] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [error, setError] = useState(null)

  // Carte "Dernier GP" et Top 3 viennent de la même source : /current/last/results
  const lastRaceWithResults = results[results.length - 1]
  // Courses passées au calendrier mais dont les résultats ne sont pas encore publiés
  const pendingRaces = lastRaceWithResults
    ? races.filter(race => getRaceStatus(race, lastRaceWithResults) === RACE_STATUS.PENDING)
    : []
  const nextRace = races.find(race => getRaceStatus(race) === RACE_STATUS.UPCOMING)

  useEffect(() => {
    const handleError = (err) => setError(getApiErrorMessage(err))

    getDriverStandings()
      .then(data => {
        setDrivers(data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [])
      })
      .catch(handleError)

    getLastRaceResults()
      .then(data => {
        setResults(data.MRData.RaceTable.Races)
      })
      .catch(handleError)

    getRaces()
      .then(data => {
        setRaces(data.MRData.RaceTable.Races)
      })
      .catch(handleError)
  }, [])

  return (
    <div className="page home">
      {error && <ApiError message={error} />}
      <div className="home__hero">
        <CircuitAmbient />
        <div className="speed-lines" aria-hidden="true" />
        <SectionHeading eyebrow="Championnat 2026" title="Top 3 pilotes" />
        <Podium standings={drivers.slice(0, 3)} onSelect={setSelectedDriver} />
      </div>

      <div className="kerb-divider" aria-hidden="true" />

      <div className="home__races">
        {lastRaceWithResults && (
          <GPCard race={lastRaceWithResults} label="Dernier GP" winner={lastRaceWithResults.Results?.[0]} />
        )}
        {pendingRaces.map(race => (
          <Fragment key={race.round}>
            <div className="home__races-arrow" aria-hidden="true" />
            <GPCard race={race} label="Course terminée" status={RACE_STATUS.PENDING} />
          </Fragment>
        ))}
        {lastRaceWithResults && nextRace && <div className="home__races-arrow" aria-hidden="true" />}
        {nextRace && <GPCard race={nextRace} label="Prochain GP" />}
      </div>

      {lastRaceWithResults?.Results && (
        <div className="home__section">
          <SectionHeading eyebrow="Résultats" title={`Top 3 — ${lastRaceWithResults.raceName}`} />
          <Podium standings={lastRaceWithResults.Results.slice(0, 3)} onSelect={setSelectedDriver} />
        </div>
      )}

      {selectedDriver && (
        <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDriver(null)}>✕</button>
            <div
              className="modal-number"
              style={{ color: teamColors[selectedDriver.Constructors?.[0]?.constructorId || selectedDriver.Constructor?.constructorId] || '#fff' }}
            >
              {selectedDriver.Driver.permanentNumber}
            </div>
            <h3>{selectedDriver.Driver.givenName} {selectedDriver.Driver.familyName}</h3>
            <p>{selectedDriver.Constructors?.[0]?.name || selectedDriver.Constructor?.name}</p>
            <p>{selectedDriver.Driver.nationality}</p>
            <p><span className="modal-points"><CountUp value={selectedDriver.points} /> pts</span> — {selectedDriver.wins} victoires</p>
            <p>Né le {selectedDriver.Driver.dateOfBirth}</p>
            <p>P{selectedDriver.position} au championnat</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
