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

function ConstructorCard({ standing, onClick, maxPoints }) {
  const { position, points, Constructor } = standing
  const color = teamColors[Constructor.constructorId] || '#ffffff'
  const targetPct = maxPoints ? Math.round((points / maxPoints) * 100) : 0
  const barWidth = useAnimatedPercent(targetPct)

  return (
    <tr className="timing-row" style={{ '--team-color': color }} onClick={onClick}>
      <td className="t-pos"><span className="t-pos__num">{position}</span></td>
      <td className="t-team">
        <span className="t-team__swatch" />
        <span className="t-team__name">{Constructor.name}</span>
      </td>
      <td className="t-nat">{Constructor.nationality}</td>
      <td className="t-pts">
        <span className="t-pts__value"><CountUp value={points} /></span>
        <span className="t-pts__bar"><span className="t-pts__fill" style={{ width: `${barWidth}%` }} /></span>
      </td>
    </tr>
  )
}

export default ConstructorCard
