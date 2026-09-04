import { useCallback, useEffect, useRef, useState } from 'react'
import { closeNotice, getNotices } from '../../api/notices.js'
import Button from '../shared/Button.jsx'
import Chip from '../shared/Chip.jsx'
import './NoticeFeed.css'

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

const CATEGORIES = ['Flood', 'Landslide', 'Severe weather', 'General']
const SEVERITIES = ['High', 'Medium', 'Low']

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

function severityVariant(severity) {
  if (severity === 'High') return 'urgent'
  if (severity === 'Medium') return 'medium'
  return 'safe'
}

function matchesFilters(notice, filters) {
  if (filters.district && notice.district !== filters.district) return false
  if (filters.category && notice.category !== filters.category) return false
  if (filters.severity && notice.severity !== filters.severity) return false
  return true
}

export default function NoticeFeed({ refreshKey = 0, onUpdate, latestNotice }) {
  const [filters, setFilters] = useState({
    district: '',
    category: '',
    severity: '',
  })
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const hasLoaded = useRef(false)

  const load = useCallback(async () => {
    if (!hasLoaded.current) setLoading(true)
    setError('')
    try {
      setNotices(await getNotices(filters))
    } catch {
      setError('Unable to load emergency notices. Please try again.')
      setNotices([])
    } finally {
      hasLoaded.current = true
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    load()
  }, [load, refreshKey])

  useEffect(() => {
    if (!latestNotice?._id) return
    if (!matchesFilters(latestNotice, filters)) return

    setNotices((current) => {
      if (current.some((item) => item._id === latestNotice._id)) return current
      return [latestNotice, ...current]
    })
  }, [latestNotice, filters])

  function updateFilter(field) {
    return (event) => {
      setFilters((current) => ({ ...current, [field]: event.target.value }))
    }
  }

  async function handleClose(notice) {
    setUpdatingId(notice._id)
    try {
      const updated = await closeNotice(notice._id)
      setNotices((current) =>
        current.map((item) => (item._id === updated._id ? updated : item)),
      )
      await onUpdate?.()
    } catch {
      setError('Unable to close this notice. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <section className="notice-feed" aria-label="Emergency notices">
      <div className="notice-feed__filters">
        <div className="notice-feed__filter">
          <label htmlFor="notice-filter-district">District</label>
          <select
            id="notice-filter-district"
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

        <div className="notice-feed__filter">
          <label htmlFor="notice-filter-category">Category</label>
          <select
            id="notice-filter-category"
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

        <div className="notice-feed__filter">
          <label htmlFor="notice-filter-severity">Severity</label>
          <select
            id="notice-filter-severity"
            value={filters.severity}
            onChange={updateFilter('severity')}
          >
            <option value="">All severity levels</option>
            {SEVERITIES.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="notice-feed__status">Loading notices…</p>
      ) : error ? (
        <p className="notice-feed__status">{error}</p>
      ) : notices.length === 0 ? (
        <p className="notice-feed__empty">
          No emergency notices match these filters.
        </p>
      ) : (
        <div className="notice-feed__list">
          {notices.map((notice) => (
            <article className="notice-card" key={notice._id}>
              <div className="notice-card__top">
                <h3 className="notice-card__title">{notice.title}</h3>
                <Chip className="notice-card__chip" variant={severityVariant(notice.severity)}>
                  {notice.severity}
                </Chip>
              </div>
              <p className="notice-card__meta">
                {notice.district} · {notice.category} ·{' '}
                {relativeTime(notice.createdAt)}
              </p>
              <p className="notice-card__body">{notice.message}</p>
              <div className="notice-card__footer">
                <Chip variant="status">{notice.status}</Chip>
                {notice.status === 'Active' ? (
                  <Button
                    variant="dark"
                    disabled={updatingId === notice._id}
                    onClick={() => handleClose(notice)}
                  >
                    {updatingId === notice._id ? 'Closing…' : 'Close notice'}
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
