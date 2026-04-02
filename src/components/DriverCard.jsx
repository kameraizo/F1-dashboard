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
  cadillac:     '#C0C0C0', // chrome/argent
}

function DriverCard({ standing, onClick }) {
  const { position, points, wins, Driver, Constructors, Constructor } = standing
const teamId = Constructors ? Constructors[0].constructorId : Constructor.constructorId
const color = teamColors[teamId] || '#ffffff'

  return (
    <div className="driver-card" onClick={onClick}>
      <div className="card-top" style={{ background: color }}></div>
      <div className="card-body">
        <div className="driver-number" style={{ color }}>{Driver.permanentNumber}</div>
        <div className="driver-name">{Driver.givenName[0]}. {Driver.familyName}</div>
        <div className="driver-team">{Constructors ? Constructors[0].name : Constructor.name}</div>
        <div className="driver-meta">
          <span>{Driver.nationality}</span>
          <span>{points} pts</span>
          <span>P{position}</span>
        </div>
      </div>
    </div>
  )
}

export default DriverCard