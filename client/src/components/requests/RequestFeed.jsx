import { useCallback, useEffect, useState } from 'react'
import { getRequests, updateRequestStatus } from '../../api/requests.js'
import Button from '../shared/Button.jsx'
import Chip from '../shared/Chip.jsx'
import './RequestFeed.css'

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

const CATEGORIES = [
  'Drinking water',
  'Dry rations',
  'Cooked meals',
  'Medicine',
  'Temporary shelter',
  'Transport',
]

const URGENCY = ['High', 'Medium', 'Low']
const STATUSES = ['Open', 'In progress', 'Resolved']

const NEXT_STATUS = {
  Open: { status: 'In progress', label: 'Mark in progress' },
  'In progress': { status: 'Resolved', label: 'Mark resolved' },
}

function shortTitle(description, category) {
  const words = String(description || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!words.length) return category || 'Help request'

  const preview = words.slice(0, 6).join(' ')
  return words.length > 6 ? `${preview}…` : preview
}

function relativeTime(value) {
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return 'just now'

  const minutes = Math.max(0, Math.floor((Date.now() - then) / 60000))
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`

  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

function urgencyVariant(urgency) {
  if (urgency === 'High') return 'urgent'
  if (urgency === 'Medium') return 'medium'
  return 'safe'
}

export default function RequestFeed({ refreshKey = 0 }) {
  const [filters, setFilters] = useState({
    district: '',
    category: '',
    urgency: '',
    status: '',
  })
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setRequests(await getRequests(filters))
    } catch {
      setError('Unable to load help requests. Please try again.')
      setRequests([])
    } finally {
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

  async function advanceStatus(request) {
    const next = NEXT_STATUS[request.status]
    if (!next) return

    setUpdatingId(request._id)
    try {
      await updateRequestStatus(request._id, next.status)
      await load()
    } catch {
      setError('Unable to update this request. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <section className="request-feed" aria-label="Help requests">
      <div className="request-feed__filters">
        <div className="request-feed__filter">
          <label htmlFor="filter-district">District</label>
          <select
            id="filter-district"
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

        <div className="request-feed__filter">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={updateFilter('category')}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="request-feed__filter">
          <label htmlFor="filter-urgency">Urgency</label>
          <select
            id="filter-urgency"
            value={filters.urgency}
            onChange={updateFilter('urgency')}
          >
            <option value="">All urgency levels</option>
            {URGENCY.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="request-feed__filter">
          <label htmlFor="filter-status">Status</label>
          <select
            id="filter-status"
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
        <p className="request-feed__status">Loading requests…</p>
      ) : error ? (
        <p className="request-feed__status">{error}</p>
      ) : requests.length === 0 ? (
        <p className="request-feed__empty">
          No help requests match these filters.
        </p>
      ) : (
        <div className="request-feed__list">
          {requests.map((request) => {
            const next = NEXT_STATUS[request.status]
            return (
              <article className="request-card" key={request._id}>
                <div className="request-card__top">
                  <h3 className="request-card__title">
                    {shortTitle(request.description, request.category)}
                  </h3>
                  <Chip variant={urgencyVariant(request.urgency)}>
                    {request.urgency}
                  </Chip>
                </div>
                <p className="request-card__meta">
                  {request.name} · {request.district} ·{' '}
                  {relativeTime(request.createdAt)}
                </p>
                <p className="request-card__body">{request.description}</p>
                <div className="request-card__footer">
                  <Chip variant="status">{request.status}</Chip>
                  {next ? (
                    <Button
                      variant="dark"
                      disabled={updatingId === request._id}
                      onClick={() => advanceStatus(request)}
                    >
                      {updatingId === request._id ? 'Updating…' : next.label}
                    </Button>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
