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
function ConstructorCard({ standing }) {
  const { position, points, wins, Constructor } = standing
  const teamId = Constructor.constructorId
  const color = teamColors[teamId] || '#ffffff'

  return (
    <div className="driver-card">
      <div className="card-top" style={{ background: color }}></div>
      <div className="card-body">
        <div className="driver-number" style={{ color }}>{Constructor.name}</div>  
        <div className="driver-team">{Constructor.nationality}</div>
        <div className="driver-meta">
          <span>{points} pts</span>
          <span>P{position}</span>
        </div>
      </div>
    </div>
  )
}

export default ConstructorCard