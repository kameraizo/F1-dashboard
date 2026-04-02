function GPCard({ race }) {
  const { Circuit, date, time, raceName, round } = race
  return (
    <div className="gp-card">
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