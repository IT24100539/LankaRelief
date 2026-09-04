import { useEffect, useState } from 'react'
import { getSummary } from '../../api/dashboard.js'
import StatCard from '../shared/StatCard.jsx'
import './StatStrip.css'

function asCount(value) {
  const count = Number(value)
  return Number.isFinite(count) && count > 0 ? count : 0
}

const EMPTY = {
  openRequests: 0,
  availableOffers: 0,
  shelterSpace: 0,
  urgentNotices: 0,
}

export default function StatStrip({ refreshKey = 0, className = '' }) {
  const [summary, setSummary] = useState(EMPTY)

  useEffect(() => {
    let active = true

    getSummary()
      .then((data) => {
        if (!active) return
        setSummary({
          openRequests: asCount(data?.openRequests),
          availableOffers: asCount(data?.availableOffers),
          shelterSpace: asCount(data?.shelterSpace),
          urgentNotices: asCount(data?.urgentNotices),
        })
      })
      .catch(() => {
        if (active) setSummary(EMPTY)
      })

    return () => {
      active = false
    }
  }, [refreshKey])

  const classes = ['stat-strip', className].filter(Boolean).join(' ')

  return (
    <div className={classes} aria-label="Current totals">
      <StatCard
        number={summary.openRequests}
        label="Open requests"
        variant="urgent"
      />
      <StatCard number={summary.availableOffers} label="Available offers" />
      <StatCard
        number={summary.shelterSpace}
        label="Shelters with space"
        variant="safe"
      />
      <StatCard
        number={summary.urgentNotices}
        label="Urgent notices"
        variant="urgent"
      />
    </div>
  )
}
