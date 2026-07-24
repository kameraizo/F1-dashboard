import { useState, useEffect } from 'react'
import DriverCard from '../components/DriverCard'
import ConstructorCard from '../components/ConstructorCard'
import SectionHeading from '../components/SectionHeading'
import CountUp from '../components/CountUp'
import { getDriverStandings, getConstructorStandings, getDriverResults } from '../services/api'

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

function StandingsPage() {
  const [activeTab, setActiveTab] = useState('drivers')
  const [drivers, setDrivers] = useState([])
  const [constructors, setConstructors] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [driverResults, setDriverResults] = useState([])
  const [selectedConstructor, setSelectedConstructor] = useState(null)
  const [allDrivers, setAllDrivers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true)
      const driversData = await getDriverStandings()
      setAllDrivers(driversData.MRData.StandingsTable.StandingsLists[0].DriverStandings)
      if (activeTab === 'drivers') {
        setDrivers(driversData.MRData.StandingsTable.StandingsLists[0].DriverStandings)
      } else {
        const data = await getConstructorStandings()
        setConstructors(data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings)
      }
      setLoading(false)
    }
    fetchStandings()
  }, [activeTab])

  return (
    <div className="page standings">
      <SectionHeading
        eyebrow="Classement 2026"
        title={activeTab === 'drivers' ? 'Pilotes' : 'Constructeurs'}
      />

      <div className="tab-buttons">
        <button
          className={activeTab === 'drivers' ? 'active' : ''}
          onClick={() => setActiveTab('drivers')}
        >Pilotes</button>
        <button
          className={activeTab === 'constructors' ? 'active' : ''}
          onClick={() => setActiveTab('constructors')}
        >Constructeurs</button>
      </div>

      {loading && (
        <div className="loading-strip"><span /></div>
      )}

      {!loading && activeTab === 'drivers' && (
        <div className="timing-tower">
          <table className="timing-table">
            <thead>
              <tr>
                <th className="t-pos">Pos</th>
                <th className="t-no">No</th>
                <th className="t-driver">Pilote</th>
                <th className="t-nat">Nat</th>
                <th className="t-pts">Points</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((standing) => (
                <DriverCard
                  key={standing.Driver.driverId}
                  standing={standing}
                  variant="row"
                  maxPoints={drivers[0]?.points}
                  onClick={async () => {
                    setSelectedDriver(standing)
                    const data = await getDriverResults(standing.Driver.driverId)
                    setDriverResults(data.MRData.RaceTable.Races)
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === 'constructors' && (
        <div className="timing-tower">
          <table className="timing-table">
            <thead>
              <tr>
                <th className="t-pos">Pos</th>
                <th className="t-team">Écurie</th>
                <th className="t-nat">Nat</th>
                <th className="t-pts">Points</th>
              </tr>
            </thead>
            <tbody>
              {constructors.map((standing) => (
                <ConstructorCard
                  key={standing.Constructor.constructorId}
                  standing={standing}
                  maxPoints={constructors[0]?.points}
                  onClick={() => setSelectedConstructor(standing)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedDriver && (
        <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDriver(null)}>✕</button>
            <div className="modal-number" style={{ color: teamColors[selectedDriver.Constructors[0].constructorId] || '#fff' }}>
              {selectedDriver.Driver.permanentNumber}
            </div>
            <h3>{selectedDriver.Driver.givenName} {selectedDriver.Driver.familyName}</h3>
            <p>{selectedDriver.Constructors[0].name}</p>
            <p>{selectedDriver.Driver.nationality}</p>
            <p><span className="modal-points"><CountUp value={selectedDriver.points} /> pts</span> — {selectedDriver.wins} victoires</p>
            <p>Né le {selectedDriver.Driver.dateOfBirth}</p>
            <p>P{selectedDriver.position} au championnat</p>
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>GP</th>
                  <th>Pos</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {driverResults.map((race) => (
                  <tr key={race.round}>
                    <td style={{ textAlign: 'left' }}>{race.raceName}</td>
                    <td style={{ textAlign: 'center' }}>{race.Results[0].position}</td>
                    <td style={{ textAlign: 'center' }}>{race.Results[0].points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedConstructor && (
        <div className="modal-overlay" onClick={() => setSelectedConstructor(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedConstructor(null)}>✕</button>
            <div className="modal-number" style={{ fontSize: '28px', color: teamColors[selectedConstructor.Constructor.constructorId] || '#fff' }}>
              {selectedConstructor.Constructor.name}
            </div>
            <p>{selectedConstructor.Constructor.nationality}</p>
            <p><span className="modal-points"><CountUp value={selectedConstructor.points} /> pts</span> — {selectedConstructor.wins} victoires</p>
            <p>P{selectedConstructor.position} au championnat</p>
            <h5 style={{ marginTop: '1rem', color: '#8B9AB0' }}>Pilotes</h5>
            {allDrivers
              .filter(d => d.Constructors[0].constructorId === selectedConstructor.Constructor.constructorId)
              .map(d => (
                <p key={d.Driver.driverId}>
                  #{d.Driver.permanentNumber} {d.Driver.givenName} {d.Driver.familyName} — {d.points} pts (P{d.position})
                </p>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default StandingsPage
