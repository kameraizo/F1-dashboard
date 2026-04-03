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

const circuitMaps = {
  albert_park:   '/circuits/albert_park.svg',
  shanghai:      '/circuits/shanghai.svg',
  suzuka:        '/circuits/suzuka.svg',
  bahrain:       '/circuits/bahrain.svg',
  jeddah:        '/circuits/jeddah.svg',
  miami:         '/circuits/miami.svg',
  imola:         '/circuits/imola.svg',
  monaco:        '/circuits/monaco.svg',
  catalunya:     '/circuits/catalunya.svg',
  villeneuve:    '/circuits/villeneuve.svg',
  red_bull_ring: '/circuits/red_bull_ring.svg',
  silverstone:   '/circuits/silverstone.svg',
  spa:           '/circuits/spa.svg',
  hungaroring:   '/circuits/hungaroring.svg',
  zandvoort:     '/circuits/zandvoort.svg',
  monza:         '/circuits/monza.svg',
  baku:          '/circuits/baku.svg',
  marina_bay:    '/circuits/marina_bay.svg',
  americas:      '/circuits/americas.svg',
  rodriguez:     '/circuits/rodriguez.svg',
  interlagos:    '/circuits/interlagos.svg',
  vegas:         '/circuits/vegas.svg',
  losail:        '/circuits/losail.svg',
  yas_marina:    '/circuits/yas_marina.svg',
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
      <h2 className="title-gradient text-center mb-4">Circuits 2026 — Top 3</h2>

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
              style={{ width: '80px', borderRadius: '4px', marginBottom: '1rem' }}
            />
            {circuitMaps[selectedRace.Circuit.circuitId] && (
              <img
                src={circuitMaps[selectedRace.Circuit.circuitId]}
                alt={selectedRace.Circuit.circuitName}
                style={{ width: '200px', margin: '0 auto 1rem', display: 'block' }}
              />
            )}
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