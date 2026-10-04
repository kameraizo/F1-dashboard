import { NavLink, Link, useLocation } from "react-router-dom"
import { useSeason } from "../hooks/useSeason"

// Icônes 24×24, trait = currentColor (couleur héritée de l'onglet)
const icons = {
  home: <path d="M3.5 11 12 4.5l8.5 6.5V20H15v-5.5H9V20H3.5z" />,
  standings: <path d="M3 20h18M4.5 20v-5.5h5V20M9.5 20V9h5v11M14.5 20v-8h5v8" />,
  season: (
    <>
      <path d="M4 6.5h16V20H4zM4 10.5h16" />
      <path d="M8.5 4v4M15.5 4v4" />
    </>
  ),
  circuits: <path d="M6 19.5c-1.9 0-3-1.2-3-2.8 0-1.4.8-2.3 2.2-2.9l8.3-3.4c1.2-.5 1.8-1.4 1.8-2.6C15.3 6.1 16.6 4.5 18.4 4.5c1.6 0 2.6 1.2 2.6 2.8v9.4c0 1.6-1.2 2.8-2.8 2.8z" />,
}

const navLinks = [
  { to: "/", label: "Accueil", icon: "home", end: true },
  { to: "/classements", label: "Classements", icon: "standings" },
  { to: "/saison", label: "Saison", icon: "season" },
  { to: "/circuits", label: "Circuits", icon: "circuits" },
]

// Index de l'onglet actif, pour placer l'indicateur qui glisse (-1 si aucune page ne correspond)
function useActiveIndex() {
  const { pathname } = useLocation()
  return navLinks.findIndex(({ to, end }) => (end ? pathname === to : pathname.startsWith(to)))
}

function NavTabs({ className, withIcons }) {
  const activeIndex = useActiveIndex()

  return (
    <div className={className} style={{ '--active-index': activeIndex, '--tab-count': navLinks.length }}>
      {navLinks.map(({ to, label, icon, end }) => (
        <NavLink key={to} to={to} end={end} className={`${className}-item`}>
          {withIcons && (
            <svg className={`${className}-icon`} viewBox="0 0 24 24" aria-hidden="true">
              {icons[icon]}
            </svg>
          )}
          <span>{label}</span>
        </NavLink>
      ))}
      {activeIndex >= 0 && <span className={`${className}-indicator`} aria-hidden="true" />}
    </div>
  )
}

function SeasonReadout() {
  const { season, round, totalRounds } = useSeason()

  return (
    <p className="pitwall-nav__readout">
      <span className="pitwall-nav__readout-label">Saison</span>
      {season && <span className="pitwall-nav__readout-value">{season}</span>}
      {round && (
        <>
          <span className="pitwall-nav__readout-sep" aria-hidden="true">·</span>
          <span aria-hidden="true">
            <span className="pitwall-nav__readout-label">R</span>
            <span className="pitwall-nav__readout-value">{round}</span>
            <span className="pitwall-nav__readout-label">/{totalRounds}</span>
          </span>
          <span className="visually-hidden">, manche {round} sur {totalRounds}</span>
        </>
      )}
    </p>
  )
}

function Navbar() {
  return (
    <>
      <header className="pitwall-nav">
        <div className="pitwall-nav__inner">
          <Link className="pitwall-nav__brand" to="/" aria-label="F1 Dashboard, accueil">
            <span className="pitwall-nav__brand-tag">F1</span>
            <span className="pitwall-nav__brand-name">Dashboard</span>
          </Link>

          <nav className="pitwall-nav__nav" aria-label="Navigation principale">
            <NavTabs className="pitwall-nav__tabs" />
          </nav>

          <SeasonReadout />
        </div>
      </header>

      <nav className="tab-bar" aria-label="Navigation principale">
        <NavTabs className="tab-bar__tabs" withIcons />
      </nav>
    </>
  )
}

export default Navbar
