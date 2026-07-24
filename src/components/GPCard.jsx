import CountUp from './CountUp'

function GPCard({ race, label, winner }) {
  const { Circuit, date, time, raceName, round } = race
  const daysUntil = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
  const isNext = label === 'Prochain GP'
  const dateFormatted = new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className={`gp-card${isNext ? ' gp-card--next' : ''}`}>
      {label && <span className="gp-card__eyebrow">{label}</span>}
      <div className="gp-card__round">Round {round}</div>
      <div className="gp-card__name">{raceName}</div>
      {winner && (
        <div className="gp-card__winner">🏆 {winner.Driver.givenName} {winner.Driver.familyName}</div>
      )}
      {isNext && (
        <div className="gp-card__countdown">
          <span className="gp-card__countdown-value"><CountUp value={daysUntil} duration={700} /></span>
          <span className="gp-card__countdown-label">jours</span>
        </div>
      )}
      <div className="gp-card__circuit">{Circuit.circuitName}</div>
      <div className="gp-card__meta">
        <span>{Circuit.Location.locality}, {Circuit.Location.country}</span>
        <span>{dateFormatted}</span>
        {time && <span>{time.slice(0, 5)}</span>}
      </div>
    </div>
  )
}

export default GPCard
