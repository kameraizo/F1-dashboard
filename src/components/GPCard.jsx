function GPCard({ race, label }) {
  const { Circuit, date, time, raceName, round } = race
  return (
    <div className="gp-card">
      {label && <div style={{ color: '#8B9AB0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{label}</div>}
      <div className="gp-round">Round {round}</div>
      <div className="gp-name">{raceName}</div>
      <div className="gp-circuit">{Circuit.circuitName}</div>
      <div className="gp-meta">
        <span>{Circuit.Location.locality}, {Circuit.Location.country}</span>
        <span>{date}</span>
        <span>{time}</span>
      </div>
    </div>
  )
}

export default GPCard