function GPCard({ race, label, winner }) {
  const { Circuit, date, time, raceName, round } = race
  const daysUntil = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
  return (
    <div className="gp-card">
      {label && <div style={{ color: '#8B9AB0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{label}</div>}
      <div className="gp-round">Round {round}</div>
      <div className="gp-name">{raceName}</div>
      {winner && (
  <div style={{ color: '#FFD700', fontSize: '13px', marginTop: '0.3rem' }}>
    🏆 {winner.Driver.givenName} {winner.Driver.familyName}
  </div>
)}
      {label === 'Prochain GP' && (
  <div style={{ color: '#E8002D', fontSize: '13px', marginTop: '0.3rem', fontWeight: '600' }}>
    Dans {daysUntil} jours
  </div>
)}
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
