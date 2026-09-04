import { Link } from 'react-router-dom'
import Panel from '../components/shared/Panel.jsx'
import './About.css'

const STEPS = [
  {
    n: '1',
    title: 'Choose a district',
    body: 'Start with the area you are in — Colombo, Kandy, Galle, Ratnapura, and six others — so every list is local.',
  },
  {
    n: '2',
    title: 'Request or offer help',
    body: 'Post a need for water, food, medicine, transport, or shelter. Volunteers list supplies and seats that coordinators can match.',
    to: '/requests',
    extra: { to: '/offer', label: 'Offer help' },
  },
  {
    n: '3',
    title: 'Find a shelter',
    body: 'Check remaining spaces at schools and halls before you travel, or add a site if you are running one.',
    to: '/shelters',
  },
  {
    n: '4',
    title: 'Check the dashboard',
    body: 'Coordinators publish flood, landslide, and weather notices. Live totals show open requests, offers, and shelter space.',
    to: '/dashboard',
  },
]

const TEAM = [
  {
    member: 'Member 1',
    module: 'Help Requests',
    contribution:
      'Need form, filters, and status updates so households can post and track aid.',
    to: '/requests',
  },
  {
    member: 'Member 2',
    module: 'Resource Offers',
    contribution:
      'Volunteer listings for water, rations, meals, medicine, and transport seats.',
    to: '/offer',
  },
  {
    member: 'Member 3',
    module: 'Shelters',
    contribution:
      'Capacity, occupancy status, and fill/free controls for community sites.',
    to: '/shelters',
  },
  {
    member: 'Member 4',
    module: 'Emergency Dashboard',
    contribution:
      'Urgent notices, summary counts, and request-category volume in one view.',
    to: '/dashboard',
  },
]

export default function About() {
  return (
    <div className="about-page">
      <div className="about-page__wrap">
        <div className="about-page__intro">
          <h1>About LankaRelief</h1>
          <p>A public directory for floods, landslides, and other emergencies.</p>
        </div>

        <Panel className="about-page__why">
          <h2>Why LankaRelief?</h2>
          <p>
            Each monsoon, rivers such as the Kalu Ganga overtop town bunds, and
            hillside roads in Kandy and Ratnapura fail in debris slides. Families
            need drinking water, dry rations, a hall with space, or a van to the
            clinic — often in the same afternoon, and often through informal
            phone trees that do not reach the next GN division. LankaRelief
            puts help requests, resource offers, shelter capacity, and emergency
            notices in one public directory so residents, volunteers, and local
            coordinators can see what is open nearby. It does not replace police,
            military, or Disaster Management Centre channels.
          </p>
        </Panel>

        <section className="about-page__section" aria-labelledby="how-heading">
          <h2 id="how-heading">How it works</h2>
          <ol className="about-page__steps">
            {STEPS.map((step) => (
              <li key={step.n} className="about-page__step">
                <span className="about-page__step-n" aria-hidden="true">
                  {step.n}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                {step.to ? (
                  <p className="about-page__step-links">
                    <Link to={step.to}>Open this step</Link>
                    {step.extra ? (
                      <Link to={step.extra.to}>{step.extra.label}</Link>
                    ) : null}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="about-page__section" aria-labelledby="team-heading">
          <h2 id="team-heading">Team & contribution</h2>
          <ul className="about-page__team">
            {TEAM.map((item) => (
              <li key={item.member}>
                <Link to={item.to} className="about-page__card">
                  <p className="about-page__card-member">{item.member}</p>
                  <h3>{item.module}</h3>
                  <p>{item.contribution}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
