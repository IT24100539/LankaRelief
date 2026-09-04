import { useCallback, useEffect, useState } from 'react'
import { deleteOffer, getOffers, updateOfferAvailability } from '../../api/offers.js'
import { DISTRICTS } from '../../constants/districts.js'
import { OFFER_STATUSES, RESOURCE_TYPES } from '../../constants/enums.js'
import Button from '../shared/Button.jsx'
import Chip from '../shared/Chip.jsx'
import './OfferFeed.css'

const NEXT_STATUS = {
  Available: { status: 'Reserved', label: 'Mark reserved' },
  Reserved: { status: 'Used', label: 'Mark used' },
}

export default function OfferFeed({ refreshKey = 0 }) {
  const [filters, setFilters] = useState({
    district: '',
    resourceType: '',
    availabilityStatus: '',
  })
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setOffers(await getOffers(filters))
    } catch {
      setError('Unable to load resource offers. Please try again.')
      setOffers([])
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

  async function advanceAvailability(offer) {
    const next = NEXT_STATUS[offer.availabilityStatus]
    if (!next) return

    setUpdatingId(offer._id)
    try {
      await updateOfferAvailability(offer._id, next.status)
      await load()
    } catch {
      setError('Unable to update this offer. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function removeOffer(offer) {
    setUpdatingId(offer._id)
    try {
      await deleteOffer(offer._id)
      await load()
    } catch {
      setError('Unable to delete this offer. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <section className="offer-feed" aria-label="Resource offers">
      <div className="offer-feed__filters">
        <div className="offer-feed__filter">
          <label htmlFor="offer-filter-district">District</label>
          <select
            id="offer-filter-district"
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

        <div className="offer-feed__filter">
          <label htmlFor="offer-filter-type">Resource type</label>
          <select
            id="offer-filter-type"
            value={filters.resourceType}
            onChange={updateFilter('resourceType')}
          >
            <option value="">All resource types</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="offer-feed__filter">
          <label htmlFor="offer-filter-status">Availability</label>
          <select
            id="offer-filter-status"
            value={filters.availabilityStatus}
            onChange={updateFilter('availabilityStatus')}
          >
            <option value="">All statuses</option>
            {OFFER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="offer-feed__status">Loading offers…</p>
      ) : error ? (
        <p className="offer-feed__status">{error}</p>
      ) : offers.length === 0 ? (
        <p className="offer-feed__empty">
          No resource offers match these filters.
        </p>
      ) : (
        <div className="offer-feed__list">
          {offers.map((offer) => {
            const next = NEXT_STATUS[offer.availabilityStatus]
            return (
              <article className="offer-card" key={offer._id}>
                <div className="offer-card__top">
                  <h3 className="offer-card__title">
                    {offer.resourceType} — {offer.quantity} units
                  </h3>
                  <Chip variant={offer.availabilityStatus}>
                    {offer.availabilityStatus}
                  </Chip>
                </div>
                <p className="offer-card__meta">
                  {offer.volunteerName} · {offer.district}
                </p>
                {offer.notes ? (
                  <p className="offer-card__notes">{offer.notes}</p>
                ) : null}
                <div className="offer-card__footer">
                  {next ? (
                    <Button
                      variant="dark"
                      disabled={updatingId === offer._id}
                      onClick={() => advanceAvailability(offer)}
                    >
                      {updatingId === offer._id ? 'Updating…' : next.label}
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    disabled={updatingId === offer._id}
                    onClick={() => removeOffer(offer)}
                  >
                    Remove
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
