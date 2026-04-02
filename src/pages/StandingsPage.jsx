import { useState, useEffect } from 'react'
import { getDriverStandings, getConstructorStandings } from '../services/api'
import DriverCard from '../components/DriverCard'
import ConstructorCard from '../components/ConstructorCard'

function StandingsPage() {
  const [activeTab, setActiveTab] = useState('drivers')
  const [drivers, setDrivers] = useState([])
  const [constructors, setConstructors] = useState([])

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
            <DriverCard key={standing.Driver.driverId} standing={standing} />
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

    </div>
  )
}

export default StandingsPage