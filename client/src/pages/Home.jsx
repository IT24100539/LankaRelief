import { Link } from 'react-router-dom'
import Button from '../components/shared/Button.jsx'
import StatCard from '../components/shared/StatCard.jsx'
import './Home.css'

const MODULES = [
  {
    to: '/requests',
    title: 'Help Requests',
    description: 'Post or respond to urgent needs for water, food, and medical aid.',
  },
  {
    to: '/offer',
    title: 'Offer Help',
    description: 'Share supplies, transport, or space with verified local requests.',
  },
  {
    to: '/shelters',
    title: 'Shelters',
    description: 'Find open shelters and check remaining capacity before you travel.',
  },
  {
    to: '/dashboard',
    title: 'Emergency Dashboard',
    description: 'See live notices, request volume, and shelter status in one place.',
  },
]

export default function Home() {
  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-wrap">
          <h1>Coordinate help when it matters most</h1>
          <p className="home-hero__lede">
            Find open shelters, request aid, or offer resources during a
            flood or other emergency. Local coordinators keep this directory
            current.
          </p>
          <div className="home-hero__actions">
            <Button to="/requests" variant="urgent">
              Request help
            </Button>
            <Button to="/offer" variant="outline">
              Offer resources
            </Button>
          </div>
        </div>
      </section>

      <section className="home-section" aria-label="Current totals">
        <div className="home-wrap home-grid">
          <StatCard number={0} label="Open help requests" variant="urgent" />
          <StatCard number={0} label="Active resource offers" />
          <StatCard number={0} label="Shelters with space" variant="safe" />
          <StatCard number={0} label="Urgent notices" variant="urgent" />
        </div>
      </section>

      <section className="home-section" aria-label="Modules">
        <div className="home-wrap home-grid">
          {MODULES.map((item) => (
            <Link key={item.to} to={item.to} className="home-module">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
