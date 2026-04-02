import { useState, useEffect } from 'react'
import { getDriverStandings, getConstructorStandings } from '../services/api'
import DriverCard from '../components/DriverCard'
import ConstructorCard from '../components/ConstructorCard'

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

  useEffect(() => {
    const fetchStandings = async () => {
      if (activeTab === 'drivers') {
        const data = await getDriverStandings()
        setDrivers(data.MRData.StandingsTable.StandingsLists[0].DriverStandings)
      } else {
        const data = await getConstructorStandings()
        setConstructors(data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings)
      }
    }
    fetchStandings()
  }, [activeTab])

  return (
    <div className="container mt-4">

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

      {activeTab === 'drivers' && (
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          {drivers.map((standing) => (
            <DriverCard
              key={standing.Driver.driverId}
              standing={standing}
              onClick={() => setSelectedDriver(standing)}
            />
          ))}
        </div>
      )}

      {activeTab === 'constructors' && (
        <div className="d-flex flex-wrap gap-3 justify-content-center">
          {constructors.map((standing) => (
            <ConstructorCard key={standing.Constructor.constructorId} standing={standing} />
          ))}
        </div>
      )}

      {selectedDriver && (
        <div className="modal-overlay" onClick={() => setSelectedDriver(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDriver(null)}>✕</button>
            <div style={{
              color: teamColors[selectedDriver.Constructors[0].constructorId] || '#fff',
              fontSize: '48px',
              fontWeight: '700'
            }}>
              {selectedDriver.Driver.permanentNumber}
            </div>
            <h3>{selectedDriver.Driver.givenName} {selectedDriver.Driver.familyName}</h3>
            <p>{selectedDriver.Constructors[0].name}</p>
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

export default StandingsPage