import { NavLink } from 'react-router-dom'
import './shared.css'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/requests', label: 'Help Requests' },
  { to: '/offer', label: 'Offer Help' },
  { to: '/shelters', label: 'Shelters' },
  { to: '/dashboard', label: 'Emergency Dashboard' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  return (
    <header className="ui-nav">
      <div className="ui-nav__inner">
        <NavLink to="/" className="ui-nav__brand" end>
          <span className="ui-nav__mark" aria-hidden="true" />
          LankaRelief
        </NavLink>
        <nav className="ui-nav__links" aria-label="Main">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'ui-nav__link is-active' : 'ui-nav__link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
