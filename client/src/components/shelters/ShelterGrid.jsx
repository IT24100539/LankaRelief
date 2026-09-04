import { useCallback, useEffect, useRef, useState } from 'react'
import { getShelters, updateShelter } from '../../api/shelters.js'
import Button from '../shared/Button.jsx'
import CapacityBar from '../shared/CapacityBar.jsx'
import Chip from '../shared/Chip.jsx'
import './ShelterGrid.css'

const DISTRICTS = [
  'Colombo',
  'Kandy',
  'Galle',
  'Ratnapura',
  'Kalutara',
  'Matara',
  'Gampaha',
  'Kurunegala',
  'Jaffna',
  'Batticaloa',
]

const STATUSES = ['Available', 'Limited', 'Full']

const STATUS_CHIP = {
  Available: 'safe',
  Limited: 'medium',
  Full: 'urgent',
}

const STATUS_COLOR = {
  Available: 'var(--safe)',
  Limited: 'var(--medium)',
  Full: 'var(--urgent)',
}

function parseFacilities(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function occupancyStatus(availableSpaces, totalCapacity) {
  const available = Number(availableSpaces)
  const total = Number(totalCapacity)
  if (!Number.isFinite(available) || available <= 0) return 'Full'
  if (!Number.isFinite(total) || available <= 0.2 * total) return 'Limited'
  return 'Available'
}

export default function ShelterGrid({ refreshKey = 0 }) {
  const [filters, setFilters] = useState({
    search: '',
    district: '',
    status: '',
  })
  const [shelters, setShelters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [updateError, setUpdateError] = useState('')
  const hasLoaded = useRef(false)

  const load = useCallback(async () => {
    if (!hasLoaded.current) setLoading(true)
    setError('')
    try {
      setShelters(await getShelters(filters))
    } catch {
      setError('Unable to load shelters. Please try again.')
      setShelters([])
    } finally {
      hasLoaded.current = true
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    load()
  }, [load, refreshKey])

  function updateFilter(field) {
    return (event) => {
      setFilters((current) => ({ ...current, [field]: event.target.value }))
    }
  }

  async function changeSpaces(shelter, delta) {
    const available = Number(shelter.availableSpaces)
    const total = Number(shelter.totalCapacity)
    const next = available + delta
    if (next < 0 || next > total) return

    setUpdatingId(shelter._id)
    setUpdateError('')
    try {
      await updateShelter(shelter._id, { availableSpaces: next })
      await load()
    } catch (err) {
      setUpdateError(
        err.response?.data?.message ||
          'Unable to update this shelter. Please try again.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <section className="shelter-grid" aria-label="Shelters">
      <div className="shelter-grid__filters">
        <div className="shelter-grid__filter">
          <label htmlFor="shelter-filter-search">Search</label>
          <input
            id="shelter-filter-search"
            type="search"
            placeholder="Search by name or address"
            value={filters.search}
            onChange={updateFilter('search')}
          />
        </div>

        <div className="shelter-grid__filter">
          <label htmlFor="shelter-filter-district">District</label>
          <select
            id="shelter-filter-district"
            value={filters.district}
            onChange={updateFilter('district')}
          >
            <option value="">All districts</option>
            {DISTRICTS.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div className="shelter-grid__filter">
          <label htmlFor="shelter-filter-status">Status</label>
          <select
            id="shelter-filter-status"
            value={filters.status}
            onChange={updateFilter('status')}
          >
            <option value="">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="shelter-grid__status">Loading shelters…</p>
      ) : error ? (
        <p className="shelter-grid__status">{error}</p>
      ) : shelters.length === 0 ? (
        <p className="shelter-grid__empty">
          No shelters match these filters.
        </p>
      ) : (
        <div className="shelter-grid__list">
          {updateError ? (
            <p className="shelter-grid__error" role="alert">
              {updateError}
            </p>
          ) : null}
          {shelters.map((shelter) => {
            const facilities = parseFacilities(shelter.facilities)
            const available = Number(shelter.availableSpaces)
            const total = Number(shelter.totalCapacity)
            const status = occupancyStatus(available, total)
            const chip = STATUS_CHIP[status] || 'status'
            const color = STATUS_COLOR[status] || 'var(--safe)'
            const busy = updatingId === shelter._id

            return (
              <article className="shelter-card" key={shelter._id}>
                <div className="shelter-card__top">
                  <h3 className="shelter-card__title">{shelter.name}</h3>
                  <Chip className="shelter-card__chip" variant={chip}>
                    {status}
                  </Chip>
                </div>
                <p className="shelter-card__meta">
                  {shelter.district} · Capacity {total}
                </p>
                <CapacityBar
                  value={Number.isFinite(available) ? available : 0}
                  max={Number.isFinite(total) ? total : 0}
                  color={color}
                  label={`${shelter.name} capacity`}
                />
                <p className="shelter-card__spaces">
                  {Number.isFinite(available) ? available : 0} of{' '}
                  {Number.isFinite(total) ? total : 0} spaces available
                </p>
                {facilities.length ? (
                  <ul className="shelter-card__pills">
                    {facilities.map((facility, index) => (
                      <li key={`${facility}-${index}`} className="shelter-card__pill">
                        {facility}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="shelter-card__adjust">
                  <Button
                    variant="outline"
                    disabled={busy || available <= 0}
                    onClick={() => changeSpaces(shelter, -1)}
                  >
                    Fill a space
                  </Button>
                  <Button
                    variant="dark"
                    disabled={busy || available >= total}
                    onClick={() => changeSpaces(shelter, 1)}
                  >
                    Free a space
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
