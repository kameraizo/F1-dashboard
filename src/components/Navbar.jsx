import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import logo from "../assets/Logo-F1.png"

const navLinks = [
  { to: "/", label: "Accueil", end: true },
  { to: "/classements", label: "Classements" },
  { to: "/saison", label: "Saison" },
  { to: "/circuits", label: "Circuits" },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="pitwall-nav">
      <div className="pitwall-nav__inner">
        <Link className="pitwall-nav__brand" to="/" onClick={() => setOpen(false)}>
          <img src={logo} alt="F1 Dashboard" />
          <span className="pitwall-nav__season">Saison 26</span>
        </Link>

        <button
          className="pitwall-nav__toggle"
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`pitwall-nav__links${open ? ' is-open' : ''}`}>
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `pitwall-nav__link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
