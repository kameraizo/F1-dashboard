import CountUp from './CountUp'
import { useAnimatedPercent } from '../hooks/useAnimatedPercent'

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

function DriverCard({ standing, onClick, variant = 'podium', maxPoints }) {
  const { position, points, Driver, Constructors, Constructor } = standing
  const teamId = Constructors ? Constructors[0].constructorId : Constructor.constructorId
  const teamName = Constructors ? Constructors[0].name : Constructor.name
  const color = teamColors[teamId] || '#ffffff'
  const targetPct = maxPoints ? Math.round((points / maxPoints) * 100) : 0
  const barWidth = useAnimatedPercent(targetPct)

  if (variant === 'row') {
    return (
      <tr className="timing-row" style={{ '--team-color': color }} onClick={onClick}>
        <td className="t-pos"><span className="t-pos__num">{position}</span></td>
        <td className="t-no"><span className="t-no__chip">{Driver.permanentNumber}</span></td>
        <td className="t-driver">
          <span className="t-driver__name"><strong>{Driver.givenName[0]}.</strong> {Driver.familyName}</span>
          <span className="t-driver__team">{teamName}</span>
        </td>
        <td className="t-nat">{Driver.nationality}</td>
        <td className="t-pts">
          <span className="t-pts__value"><CountUp value={points} /></span>
          <span className="t-pts__bar"><span className="t-pts__fill" style={{ width: `${barWidth}%` }} /></span>
        </td>
      </tr>
    )
  }

  return (
    <div className="driver-card" onClick={onClick} style={{ '--team-color': color }}>
      <div className="card-edge" />
      <div className="card-body">
        <div className="driver-number">{Driver.permanentNumber}</div>
        <div className="driver-name">{Driver.givenName[0]}. {Driver.familyName}</div>
        <div className="driver-team">{teamName}</div>
        <div className="driver-meta">
          <span>{Driver.nationality}</span>
          <span className="pts"><CountUp value={points} /> pts</span>
        </div>
      </div>
    </div>
  )
}

export default DriverCard
