import { useState, useEffect } from "react"
import { getDriverStandings, getResults } from "../services/api"
import DriverCard from "../components/DriverCard"
import GPCard from "../components/GPCard"
function HomePage() {
  const [drivers, setDrivers] = useState([])
  const [results, setResults] = useState([])
  const lastRace = results[results.length - 1]

  useEffect(() => {
getDriverStandings()
  .then(data => {
    const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings
    console.log(standings)
    setDrivers(standings)
  })

 getResults()
  .then(data => {
    const standings = data.MRData.RaceTable.Races
    console.log(standings)
    setResults(standings)
  }) 
  }, [])

return (
  <div className="container">
    
    <h2 className="text-white text-center mb-4"> Championnat 2026 — Top 3</h2>
    <div className="d-flex gap-3 justify-content-center">
      {drivers.slice(0, 3).map((standing) => (
        <DriverCard key={standing.Driver.driverId} standing={standing} />
      ))}
    </div>

    <div className="d-flex gap-3 justify-content-center mt-5">
      {lastRace && <GPCard race={lastRace} />}
    </div>

    <h2 className="text-white text-center mb-4 mt-5">
       Top 3 — {lastRace?.raceName}
    </h2>
    <div className="d-flex gap-3 justify-content-center">
      {lastRace?.Results?.slice(0, 3).map((result) => (
        <DriverCard key={result.Driver.driverId} standing={result} />
      ))}
    </div>

  </div>
)
}

export default HomePage